/* SuperCollider Lab · U-MA — labs.js
 * Interactive labs. Every lab is a control surface that writes real SuperCollider code,
 * runs it through the interpreter and keeps the code view in sync.
 */
(function (G) {
'use strict';
const n3 = x => { const v = +(+x).toPrecision(4); return Number.isInteger(v) ? String(v) : String(v); };
const h = (tag, attrs, ...kids) => { const e = document.createElement(tag); if (attrs) for (const k in attrs) { const v = attrs[k]; if (k === 'class') e.className = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (k === 'html') e.innerHTML = v; else if (v != null && v !== false) e.setAttribute(k, v); } kids.flat().forEach(c => c != null && e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c)); return e; };

// slider: {key, min, max, val, exp, step, fmt}
function slider(api, o, onInput) {
  const id = 'sl-' + o.key + '-' + Math.random().toString(36).slice(2, 6);
  const toPos = v => o.exp ? Math.log(v / o.min) / Math.log(o.max / o.min) : (v - o.min) / (o.max - o.min);
  const fromPos = p => o.exp ? o.min * Math.pow(o.max / o.min, p) : o.min + p * (o.max - o.min);
  const out = h('b', null, ''); const inp = h('input', { type: 'range', min: 0, max: 1000, id });
  const lab = h('label', { for: id }, api.t('c_' + o.key) || o.key, out);
  const set = (v, silent) => { o.val = v; inp.value = Math.round(toPos(v) * 1000); inp.style.setProperty('--v', (toPos(v) * 100) + '%'); out.textContent = (o.fmt ? o.fmt(v) : n3(v)) + (o.unit ? ' ' + o.unit : ''); if (!silent) onInput(v); };
  inp.addEventListener('input', () => { let v = fromPos(inp.value / 1000); if (o.step) v = Math.round(v / o.step) * o.step; set(v); });
  set(o.val, true);
  return { el: h('div', { class: 'sl' }, lab, inp), set, get: () => o.val };
}
function seg(options, cur, onPick, labels) {
  const el = h('div', { class: 'seg', role: 'group' });
  const btns = options.map((o, i) => { const b = h('button', { type: 'button', 'aria-pressed': String(o === cur) }, labels ? labels[i] : o); b.onclick = () => { btns.forEach(x => x.setAttribute('aria-pressed', 'false')); b.setAttribute('aria-pressed', 'true'); onPick(o); }; el.appendChild(b); return b; });
  return el;
}

// Common lab shell: controls (left) + code (right)
function shell(api, lab, o) {
  const root = api.root; root.innerHTML = '';
  const T = api.lt(lab.id);
  const head = h('section', { class: 'panel p-' + (lab.color === 'ink' ? 'ink' : 'paper') }, h('div', { class: 'in' },
    h('div', { class: 'sh' }, h('div', { class: 'meta' }, h('span', null, 'LAB ' + lab.num), h('span', null, 'ID SCL-L' + lab.num + '0'), h('span', null, api.t('lab_live'))),
      h('div', { class: 'shm' }, h('div', { class: 'num' }, lab.num), h('div', { class: 'sq' }, h('i', { class: 'm' }), h('i', { class: 'c' }), h('i', { class: 'y' })), h('h1', null, T.t))),
    h('p', { class: 'note', style: 'max-width:80ch;font-size:13.5px' }, T.d)));
  root.appendChild(head);
  const ctl = h('div', { class: 'in' }); const code = h('div', { class: 'in' });
  const grid = h('div', { class: 'labgrid mt' },
    h('section', { class: 'panel p-paper' }, ctl),
    h('section', { class: 'panel p-ink' }, code));
  root.appendChild(grid);
  // code panel
  const bar = h('div', { class: 'row', style: 'margin-bottom:8px' });
  const play = h('button', { class: 'btn cya', type: 'button' }, '▶ ' + api.t('play'));
  const stop = h('button', { class: 'btn', type: 'button' }, '■ ' + api.t('stop'));
  const open = h('button', { class: 'btn', type: 'button' }, '⧉ ' + api.t('open_free'));
  bar.append(play, stop, open);
  code.appendChild(h('div', { class: 'lbl', style: 'margin-top:0' }, api.t('lab_code')));
  code.appendChild(bar);
  const edHost = h('div', { class: 'cell', style: 'margin:0' }); code.appendChild(edHost);
  const ed = G.SCEditor.create(edHost, { code: '', runAll: true, onEval: c => api.run(c), onStop: () => api.stopAll(), onHelp: w => api.openRef(w) });
  code.appendChild(h('p', { class: 'note', style: 'color:#9C9B97' }, api.t('lab_codenote')));
  play.onclick = () => { o.play ? o.play() : api.run(ed.get()); playing = true; };
  stop.onclick = () => { o.stop ? o.stop() : api.run('Ndef(\\lab).stop(0.2);'); playing = false; };
  open.onclick = () => api.openFree(ed.get());
  let playing = false;
  api.markLab(lab.id);
  return { ctl, code, ed, T, isPlaying: () => playing, setPlaying: v => playing = v, playBtn: play };
}

// Helper: Ndef lab with set() for continuous params
function ndefLab(api, lab, build, params, extraCtl) {
  const S = shell(api, lab, {});
  const state = {}; params.forEach(p => state[p.key] = p.val);
  const write = () => S.ed.set(build(state));
  params.forEach(p => {
    const s = slider(api, p, v => { state[p.key] = v; write(); if (S.isPlaying()) api.quiet('Ndef(\\lab).set(\\' + p.key + ', ' + n3(v) + ')'); });
    S.ctl.appendChild(s.el);
  });
  if (extraCtl) extraCtl(S, state, () => { write(); if (S.isPlaying()) api.run(S.ed.get()); });
  write();
  return S;
}

const LABS = [];
const def = (id, num, color, render) => LABS.push({ id, num, color, render });

// 01 — Oscillators
def('osc', '01', 'paper', (api, lab) => {
  let wave = 'Saw', mouse = false;
  const build = st => {
    const f = mouse ? 'MouseX.kr(50, 2000, 1)' : 'freq';
    const src = { SinOsc: `SinOsc.ar(${f})`, Saw: `Saw.ar(${f})`, Pulse: `Pulse.ar(${f}, width)`, LFTri: `LFTri.ar(${f})`, VarSaw: `VarSaw.ar(${f}, 0, width)`, Blip: `Blip.ar(${f}, harm)`, WhiteNoise: 'WhiteNoise.ar', PinkNoise: 'PinkNoise.ar' }[wave];
    return `Ndef(\\lab).fadeTime = 0.1;\nNdef(\\lab, { |freq = ${n3(st.freq)}, amp = ${n3(st.amp)}, width = ${n3(st.width)}, harm = ${Math.round(st.harm)}, pan = ${n3(st.pan)}|\n  var sig = ${src};\n  Pan2.ar(sig, pan, amp)\n}).play;`;
  };
  ndefLab(api, lab, build, [
    { key: 'freq', min: 20, max: 4000, val: 110, exp: true, unit: 'Hz' }, { key: 'amp', min: 0, max: 0.5, val: 0.15 },
    { key: 'width', min: 0.02, max: 0.98, val: 0.5 }, { key: 'harm', min: 1, max: 60, val: 8, step: 1 }, { key: 'pan', min: -1, max: 1, val: 0 },
  ], (S, st, rebuild) => {
    S.ctl.prepend(h('div', { class: 'lbl', style: 'margin-top:0' }, api.t('c_wave')), seg(['SinOsc', 'Saw', 'Pulse', 'LFTri', 'VarSaw', 'Blip', 'WhiteNoise', 'PinkNoise'], wave, w => { wave = w; rebuild(); }), h('div', { style: 'height:8px' }));
    const mb = h('button', { class: 'btn sm mt', type: 'button', 'aria-pressed': 'false' }, 'MouseX → freq');
    mb.onclick = () => { mouse = !mouse; mb.setAttribute('aria-pressed', String(mouse)); rebuild(); };
    S.ctl.appendChild(mb);
    S.ctl.appendChild(h('p', { class: 'note' }, api.lt('osc').tip));
  });
  api.scope('scope');
});

// 02 — Subtractive synth with keyboard
def('sub', '02', 'paper', (api, lab) => {
  const st = { cutoff: 1200, rq: 0.3, atk: 0.01, dec: 0.3, sus: 0.5, rel: 0.8, lfo: 0, depth: 0.5, detune: 0.3, amp: 0.25 };
  let osc = 'Saw', filt = 'RLPF';
  const sdef = () => {
    const o = { Saw: 'Saw.ar(freq * [1, 1 + (detune * 0.01)])', Pulse: 'Pulse.ar(freq * [1, 1 + (detune * 0.01)], 0.4)', 'Saw+Pulse': '[Saw.ar(freq), Pulse.ar(freq * (1 + (detune * 0.01)) / 2, 0.3)]' }[osc];
    const cut = 'cutoff * (1 + (SinOsc.kr(lfo) * depth * (lfo > 0)))';
    const f = { RLPF: `RLPF.ar(sig, (${cut}).clip(30, 18000), rq)`, MoogFF: `MoogFF.ar(sig, (${cut}).clip(30, 18000), (1 - rq) * 3.8)`, BPF: `BPF.ar(sig, (${cut}).clip(30, 18000), rq) * 2`, RHPF: `RHPF.ar(sig, (${cut}).clip(30, 18000), rq)` }[filt];
    return `SynthDef(\\labsub, { |out = 0, freq = 220, gate = 1, amp = ${n3(st.amp)}, cutoff = ${Math.round(st.cutoff)}, rq = ${n3(st.rq)},\n    atk = ${n3(st.atk)}, dec = ${n3(st.dec)}, sus = ${n3(st.sus)}, rel = ${n3(st.rel)}, lfo = ${n3(st.lfo)}, depth = ${n3(st.depth)}, detune = ${n3(st.detune)}|\n  var env = EnvGen.kr(Env.adsr(atk, dec, sus, rel), gate, doneAction: 2);\n  var sig = Mix(${o});\n  sig = ${f};\n  Out.ar(out, Pan2.ar(sig * env * amp));\n}).add;\n\n// play it: x = Synth(\\labsub, [\\freq, 220]); x.set(\\gate, 0);`;
  };
  const S = shell(api, lab, { play: () => { api.run(S.ed.get()); arpOn = true; arpBtn.setAttribute('aria-pressed', 'true'); playArp(); }, stop: () => { arpOn = false; arpBtn.setAttribute('aria-pressed', 'false'); stopArp(); } });
  const write = () => S.ed.set(sdef());
  const active = new Map(); let arpOn = false;
  const send = () => { active.forEach(sy => api.setSynth(sy, st)); };
  S.ctl.append(h('div', { class: 'lbl', style: 'margin-top:0' }, api.t('c_osc')), seg(['Saw', 'Pulse', 'Saw+Pulse'], osc, v => { osc = v; write(); api.run(S.ed.get()); }),
    h('div', { class: 'lbl' }, api.t('c_filter')), seg(['RLPF', 'MoogFF', 'BPF', 'RHPF'], filt, v => { filt = v; write(); api.run(S.ed.get()); }));
  [{ key: 'cutoff', min: 40, max: 12000, val: st.cutoff, exp: true, unit: 'Hz' }, { key: 'rq', min: 0.05, max: 1, val: st.rq }, { key: 'lfo', min: 0, max: 12, val: st.lfo, unit: 'Hz' }, { key: 'depth', min: 0, max: 0.95, val: st.depth },
   { key: 'atk', min: 0.001, max: 2, val: st.atk, exp: true, unit: 's' }, { key: 'dec', min: 0.01, max: 2, val: st.dec, exp: true, unit: 's' }, { key: 'sus', min: 0, max: 1, val: st.sus }, { key: 'rel', min: 0.01, max: 4, val: st.rel, exp: true, unit: 's' },
   { key: 'detune', min: 0, max: 2, val: st.detune }, { key: 'amp', min: 0, max: 0.6, val: st.amp }].forEach(p => {
    S.ctl.appendChild(slider(api, p, v => { st[p.key] = v; write(); send(); }).el);
  });
  // keyboard
  S.ctl.appendChild(h('div', { class: 'lbl' }, api.t('c_keys')));
  const kb = api.keyboard(48, 25, (note, on) => {
    if (on) { const sy = api.newSynth('labsub', Object.assign({ freq: 440 * Math.pow(2, (note - 69) / 12) }, st)); active.set(note, sy); }
    else { const sy = active.get(note); if (sy) { api.setSynth(sy, { gate: 0 }); active.delete(note); } }
  });
  S.ctl.appendChild(kb);
  S.ctl.appendChild(h('p', { class: 'note' }, api.lt('sub').tip));
  const arpBtn = h('button', { class: 'btn sm mt', type: 'button', 'aria-pressed': 'false' }, '♪ ' + api.t('c_arp'));
  arpBtn.onclick = () => { arpOn = !arpOn; arpBtn.setAttribute('aria-pressed', String(arpOn)); arpOn ? playArp() : stopArp(); };
  S.ctl.appendChild(arpBtn);
  function playArp() { if (!arpOn) return; api.run(S.ed.get()); api.quiet('Pdef(\\labarp, Pbind(\\instrument, \\labsub, \\degree, Pseq([0, 2, 4, 7, 9, 7, 4, 2], inf), \\octave, 3, \\dur, 0.125, \\legato, 0.6)).play(quant: 0)'); }
  function stopArp() { api.quiet('Pdef(\\labarp).stop'); }
  write(); api.quiet(sdef());
  api.scope('spectrum');
});

// 03 — FM
def('fm', '03', 'paper', (api, lab) => {
  let envOn = false;
  const build = st => envOn
    ? `Ndef(\\lab).fadeTime = 0.1;\nNdef(\\lab, { |freq = ${n3(st.freq)}, ratio = ${n3(st.ratio)}, index = ${n3(st.index)}, amp = ${n3(st.amp)}|\n  var trig = Impulse.kr(1);\n  var env = EnvGen.kr(Env.perc(0.005, 0.9), trig);\n  PMOsc.ar(freq, freq * ratio, index * env) * env * amp ! 2\n}).play;`
    : `Ndef(\\lab).fadeTime = 0.1;\nNdef(\\lab, { |freq = ${n3(st.freq)}, ratio = ${n3(st.ratio)}, index = ${n3(st.index)}, amp = ${n3(st.amp)}|\n  PMOsc.ar(freq, freq * ratio, index) * amp ! 2\n}).play;`;
  ndefLab(api, lab, build, [
    { key: 'freq', min: 40, max: 2000, val: 220, exp: true, unit: 'Hz' }, { key: 'ratio', min: 0.25, max: 8, val: 2, step: 0.01 }, { key: 'index', min: 0, max: 20, val: 3 }, { key: 'amp', min: 0, max: 0.5, val: 0.15 },
  ], (S, st, rebuild) => {
    const b = h('button', { class: 'btn sm mt', type: 'button', 'aria-pressed': 'false' }, api.t('c_envidx'));
    b.onclick = () => { envOn = !envOn; b.setAttribute('aria-pressed', String(envOn)); rebuild(); };
    S.ctl.appendChild(b);
    S.ctl.appendChild(h('div', { class: 'lbl' }, api.t('c_ratios')));
    S.ctl.appendChild(seg(['1', '2', '3', '1.5', '1.414', '3.5', '7.1'], '', r => { st.ratio = +r; S.ed.set(build(st)); if (S.isPlaying()) api.quiet('Ndef(\\lab).set(\\ratio, ' + r + ')'); }));
    S.ctl.appendChild(h('p', { class: 'note' }, api.lt('fm').tip));
  });
  api.scope('spectrum');
});

// 04 — Additive (drawbars)
def('add', '04', 'paper', (api, lab) => {
  const N = 16; let amps = Array.from({ length: N }, (_, i) => +(1 / (i + 1)).toFixed(3)); let stretch = 1, freq = 110, amp = 0.25;
  const build = () => `Ndef(\\lab).fadeTime = 0.1;\nNdef(\\lab, { |freq = ${n3(freq)}, amp = ${n3(amp)}, stretch = ${n3(stretch)},\n    amps = #[${amps.map(n3).join(', ')}]|\n  var partials = (1..${N}) ** stretch;\n  Mix(SinOsc.ar(freq * partials, 0, amps / ${N} * 4)) * amp ! 2\n}).play;`;
  const S = shell(api, lab, {});
  const write = () => S.ed.set(build());
  const bars = h('div', { class: 'bars', role: 'group', 'aria-label': 'harmonics' });
  const bel = amps.map((a, i) => { const d = h('div', null, h('span', null, String(i + 1))); d.style.height = (a * 100) + '%'; bars.appendChild(d); return d; });
  const upd = () => { bel.forEach((d, i) => d.style.height = Math.max(1, amps[i] * 100) + '%'); write(); if (S.isPlaying()) api.quiet('Ndef(\\lab).set(\\amps, [' + amps.map(n3).join(',') + '])'); };
  const drag = e => { const r = bars.getBoundingClientRect(); const i = Math.floor((e.clientX - r.left) / r.width * N); if (i < 0 || i >= N) return; amps[i] = +Math.max(0, Math.min(1, 1 - (e.clientY - r.top - 6) / (r.height - 12))).toFixed(3); upd(); };
  bars.addEventListener('pointerdown', e => { bars.setPointerCapture(e.pointerId); drag(e); });
  bars.addEventListener('pointermove', e => { if (e.buttons) drag(e); });
  S.ctl.append(h('div', { class: 'lbl', style: 'margin-top:0' }, api.t('c_harmonics')), bars, h('div', { style: 'height:18px' }));
  const presets = { Saw: i => 1 / (i + 1), Square: i => (i % 2 === 0) ? 1 / (i + 1) : 0, Triangle: i => (i % 2 === 0) ? 1 / ((i + 1) * (i + 1)) : 0, Organ: i => [1, 0.8, 0.6, 0.7, 0, 0.5, 0, 0.4][i] || 0, Sine: i => i === 0 ? 1 : 0, Random: () => Math.random() };
  S.ctl.appendChild(seg(Object.keys(presets), 'Saw', p => { amps = amps.map((_, i) => +presets[p](i).toFixed(3)); upd(); }));
  [{ key: 'freq', min: 40, max: 880, val: freq, exp: true, unit: 'Hz' }, { key: 'stretch', min: 0.8, max: 1.3, val: stretch }, { key: 'amp', min: 0, max: 0.6, val: amp }].forEach(p => S.ctl.appendChild(slider(api, p, v => { if (p.key === 'freq') freq = v; if (p.key === 'stretch') stretch = v; if (p.key === 'amp') amp = v; write(); if (S.isPlaying()) api.quiet('Ndef(\\lab).set(\\' + p.key + ', ' + n3(v) + ')'); }).el));
  S.ctl.appendChild(h('p', { class: 'note' }, api.lt('add').tip));
  write(); api.scope('spectrum');
});

// 05 — Envelope editor
def('env', '05', 'paper', (api, lab) => {
  let pts = [[0, 0], [0.02, 1], [0.25, 0.4], [0.9, 0]]; let curve = -4; let sel = -1; let loop = false; let timer = null;
  const times = () => pts.slice(1).map((p, i) => +(p[0] - pts[i][0]).toFixed(3));
  const envStr = () => `Env([${pts.map(p => n3(p[1])).join(', ')}], [${times().map(n3).join(', ')}], ${n3(curve)})`;
  const build = () => `${envStr()}.plot;\n\n{ Saw.ar([220, 221], 0.2) * EnvGen.kr(${envStr()}, doneAction: 2) }.play;`;
  const S = shell(api, lab, { play: () => trig(), stop: () => { loop = false; lb.setAttribute('aria-pressed', 'false'); clearInterval(timer); } });
  const cv = h('canvas', { class: 'pad', style: 'height:220px' }); S.ctl.appendChild(h('div', { class: 'lbl', style: 'margin-top:0' }, api.t('c_envdraw')));
  S.ctl.appendChild(cv);
  const g = cv.getContext('2d');
  function draw() {
    const r = cv.getBoundingClientRect(); const d = Math.min(2, devicePixelRatio || 1); cv.width = r.width * d; cv.height = r.height * d; const w = cv.width, hh = cv.height;
    g.fillStyle = '#050505'; g.fillRect(0, 0, w, hh); g.strokeStyle = 'rgba(255,255,255,.08)'; for (let i = 1; i < 10; i++) { g.beginPath(); g.moveTo(w * i / 10, 0); g.lineTo(w * i / 10, hh); g.stroke(); }
    const X = t => 10 * d + t * (w - 20 * d), Y = v => hh - 10 * d - v * (hh - 20 * d);
    g.strokeStyle = '#D12F7D'; g.lineWidth = 2.2 * d; g.beginPath();
    for (let s = 0; s < pts.length - 1; s++) { const [t0, a] = pts[s], [t1, b] = pts[s + 1]; for (let k = 0; k <= 40; k++) { const p = k / 40; const v = Math.abs(curve) < 0.001 ? a + (b - a) * p : a + (b - a) * (1 - Math.exp(curve * p)) / (1 - Math.exp(curve)); const x = X(t0 + (t1 - t0) * p), y = Y(v); (s === 0 && k === 0) ? g.moveTo(x, y) : g.lineTo(x, y); } }
    g.stroke();
    pts.forEach((p, i) => { g.fillStyle = i === sel ? '#E1C43B' : '#F0EFEA'; g.fillRect(X(p[0]) - 5 * d, Y(p[1]) - 5 * d, 10 * d, 10 * d); });
    g.fillStyle = '#9C9B97'; g.font = (10 * d) + 'px IBM Plex Mono'; g.fillText((pts[pts.length - 1][0]).toFixed(2) + ' s', w - 60 * d, hh - 14 * d);
  }
  const toPt = e => { const r = cv.getBoundingClientRect(); return [Math.max(0, Math.min(1, (e.clientX - r.left - 10) / (r.width - 20))), Math.max(0, Math.min(1, 1 - (e.clientY - r.top - 10) / (r.height - 20)))]; };
  cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); const [t, v] = toPt(e); const r = cv.getBoundingClientRect(); sel = pts.findIndex(p => Math.abs(p[0] - t) * r.width < 16 && Math.abs(p[1] - v) * r.height < 16);
    if (sel < 0 && e.detail >= 2 && pts.length < 8) { let k = pts.findIndex(p => p[0] > t); if (k < 0) k = pts.length; pts.splice(k, 0, [t, v]); sel = k; }
    draw(); });
  cv.addEventListener('pointermove', e => { if (!e.buttons || sel < 0) return; let [t, v] = toPt(e); if (sel === 0) t = 0; const lo = sel > 0 ? pts[sel - 1][0] + 0.005 : 0, hi = sel < pts.length - 1 ? pts[sel + 1][0] - 0.005 : 1; pts[sel] = [Math.min(hi, Math.max(lo, t)), +v.toFixed(3)]; if (sel === pts.length - 1) pts[sel][0] = Math.max(pts[sel][0], lo); draw(); S.ed.set(build()); });
  cv.addEventListener('pointerup', () => { S.ed.set(build()); });
  S.ctl.appendChild(slider(api, { key: 'curve', min: -10, max: 10, val: curve, step: 0.1 }, v => { curve = v; draw(); S.ed.set(build()); }).el);
  const rm = h('button', { class: 'btn sm', type: 'button' }, api.t('c_delpt')); rm.onclick = () => { if (sel > 0 && sel < pts.length - 1 && pts.length > 3) { pts.splice(sel, 1); sel = -1; draw(); S.ed.set(build()); } };
  const tb = h('button', { class: 'btn sm cya', type: 'button' }, '▶ ' + api.t('c_trigger')); tb.onclick = () => trig();
  const lb = h('button', { class: 'btn sm', type: 'button', 'aria-pressed': 'false' }, '↻ ' + api.t('c_loop'));
  lb.onclick = () => { loop = !loop; lb.setAttribute('aria-pressed', String(loop)); clearInterval(timer); if (loop) { trig(); timer = setInterval(trig, Math.max(300, pts[pts.length - 1][0] * 1000 + 200)); } };
  S.ctl.appendChild(h('div', { class: 'row mt' }, tb, lb, rm));
  S.ctl.appendChild(h('p', { class: 'note' }, api.lt('env').tip));
  function trig() { api.quiet('{ Saw.ar([220, 221], 0.2) * EnvGen.kr(' + envStr() + ', doneAction: 2) }.play'); }
  api.onLeave(() => clearInterval(timer));
  requestAnimationFrame(draw); S.ed.set(build()); api.scope('scope');
});

