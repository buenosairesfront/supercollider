// Headless harness: runs the SC interpreter + DSP server in Node, advancing audio time manually.
// Usage: const H = require('./harness'); const r = H.run(code, seconds);
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

function makeEnv() {
  const ctx = { console, Math, Date, performance: { now: () => Date.now() }, setTimeout: () => 0, setInterval: () => 0, clearInterval() { }, URL: { createObjectURL: () => '' }, Blob: function () { }, navigator: {} };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  for (const f of ['js/dsp.js', 'js/lang.js', 'js/sclib.js', 'js/patterns.js']) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  const D = ctx.SCDSP, L = ctx.SCLang, LIB = ctx.SCLib;
  const sr = 48000, BLOCK = D.BLOCK;
  const server = new D.Server(sr);
  let now = 0; const posts = [], errors = [], notes = [];
  const engine = {
    booted: true, status: { cpu: 0, synths: 0, ugens: 0, nodes: [] },
    now: () => now, sampleRate: () => sr, boot() { }, send(m) { server.handle(m); },
    renderOffline(def, nch, dur) { const sv = new D.Server(sr); sv.exec({ type: 's_new', id: 1, def, controls: {} }); const n = Math.round(dur * sr); const out = Array.from({ length: nch }, () => new Float32Array(n)); const Lb = new Float32Array(BLOCK), Rb = new Float32Array(BLOCK); for (let off = 0; off < n; off += BLOCK) { sv.process(Lb, Rb, null, null, BLOCK, off / sr); for (let c = 0; c < nch; c++) { const b = sv.busStamp[c] === sv.block ? sv.bus[c] : sv.zero; out[c].set(b.subarray(0, Math.min(BLOCK, n - off)), off); } } return out; },
    startRecording() { }, stopRecording() { }, volumeDb: () => 0, setVolumeDb() { }, setMute() { }, needMic() { },
  };
  const ui = { plot: (d, o) => posts.push('[plot ' + d.length + 'ch ' + d[0].length + ']'), show() { }, openRef() { }, showGraph() { }, error: e => errors.push(e.message || String(e)), note: n => notes.push(n), synthStarted() { }, defAdded() { } };
  const I = new L.Interpreter({ post: (t) => posts.push(t) });
  LIB.I = I; LIB.host = { engine, ui, t: k => k, lang: 'en', stopAll: () => LIB.stopAll() };
  I.globals.set('s', LIB.server);
  I.interpret(LIB.PRELUDE);
  const Lb = new Float32Array(BLOCK), Rb = new Float32Array(BLOCK);
  function advance(sec, acc) {
    const blocks = Math.round(sec * sr / BLOCK);
    for (let b = 0; b < blocks; b++) {
      LIB.Sched.tick();
      server.process(Lb, Rb, null, null, BLOCK, now);
      now += BLOCK / sr;
      const ob = server.takeOutbox();
      for (const m of ob) { if (m.type === 'status' && m.ended && m.ended.length) LIB.onEnded(m.ended); if (m.type === 'ended') LIB.onEnded(m.ids); if (m.type === 'poll') posts.push(m.label + ': ' + m.value); if (m.type === 'error') errors.push('SERVER ' + m.msg); }
      if (acc) for (let i = 0; i < BLOCK; i++) { acc.sL += Lb[i] * Lb[i]; acc.sR += Rb[i] * Rb[i]; acc.n++; acc.pk = Math.max(acc.pk, Math.abs(Lb[i]), Math.abs(Rb[i])); if (!Number.isFinite(Lb[i])) acc.nan = true; }
    }
  }
  function evalCode(code) {
    try { const v = I.interpret(code); posts.push('-> ' + I.str(v)); return v; }
    catch (e) { errors.push((e.sc ? 'ERROR: ' : 'JSERR: ') + e.message + (e.extra && e.extra.line ? ' (line ' + e.extra.line + ')' : '') + (e.sc ? '' : '\n' + e.stack)); return null; }
  }
  return { ctx, I, LIB, server, posts, errors, notes, advance, evalCode, get now() { return now; } };
}

function run(code, seconds = 1) {
  const env = makeEnv();
  const blocks = Array.isArray(code) ? code : [code];
  for (const c of blocks) env.evalCode(c);
  const acc = { sL: 0, sR: 0, n: 0, pk: 0, nan: false };
  env.advance(seconds, acc);
  const rms = [Math.sqrt(acc.sL / Math.max(acc.n, 1)), Math.sqrt(acc.sR / Math.max(acc.n, 1))];
  return { posts: env.posts, errors: env.errors, rms, peak: acc.pk, nan: acc.nan, synths: env.server.nodes.length, notes: env.notes.length, env };
}
module.exports = { makeEnv, run };
