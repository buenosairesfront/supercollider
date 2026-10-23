/* SuperCollider Lab · U-MA
 * dsp.js — a small scsynth in JavaScript.
 * Runs both inside the AudioWorklet and on the main thread (fallback + offline .plot).
 * Defines globalThis.SCDSP = { Server, UNITS, BLOCK }.
 */
(function (G) {
'use strict';
const BLOCK = 128;
const TWO_PI = Math.PI * 2;
const LOG001 = Math.log(0.001);

// ---------- random (seedable, per synth) ----------
function rng(seed) {
  let s = (seed >>> 0) || 0x9E3779B9;
  return function () { // mulberry32
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
let seedCounter = (Date.now() & 0xffff) * 7919;

// ---------- helpers ----------
const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
const fold = (x, lo, hi) => {
  const r = hi - lo; if (r <= 0) return lo;
  let v = (x - lo) % (2 * r); if (v < 0) v += 2 * r;
  return lo + (v > r ? 2 * r - v : v);
};
const wrap = (x, lo, hi) => { const r = hi - lo; if (r <= 0) return lo; let v = (x - lo) % r; if (v < 0) v += r; return lo + v; };
const midicps = m => 440 * Math.pow(2, (m - 69) / 12);
const cpsmidi = f => 69 + 12 * Math.log2(Math.abs(f) / 440);
const isTrig = (prev, cur) => prev <= 0 && cur > 0;

function polyblep(t, dt) {
  if (t < dt) { t /= dt; return t + t - t * t - 1; }
  if (t > 1 - dt) { t = (t - 1) / dt; return t * t + t + t + 1; }
  return 0;
}

// Biquad (RBJ) with lazy coefficient update
function makeBiquad(kind) {
  return function (u, ctx) {
    const sr = ctx.sr;
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0, lf = -1, lq = -1, lg = -1e9;
    let b0 = 0, b1 = 0, b2 = 0, a1 = 0, a2 = 0;
    function coef(f, q, db) {
      f = clamp(f, 1, sr * 0.49); q = Math.max(q, 0.01);
      const w = TWO_PI * f / sr, cs = Math.cos(w), sn = Math.sin(w), al = sn / (2 * q);
      let a0;
      switch (kind) {
        case 'lp': b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = b0; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al; break;
        case 'hp': b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = b0; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al; break;
        case 'bp': b0 = al; b1 = 0; b2 = -al; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al; break;
        case 'br': b0 = 1; b1 = -2 * cs; b2 = 1; a0 = 1 + al; a1 = -2 * cs; a2 = 1 - al; break;
        case 'peak': { const A = Math.pow(10, db / 40); b0 = 1 + al * A; b1 = -2 * cs; b2 = 1 - al * A; a0 = 1 + al / A; a1 = -2 * cs; a2 = 1 - al / A; break; }
        case 'ls': case 'hs': { const A = Math.pow(10, db / 40), sq = 2 * Math.sqrt(A) * al;
          if (kind === 'ls') { b0 = A * ((A + 1) - (A - 1) * cs + sq); b1 = 2 * A * ((A - 1) - (A + 1) * cs); b2 = A * ((A + 1) - (A - 1) * cs - sq); a0 = (A + 1) + (A - 1) * cs + sq; a1 = -2 * ((A - 1) + (A + 1) * cs); a2 = (A + 1) + (A - 1) * cs - sq; }
          else { b0 = A * ((A + 1) + (A - 1) * cs + sq); b1 = -2 * A * ((A - 1) + (A + 1) * cs); b2 = A * ((A + 1) + (A - 1) * cs - sq); a0 = (A + 1) - (A - 1) * cs + sq; a1 = 2 * ((A - 1) - (A + 1) * cs); a2 = (A + 1) - (A - 1) * cs - sq; }
          break; }
      }
      b0 /= a0; b1 /= a0; b2 /= a0; a1 /= a0; a2 /= a0;
    }
    // input layout: in, freq, (rq | none), (db)
    const fixedQ = (kind === 'lp' || kind === 'hp') && u.name !== 'RLPF' && u.name !== 'RHPF';
    return function (n) {
      const I = u.ins, o = u.outs[0], inp = I[0], fr = I[1];
      const rqA = fixedQ ? null : I[2];
      const dbA = (kind === 'peak' || kind === 'ls' || kind === 'hs') ? I[3] : null;
      for (let i = 0; i < n; i++) {
        const f = fr[i], q = fixedQ ? 0.70710678 : 1 / Math.max(rqA[i], 0.0001), g = dbA ? dbA[i] : 0;
        if (f !== lf || q !== lq || g !== lg) { coef(f, q, g); lf = f; lq = q; lg = g; }
        const x = inp[i];
        let y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
        if (!(y > -1e10 && y < 1e10)) { y = 0; y1 = y2 = 0; }
        x2 = x1; x1 = x; y2 = y1; y1 = y; o[i] = y;
      }
    };
  };
}

// Delay line helper
function delayBuf(ctx, maxTime) {
  let len = Math.max(4, Math.ceil(Math.max(0.0001, maxTime) * ctx.sr) + 4);
  len = Math.min(len, ctx.sr * 60);
  return { buf: new Float32Array(len), len, w: 0 };
}
function readDelay(d, delaySamps, interp) {
  const len = d.len;
  if (delaySamps < 1) delaySamps = 1;
  if (delaySamps > len - 3) delaySamps = len - 3;
  let rp = d.w - delaySamps; while (rp < 0) rp += len;
  const i0 = Math.floor(rp), fr = rp - i0, b = d.buf;
  if (interp === 0) return b[Math.round(rp) % len];
  const a = b[i0 % len], c = b[(i0 + 1) % len];
  if (interp === 1) return a + (c - a) * fr;
  const z = b[(i0 - 1 + len) % len], d3 = b[(i0 + 2) % len]; // hermite
  const c0 = a, c1 = 0.5 * (c - z), c2 = z - 2.5 * a + 2 * c - 0.5 * d3, c3 = 0.5 * (d3 - z) + 1.5 * (a - c);
  return ((c3 * fr + c2) * fr + c1) * fr + c0;
}

// ---------- Demand streams (Dseq & co.) ----------
function dstream(spec, R) {
  if (typeof spec === 'number') { let done = false; return { next() { return spec; }, reset() { done = false; }, isConst: true }; }
  if (!spec || !spec.d) return { next() { return 0; }, reset() { } };
  const t = spec.d, list = spec.list || [], rep = spec.repeats == null ? 1 : spec.repeats;
  let st;
  const sub = x => (typeof x === 'number') ? { once: true, v: x } : dstream(x, R);
  function reset() {
    st = { count: 0, idx: 0, cur: null, last: -1, perm: null, val: spec.start != null ? spec.start : (spec.lo != null ? spec.lo + R() * (spec.hi - spec.lo) : 0) };
  }
  reset();
  function fromList(chooseIdx, total) {
    // returns next value, descending into nested streams
    for (let guard = 0; guard < 1000; guard++) {
      if (st.cur) {
        if (st.cur.once) { const v = st.cur.v; st.cur = null; return v; }
        const v = st.cur.next(); if (v != null) return v; st.cur = null;
      }
      if (st.count >= total) return null;
      const i = chooseIdx(); if (i == null) return null;
      st.count++;
      st.cur = sub(list[i]);
      if (!st.cur.once && st.cur.reset) st.cur.reset();
    }
    return null;
  }
  const len = list.length || 1;
  return {
    reset,
    next() {
      switch (t) {
        case 'Dseq': return fromList(() => (st.idx++) % len, rep * len);
        case 'Dser': return fromList(() => (st.idx++) % len, rep);
        case 'Drand': return fromList(() => Math.floor(R() * len), rep);
        case 'Dxrand': return fromList(() => { let i; do { i = Math.floor(R() * len); } while (len > 1 && i === st.last); st.last = i; return i; }, rep);
        case 'Dshuf': return fromList(() => {
          if (!st.perm) { st.perm = list.map((_, i) => i); for (let i = len - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [st.perm[i], st.perm[j]] = [st.perm[j], st.perm[i]]; } }
          return st.perm[(st.idx++) % len]; }, rep * len);
        case 'Dwhite': if (st.count++ >= spec.length) return null; return spec.lo + R() * (spec.hi - spec.lo);
        case 'Diwhite': if (st.count++ >= spec.length) return null; return Math.floor(spec.lo + R() * (spec.hi - spec.lo + 1));
        case 'Dbrown': { if (st.count++ >= spec.length) return null; const v = st.val; st.val = fold(st.val + (R() * 2 - 1) * spec.step, spec.lo, spec.hi); return v; }
        case 'Dseries': { if (st.count >= spec.length) return null; const v = spec.start + spec.step * st.count; st.count++; return v; }
        case 'Dgeom': { if (st.count >= spec.length) return null; const v = spec.start * Math.pow(spec.grow, st.count); st.count++; return v; }
      }
      return null;
    }
  };
}

// ---------- Unit generators ----------
// Each entry: (u, ctx) => process(n). u.ins = Float32Array[], u.outs = Float32Array[], u.params = extra data.
const UNITS = {};
const U = (names, f) => names.split(' ').forEach(nm => UNITS[nm] = f);

U('Control', (u, ctx) => function (n) { /* filled by synth */ });

U('SinOsc FSinOsc', (u, ctx) => {
  let ph = 0; const isr = 1 / ctx.sr; let first = true;
  return n => { const f = u.ins[0], p = u.ins[1], o = u.outs[0];
    for (let i = 0; i < n; i++) { o[i] = Math.sin(TWO_PI * ph + p[i]); ph += f[i] * isr; ph -= Math.floor(ph); } };
});
U('SinOscFB', (u, ctx) => {
  let ph = 0, prev = 0; const isr = 1 / ctx.sr;
  return n => { const f = u.ins[0], fb = u.ins[1], o = u.outs[0];
    for (let i = 0; i < n; i++) { const y = Math.sin(TWO_PI * ph + fb[i] * prev); prev = y; o[i] = y; ph += f[i] * isr; ph -= Math.floor(ph); } };
});
U('Saw', (u, ctx) => {
  let ph = 0.5; const isr = 1 / ctx.sr;
  return n => { const f = u.ins[0], o = u.outs[0];
    for (let i = 0; i < n; i++) { const dt = Math.min(Math.abs(f[i]) * isr, 0.5); o[i] = (2 * ph - 1) - polyblep(ph, dt); ph += dt; if (ph >= 1) ph -= 1; } };
});
U('Pulse', (u, ctx) => {
  let ph = 0; const isr = 1 / ctx.sr;
  return n => { const f = u.ins[0], w = u.ins[1], o = u.outs[0];
    for (let i = 0; i < n; i++) {
      const dt = Math.min(Math.abs(f[i]) * isr, 0.5), wd = clamp(w[i], 0.01, 0.99);
      let y = ph < wd ? 1 : -1; y += polyblep(ph, dt); let t2 = ph - wd; if (t2 < 0) t2 += 1; y -= polyblep(t2, dt);
      o[i] = y; ph += dt; if (ph >= 1) ph -= 1; } };
});
U('LFSaw', (u, ctx) => {
  let ph = null; const isr = 1 / ctx.sr;
  return n => { const f = u.ins[0], o = u.outs[0]; if (ph === null) ph = wrap(u.ins[1][0], -1, 1);
    for (let i = 0; i < n; i++) { o[i] = ph; ph += 2 * f[i] * isr; if (ph >= 1) ph -= 2; else if (ph < -1) ph += 2; } };
});
U('LFPulse', (u, ctx) => {
  let ph = null; const isr = 1 / ctx.sr;
  return n => { const f = u.ins[0], w = u.ins[2], o = u.outs[0]; if (ph === null) ph = wrap(u.ins[1][0], 0, 1);
    for (let i = 0; i < n; i++) { o[i] = ph < w[i] ? 1 : 0; ph += f[i] * isr; if (ph >= 1) ph -= 1; else if (ph < 0) ph += 1; } };
});
U('LFTri', (u, ctx) => {
  let ph = null; const isr = 1 / ctx.sr;
  return n => { const f = u.ins[0], o = u.outs[0]; if (ph === null) ph = wrap(u.ins[1][0] / 4, 0, 1);
    for (let i = 0; i < n; i++) { const p = ph; o[i] = p < 0.25 ? p * 4 : p < 0.75 ? 2 - p * 4 : p * 4 - 4; ph += f[i] * isr; if (ph >= 1) ph -= 1; else if (ph < 0) ph += 1; } };
});
U('LFPar', (u, ctx) => {
  let ph = 0; const isr = 1 / ctx.sr;
  return n => { const f = u.ins[0], o = u.outs[0];
    for (let i = 0; i < n; i++) { const x = ph * 2 - 1; o[i] = ph < 0.5 ? 1 - 4 * (ph - 0.25) * (ph - 0.25) * 4 : -(1 - 4 * (ph - 0.75) * (ph - 0.75) * 4); ph += f[i] * isr; if (ph >= 1) ph -= 1; } };
});
U('LFCub', (u, ctx) => {
  let ph = 0; const isr = 1 / ctx.sr;
  return n => { const f = u.ins[0], o = u.outs[0];
    for (let i = 0; i < n; i++) { const x = ph < 0.5 ? ph * 4 - 1 : 3 - ph * 4; o[i] = x * (1.5 - 0.5 * x * x); ph += f[i] * isr; if (ph >= 1) ph -= 1; } };
});
U('VarSaw', (u, ctx) => {
  let ph = null; const isr = 1 / ctx.sr;
  return n => { const f = u.ins[0], w = u.ins[2], o = u.outs[0]; if (ph === null) ph = wrap(u.ins[1][0], 0, 1);
    for (let i = 0; i < n; i++) { const d = clamp(w[i], 0.001, 0.999); o[i] = ph < d ? (2 * ph / d - 1) : (1 - 2 * (ph - d) / (1 - d)); ph += f[i] * isr; if (ph >= 1) ph -= 1; } };
});
U('SyncSaw', (u, ctx) => {
  let p1 = 0, p2 = 0; const isr = 1 / ctx.sr;
  return n => { const sf = u.ins[0], wf = u.ins[1], o = u.outs[0];
    for (let i = 0; i < n; i++) { o[i] = p2 * 2 - 1; p1 += sf[i] * isr; p2 += wf[i] * isr; if (p1 >= 1) { p1 -= 1; p2 = p1 * wf[i] / Math.max(sf[i], 1e-6); } if (p2 >= 1) p2 -= 1; } };
});
U('Blip', (u, ctx) => {
  let ph = 0; const isr = 1 / ctx.sr;
  return n => { const f = u.ins[0], nh = u.ins[1], o = u.outs[0];
    for (let i = 0; i < n; i++) {
      const fr = Math.max(Math.abs(f[i]), 0.001), maxN = Math.max(1, Math.floor(ctx.sr * 0.5 / fr));
      const N = clamp(Math.floor(nh[i]), 1, maxN);
      const th = Math.PI * ph, den = Math.sin(th);
      let y; if (Math.abs(den) < 1e-6) y = 1; else y = (Math.sin((2 * N + 1) * th) / den - 1) / (2 * N);
      o[i] = y; ph += fr * isr; if (ph >= 1) ph -= 1; } };
});
U('Formant', (u, ctx) => {
  let pf = 0, pw = 0, pc = 0; const isr = 1 / ctx.sr;
  return n => { const ff = u.ins[0], fo = u.ins[1], bw = u.ins[2], o = u.outs[0];
    for (let i = 0; i < n; i++) {
      const winLen = Math.max(bw[i], ff[i]); // window rate
      pf += ff[i] * isr; if (pf >= 1) { pf -= 1; pw = 0; pc = 0; }
      let y = 0; if (pw < 1) { y = (0.5 - 0.5 * Math.cos(TWO_PI * pw)) * Math.sin(TWO_PI * pc); pw += winLen * isr; pc += fo[i] * isr; }
      o[i] = y; } };
});
U('Impulse', (u, ctx) => {
  let ph = null; const isr = 1 / ctx.sr;
  return n => { const f = u.ins[0], o = u.outs[0];
    if (ph === null) { const p = u.ins[1][0]; ph = p === 0 ? 1 : wrap(p, 0, 1); }
    for (let i = 0; i < n; i++) { if (ph >= 1) { o[i] = 1; ph -= Math.floor(ph); } else o[i] = 0; ph += f[i] * isr; } };
});
U('Dust', (u, ctx) => { const R = ctx.R, isr = 1 / ctx.sr;
  return n => { const d = u.ins[0], o = u.outs[0]; for (let i = 0; i < n; i++) { const r = R(); o[i] = r < d[i] * isr ? R() : 0; } }; });
U('Dust2', (u, ctx) => { const R = ctx.R, isr = 1 / ctx.sr;
  return n => { const d = u.ins[0], o = u.outs[0]; for (let i = 0; i < n; i++) { const r = R(); o[i] = r < d[i] * isr ? R() * 2 - 1 : 0; } }; });
U('WhiteNoise', (u, ctx) => { const R = ctx.R; return n => { const o = u.outs[0]; for (let i = 0; i < n; i++) o[i] = R() * 2 - 1; }; });
U('ClipNoise', (u, ctx) => { const R = ctx.R; return n => { const o = u.outs[0]; for (let i = 0; i < n; i++) o[i] = R() < 0.5 ? -1 : 1; }; });
U('GrayNoise', (u, ctx) => { const R = ctx.R; let c = 0;
  return n => { const o = u.outs[0]; for (let i = 0; i < n; i++) { c ^= 1 << Math.floor(R() * 31); o[i] = (c | 0) * 4.65661287308e-10; } }; });
U('PinkNoise', (u, ctx) => { const R = ctx.R; let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  return n => { const o = u.outs[0]; for (let i = 0; i < n; i++) { const w = R() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.96900 * b2 + w * 0.1538520;
    b3 = 0.86650 * b3 + w * 0.3104856; b4 = 0.55000 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.0168980;
    o[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926; } }; });
U('BrownNoise', (u, ctx) => { const R = ctx.R; let z = 0;
  return n => { const o = u.outs[0]; for (let i = 0; i < n; i++) { z = fold(z + (R() * 2 - 1) * 0.125, -1, 1); o[i] = z; } }; });
U('LFNoise0 LFDNoise0', (u, ctx) => { const R = ctx.R, isr = 1 / ctx.sr; let ph = 1, v = 0;
  return n => { const f = u.ins[0], o = u.outs[0]; for (let i = 0; i < n; i++) { if (ph >= 1) { ph -= Math.floor(ph); v = R() * 2 - 1; } o[i] = v; ph += Math.max(f[i], 0) * isr; } }; });
U('LFClipNoise', (u, ctx) => { const R = ctx.R, isr = 1 / ctx.sr; let ph = 1, v = 0;
  return n => { const f = u.ins[0], o = u.outs[0]; for (let i = 0; i < n; i++) { if (ph >= 1) { ph -= Math.floor(ph); v = R() < 0.5 ? -1 : 1; } o[i] = v; ph += Math.max(f[i], 0) * isr; } }; });
U('LFNoise1 LFDNoise1', (u, ctx) => { const R = ctx.R, isr = 1 / ctx.sr; let ph = 1, a = R() * 2 - 1, b = R() * 2 - 1;
  return n => { const f = u.ins[0], o = u.outs[0]; for (let i = 0; i < n; i++) { if (ph >= 1) { ph -= Math.floor(ph); a = b; b = R() * 2 - 1; } o[i] = a + (b - a) * ph; ph += Math.max(f[i], 0) * isr; } }; });
U('LFNoise2 LFDNoise3', (u, ctx) => { const R = ctx.R, isr = 1 / ctx.sr; let ph = 1; const v = [R() * 2 - 1, R() * 2 - 1, R() * 2 - 1, R() * 2 - 1];
  return n => { const f = u.ins[0], o = u.outs[0]; for (let i = 0; i < n; i++) {
    if (ph >= 1) { ph -= Math.floor(ph); v.shift(); v.push(R() * 2 - 1); }
    const [z, a, c, d] = v, t = ph; const c1 = 0.5 * (c - z), c2 = z - 2.5 * a + 2 * c - 0.5 * d, c3 = 0.5 * (d - z) + 1.5 * (a - c);
    o[i] = clamp(((c3 * t + c2) * t + c1) * t + a, -1, 1); ph += Math.max(f[i], 0) * isr; } }; });
U('Crackle', (u, ctx) => { let y1 = 0.3, y2 = 0;
  return n => { const p = u.ins[0], o = u.outs[0]; for (let i = 0; i < n; i++) { const y0 = Math.abs(y1 * p[i] - y2 - 0.05); y2 = y1; y1 = y0; o[i] = y0; } }; });
U('Logistic', (u, ctx) => { const isr = 1 / ctx.sr; let y = null, ph = 1;
  return n => { const r = u.ins[0], f = u.ins[1], o = u.outs[0]; if (y === null) y = u.ins[2][0];
    for (let i = 0; i < n; i++) { ph += f[i] * isr; if (ph >= 1) { ph -= Math.floor(ph); y = r[i] * y * (1 - y); if (!(y > -10 && y < 10)) y = 0.5; } o[i] = y; } }; });
U('HenonN', (u, ctx) => { const isr = 1 / ctx.sr; let x0 = 0, x1 = 0, ph = 1;
  return n => { const f = u.ins[0], a = u.ins[1], b = u.ins[2], o = u.outs[0];
    for (let i = 0; i < n; i++) { ph += f[i] * isr; if (ph >= 1) { ph -= Math.floor(ph); const x = 1 - a[i] * x0 * x0 + b[i] * x1; x1 = x0; x0 = (x > -3 && x < 3) ? x : 0; } o[i] = x0; } }; });
U('Gendy1', (u, ctx) => {
  const R = ctx.R; let cps = null, amps, durs, idx = 0, ph = 1, a0 = 0, a1 = 0, speed = 0;
  function dist(kind, a, x) {
    const t = 0.5 - x; // centred
    switch (kind | 0) {
      case 0: return 2 * t; // linear
      case 1: { const c = Math.atan(10 * a); return (1 / a) * Math.tan(c * 2 * t) * 0.1; } // cauchy
      case 2: { const c = 0.5 + 0.499 * a, m = Math.log((1 - c) / c); const xx = 0.0001 + 0.9998 * x; return (Math.log((1 - xx) / xx) - m) * 0.5 / m * 0 + Math.log((1 - xx) / xx) / 10; }
      case 4: return Math.sin(Math.PI * t) ;
      case 5: return -Math.log(1 - 0.999 * x) / (1 + a * 10) * 2 - 0.5;
      case 6: return Math.sin(TWO_PI * x * a);
      default: return 2 * t;
    }
  }
  return n => {
    const I = u.ins, o = u.outs[0];
    if (cps === null) { cps = clamp(Math.floor(I[8][0]) || 12, 2, 64); amps = new Float32Array(cps).map(() => R() * 2 - 1); durs = new Float32Array(cps).map(() => R()); }
    const ampdist = I[0][0], durdist = I[1][0], adp = I[2][0], ddp = I[3][0];
    for (let i = 0; i < n; i++) {
      if (ph >= 1) {
        ph -= Math.floor(ph); idx = (idx + 1) % cps; a0 = a1;
        amps[idx] = fold(amps[idx] + I[6][i] * dist(ampdist, adp, R()), -1, 1);
        durs[idx] = fold(durs[idx] + I[7][i] * dist(durdist, ddp, R()), 0, 1);
        a1 = amps[idx];
        const minf = Math.max(I[4][i], 1), maxf = Math.max(I[5][i], minf);
        const segFreq = (minf + (maxf - minf) * durs[idx]) * cps;
        speed = segFreq / ctx.sr;
      }
      o[i] = a0 + (a1 - a0) * ph; ph += speed;
    }
  };
});

// filters
UNITS.RLPF = makeBiquad('lp'); UNITS.RHPF = makeBiquad('hp');
UNITS.LPF = makeBiquad('lp'); UNITS.HPF = makeBiquad('hp');
UNITS.BPF = makeBiquad('bp'); UNITS.BRF = makeBiquad('br');
UNITS.MidEQ = (u, ctx) => { const f = makeBiquad('peak')(u, ctx); return f; };
UNITS.BLowShelf = makeBiquad('ls'); UNITS.BHiShelf = makeBiquad('hs');
UNITS.Resonz = makeBiquad('bp');
U('Ringz', (u, ctx) => { let y1 = 0, y2 = 0, lf = -1, ld = -1, b1 = 0, b2 = 0;
  return n => { const inp = u.ins[0], f = u.ins[1], d = u.ins[2], o = u.outs[0];
    for (let i = 0; i < n; i++) {
      if (f[i] !== lf || d[i] !== ld) { lf = f[i]; ld = d[i]; const w = TWO_PI * clamp(lf, 0, ctx.sr * 0.49) / ctx.sr; const r = ld === 0 ? 0 : Math.exp(LOG001 / (Math.abs(ld) * ctx.sr)); b1 = 2 * r * Math.cos(w); b2 = -r * r; }
      const y0 = inp[i] + b1 * y1 + b2 * y2; o[i] = 0.5 * (y0 - y2); y2 = y1; y1 = (y0 > -1e8 && y0 < 1e8) ? y0 : 0; } };
});
U('Formlet', (u, ctx) => { const st = [[0, 0], [0, 0]]; let lf = -1, la = -1, ld = -1, c = [[0, 0], [0, 0]];
  return n => { const inp = u.ins[0], f = u.ins[1], at = u.ins[2], de = u.ins[3], o = u.outs[0];
    for (let i = 0; i < n; i++) {
      if (f[i] !== lf || at[i] !== la || de[i] !== ld) { lf = f[i]; la = at[i]; ld = de[i]; const w = TWO_PI * clamp(lf, 0, ctx.sr * 0.49) / ctx.sr;
        [ld, la].forEach((t, k) => { const r = t <= 0 ? 0 : Math.exp(LOG001 / (t * ctx.sr)); c[k] = [2 * r * Math.cos(w), -r * r]; }); }
      let out = 0;
      for (let k = 0; k < 2; k++) { const s = st[k]; const y0 = inp[i] + c[k][0] * s[0] + c[k][1] * s[1]; const v = 0.25 * (y0 - s[1]); out += k === 0 ? v : -v; s[1] = s[0]; s[0] = y0; }
      o[i] = out; } };
});
U('MoogFF', (u, ctx) => { let s = [0, 0, 0, 0], i1 = [0, 0, 0, 0];
  return n => { const inp = u.ins[0], fr = u.ins[1], g = u.ins[2], o = u.outs[0];
    for (let i = 0; i < n; i++) {
      let f = clamp(fr[i] * 1.16 / (ctx.sr / 2), 0, 1); const res = clamp(g[i], 0, 4);
      const fb = res * (1 - 0.15 * f * f);
      let x = inp[i] - s[3] * fb; x *= 0.35013 * (f * f) * (f * f); x = Math.tanh(x);
      s[0] = x + 0.3 * i1[0] + (1 - f) * s[0]; i1[0] = x;
      s[1] = s[0] + 0.3 * i1[1] + (1 - f) * s[1]; i1[1] = s[0];
      s[2] = s[1] + 0.3 * i1[2] + (1 - f) * s[2]; i1[2] = s[1];
      s[3] = s[2] + 0.3 * i1[3] + (1 - f) * s[3]; i1[3] = s[2];
      if (!(s[3] > -1e6 && s[3] < 1e6)) { s = [0, 0, 0, 0]; }
      o[i] = s[3] * 1.8; } };
});
U('OnePole', (u, ctx) => { let y = 0; return n => { const x = u.ins[0], c = u.ins[1], o = u.outs[0]; for (let i = 0; i < n; i++) { y = (1 - Math.abs(c[i])) * x[i] + c[i] * y; o[i] = y; } }; });
U('OneZero', (u, ctx) => { let x1 = 0; return n => { const x = u.ins[0], c = u.ins[1], o = u.outs[0]; for (let i = 0; i < n; i++) { o[i] = (1 - Math.abs(c[i])) * x[i] + c[i] * x1; x1 = x[i]; } }; });
U('Integrator', (u, ctx) => { let y = 0; return n => { const x = u.ins[0], c = u.ins[1], o = u.outs[0]; for (let i = 0; i < n; i++) { y = x[i] + c[i] * y; o[i] = y; } }; });
U('LeakDC', (u, ctx) => { let x1 = 0, y1 = 0; return n => { const x = u.ins[0], c = u.ins[1], o = u.outs[0]; for (let i = 0; i < n; i++) { y1 = x[i] - x1 + c[i] * y1; x1 = x[i]; o[i] = y1; } }; });
function lagUnit(stages) {
  return (u, ctx) => { const y = new Float64Array(stages); let init = false, lt = -1, b = 0;
    return n => { const x = u.ins[0], t = u.ins[1], o = u.outs[0];
      if (!init) { y.fill(x[0]); init = true; }
      for (let i = 0; i < n; i++) {
        if (t[i] !== lt) { lt = t[i]; b = lt <= 0 ? 0 : Math.exp(LOG001 / (lt * ctx.sr)); }
        let v = x[i]; for (let k = 0; k < stages; k++) { y[k] = v + b * (y[k] - v); v = y[k]; } o[i] = v; } };
  };
}
UNITS.Lag = lagUnit(1); UNITS.Lag2 = lagUnit(2); UNITS.Lag3 = lagUnit(3);
U('LagUD', (u, ctx) => { let y = null; return n => { const x = u.ins[0], up = u.ins[1], dn = u.ins[2], o = u.outs[0]; if (y === null) y = x[0];
  for (let i = 0; i < n; i++) { const t = x[i] > y ? up[i] : dn[i]; const b = t <= 0 ? 0 : Math.exp(LOG001 / (t * ctx.sr)); y = x[i] + b * (y - x[i]); o[i] = y; } }; });
U('Slew', (u, ctx) => { let y = null; return n => { const x = u.ins[0], up = u.ins[1], dn = u.ins[2], o = u.outs[0]; if (y === null) y = x[0];
  for (let i = 0; i < n; i++) { const d = x[i] - y; y += clamp(d, -dn[i] / ctx.sr, up[i] / ctx.sr); o[i] = y; } }; });
U('Decay', (u, ctx) => { let y = 0, lt = -1, b = 0; return n => { const x = u.ins[0], t = u.ins[1], o = u.outs[0];
  for (let i = 0; i < n; i++) { if (t[i] !== lt) { lt = t[i]; b = lt <= 0 ? 0 : Math.exp(LOG001 / (lt * ctx.sr)); } y = x[i] + b * y; o[i] = y; } }; });
U('Decay2', (u, ctx) => { let y1 = 0, y2 = 0; return n => { const x = u.ins[0], a = u.ins[1], d = u.ins[2], o = u.outs[0];
  for (let i = 0; i < n; i++) { const bd = d[i] <= 0 ? 0 : Math.exp(LOG001 / (d[i] * ctx.sr)), ba = a[i] <= 0 ? 0 : Math.exp(LOG001 / (a[i] * ctx.sr));
    y1 = x[i] + bd * y1; y2 = x[i] + ba * y2; o[i] = y1 - y2; } }; });

// delays
function delayUnit(interp, mode) { // mode 0 delay, 1 comb, 2 allpass
  return (u, ctx) => { const d = delayBuf(ctx, u.ins[1][0]);
    return n => { const x = u.ins[0], dt = u.ins[2], dc = mode ? u.ins[3] : null, o = u.outs[0], b = d.buf;
      for (let i = 0; i < n; i++) {
        const ds = Math.max(dt[i], 0) * ctx.sr;
        const v = readDelay(d, ds, interp);
        if (mode === 0) { b[d.w] = x[i]; o[i] = v; }
        else {
          const t = dc[i]; const fb = t === 0 ? 0 : Math.sign(t) * Math.exp(LOG001 * Math.max(dt[i], 1e-5) / Math.abs(t));
          if (mode === 1) { let w = x[i] + fb * v; if (!(w > -1e6 && w < 1e6)) w = 0; b[d.w] = w; o[i] = v; }
          else { let dwr = x[i] + fb * v; if (!(dwr > -1e6 && dwr < 1e6)) dwr = 0; b[d.w] = dwr; o[i] = v - fb * dwr; }
        }
        d.w = (d.w + 1) % d.len; } };
  };
}
UNITS.DelayN = delayUnit(0, 0); UNITS.DelayL = delayUnit(1, 0); UNITS.DelayC = delayUnit(2, 0);
UNITS.CombN = delayUnit(0, 1); UNITS.CombL = delayUnit(1, 1); UNITS.CombC = delayUnit(2, 1);
UNITS.AllpassN = delayUnit(0, 2); UNITS.AllpassL = delayUnit(1, 2); UNITS.AllpassC = delayUnit(2, 2);

// Freeverb (Jezar) — mono and stereo
function fvCore(ctx, spread) {
  const sc = ctx.sr / 44100;
  const ct = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map(x => Math.round((x + spread) * sc));
  const at = [556, 441, 341, 225].map(x => Math.round((x + spread) * sc));
  const combs = ct.map(l => ({ b: new Float32Array(l), i: 0, s: 0 }));
  const aps = at.map(l => ({ b: new Float32Array(l), i: 0 }));
  return function (x, room, damp) {
    const fb = room * 0.28 + 0.7, d1 = damp * 0.4, d2 = 1 - d1; let out = 0;
    const inp = x * 0.015;
    for (const c of combs) { const y = c.b[c.i]; c.s = y * d2 + c.s * d1; c.b[c.i] = inp + c.s * fb; if (++c.i >= c.b.length) c.i = 0; out += y; }
    for (const a of aps) { const bo = a.b[a.i]; const y = -out + bo; a.b[a.i] = out + bo * 0.5; if (++a.i >= a.b.length) a.i = 0; out = y; }
    return out;
  };
}
U('FreeVerb', (u, ctx) => { const L = fvCore(ctx, 0);
  return n => { const x = u.ins[0], mx = u.ins[1], rm = u.ins[2], dm = u.ins[3], o = u.outs[0];
    for (let i = 0; i < n; i++) { const m = clamp(mx[i], 0, 1); const w = L(x[i], clamp(rm[i], 0, 1), clamp(dm[i], 0, 1)) * 3; o[i] = x[i] * (1 - m) + w * m; } }; });
U('FreeVerb2', (u, ctx) => { const L = fvCore(ctx, 0), R = fvCore(ctx, 23);
  return n => { const xl = u.ins[0], xr = u.ins[1], mx = u.ins[2], rm = u.ins[3], dm = u.ins[4], ol = u.outs[0], or = u.outs[1];
    for (let i = 0; i < n; i++) { const m = clamp(mx[i], 0, 1), r = clamp(rm[i], 0, 1), d = clamp(dm[i], 0, 1), s = (xl[i] + xr[i]);
      ol[i] = xl[i] * (1 - m) + L(s, r, d) * 1.5 * m; or[i] = xr[i] * (1 - m) + R(s, r, d) * 1.5 * m; } }; });
U('GVerb', (u, ctx) => { const L = fvCore(ctx, 0), R = fvCore(ctx, 31); const pre = delayBuf(ctx, 0.2);
  return n => { const x = u.ins[0], size = u.ins[1], rt = u.ins[2], dmp = u.ins[3], dry = u.ins[6], er = u.ins[7], tail = u.ins[8], ol = u.outs[0], or = u.outs[1];
    for (let i = 0; i < n; i++) {
      const room = clamp(0.55 + Math.log10(1 + Math.max(rt[i], 0.01)) * 0.45, 0, 0.995);
      pre.buf[pre.w] = x[i]; const e = readDelay(pre, clamp(size[i], 1, 300) * 0.0004 * ctx.sr, 1); pre.w = (pre.w + 1) % pre.len;
      const wl = L(e, room, clamp(dmp[i], 0, 1)) * 2.5, wr = R(e, room, clamp(dmp[i], 0, 1)) * 2.5;
      ol[i] = x[i] * dry[i] + e * er[i] * 0.5 + wl * tail[i]; or[i] = x[i] * dry[i] + e * er[i] * 0.5 + wr * tail[i]; } }; });

U('Pluck', (u, ctx) => { const d = delayBuf(ctx, Math.max(u.ins[2][0], 0.001)); let burst = 0, lp = 0, pt = 0;
  return n => { const x = u.ins[0], tr = u.ins[1], dt = u.ins[3], dc = u.ins[4], cf = u.ins[5], o = u.outs[0];
    for (let i = 0; i < n; i++) {
      const ds = Math.max(dt[i] * ctx.sr, 2);
      if (isTrig(pt, tr[i])) burst = Math.round(ds); pt = tr[i];
      const v = readDelay(d, ds, 1); const c = clamp(cf[i], -0.999, 0.999);
      lp = (1 - Math.abs(c)) * v + c * lp;
      const fb = dc[i] === 0 ? 0 : Math.exp(LOG001 * dt[i] / Math.abs(dc[i]));
      let w = lp * fb; if (burst > 0) { w += x[i]; burst--; }
      d.buf[d.w] = w; d.w = (d.w + 1) % d.len; o[i] = v; } }; });

U('PitchShift', (u, ctx) => { const d = delayBuf(ctx, 1.2); const R = ctx.R; let ph = 0;
  return n => { const x = u.ins[0], ws = u.ins[1], pr = u.ins[2], pd = u.ins[3], td = u.ins[4], o = u.outs[0];
    for (let i = 0; i < n; i++) {
      d.buf[d.w] = x[i];
      const win = clamp(ws[i], 0.01, 1), rate = (1 - pr[i]) / win; ph = wrap(ph + rate / ctx.sr, 0, 1);
      let y = 0; for (let k = 0; k < 2; k++) { const p = wrap(ph + k * 0.5, 0, 1); const env = Math.sin(Math.PI * p); y += readDelay(d, (p * win) * ctx.sr + 2, 1) * env * env; }
      d.w = (d.w + 1) % d.len; o[i] = y; } }; });

// envelopes
const SHAPES = { step: 0, lin: 1, exp: 2, sin: 3, wel: 4, curve: 5, sqr: 6, cub: 7, hold: 8 };
function envInterp(shape, curve, a, b, pos) {
  switch (shape) {
    case 0: return b;
    case 1: return a + (b - a) * pos;
    case 2: { const A = Math.abs(a) < 1e-4 ? (a < 0 ? -1e-4 : 1e-4) : a, B = Math.abs(b) < 1e-4 ? (b < 0 ? -1e-4 : 1e-4) : b; return A * Math.pow(B / A, pos); }
    case 3: return a + (b - a) * (0.5 - 0.5 * Math.cos(Math.PI * pos));
    case 4: return a < b ? a + (b - a) * Math.sin(Math.PI / 2 * pos) : b + (a - b) * Math.sin(Math.PI / 2 * (1 - pos));
    case 5: if (Math.abs(curve) < 0.001) return a + (b - a) * pos; return a + (b - a) * (1 - Math.exp(curve * pos)) / (1 - Math.exp(curve));
    case 6: { const s = Math.sqrt(Math.max(a, 0)), e = Math.sqrt(Math.max(b, 0)); const v = s + (e - s) * pos; return v * v; }
    case 7: { const s = Math.cbrt(a), e = Math.cbrt(b); const v = s + (e - s) * pos; return v * v * v; }
    case 8: return pos < 1 ? a : b;
  }
  return b;
}
U('EnvGen', (u, ctx) => {
  // inputs: gate, levelScale, levelBias, timeScale, doneAction, [init, numStages, releaseNode, loopNode, (lvl, time, shape, curve)*]
  let stage = -1, pos = 0, len = 0, start = 0, level = 0, prevGate = 0, sustaining = false, done = false, inited = false;
  const I = u.ins;
  const E = k => I[5 + k];
  function nStages() { return Math.round(E(1)[0]); }
  function relNode() { const r = Math.round(E(2)[0]); return r < 0 ? -1 : r; }
  function loopNode() { const r = Math.round(E(3)[0]); return r < 0 ? -1 : r; }
  function begin(s, i) {
    const ns = nStages();
    if (s >= ns) { stage = ns; done = true; return; }
    stage = s; start = level; pos = 0; sustaining = false;
    const t = Math.max(E(4 + s * 4 + 1)[i] * I[3][i], 0); len = Math.max(1, Math.round(t * ctx.sr));
    if (t === 0) len = 0;
  }
  return n => {
    const o = u.outs[0], gate = I[0];
    if (!inited) { level = E(0)[0]; inited = true; if (gate[0] > 0) { begin(0, 0); } prevGate = gate[0]; }
    for (let i = 0; i < n; i++) {
      const g = gate[i];
      if (g > 0 && prevGate <= 0) { done = false; begin(0, i); }
      else if (g <= 0 && prevGate > 0) { const r = relNode(); if (r >= 0 && stage <= r) begin(r, i); }
      prevGate = g;
      if (!done && stage >= 0 && !sustaining) {
        const b = 4 + stage * 4, target = E(b)[i], shape = Math.round(E(b + 2)[i]), curve = E(b + 3)[i];
        if (len === 0) { level = target; pos = 1; }
        else { pos += 1 / len; level = envInterp(shape, curve, start, target, Math.min(pos, 1)); }
        if (pos >= 1 - 1e-9) {
          level = target; const next = stage + 1, r = relNode(), lp = loopNode();
          if (next === r && g > 0) { if (lp >= 0 && lp < r) begin(lp, i); else { sustaining = true; stage = next; } }
          else if (next >= nStages()) { done = true; stage = nStages(); const da = I[4][i]; if (da >= 2) ctx.synth.doneFlag = true; }
          else begin(next, i);
        }
      }
      o[i] = level * I[1][i] + I[2][i];
    }
  };
});
U('EnvGate', (u, ctx) => { // gate, fadeTime -> fade in/out (sine), frees synth when closed
  let lvl = 0, prev = 0, dir = 1, init = false;
  return n => { const g = u.ins[0], ft = u.ins[1], o = u.outs[0];
    if (!init) { init = true; lvl = ft[0] <= 0 ? 1 : 0; }
    for (let i = 0; i < n; i++) {
      dir = g[i] > 0 ? 1 : -1; const step = 1 / Math.max(ft[i] * ctx.sr, 1);
      lvl = clamp(lvl + dir * step, 0, 1);
      if (dir < 0 && lvl <= 0) ctx.synth.doneFlag = true;
      o[i] = 0.5 - 0.5 * Math.cos(Math.PI * lvl); } };
});
U('Line', (u, ctx) => { let pos = 0, init = false, done = false; return n => { const a = u.ins[0][0], b = u.ins[1][0], d = Math.max(u.ins[2][0], 0), o = u.outs[0];
  const st = d === 0 ? 1 : 1 / (d * ctx.sr);
  for (let i = 0; i < n; i++) { o[i] = a + (b - a) * Math.min(pos, 1); pos += st; if (pos >= 1 && !done) { done = true; if (u.ins[3][0] >= 2) ctx.synth.doneFlag = true; } } }; });
U('XLine', (u, ctx) => { let pos = 0, done = false; return n => { let a = u.ins[0][0], b = u.ins[1][0]; const d = Math.max(u.ins[2][0], 0), o = u.outs[0];
  if (Math.abs(a) < 1e-6) a = 1e-6; if (Math.abs(b) < 1e-6) b = 1e-6; const st = d === 0 ? 1 : 1 / (d * ctx.sr);
  for (let i = 0; i < n; i++) { o[i] = a * Math.pow(b / a, Math.min(pos, 1)); pos += st; if (pos >= 1 && !done) { done = true; if (u.ins[3][0] >= 2) ctx.synth.doneFlag = true; } } }; });
U('Linen', (u, ctx) => { // gate, attack, susLevel, release, doneAction
  let lvl = 0, pg = 0, state = 0;
  return n => { const g = u.ins[0], at = u.ins[1], sl = u.ins[2], rl = u.ins[3], o = u.outs[0];
    for (let i = 0; i < n; i++) {
      if (g[i] > 0 && pg <= 0) state = 1; if (g[i] <= 0 && pg > 0) state = 3; pg = g[i];
      if (state === 1) { lvl += sl[i] / Math.max(at[i] * ctx.sr, 1); if (lvl >= sl[i]) { lvl = sl[i]; state = 2; } }
      else if (state === 2) lvl = sl[i];
      else if (state === 3) { lvl -= sl[i] / Math.max(rl[i] * ctx.sr, 1); if (lvl <= 0) { lvl = 0; state = 4; if (u.ins[4][0] >= 2) ctx.synth.doneFlag = true; } }
      o[i] = lvl; } };
});

// triggers & random
U('Latch', (u, ctx) => { let v = 0, pt = 0; return n => { const x = u.ins[0], t = u.ins[1], o = u.outs[0]; for (let i = 0; i < n; i++) { if (isTrig(pt, t[i])) v = x[i]; pt = t[i]; o[i] = v; } }; });
U('Gate', (u, ctx) => { let v = 0; return n => { const x = u.ins[0], t = u.ins[1], o = u.outs[0]; for (let i = 0; i < n; i++) { if (t[i] > 0) v = x[i]; o[i] = v; } }; });
function trand(gen) { return (u, ctx) => { const R = ctx.R; let v = null, pt = 0;
  return n => { const lo = u.ins[0], hi = u.ins[1], t = u.ins[2], o = u.outs[0]; if (v === null) v = gen(R, lo[0], hi[0]);
    for (let i = 0; i < n; i++) { if (isTrig(pt, t[i])) v = gen(R, lo[i], hi[i]); pt = t[i]; o[i] = v; } }; }; }
UNITS.TRand = trand((R, a, b) => a + R() * (b - a));
UNITS.TIRand = trand((R, a, b) => Math.floor(a + R() * (b - a + 1)));
UNITS.TExpRand = trand((R, a, b) => { a = a || 1e-4; b = b || 1e-4; return a * Math.pow(b / a, R()); });
function irand(gen) { return (u, ctx) => { let v = null; return n => { const o = u.outs[0]; if (v === null) v = gen(ctx.R, u.ins[0][0], u.ins[1][0]); o.fill(v, 0, n); }; }; }
UNITS.Rand = irand((R, a, b) => a + R() * (b - a));
UNITS.IRand = irand((R, a, b) => Math.floor(a + R() * (b - a + 1)));
UNITS.ExpRand = irand((R, a, b) => { a = a || 1e-4; b = b || 1e-4; return a * Math.pow(b / a, R()); });
UNITS.NRand = (u, ctx) => { let v = null; return n => { if (v === null) { const k = Math.max(1, u.ins[2][0] | 0); let s = 0; for (let j = 0; j < k; j++) s += ctx.R(); v = u.ins[0][0] + (u.ins[1][0] - u.ins[0][0]) * s / k; } u.outs[0].fill(v, 0, n); }; };
U('CoinGate', (u, ctx) => { let pt = 0; return n => { const p = u.ins[0], t = u.ins[1], o = u.outs[0]; for (let i = 0; i < n; i++) { o[i] = (isTrig(pt, t[i]) && ctx.R() < p[i]) ? t[i] : 0; pt = t[i]; } }; });
U('Select', (u, ctx) => { return n => { const w = u.ins[0], o = u.outs[0], k = u.ins.length - 1; for (let i = 0; i < n; i++) { const j = clamp(Math.floor(w[i]), 0, k - 1); o[i] = u.ins[1 + j][i]; } }; });
U('Stepper', (u, ctx) => { let v = null, pt = 0, pr = 0; return n => { const t = u.ins[0], r = u.ins[1], mn = u.ins[2], mx = u.ins[3], st = u.ins[4], rv = u.ins[5], o = u.outs[0];
  if (v === null) v = rv[0];
  for (let i = 0; i < n; i++) { if (isTrig(pr, r[i])) v = rv[i]; else if (isTrig(pt, t[i])) { v += st[i]; const lo = mn[i], hi = mx[i]; if (v > hi) v = lo + (v - hi - 1); if (v < lo) v = hi - (lo - v - 1); } pt = t[i]; pr = r[i]; o[i] = v; } }; });
U('PulseCount', (u, ctx) => { let v = 0, pt = 0, pr = 0; return n => { const t = u.ins[0], r = u.ins[1], o = u.outs[0];
  for (let i = 0; i < n; i++) { if (isTrig(pr, r[i])) v = 0; if (isTrig(pt, t[i])) v++; pt = t[i]; pr = r[i]; o[i] = v; } }; });
U('PulseDivider', (u, ctx) => { let c = 0, pt = 0; return n => { const t = u.ins[0], d = u.ins[1], o = u.outs[0];
  for (let i = 0; i < n; i++) { let y = 0; if (isTrig(pt, t[i])) { c++; if (c >= d[i]) { c = 0; y = 1; } } pt = t[i]; o[i] = y; } }; });
U('ToggleFF', (u, ctx) => { let v = 0, pt = 0; return n => { const t = u.ins[0], o = u.outs[0]; for (let i = 0; i < n; i++) { if (isTrig(pt, t[i])) v = 1 - v; pt = t[i]; o[i] = v; } }; });
U('Trig Trig1', (u, ctx) => { let c = 0, v = 0, pt = 0; const one = u.name === 'Trig1'; return n => { const x = u.ins[0], d = u.ins[1], o = u.outs[0];
  for (let i = 0; i < n; i++) { if (c <= 0 && isTrig(pt, x[i])) { c = Math.max(1, Math.round(d[i] * ctx.sr)); v = one ? 1 : x[i]; } pt = x[i]; if (c > 0) { o[i] = v; c--; } else o[i] = 0; } }; });
U('TDelay', (u, ctx) => { const q = []; let pt = 0, t = 0; return n => { const x = u.ins[0], d = u.ins[1], o = u.outs[0];
  for (let i = 0; i < n; i++, t++) { if (isTrig(pt, x[i])) q.push(t + Math.round(d[i] * ctx.sr)); pt = x[i]; o[i] = 0; if (q.length && q[0] <= t) { q.shift(); o[i] = 1; } } }; });
U('Sweep', (u, ctx) => { let v = 0, pt = 0; return n => { const t = u.ins[0], r = u.ins[1], o = u.outs[0];
  for (let i = 0; i < n; i++) { if (isTrig(pt, t[i])) v = 0; pt = t[i]; o[i] = v; v += r[i] / ctx.sr; } }; });
U('Phasor', (u, ctx) => { let v = null, pt = 0; return n => { const t = u.ins[0], r = u.ins[1], s = u.ins[2], e = u.ins[3], rp = u.ins[4], o = u.outs[0];
  if (v === null) v = s[0];
  for (let i = 0; i < n; i++) { if (isTrig(pt, t[i])) v = rp[i]; pt = t[i]; o[i] = v; v += r[i]; if (e[i] > s[i]) v = wrap(v, s[i], e[i]); } }; });
U('Demand', (u, ctx) => { const st = (u.params.specs || []).map(s => dstream(s, ctx.R)); let pt = 0, pr = 0, vals = st.map(() => 0), first = true;
  return n => { const t = u.ins[0], r = u.ins[1];
    for (let i = 0; i < n; i++) {
      if (isTrig(pr, r[i])) st.forEach(s => s.reset()); pr = r[i];
      if (isTrig(pt, t[i]) || (first && t[i] > 0)) { st.forEach((s, k) => { const v = s.next(); if (v != null) vals[k] = v; }); }
      first = false; pt = t[i];
      for (let k = 0; k < st.length; k++) u.outs[k][i] = vals[k]; } }; });
U('Duty TDuty', (u, ctx) => { const P = u.params; const durS = P.durSpec != null ? dstream(P.durSpec, ctx.R) : null; const lv = dstream(P.levelSpec, ctx.R);
  let count = 0, val = 0, ended = false, pr = 0; const trig = u.name === 'TDuty';
  return n => { const durIn = u.ins[0], r = u.ins[1], o = u.outs[0];
    for (let i = 0; i < n; i++) {
      if (isTrig(pr, r[i])) { lv.reset(); if (durS) durS.reset(); count = 0; ended = false; } pr = r[i];
      let fired = false;
      if (!ended && count <= 0) { const v = lv.next(); const d = durS ? durS.next() : durIn[i];
        if (v == null || d == null) { ended = true; if ((P.doneAction || 0) >= 2) ctx.synth.doneFlag = true; } else { val = v; count += Math.max(d, 0.0001) * ctx.sr; fired = true; } }
      count--; o[i] = trig ? (fired ? val : 0) : val; } }; });

// analysis
U('Amplitude', (u, ctx) => { let y = 0; return n => { const x = u.ins[0], at = u.ins[1], rl = u.ins[2], o = u.outs[0];
  for (let i = 0; i < n; i++) { const v = Math.abs(x[i]); const t = v > y ? at[i] : rl[i]; const b = t <= 0 ? 0 : Math.exp(LOG001 / (t * ctx.sr)); y = v + b * (y - v); o[i] = y; } }; });
U('DetectSilence', (u, ctx) => { let cnt = 0, fired = false; return n => { const x = u.ins[0], th = u.ins[1], tm = u.ins[2], o = u.outs[0];
  for (let i = 0; i < n; i++) { if (Math.abs(x[i]) > th[i]) cnt = 0; else cnt++; o[i] = 0; if (!fired && cnt >= tm[i] * ctx.sr) { fired = true; o[i] = 1; if (u.ins[3][0] >= 2) ctx.synth.doneFlag = true; } } }; });
U('Peak', (u, ctx) => { let y = 0, pt = 0; return n => { const x = u.ins[0], t = u.ins[1], o = u.outs[0]; for (let i = 0; i < n; i++) { if (isTrig(pt, t[i])) y = 0; pt = t[i]; y = Math.max(y, Math.abs(x[i])); o[i] = y; } }; });
U('RunningMax', (u, ctx) => { let y = -Infinity, pt = 0; return n => { const x = u.ins[0], t = u.ins[1], o = u.outs[0]; for (let i = 0; i < n; i++) { if (isTrig(pt, t[i])) y = x[i]; pt = t[i]; y = Math.max(y, x[i]); o[i] = y; } }; });
U('ZeroCrossing', (u, ctx) => { let prev = 0, count = 0, f = 0; return n => { const x = u.ins[0], o = u.outs[0];
  for (let i = 0; i < n; i++) { count++; if (prev <= 0 && x[i] > 0) { f = ctx.sr / count; count = 0; } prev = x[i]; o[i] = f; } }; });
U('Pitch', (u, ctx) => { // simple autocorrelation on 1024-sample window, updated per block
  const N = 1024; const buf = new Float32Array(N); let w = 0, f = 440, has = 0, cnt = 0;
  return n => { const x = u.ins[0], minF = u.ins[2] ? u.ins[2][0] : 60, maxF = u.ins[3] ? u.ins[3][0] : 4000;
    for (let i = 0; i < n; i++) { buf[w] = x[i]; w = (w + 1) % N; }
    if ((cnt++ & 3) === 0) {
      const lmin = Math.floor(ctx.sr / maxF), lmax = Math.min(N - 1, Math.floor(ctx.sr / minF)); let best = 0, bl = 0, e0 = 0;
      for (let k = 0; k < N; k++) { const v = buf[(w + k) % N]; e0 += v * v; }
      for (let l = lmin; l <= lmax; l += 1) { let s = 0; for (let k = 0; k < N - l; k += 2) s += buf[(w + k) % N] * buf[(w + k + l) % N]; if (s > best) { best = s; bl = l; } }
      const clar = e0 > 1e-6 ? best / (e0 * 0.5) : 0; has = clar > 0.5 ? 1 : 0; if (bl > 0 && has) f = ctx.sr / bl;
    }
    u.outs[0].fill(f, 0, n); if (u.outs[1]) u.outs[1].fill(has, 0, n); }; });
U('Limiter', (u, ctx) => { let g = 1; return n => { const x = u.ins[0], lv = u.ins[1], o = u.outs[0]; const rel = Math.exp(LOG001 / (0.08 * ctx.sr));
  for (let i = 0; i < n; i++) { const L = Math.max(lv[i], 1e-4), a = Math.abs(x[i]); const tg = a > L ? L / a : 1; g = tg < g ? tg : tg + rel * (g - tg); o[i] = clamp(x[i] * g, -L, L); } }; });
U('Compander', (u, ctx) => { let env = 0; return n => { const x = u.ins[0], c = u.ins[1], th = u.ins[2], sb = u.ins[3], sa = u.ins[4], ct = u.ins[5], rt = u.ins[6], o = u.outs[0];
  for (let i = 0; i < n; i++) { const v = Math.abs(c[i]); const t = v > env ? ct[i] : rt[i]; const b = t <= 0 ? 0 : Math.exp(LOG001 / (t * ctx.sr)); env = v + b * (env - v);
    let g = 1; if (env > th[i]) g = Math.pow(env / th[i], sa[i] - 1); else if (env > 1e-6) g = Math.pow(env / th[i], sb[i] - 1); o[i] = x[i] * Math.min(g, 100); } }; });
U('Poll', (u, ctx) => { let pt = 0; return n => { const t = u.ins[0], x = u.ins[1], o = u.outs[0];
  for (let i = 0; i < n; i++) { if (isTrig(pt, t[i])) ctx.server.post({ type: 'poll', label: u.params.label || 'UGen', value: x[i] }); pt = t[i]; o[i] = x[i]; } }; });

// grains
U('GrainSin GrainFM', (u, ctx) => { const grains = []; let pt = 0; const R = ctx.R; const fm = u.name === 'GrainFM'; const nch = u.outs.length;
  return n => { const I = u.ins; const t = I[0];
    for (const o of u.outs) o.fill(0, 0, n);
    for (let i = 0; i < n; i++) {
      if (isTrig(pt, t[i]) && grains.length < 256) {
        const dur = Math.max(I[1][i], 0.0005) * ctx.sr;
        if (fm) grains.push({ ph: 0, mph: 0, f: I[2][i], mf: I[3][i], idx: I[4][i], pan: I[5][i], len: dur, pos: 0 });
        else grains.push({ ph: 0, f: I[2][i], pan: I[3][i], len: dur, pos: 0 });
      }
      pt = t[i];
    }
    for (let g = grains.length - 1; g >= 0; g--) {
      const gr = grains[g]; const pan = clamp(gr.pan, -1, 1), a = (pan + 1) * Math.PI / 4, gl = Math.cos(a), grr = Math.sin(a);
      // grains start at block start (block-quantised)
      for (let i = 0; i < n && gr.pos < gr.len; i++, gr.pos++) {
        const e = Math.sin(Math.PI * gr.pos / gr.len); const env = e * e;
        let y;
        if (fm) { const m = Math.sin(TWO_PI * gr.mph) * gr.idx; y = Math.sin(TWO_PI * gr.ph + m); gr.mph += gr.mf / ctx.sr; gr.mph -= Math.floor(gr.mph); }
        else y = Math.sin(TWO_PI * gr.ph);
        gr.ph += gr.f / ctx.sr; gr.ph -= Math.floor(gr.ph);
        y *= env; if (nch === 1) u.outs[0][i] += y; else { u.outs[0][i] += y * gl; u.outs[1][i] += y * grr; }
      }
      if (gr.pos >= gr.len) grains.splice(g, 1);
    }
  }; });

// panning
U('Pan2', (u, ctx) => n => { const x = u.ins[0], p = u.ins[1], l = u.ins[2], L = u.outs[0], R = u.outs[1];
  for (let i = 0; i < n; i++) { const a = (clamp(p[i], -1, 1) + 1) * Math.PI / 4; L[i] = x[i] * Math.cos(a) * l[i]; R[i] = x[i] * Math.sin(a) * l[i]; } });
U('LinPan2', (u, ctx) => n => { const x = u.ins[0], p = u.ins[1], l = u.ins[2], L = u.outs[0], R = u.outs[1];
  for (let i = 0; i < n; i++) { const r = (clamp(p[i], -1, 1) + 1) / 2; L[i] = x[i] * (1 - r) * l[i]; R[i] = x[i] * r * l[i]; } });
U('Balance2', (u, ctx) => n => { const xl = u.ins[0], xr = u.ins[1], p = u.ins[2], l = u.ins[3], L = u.outs[0], R = u.outs[1];
  for (let i = 0; i < n; i++) { const a = (clamp(p[i], -1, 1) + 1) * Math.PI / 4; L[i] = xl[i] * Math.cos(a) * Math.SQRT2 * l[i]; R[i] = xr[i] * Math.sin(a) * Math.SQRT2 * l[i]; } });
U('Rotate2', (u, ctx) => n => { const x = u.ins[0], y = u.ins[1], p = u.ins[2], A = u.outs[0], B = u.outs[1];
  for (let i = 0; i < n; i++) { const a = p[i] * Math.PI, c = Math.cos(a), s = Math.sin(a); A[i] = x[i] * c + y[i] * s; B[i] = y[i] * c - x[i] * s; } });

// I/O
U('Out OffsetOut', (u, ctx) => n => { const b = Math.round(u.ins[0][0]); for (let c = 1; c < u.ins.length; c++) ctx.server.writeBus(b + c - 1, u.ins[c], n, ctx.synth.fadeArr); });
U('ReplaceOut', (u, ctx) => n => { const b = Math.round(u.ins[0][0]); for (let c = 1; c < u.ins.length; c++) ctx.server.writeBus(b + c - 1, u.ins[c], n, ctx.synth.fadeArr, true); });
U('In InFeedback', (u, ctx) => n => { const b = Math.round(u.ins[0][0]); for (let c = 0; c < u.outs.length; c++) u.outs[c].set(ctx.server.readBus(b + c, n).subarray(0, n)); });
U('SoundIn', (u, ctx) => n => { const b = Math.round(u.ins[0][0]); for (let c = 0; c < u.outs.length; c++) u.outs[c].set(ctx.server.readInput(b + c, n).subarray(0, n)); });
U('LocalIn', (u, ctx) => { ctx.synth.localBuf = u.outs.map(() => new Float32Array(BLOCK)); return n => { for (let c = 0; c < u.outs.length; c++) u.outs[c].set(ctx.synth.localBuf[c].subarray(0, n)); }; });
U('LocalOut', (u, ctx) => n => { const lb = ctx.synth.localBuf; if (!lb) return; for (let c = 0; c < u.ins.length && c < lb.length; c++) lb[c].set(u.ins[c].subarray(0, n)); });
U('OutKr', (u, ctx) => n => { const b = Math.round(u.ins[0][0]); for (let c = 1; c < u.ins.length; c++) ctx.server.ctlBus[b + c - 1] = u.ins[c][n - 1]; });
U('InKr', (u, ctx) => n => { const b = Math.round(u.ins[0][0]); for (let c = 0; c < u.outs.length; c++) u.outs[c].fill(ctx.server.ctlBus[b + c] || 0, 0, n); });
U('MouseX MouseY', (u, ctx) => { let y = null; const isY = u.name === 'MouseY';
  return n => { const mn = u.ins[0][0], mx = u.ins[1][0], warp = u.ins[2][0], lag = u.ins[3][0];
    let p = isY ? 1 - ctx.server.mouse.y : ctx.server.mouse.x; p = clamp(p, 0, 1);
    let v = warp >= 1 ? (Math.max(mn, 1e-4) * Math.pow(Math.max(mx, 1e-4) / Math.max(mn, 1e-4), p)) : mn + (mx - mn) * p;
    if (y === null) y = v; const b = lag <= 0 ? 0 : Math.exp(LOG001 / (lag * ctx.sr / BLOCK)); y = v + b * (y - v);
    u.outs[0].fill(y, 0, n); }; });
U('MouseButton', (u, ctx) => { let y = 0; return n => { const v = ctx.server.mouse.b ? u.ins[1][0] : u.ins[0][0]; y = v + 0.5 * (y - v); u.outs[0].fill(y, 0, n); }; });
U('SampleRate', (u, ctx) => n => u.outs[0].fill(ctx.sr, 0, n));
U('SampleDur', (u, ctx) => n => u.outs[0].fill(1 / ctx.sr, 0, n));
U('ControlRate', (u, ctx) => n => u.outs[0].fill(ctx.sr / BLOCK, 0, n));
U('ControlDur', (u, ctx) => n => u.outs[0].fill(BLOCK / ctx.sr, 0, n));
U('RadiansPerSample', (u, ctx) => n => u.outs[0].fill(TWO_PI / ctx.sr, 0, n));
U('K2A A2K DC', (u, ctx) => n => u.outs[0].set(u.ins[0].subarray(0, n)));
U('Silent', (u, ctx) => n => u.outs[0].fill(0, 0, n));
U('Clip', (u, ctx) => n => { const x = u.ins[0], a = u.ins[1], b = u.ins[2], o = u.outs[0]; for (let i = 0; i < n; i++) o[i] = clamp(x[i], a[i], b[i]); });
U('Fold', (u, ctx) => n => { const x = u.ins[0], a = u.ins[1], b = u.ins[2], o = u.outs[0]; for (let i = 0; i < n; i++) o[i] = fold(x[i], a[i], b[i]); });
U('Wrap', (u, ctx) => n => { const x = u.ins[0], a = u.ins[1], b = u.ins[2], o = u.outs[0]; for (let i = 0; i < n; i++) o[i] = wrap(x[i], a[i], b[i]); });
U('Schmidt', (u, ctx) => { let s = 0; return n => { const x = u.ins[0], lo = u.ins[1], hi = u.ins[2], o = u.outs[0]; for (let i = 0; i < n; i++) { if (s && x[i] < lo[i]) s = 0; else if (!s && x[i] > hi[i]) s = 1; o[i] = s; } }; });
U('InRange', (u, ctx) => n => { const x = u.ins[0], a = u.ins[1], b = u.ins[2], o = u.outs[0]; for (let i = 0; i < n; i++) o[i] = (x[i] >= a[i] && x[i] <= b[i]) ? 1 : 0; });
U('XFade2', (u, ctx) => n => { const a = u.ins[0], b = u.ins[1], p = u.ins[2], l = u.ins[3], o = u.outs[0]; for (let i = 0; i < n; i++) { const t = (clamp(p[i], -1, 1) + 1) * Math.PI / 4; o[i] = (a[i] * Math.cos(t) + b[i] * Math.sin(t)) * l[i]; } });
U('LinXFade2', (u, ctx) => n => { const a = u.ins[0], b = u.ins[1], p = u.ins[2], o = u.outs[0]; for (let i = 0; i < n; i++) { const t = (clamp(p[i], -1, 1) + 1) / 2; o[i] = a[i] * (1 - t) + b[i] * t; } });
U('Mix', (u, ctx) => n => { const o = u.outs[0]; o.fill(0, 0, n); for (const x of u.ins) for (let i = 0; i < n; i++) o[i] += x[i]; });

// math
const BIN = {
  '+': (a, b) => a + b, '-': (a, b) => a - b, '*': (a, b) => a * b,
  '/': (a, b) => b === 0 ? 0 : a / b, '**': (a, b) => a < 0 ? -Math.pow(-a, b) : Math.pow(a, b), pow: (a, b) => a < 0 ? -Math.pow(-a, b) : Math.pow(a, b),
  '%': (a, b) => b === 0 ? 0 : a - b * Math.floor(a / b), mod: (a, b) => b === 0 ? 0 : a - b * Math.floor(a / b),
  min: Math.min, max: Math.max, '<': (a, b) => a < b ? 1 : 0, '>': (a, b) => a > b ? 1 : 0, '<=': (a, b) => a <= b ? 1 : 0, '>=': (a, b) => a >= b ? 1 : 0,
  hypot: Math.hypot, atan2: Math.atan2, round: (a, b) => b === 0 ? a : Math.round(a / b) * b, trunc: (a, b) => b === 0 ? a : Math.trunc(a / b) * b,
  clip2: (a, b) => clamp(a, -b, b), fold2: (a, b) => fold(a, -b, b), wrap2: (a, b) => wrap(a, -b, b), excess: (a, b) => a - clamp(a, -b, b),
  ring1: (a, b) => a * b + a, ring2: (a, b) => a * b + a + b, ring3: (a, b) => a * a * b, ring4: (a, b) => a * a * b - a * b * b,
  absdif: (a, b) => Math.abs(a - b), sqrsum: (a, b) => (a + b) * (a + b), sqrdif: (a, b) => (a - b) * (a - b), sumsqr: (a, b) => a * a + b * b, difsqr: (a, b) => a * a - b * b,
  amclip: (a, b) => b <= 0 ? 0 : a * b, scaleneg: (a, b) => a < 0 ? a * b : a, thresh: (a, b) => a < b ? 0 : a,
  '&': (a, b) => (a | 0) & (b | 0), '|': (a, b) => (a | 0) | (b | 0), bitAnd: (a, b) => (a | 0) & (b | 0), bitOr: (a, b) => (a | 0) | (b | 0), bitXor: (a, b) => (a | 0) ^ (b | 0),
  '>>': (a, b) => (a | 0) >> (b | 0), '<<': (a, b) => (a | 0) << (b | 0), lcm: (a, b) => a * b, gcd: (a, b) => { a = Math.abs(a | 0); b = Math.abs(b | 0); while (b) [a, b] = [b, a % b]; return a; },
  '==': (a, b) => a === b ? 1 : 0, '!=': (a, b) => a !== b ? 1 : 0
};
const UN = {
  neg: a => -a, abs: Math.abs, sqrt: a => a < 0 ? -Math.sqrt(-a) : Math.sqrt(a), squared: a => a * a, cubed: a => a * a * a,
  exp: Math.exp, log: a => a <= 0 ? -1e9 : Math.log(a), log2: a => Math.log2(Math.abs(a) || 1e-12), log10: a => Math.log10(Math.abs(a) || 1e-12),
  sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, acos: Math.acos, atan: Math.atan, sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh,
  distort: a => a / (1 + Math.abs(a)), softclip: a => { const b = Math.abs(a); return b <= 0.5 ? a : (b - 0.25) / a; },
  midicps, cpsmidi, midiratio: a => Math.pow(2, a / 12), ratiomidi: a => 12 * Math.log2(Math.abs(a) || 1e-12),
  dbamp: a => Math.pow(10, a / 20), ampdb: a => 20 * Math.log10(Math.abs(a) || 1e-12), reciprocal: a => a === 0 ? 0 : 1 / a,
  sign: Math.sign, floor: Math.floor, ceil: Math.ceil, frac: a => a - Math.floor(a), isPositive: a => a >= 0 ? 1 : 0, isNegative: a => a < 0 ? 1 : 0, isStrictlyPositive: a => a > 0 ? 1 : 0,
  octcps: a => 440 * Math.pow(2, a - 4.75), cpsoct: a => Math.log2(Math.abs(a) / 440) + 4.75,
  unipolar: a => a * 0.5 + 0.5, bipolar: a => a, not: a => a > 0 ? 0 : 1, rectWindow: a => (a >= 0 && a <= 1) ? 1 : 0,
  hanWindow: a => (a < 0 || a > 1) ? 0 : 0.5 - 0.5 * Math.cos(TWO_PI * a), triWindow: a => (a < 0 || a > 1) ? 0 : a < 0.5 ? 2 * a : 2 - 2 * a,
  ramp: a => clamp(a, 0, 1), scurve: a => { const x = clamp(a, 0, 1); return x * x * (3 - 2 * x); }
};
U('BinaryOpUGen', (u, ctx) => { const f = BIN[u.params.op] || BIN['+']; return n => { const a = u.ins[0], b = u.ins[1], o = u.outs[0]; for (let i = 0; i < n; i++) o[i] = f(a[i], b[i]); }; });
U('UnaryOpUGen', (u, ctx) => { const f = UN[u.params.op] || (x => x); return n => { const a = u.ins[0], o = u.outs[0]; for (let i = 0; i < n; i++) o[i] = f(a[i]); }; });
U('MulAdd', (u, ctx) => n => { const a = u.ins[0], m = u.ins[1], b = u.ins[2], o = u.outs[0]; for (let i = 0; i < n; i++) o[i] = a[i] * m[i] + b[i]; });

// ---------- Synth ----------
class Synth {
  constructor(server, id, def, controls) {
    this.server = server; this.id = id; this.def = def; this.doneFlag = false;
    this.fade = 1; this.fadeTarget = 1; this.fadeStep = 0; this.fadeFree = false;
    this.fadeArr = null; this.localBuf = null; this.peak = 0;
    this.R = rng(seedCounter = (seedCounter * 1103515245 + 12345 + id) >>> 0);
    const ctx = { sr: server.sr, R: this.R, synth: this, server };
    this.ctx = ctx;
    // control values
    this.ctlVals = new Float32Array(def.numControls);
    this.ctlLag = new Float32Array(def.numControls);
    this.ctlCur = new Float32Array(def.numControls);
    this.trigCtl = [];
    for (const c of def.controls) {
      for (let k = 0; k < c.size; k++) { this.ctlVals[c.index + k] = c.defaults[k] ?? 0; this.ctlLag[c.index + k] = c.lag || 0; }
      if (c.trig) for (let k = 0; k < c.size; k++) this.trigCtl.push(c.index + k);
    }
    this.setControls(controls, true);
    this.ctlCur.set(this.ctlVals);
    // build units
    this.units = def.units.map(ud => ({ name: ud.name, outs: [], ins: [], params: ud.params || {}, run: null, lvl: 0 }));
    const consts = new Map();
    const constArr = v => { let a = consts.get(v); if (!a) { a = new Float32Array(BLOCK).fill(v); consts.set(v, a); } return a; };
    def.units.forEach((ud, i) => { const u = this.units[i]; for (let k = 0; k < ud.nout; k++) u.outs.push(new Float32Array(BLOCK)); });
    def.units.forEach((ud, i) => {
      const u = this.units[i];
      u.ins = ud.ins.map(r => r[0] === 'c' ? constArr(r[1]) : (this.units[r[1]] ? this.units[r[1]].outs[r[2] || 0] : constArr(0)));
    });
    this.units.forEach(u => { const f = UNITS[u.name]; if (!f) throw new Error('UGen ' + u.name + ' not available'); u.run = f(u, ctx); });
    this.controlUnits = this.units.filter(u => u.name === 'Control');
  }
  setControls(c, init) {
    if (!c) return;
    for (const k in c) {
      let idx = this.def.ctlIndex[k];
      if (idx == null) { if (/^\d+$/.test(k)) idx = +k; else continue; }
      const v = c[k];
      if (Array.isArray(v)) v.forEach((x, j) => { this.ctlVals[idx + j] = +x || 0; });
      else this.ctlVals[idx] = +v || 0;
    }
  }
  process(n) {
    // controls
    const sr = this.server.sr;
    for (const cu of this.controlUnits) {
      const base = cu.params.index;
      for (let k = 0; k < cu.outs.length; k++) {
        const j = base + k, target = this.ctlVals[j], lag = this.ctlLag[j], o = cu.outs[k];
        if (lag > 0) {
          const b = Math.exp(LOG001 / (lag * sr)); let y = this.ctlCur[j];
          for (let i = 0; i < n; i++) { y = target + b * (y - target); o[i] = y; } this.ctlCur[j] = y;
        } else { o.fill(target, 0, n); this.ctlCur[j] = target; }
      }
    }
    // fade
    if (this.fadeStep !== 0 || this.fade !== 1) {
      if (!this.fadeArr) this.fadeArr = new Float32Array(BLOCK);
      for (let i = 0; i < n; i++) {
        this.fade += this.fadeStep;
        if ((this.fadeStep > 0 && this.fade >= this.fadeTarget) || (this.fadeStep < 0 && this.fade <= this.fadeTarget)) { this.fade = this.fadeTarget; this.fadeStep = 0; }
        this.fadeArr[i] = this.fade;
      }
      if (this.fadeFree && this.fade <= 0) this.doneFlag = true;
    } else this.fadeArr = null;
    const watch = this.server.watchId === this.id;
    for (let k = 0; k < this.units.length; k++) {
      const u = this.units[k];
      u.run(n);
      if (watch) { let m = u.lvl; for (const o of u.outs) for (let i = 0; i < n; i += 8) { const a = Math.abs(o[i]); if (a > m) m = a; } u.lvl = m; }
    }
    for (const j of this.trigCtl) this.ctlVals[j] = 0;
  }
}

// ---------- Server ----------
class Server {
  constructor(sr, opts = {}) {
    this.sr = sr; this.nodes = []; this.byId = new Map(); this.defs = new Map(); this.queue = [];
    this.numBuses = opts.numBuses || 256;
    this.bus = []; this.busPrev = []; this.busStamp = new Int32Array(this.numBuses).fill(-10);
    for (let i = 0; i < this.numBuses; i++) { this.bus.push(new Float32Array(BLOCK)); this.busPrev.push(new Float32Array(BLOCK)); }
    this.zero = new Float32Array(BLOCK); this.ctlBus = new Float32Array(4096);
    this.input = [new Float32Array(BLOCK), new Float32Array(BLOCK)];
    this.block = 0; this.time = 0; this.outbox = []; this.ended = [];
    this.mouse = { x: 0.5, y: 0.5, b: 0 };
    this.volume = 1; this.limit = true; this.watchId = -1;
    this.peaks = [0, 0]; this.cpuAcc = 0; this.cpuBlocks = 0; this.statusEvery = Math.round(sr / BLOCK / 20);
    this.nanFlag = false;
  }
  post(m) { if (this.outbox.length < 200) this.outbox.push(m); }
  writeBus(b, data, n, fade, replace) {
    if (b < 0 || b >= this.numBuses) return;
    if (this.busStamp[b] !== this.block) {
      // first write this block: keep last block's content as prev
      const t = this.busPrev[b]; this.busPrev[b] = this.bus[b]; this.bus[b] = t;
      if (this.busStamp[b] !== this.block - 1) this.busPrev[b].fill(0);
      this.bus[b].fill(0); this.busStamp[b] = this.block;
    }
    const B = this.bus[b];
    if (replace) { if (fade) for (let i = 0; i < n; i++) B[i] = data[i] * fade[i]; else B.set(data.subarray(0, n)); }
    else if (fade) for (let i = 0; i < n; i++) B[i] += data[i] * fade[i];
    else for (let i = 0; i < n; i++) B[i] += data[i];
  }
  readBus(b, n) {
    if (b < 0 || b >= this.numBuses) return this.zero;
    const s = this.busStamp[b];
    if (s === this.block) return this.bus[b];
    if (s === this.block - 1) return this.bus[b]; // previous block (InFeedback semantics)
    return this.zero;
  }
  readInput(c, n) { return this.input[c] || this.zero; }
  // messages
  handle(m) {
    if (m.time && m.time > this.time + 1e-4) { this.queue.push(m); this.queue.sort((a, b) => a.time - b.time); return; }
    this.exec(m);
  }
  exec(m) {
    switch (m.type) {
      case 'd_recv': this.defs.set(m.def.name, m.def); break;
      case 's_new': {
        const def = m.def || this.defs.get(m.defName); if (!def) { this.post({ type: 'error', msg: 'SynthDef ' + m.defName + ' not found' }); break; }
        let s; try { s = new Synth(this, m.id, def, m.controls); } catch (e) { this.post({ type: 'error', msg: String(e.message || e) }); this.ended.push(m.id); break; }
        if (m.fadeIn > 0) { s.fade = 0; s.fadeTarget = 1; s.fadeStep = 1 / (m.fadeIn * this.sr); }
        s.tag = m.tag || ''; s.group = m.group || 0;
        const act = m.addAction || 'head', tgt = m.target != null ? this.byId.get(m.target) : null;
        if (act === 'tail') this.nodes.push(s);
        else if (act === 'before' && tgt) this.nodes.splice(this.nodes.indexOf(tgt), 0, s);
        else if (act === 'after' && tgt) this.nodes.splice(this.nodes.indexOf(tgt) + 1, 0, s);
        else if (act === 'replace' && tgt) { const i = this.nodes.indexOf(tgt); this.nodes[i] = s; this.byId.delete(tgt.id); this.ended.push(tgt.id); }
        else this.nodes.unshift(s);
        this.byId.set(m.id, s); break;
      }
      case 'n_set': { const s = this.byId.get(m.id); if (s) s.setControls(m.controls); break; }
      case 'n_free': { const s = this.byId.get(m.id); if (s) s.doneFlag = true; break; }
      case 'n_fade': { const s = this.byId.get(m.id); if (s) { const t = Math.max(m.fadeTime || 0.01, 0.001); s.fadeTarget = m.level == null ? 0 : m.level; s.fadeStep = (s.fadeTarget - s.fade) / (t * this.sr); s.fadeFree = !!m.free; if (s.fadeStep === 0 && m.free) s.doneFlag = true; } break; }
      case 'freeAll': for (const s of this.nodes) s.doneFlag = true; this.queue = []; break;
      case 'clearSched': this.queue = this.queue.filter(q => q.type !== 's_new' && q.type !== 'n_set'); break;
      case 'mouse': Object.assign(this.mouse, m.mouse); break;
      case 'volume': this.volume = m.value; break;
      case 'limit': this.limit = !!m.value; break;
      case 'watch': this.watchId = m.id; break;
      case 'c_set': this.ctlBus[m.index] = m.value; break;
    }
  }
  process(outL, outR, inL, inR, n, time) {
    const t0 = (G.performance && G.performance.now) ? G.performance.now() : Date.now();
    this.time = time;
    const tEnd = time + n / this.sr;
    while (this.queue.length && this.queue[0].time <= tEnd) this.exec(this.queue.shift());
    this.block++;
    if (inL) this.input[0].set(inL.subarray(0, n)); else this.input[0].fill(0);
    if (inR) this.input[1].set(inR.subarray(0, n)); else this.input[1].set(this.input[0]);
    // also expose inputs on buses 2,3 like scsynth (2 out, 2 in)
    for (let i = 0; i < this.nodes.length; i++) {
      const s = this.nodes[i];
      if (s.doneFlag) continue;
      try { s.process(n); } catch (e) { s.doneFlag = true; this.post({ type: 'error', msg: 'Synth ' + s.id + ': ' + (e.message || e) }); }
    }
    // remove finished
    if (this.nodes.some(s => s.doneFlag)) {
      this.nodes = this.nodes.filter(s => { if (s.doneFlag) { this.byId.delete(s.id); this.ended.push(s.id); return false; } return true; });
    }
    const L = this.readBus(0, n), R = this.readBus(1, n);
    const outsL = this.busStamp[0] === this.block ? L : this.zero, outsR = this.busStamp[1] === this.block ? R : this.zero;
    let pl = this.peaks[0], pr = this.peaks[1]; const v = this.volume;
    for (let i = 0; i < n; i++) {
      let a = outsL[i] * v, b = outsR[i] * v;
      if (!(a > -1e9 && a < 1e9)) { a = 0; this.nanFlag = true; } if (!(b > -1e9 && b < 1e9)) { b = 0; this.nanFlag = true; }
      if (this.limit) { a = a > 1 ? 1 : a < -1 ? -1 : a; b = b > 1 ? 1 : b < -1 ? -1 : b; }
      outL[i] = a; outR[i] = b;
      const aa = Math.abs(a), bb = Math.abs(b); if (aa > pl) pl = aa; if (bb > pr) pr = bb;
    }
    this.peaks[0] = pl; this.peaks[1] = pr;
    const t1 = (G.performance && G.performance.now) ? G.performance.now() : Date.now();
    this.cpuAcc += (t1 - t0); this.cpuBlocks++;
    if (this.cpuBlocks >= this.statusEvery) this.makeStatus();
  }
  makeStatus() {
    const budget = this.cpuBlocks * BLOCK / this.sr * 1000;
    let ugens = 0; for (const s of this.nodes) ugens += s.units.length;
    const st = { type: 'status', cpu: this.cpuAcc / budget * 100, peaks: this.peaks.slice(), synths: this.nodes.length, ugens, time: this.time,
      nodes: this.nodes.map(s => [s.id, s.def.name, s.tag]), ended: this.ended.splice(0), nan: this.nanFlag };
    const w = this.byId.get(this.watchId);
    if (w) { st.watch = { id: w.id, lv: w.units.map(u => { const l = u.lvl; u.lvl = 0; return Math.round(l * 1000) / 1000; }) }; }
    this.nanFlag = false; this.peaks = [0, 0]; this.cpuAcc = 0; this.cpuBlocks = 0;
    this.outbox.push(st);
  }
  takeOutbox() { const o = this.outbox; this.outbox = []; if (this.ended.length) o.push({ type: 'ended', ids: this.ended.splice(0) }); return o; }
}

G.SCDSP = { Server, UNITS, BLOCK, SHAPES, BIN, UN, dstream };
})(typeof globalThis !== 'undefined' ? globalThis : this);