// 06 — Step sequencer -> Pbind
def('seq', '06', 'paper', (api, lab) => {
  const ROWS = 8, STEPS = 16; let grid = Array.from({ length: STEPS }, (_, i) => [[0, 4, 2, 4, 0, 4, 5, 4, 0, 4, 2, 4, 7, 6, 5, 4][i]]);
  let scale = 'minorPentatonic', inst = 'default', tempo = 120, oct = 5, legato = 0.5;
  const pseq = () => '[' + grid.map(s => s.length === 0 ? '\\rest' : s.length === 1 ? s[0] : '[' + s.join(', ') + ']').join(', ') + ']';
  const build = () => `TempoClock.default.tempo = ${tempo}/60;\nPdef(\\seq, Pbind(\n  \\instrument, \\${inst},\n  \\scale, Scale.${scale},\n  \\degree, Pseq(${pseq()}, inf),\n  \\octave, ${oct},\n  \\dur, 0.25,\n  \\legato, ${n3(legato)}\n)).play(quant: 1);`;
  const S = shell(api, lab, { play: () => { api.run(S.ed.get()); S.setPlaying(true); }, stop: () => { api.quiet('Pdef(\\seq).stop'); S.setPlaying(false); } });
  const write = () => { S.ed.set(build()); if (S.isPlaying()) api.quiet(build()); };
  const gw = h('div', { class: 'steps', style: 'grid-template-columns:24px repeat(' + STEPS + ',1fr)' });
  const btns = [];
  for (let r = ROWS - 1; r >= 0; r--) {
    gw.appendChild(h('div', { class: 'rl' }, String(r)));
    for (let c = 0; c < STEPS; c++) { const b = h('button', { type: 'button', 'aria-label': 'step ' + (c + 1) + ' degree ' + r }); b.onclick = () => { const s = grid[c]; const k = s.indexOf(r); if (k >= 0) s.splice(k, 1); else s.push(r); s.sort((a, b2) => a - b2); paint(); write(); }; btns.push({ b, r, c }); gw.appendChild(b); }
  }
  const paint = () => btns.forEach(({ b, r, c }) => b.classList.toggle('on', grid[c].includes(r)));
  paint();
  S.ctl.append(h('div', { class: 'lbl', style: 'margin-top:0' }, api.t('c_steps')), gw);
  S.ctl.append(h('div', { class: 'lbl' }, api.t('c_scale')), seg(['major', 'minor', 'dorian', 'minorPentatonic', 'majorPentatonic', 'hirajoshi', 'bhairav', 'whole'], scale, v => { scale = v; write(); }));
  S.ctl.append(h('div', { class: 'lbl' }, api.t('c_instrument')), seg(['default', 'labpluck', 'labblip'], inst, v => { inst = v; write(); }));
  [{ key: 'tempo', min: 50, max: 200, val: tempo, step: 1, unit: 'BPM' }, { key: 'octave', min: 3, max: 7, val: oct, step: 1 }, { key: 'legato', min: 0.1, max: 1.5, val: legato }].forEach(p => S.ctl.appendChild(slider(api, p, v => { if (p.key === 'tempo') tempo = Math.round(v); if (p.key === 'octave') oct = Math.round(v); if (p.key === 'legato') legato = v; write(); }).el));
  const clr = h('button', { class: 'btn sm mt', type: 'button' }, api.t('c_clear')); clr.onclick = () => { grid = grid.map(() => []); paint(); write(); };
  const rnd = h('button', { class: 'btn sm mt', type: 'button' }, api.t('c_random')); rnd.onclick = () => { grid = grid.map(() => Math.random() < 0.7 ? [Math.floor(Math.random() * ROWS)] : []); paint(); write(); };
  S.ctl.appendChild(h('div', { class: 'row' }, clr, rnd));
  S.ctl.appendChild(h('p', { class: 'note' }, api.lt('seq').tip));
  api.quiet(`SynthDef(\\labpluck, { |out = 0, freq = 440, amp = 0.3, pan = 0| var sig = Pluck.ar(WhiteNoise.ar(0.5), Impulse.kr(0), 0.05, freq.reciprocal, 1.5, 0.3); DetectSilence.ar(sig, doneAction: 2); Out.ar(out, Pan2.ar(sig * amp, pan)) }).add;
SynthDef(\\labblip, { |out = 0, freq = 440, amp = 0.2, pan = 0, sustain = 0.2| var env = EnvGen.kr(Env.perc(0.005, sustain * 2), doneAction: 2); Out.ar(out, Pan2.ar(Blip.ar(freq, 5) * env * amp, pan)) }).add;`);
  // step highlight from the clock
  const iv = setInterval(() => { if (!S.isPlaying()) { btns.forEach(x => x.b.classList.remove('cur')); return; } const cl = G.SCLib.TempoClock.default; const b = cl.secs2beats(G.SCEngine.now()); const step = Math.floor(b * 4) % STEPS; btns.forEach(x => x.b.classList.toggle('cur', x.c === step)); }, 60);
  api.onLeave(() => clearInterval(iv));
  write(); api.scope('timeline');
});

