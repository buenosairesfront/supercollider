/* SuperCollider Lab · U-MA — engine.js
 * Browser side of the server: AudioContext + AudioWorklet (or ScriptProcessor fallback),
 * analysers for scope/spectrum, recording to WAV, offline render for .plot.
 */
(function (G) {
'use strict';
const D = G.SCDSP;
const BASE = (document.currentScript && document.currentScript.src || '').replace(/engine\.js.*$/, '') || 'js/';

const Engine = {
  ctx: null, node: null, server: null, mode: 'off', booted: false, booting: null,
  status: { cpu: 0, peaks: [0, 0], synths: 0, ugens: 0, nodes: [] },
  listeners: {}, pending: [], volDb: 0, muted: false, limit: true,
  rec: null, micStream: null, micNode: null, mouseT: 0,
  on(ev, fn) { (this.listeners[ev] || (this.listeners[ev] = [])).push(fn); },
  emit(ev, x) { (this.listeners[ev] || []).forEach(f => { try { f(x); } catch (e) { console.error(e); } }); },
  now() { return this.ctx ? this.ctx.currentTime : performance.now() / 1000; },
  sampleRate() { return this.ctx ? this.ctx.sampleRate : 48000; },
  boot(verbose) {
    if (this.booted) { if (this.ctx.state !== 'running') this.ctx.resume(); if (verbose) this.emit('post', { text: 'Server \'localhost\' running. Sample rate ' + this.ctx.sampleRate + ' Hz · ' + (this.mode === 'worklet' ? 'AudioWorklet' : 'ScriptProcessor'), kind: 'info' }); return this.booting; }
    if (this.booting) return this.booting;
    const AC = G.AudioContext || G.webkitAudioContext;
    if (!AC) { this.emit('post', { text: 'Web Audio is not available in this browser.', kind: 'error' }); return Promise.resolve(); }
    this.ctx = new AC({ latencyHint: 'interactive' });
    this.ctx.resume();
    this.emit('post', { text: 'booting server \'localhost\'...', kind: 'info' });
    this.booting = Promise.resolve();
    this.booting = this.setup().then(() => {
      this.booted = true;
      this.applyVolume();
      this.emit('post', { text: 'SuperCollider 3 server ready. ' + this.ctx.sampleRate + ' Hz · ' + (this.mode === 'worklet' ? 'AudioWorklet' : 'ScriptProcessor (compat)'), kind: 'ok' });
      this.emit('booted');
      const q = this.pending; this.pending = []; q.forEach(m => this.send(m));
    }).catch(e => { console.error(e); this.emit('post', { text: 'Audio failed to start: ' + e.message, kind: 'error' }); });
    // mouse
    const mv = (x, y) => { const t = performance.now(); if (t - this.mouseT < 16) return; this.mouseT = t; this.send({ type: 'mouse', mouse: { x, y } }); this.emit('mouse', { x, y }); };
    G.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') mv(e.clientX / G.innerWidth, e.clientY / G.innerHeight); }, { passive: true });
    G.addEventListener('pointerdown', () => this.send({ type: 'mouse', mouse: { b: 1 } }), { passive: true });
    G.addEventListener('pointerup', () => this.send({ type: 'mouse', mouse: { b: 0 } }), { passive: true });
    return this.booting;
  },
  async setup() {
    const ctx = this.ctx;
    this.out = ctx.createGain(); this.out.gain.value = 1;
    this.splitter = ctx.createChannelSplitter(2);
    this.anL = ctx.createAnalyser(); this.anR = ctx.createAnalyser();
    this.anL.fftSize = 4096; this.anR.fftSize = 4096; this.anL.smoothingTimeConstant = 0.6; this.anR.smoothingTimeConstant = 0.6;
    this.out.connect(ctx.destination); this.out.connect(this.splitter);
    this.splitter.connect(this.anL, 0); this.splitter.connect(this.anR, 1);
    let ok = false;
    if (ctx.audioWorklet && location.protocol !== 'file:') {
      try {
        await ctx.audioWorklet.addModule(BASE + 'dsp.js');
        await ctx.audioWorklet.addModule(BASE + 'worklet.js');
        this.node = new AudioWorkletNode(ctx, 'sclab', { numberOfInputs: 1, numberOfOutputs: 1, outputChannelCount: [2] });
        this.node.port.onmessage = e => this.receive(e.data);
        this.node.connect(this.out);
        this.mode = 'worklet'; ok = true;
      } catch (e) { console.warn('worklet failed, fallback', e); }
    }
    if (!ok) {
      this.server = new D.Server(ctx.sampleRate);
      const sp = ctx.createScriptProcessor(1024, 2, 2);
      const L = new Float32Array(D.BLOCK), R = new Float32Array(D.BLOCK);
      sp.onaudioprocess = ev => {
        const oL = ev.outputBuffer.getChannelData(0), oR = ev.outputBuffer.getChannelData(1);
        const iL = ev.inputBuffer.getChannelData(0), iR = ev.inputBuffer.getChannelData(1);
        const t0 = ev.playbackTime || ctx.currentTime;
        for (let off = 0; off < oL.length; off += D.BLOCK) {
          this.server.process(L, R, iL.subarray(off, off + D.BLOCK), iR.subarray(off, off + D.BLOCK), D.BLOCK, t0 + off / ctx.sampleRate);
          oL.set(L, off); oR.set(R, off);
          if (this.rec) this.recPush(L, R);
        }
        const ob = this.server.takeOutbox(); if (ob.length) this.receive(ob);
      };
      const silent = ctx.createConstantSource ? ctx.createConstantSource() : null;
      if (silent) { silent.offset.value = 0; silent.connect(sp); silent.start(); }
      sp.connect(this.out);
      this.node = sp; this.mode = 'compat';
    }
  },
  receive(list) {
    for (const m of list) {
      if (m.type === 'status') { this.status = m; this.emit('status', m); if (m.ended && m.ended.length) this.emit('ended', m.ended); }
      else if (m.type === 'ended') this.emit('ended', m.ids);
      else if (m.type === 'poll') this.emit('post', { text: m.label + ': ' + (+m.value.toPrecision(6)), kind: 'poll' });
      else if (m.type === 'error') this.emit('post', { text: 'FAILURE IN SERVER: ' + m.msg, kind: 'error' });
      else if (m.type === 'rec') this.recData(m);
    }
  },
  send(m) {
    if (!this.booted) { this.pending.push(m); if (!this.booting && this.gesture) this.boot(); return; }
    if (this.mode === 'worklet') this.node.port.postMessage(m);
    else this.server.handle(m);
  },
  applyVolume() { const v = this.muted ? 0 : Math.pow(10, this.volDb / 20); this.send({ type: 'volume', value: v }); this.send({ type: 'limit', value: this.limit }); },
  setVolumeDb(db) { this.volDb = Math.max(-90, Math.min(6, db)); this.applyVolume(); this.emit('volume', this.volDb); },
  volumeDb() { return this.volDb; },
  setMute(m) { this.muted = m; this.applyVolume(); },
  setLimit(on) { this.limit = on; this.applyVolume(); },
  freeAll() { this.send({ type: 'freeAll' }); },
  // ---------------- recording (WAV) ----------------
  startRecording() {
    if (!this.booted) { this.boot(); }
    this.rec = { L: [], R: [], n: 0 };
    if (this.mode === 'worklet') {
      // tap with a small recorder worklet-free approach: MediaRecorder is lossy; use a ScriptProcessor tap
      const sp = this.ctx.createScriptProcessor(4096, 2, 2);
      sp.onaudioprocess = ev => { if (!this.rec) return; this.recPush(ev.inputBuffer.getChannelData(0).slice(), ev.inputBuffer.getChannelData(1).slice()); };
      const g = this.ctx.createGain(); g.gain.value = 0;
      this.out.connect(sp); sp.connect(g); g.connect(this.ctx.destination);
      this.recTap = sp; this.recSink = g;
    }
    this.emit('rec', true);
  },
  recPush(L, R) { if (!this.rec) return; this.rec.L.push(L.slice ? L.slice() : L); this.rec.R.push(R.slice ? R.slice() : R); this.rec.n += L.length; if (this.rec.n > this.ctx.sampleRate * 600) this.stopRecording(); },
  stopRecording() {
    if (!this.rec) return;
    const r = this.rec; this.rec = null;
    if (this.recTap) { try { this.out.disconnect(this.recTap); this.recTap.disconnect(); this.recSink.disconnect(); } catch (e) { } this.recTap = null; }
    const blob = encodeWav(r, this.ctx.sampleRate);
    this.emit('rec', false);
    this.emit('recorded', { blob, seconds: r.n / this.ctx.sampleRate });
  },
  // ---------------- microphone ----------------
  needMic() {
    if (this.micStream || this.micAsked) return;
    this.micAsked = true;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }).then(st => {
      this.micStream = st; const go = () => { this.micNode = this.ctx.createMediaStreamSource(st); this.micNode.connect(this.node); this.emit('post', { text: 'SoundIn: microphone connected (use headphones to avoid feedback)', kind: 'info' }); };
      if (this.booted) go(); else this.on('booted', go);
    }).catch(() => this.emit('post', { text: 'SoundIn: microphone permission denied, input is silent', kind: 'warn' }));
  },
  // ---------------- offline render (for plot) ----------------
  renderOffline(def, nch, dur) {
    const sr = this.sampleRate();
    const sv = new D.Server(sr);
    sv.exec({ type: 's_new', id: 1, def, controls: {} });
    const n = Math.max(1, Math.round(dur * sr));
    const out = Array.from({ length: nch }, () => new Float32Array(n));
    const L = new Float32Array(D.BLOCK), R = new Float32Array(D.BLOCK);
    for (let off = 0; off < n; off += D.BLOCK) {
      sv.process(L, R, null, null, D.BLOCK, off / sr);
      for (let c = 0; c < nch; c++) {
        const b = sv.busStamp[c] === sv.block ? sv.bus[c] : sv.zero;
        out[c].set(b.subarray(0, Math.min(D.BLOCK, n - off)), off);
      }
    }
    const errs = sv.outbox.filter(m => m.type === 'error'); if (errs.length) throw new G.SCLang.SCError(errs[0].msg);
    return out;
  },
};

function encodeWav(r, sr) {
  const n = r.n, buf = new ArrayBuffer(44 + n * 4), v = new DataView(buf);
  const ws = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  ws(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); ws(8, 'WAVE'); ws(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); ws(36, 'data'); v.setUint32(40, n * 4, true);
  let o = 44;
  for (let k = 0; k < r.L.length; k++) { const a = r.L[k], b = r.R[k]; for (let i = 0; i < a.length; i++) { v.setInt16(o, Math.max(-1, Math.min(1, a[i])) * 32767, true); v.setInt16(o + 2, Math.max(-1, Math.min(1, b[i])) * 32767, true); o += 4; } }
  return new Blob([buf], { type: 'audio/wav' });
}
['pointerdown', 'keydown', 'touchstart'].forEach(ev => G.addEventListener(ev, () => { Engine.gesture = true; }, { capture: true, passive: true }));
G.SCEngine = Engine;
})(typeof globalThis !== 'undefined' ? globalThis : this);