// 07 — Granular
def('gran', '07', 'paper', (api, lab) => {
  let sync = false, fm = false;
  const build = st => `Ndef(\\lab).fadeTime = 0.2;\nNdef(\\lab, { |density = ${n3(st.density)}, size = ${n3(st.size)}, freq = ${n3(st.freq)}, spread = ${n3(st.spread)}, pan = ${n3(st.pan)}, amp = ${n3(st.amp)}|\n  var trig = ${sync ? 'Impulse' : 'Dust'}.kr(density);\n  var f = freq * LFNoise1.kr(density).range(1 - spread, 1 + spread);\n  ${fm ? 'GrainFM.ar(2, trig, size, f, f * 1.5, 3, LFNoise1.kr(10) * pan)' : 'GrainSin.ar(2, trig, size, f, LFNoise1.kr(10) * pan)'} * amp\n}).play;`;
  ndefLab(api, lab, build, [
    { key: 'density', min: 1, max: 400, val: 40, exp: true, unit: '/s' }, { key: 'size', min: 0.002, max: 0.3, val: 0.04, exp: true, unit: 's' }, { key: 'freq', min: 80, max: 4000, val: 600, exp: true, unit: 'Hz' },
    { key: 'spread', min: 0, max: 0.9, val: 0.3 }, { key: 'pan', min: 0, max: 1, val: 0.8 }, { key: 'amp', min: 0, max: 0.6, val: 0.25 },
  ], (S, st, rebuild) => {
    S.ctl.prepend(h('div', { class: 'row', style: 'margin-bottom:8px' }, seg(['Dust', 'Impulse'], 'Dust', v => { sync = v === 'Impulse'; rebuild(); }), seg(['GrainSin', 'GrainFM'], 'GrainSin', v => { fm = v === 'GrainFM'; rebuild(); })));
    S.ctl.appendChild(h('p', { class: 'note' }, api.lt('gran').tip));
  });
  api.scope('sono');
});

// 08 — Tuning
def('tune', '08', 'paper', (api, lab) => {
  let edo = 12, base = 220;
  const build = () => `// ${edo} equal divisions of the octave\nPbind(\n  \\stepsPerOctave, ${edo},\n  \\root, 0, \\octave, ${Math.round(Math.log2(base / 440 * 16) + 0.75) || 4},\n  \\note, Pseq((0..${edo}), 1),\n  \\dur, ${n3(Math.max(0.06, Math.min(0.3, 2.4 / edo)))}\n).play;`;
  const S = shell(api, lab, {});
  const cv = h('canvas', { class: 'pad', style: 'height:280px' });
  S.ctl.append(h('div', { class: 'lbl', style: 'margin-top:0' }, api.t('c_circle')), cv);
  const JUST = [[1, '1/1'], [9 / 8, '9/8'], [6 / 5, '6/5'], [5 / 4, '5/4'], [4 / 3, '4/3'], [3 / 2, '3/2'], [5 / 3, '5/3'], [15 / 8, '15/8']];
  function draw() {
    const r = cv.getBoundingClientRect(); const d = Math.min(2, devicePixelRatio || 1); cv.width = r.width * d; cv.height = r.height * d; const g = cv.getContext('2d'); const w = cv.width, hh = cv.height;
    g.fillStyle = '#050505'; g.fillRect(0, 0, w, hh); const cx = w / 2, cy = hh / 2, R = Math.min(w, hh) * 0.4;
    g.strokeStyle = 'rgba(255,255,255,.15)'; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke();
    JUST.forEach(([rt, l]) => { const a = Math.log2(rt) * Math.PI * 2 - Math.PI / 2; g.strokeStyle = '#E1C43B'; g.lineWidth = 1.5 * d; g.beginPath(); g.moveTo(cx + Math.cos(a) * R * 0.86, cy + Math.sin(a) * R * 0.86); g.lineTo(cx + Math.cos(a) * R * 1.12, cy + Math.sin(a) * R * 1.12); g.stroke(); g.fillStyle = '#E1C43B'; g.font = (10 * d) + 'px IBM Plex Mono'; g.fillText(l, cx + Math.cos(a) * R * 1.2 - 10 * d, cy + Math.sin(a) * R * 1.2 + 4 * d); });
    for (let i = 0; i < edo; i++) { const a = i / edo * Math.PI * 2 - Math.PI / 2; g.fillStyle = i === 0 ? '#D12F7D' : '#2A9EBF'; g.beginPath(); g.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R, (edo > 30 ? 3 : 5) * d, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = '#F0EFEA'; g.font = '800 ' + (34 * d) + 'px Barlow Condensed'; g.textAlign = 'center'; g.fillText(edo + '-EDO', cx, cy + 6 * d); g.font = (10 * d) + 'px IBM Plex Mono'; g.fillStyle = '#9C9B97'; g.fillText((1200 / edo).toFixed(1) + ' cents', cx, cy + 24 * d); g.textAlign = 'left';
  }
  S.ctl.appendChild(slider(api, { key: 'edo', min: 5, max: 53, val: edo, step: 1 }, v => { edo = Math.round(v); draw(); S.ed.set(build()); }).el);
  S.ctl.appendChild(slider(api, { key: 'base', min: 110, max: 440, val: base, exp: true, unit: 'Hz' }, v => { base = v; S.ed.set(build()); }).el);
  const bE = h('button', { class: 'btn sm', type: 'button' }, api.t('c_et_chord')); bE.onclick = () => api.quiet(`{ SinOsc.ar([0, 4, 7].midiratio * ${n3(base)}, 0, 0.1).sum * EnvGen.kr(Env.linen(0.05, 1.5, 0.5), doneAction: 2) ! 2 }.play`);
  const bJ = h('button', { class: 'btn sm', type: 'button' }, api.t('c_just_chord')); bJ.onclick = () => api.quiet(`{ SinOsc.ar([1, 5/4, 3/2] * ${n3(base)}, 0, 0.1).sum * EnvGen.kr(Env.linen(0.05, 1.5, 0.5), doneAction: 2) ! 2 }.play`);
  const bN = h('button', { class: 'btn sm', type: 'button' }, api.t('c_edo_chord')); bN.onclick = () => { const st = k => Math.round(Math.log2(k) * edo); api.quiet(`{ SinOsc.ar([0, ${st(5 / 4)}, ${st(3 / 2)}].collect { |s| 2 ** (s / ${edo}) } * ${n3(base)}, 0, 0.1).sum * EnvGen.kr(Env.linen(0.05, 1.5, 0.5), doneAction: 2) ! 2 }.play`); };
  S.ctl.appendChild(h('div', { class: 'row mt' }, bE, bJ, bN));
  S.ctl.appendChild(h('p', { class: 'note' }, api.lt('tune').tip));
  requestAnimationFrame(draw); S.ed.set(build()); api.scope('spectrum');
});

// 09 — Effects chain
def('fx', '09', 'paper', (api, lab) => {
  let src = 'pluck'; const on = { dist: false, comb: true, filt: false, verb: true };
  const st = { drive: 4, dtime: 0.25, decay: 3, cutoff: 2000, mix: 0.35, room: 0.8 };
  const build = () => {
    const s = { pluck: 'Pluck.ar(WhiteNoise.ar(0.4), Impulse.kr(2), 0.02, LFNoise0.kr(2).range(110, 440).round(55).reciprocal, 2, 0.4)', drums: 'Decay2.ar(Impulse.ar([2, 3]).sum, 0.002, 0.15) * WhiteNoise.ar(0.4)', pad: 'Splay.ar(Saw.ar([110, 165, 220] * LFNoise1.kr(0.3 ! 3).range(0.99, 1.01), 0.08)).sum' }[src];
    let code = `Ndef(\\lab).fadeTime = 0.2;\nNdef(\\lab, { |drive = ${n3(st.drive)}, dtime = ${n3(st.dtime)}, decay = ${n3(st.decay)}, cutoff = ${Math.round(st.cutoff)}, mix = ${n3(st.mix)}, room = ${n3(st.room)}|\n  var sig = ${s};\n`;
    if (on.dist) code += '  sig = (sig * drive).tanh * 0.5;\n';
    if (on.comb) code += '  sig = sig + CombN.ar(sig, 1, dtime, decay, 0.5);\n';
    if (on.filt) code += '  sig = RLPF.ar(sig, cutoff, 0.3);\n';
    code += '  sig = sig ! 2;\n';
    if (on.verb) code += '  sig = FreeVerb2.ar(sig[0], sig[1], mix, room, 0.4);\n';
    return code + '  Limiter.ar(sig * 0.8, 0.9)\n}).play;';
  };
  const S = shell(api, lab, {});
  const rebuild = () => { S.ed.set(build()); if (S.isPlaying()) api.run(S.ed.get()); };
  S.ctl.append(h('div', { class: 'lbl', style: 'margin-top:0' }, api.t('c_source')), seg(['pluck', 'drums', 'pad'], src, v => { src = v; rebuild(); }), h('div', { class: 'lbl' }, api.t('c_chain')));
  const tg = h('div', { class: 'row' });
  [['dist', 'tanh'], ['comb', 'CombN'], ['filt', 'RLPF'], ['verb', 'FreeVerb2']].forEach(([k, l]) => { const b = h('button', { class: 'btn sm', type: 'button', 'aria-pressed': String(on[k]) }, l); b.onclick = () => { on[k] = !on[k]; b.setAttribute('aria-pressed', String(on[k])); rebuild(); }; tg.appendChild(b); });
  S.ctl.appendChild(tg);
  [{ key: 'drive', min: 1, max: 40, val: st.drive, exp: true }, { key: 'dtime', min: 0.01, max: 1, val: st.dtime, exp: true, unit: 's' }, { key: 'decay', min: 0.1, max: 10, val: st.decay, exp: true, unit: 's' }, { key: 'cutoff', min: 100, max: 10000, val: st.cutoff, exp: true, unit: 'Hz' }, { key: 'mix', min: 0, max: 1, val: st.mix }, { key: 'room', min: 0, max: 1, val: st.room }].forEach(p => S.ctl.appendChild(slider(api, p, v => { st[p.key] = v; S.ed.set(build()); if (S.isPlaying()) api.quiet('Ndef(\\lab).set(\\' + p.key + ', ' + n3(v) + ')'); }).el));
  S.ctl.appendChild(h('p', { class: 'note' }, api.lt('fx').tip));
  S.ed.set(build()); api.scope('scope');
});

// 10 — Chaos & non-standard synthesis
def('chaos', '10', 'paper', (api, lab) => {
  let algo = 'Gendy1';
  const build = st => {
    const s = { Gendy1: 'Gendy1.ar(1, 1, 1, 1, freq, freq * 2, chaos, chaos)', Logistic: '(Logistic.ar(3 + chaos, freq * 4) - 0.5)', Crackle: 'Crackle.ar(1 + chaos)', HenonN: 'HenonN.ar(freq * 20, 1 + (chaos * 0.4), 0.3)', LFNoise0: 'LFNoise0.ar(freq * 10)' }[algo];
    return `Ndef(\\lab).fadeTime = 0.2;\nNdef(\\lab, { |freq = ${n3(st.freq)}, chaos = ${n3(st.chaos)}, amp = ${n3(st.amp)}, cutoff = ${Math.round(st.cutoff)}|\n  var sig = ${s};\n  Pan2.ar(LPF.ar(LeakDC.ar(sig), cutoff), LFNoise1.kr(0.5) * 0.5, amp)\n}).play;`;
  };
  ndefLab(api, lab, build, [{ key: 'freq', min: 20, max: 1000, val: 120, exp: true, unit: 'Hz' }, { key: 'chaos', min: 0, max: 0.99, val: 0.6 }, { key: 'cutoff', min: 200, max: 16000, val: 8000, exp: true, unit: 'Hz' }, { key: 'amp', min: 0, max: 0.5, val: 0.2 }], (S, st, rebuild) => {
    S.ctl.prepend(h('div', { class: 'lbl', style: 'margin-top:0' }, api.t('c_algo')), seg(['Gendy1', 'Logistic', 'Crackle', 'HenonN', 'LFNoise0'], algo, v => { algo = v; rebuild(); }), h('div', { style: 'height:8px' }));
    S.ctl.appendChild(h('p', { class: 'note' }, api.lt('chaos').tip));
  });
  api.scope('scope');
});

G.SCLabs = { LABS, h, slider, seg };
})(window);
