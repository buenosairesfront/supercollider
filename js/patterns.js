/* SuperCollider Lab · U-MA
 * patterns.js — clocks, Routine/Task, patterns & streams, events, Scale/Tuning, Pdef, Ndef/ProxySpace, MIDI.
 */
(function (G) {
'use strict';
const L = G.SCLang, LIB = G.SCLib, D = G.SCDSP;
const { defClass, CLASSES, Sym, sym, SCFunction, SCEvent, ClassRef, Ref, A, fl, isNum, isFloat, num } = L;
const { err, sname, toArr } = LIB.util;
const LOOKAHEAD = 0.12;

// ======================================================================
// Scheduler (audio-clock driven, lookahead)
// ======================================================================
const Sched = {
  q: [], seq: 0, timer: null,
  add(time, fn) { this.q.push({ time, fn, seq: this.seq++ }); this.q.sort((a, b) => a.time - b.time || a.seq - b.seq); this.start(); },
  start() {
    if (this.timer) return;
    try {
      const src = 'let t=null;onmessage=e=>{if(e.data==="start"&&!t)t=setInterval(()=>postMessage(0),15);if(e.data==="stop"){clearInterval(t);t=null;}}';
      this.worker = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
      this.worker.onmessage = () => this.tick(); this.worker.postMessage('start'); this.timer = 'w';
    } catch (e) { this.timer = setInterval(() => this.tick(), 15); }
  },
  tick() {
    const now = LIB.host.engine.now();
    let guard = 0;
    while (this.q.length && this.q[0].time <= now + LOOKAHEAD && guard++ < 2000) {
      const it = this.q.shift();
      try { it.fn(it.time); } catch (e) { LIB.host.ui.error(e); }
    }
  },
  clear() { this.q = []; },
};
LIB.Sched = Sched;

// ======================================================================
// Clocks
// ======================================================================
class Clock {
  constructor(tempo) { this.tempo = tempo; this.baseBeats = 0; this.baseTime = null; this.isSystem = false; }
  ensure() { if (this.baseTime == null) { this.baseTime = LIB.host.engine.now(); this.baseBeats = 0; } }
  beats() { this.ensure(); const t = LIB.I.thread.isRoutine && LIB.I.thread.clock === this ? LIB.I.thread.time : LIB.host.engine.now(); return this.secs2beats(t); }
  beats2secs(b) { this.ensure(); return this.baseTime + (b - this.baseBeats) / this.tempo; }
  secs2beats(t) { this.ensure(); return this.baseBeats + (t - this.baseTime) * this.tempo; }
  setTempo(t) { this.ensure(); const now = LIB.host.engine.now(); this.baseBeats = this.secs2beats(now); this.baseTime = now; this.tempo = Math.max(num(t), 0.001); }
  nextOnGrid(quant, phase = 0) { const b = this.secs2beats(LIB.host.engine.now() + 0.05); if (!quant) return b; return Math.ceil((b - phase) / quant) * quant + phase; }
}
Clock.prototype.scClass = 'TempoClock';
const defaultClock = new Clock(1);
const systemClock = new Clock(1); systemClock.isSystem = true;
LIB.TempoClock = { default: defaultClock };
const clockIM = {
  tempo: r => r.tempo, tempo_: (r, a) => { r.setTempo(a[0]); return r; }, beats: r => r.beats(), seconds: () => LIB.host.engine.now(),
  sched(r, a) { const delta = num(a[0]), f = a[1]; const start = r.beats() + delta; schedFn(r, start, f); return r; },
  schedAbs(r, a) { schedFn(r, num(a[0]), a[1]); return r; },
  play(r, a) { return LIB.I.sendSync(a[0], 'play', [r, a[1] ?? null]); },
  nextTimeOnGrid: (r, a) => r.nextOnGrid(num(a[0] ?? 1), num(a[1] ?? 0)),
  clear(r) { return r; }, stop(r) { return r; }, permanent_: r => r, beatDur: r => 1 / r.tempo, bar: r => Math.floor(r.beats() / 4), beatsPerBar: () => 4,
  printOn: null,
};
function schedFn(clock, beat, f) {
  Sched.add(clock.beats2secs(beat), (time) => {
    const prev = LIB.I.thread; LIB.I.thread = { isRoutine: true, time, beats: beat, clock };
    let r; try { r = LIB.I.callSync(f, [beat, time, clock]); } finally { LIB.I.thread = prev; }
    if (isNum(r) && num(r) > 0) schedFn(clock, beat + num(r), f);
  });
}
defClass('Clock', 'Object', clockIM);
defClass('TempoClock', 'Clock', {}, { new: (c, a, kw) => { const k = new Clock(num(A(a, kw, 0, 'tempo', 1))); return k; }, default: () => defaultClock, tempo: () => defaultClock.tempo, tempo_: (c, a) => { defaultClock.setTempo(a[0]); return c; }, beats: () => defaultClock.beats(), sched: (c, a) => clockIM.sched(defaultClock, a), play: (c, a) => clockIM.play(defaultClock, a), nextTimeOnGrid: (c, a) => clockIM.nextTimeOnGrid(defaultClock, a) });
defClass('SystemClock', 'Clock', {}, { sched: (c, a) => clockIM.sched(systemClock, a), schedAbs: (c, a) => clockIM.schedAbs(systemClock, a), seconds: () => LIB.host.engine.now(), beats: () => systemClock.beats(), clear: c => c });
defClass('AppClock', 'Clock', {}, { sched: (c, a) => clockIM.sched(systemClock, a), seconds: () => LIB.host.engine.now(), clear: c => c });
Clock.prototype.printOn = function () { return this.isSystem ? 'SystemClock' : 'a TempoClock'; };

// ======================================================================
// Routine / Task
// ======================================================================
const RUNNING = new Set();
class Routine {
  constructor(fn) { this.fn = fn; this.gen = null; this.playing = false; this.done = false; this.clock = defaultClock; this.beats = 0; this.time = 0; this.token = 0; }
  printOn() { return 'a ' + (this.isTask ? 'Task' : 'Routine'); }
  startGen(inval) { this.gen = LIB.I.call(this.fn, [inval]); this.done = false; }
  // stream use
  next(inval) {
    if (this.done) return null;
    if (!this.gen) this.startGen(inval);
    const prev = LIB.I.thread; LIB.I.thread = { isRoutine: true, time: prev.time, beats: prev.beats, clock: prev.clock, stream: true };
    LIB.I.steps = 0;
    try {
      const r = this.gen.next(inval);
      if (r.done) { this.done = true; return null; }
      const y = r.value; return y && y.yieldVal !== undefined ? y.yieldVal : (y && y.wait !== undefined ? y.wait : null);
    } finally { LIB.I.thread = prev; }
  }
  play(clock, quant) {
    if (this.playing) return this;
    this.clock = clock && clock.scClass === 'TempoClock' ? clock : defaultClock;
    const q = quant == null ? 0 : (Array.isArray(quant) ? num(quant[0]) : num(quant));
    if (!this.gen || this.done) this.startGen(null);
    const startT = LIB.host.engine.now() + 0.06;
    this.beats = q > 0 ? this.clock.nextOnGrid(q) : this.clock.secs2beats(startT);
    this.time = this.clock.beats2secs(this.beats);
    if (this.time < startT) { this.time = startT; this.beats = this.clock.secs2beats(startT); }
    this.playing = true; RUNNING.add(this); const tok = ++this.token;
    Sched.add(this.time, () => this.resume(tok));
    LIB.host.ui.routines && LIB.host.ui.routines(RUNNING.size);
    return this;
  }
  resume(tok) {
    if (!this.playing || tok !== this.token) return;
    const prev = LIB.I.thread;
    LIB.I.thread = { isRoutine: true, time: this.time, beats: this.beats, clock: this.clock, routine: this };
    LIB.I.steps = 0;
    let r;
    try { r = this.gen.next(this.beats); }
    catch (e) { LIB.I.thread = prev; this.stop(); LIB.host.ui.error(e); return; }
    LIB.I.thread = prev;
    if (r.done) { this.done = true; this.stop(); return; }
    const y = r.value; const w = y && y.wait !== undefined ? y.wait : null;
    if (w == null || !isNum(w) || !(num(w) >= 0)) { this.done = true; this.stop(); return; }
    this.beats += num(w); this.time = this.clock.beats2secs(this.beats);
    Sched.add(this.time, () => this.resume(tok));
  }
  stop() { this.playing = false; this.token++; RUNNING.delete(this); LIB.host.ui.routines && LIB.host.ui.routines(RUNNING.size); return this; }
  reset() { this.gen = null; this.done = false; return this; }
}
Routine.prototype.scClass = 'Routine';
LIB.Routine = Routine;
const routineIM = {
  next: (r, a) => r.next(a[0] ?? null), value: (r, a) => r.next(a[0] ?? null), nextN: (r, a) => { const out = []; for (let i = 0; i < num(a[0]); i++) { const v = r.next(a[1] ?? null); if (v == null) break; out.push(v); } return out; },
  all: r => { const out = []; for (let i = 0; i < 10000; i++) { const v = r.next(null); if (v == null) break; out.push(v); } return out; },
  play: (r, a, kw) => r.play(A(a, kw, 0, 'clock'), A(a, kw, 1, 'quant')), stop: r => r.stop(), reset: r => r.reset(),
  pause: r => r.stop(), resume: (r, a) => r.play(a[0]), start: (r, a) => r.play(a[0]), isPlaying: r => r.playing,
  asStream: r => r, embedInStream: function* (r) { for (;;) { const v = r.next(null); if (v == null) return null; yield { wait: v, yieldVal: v }; } },
  printOn: null,
};
defClass('Stream', 'Object', {});
defClass('Routine', 'Stream', routineIM, { new: (c, a) => new Routine(a[0]), run: (c, a) => new Routine(a[0]).play() });
defClass('Task', 'Routine', {}, { new: (c, a) => { const r = new Routine(a[0]); r.isTask = true; return r; } });
CLASSES.Function.im.fork = (r, a, kw) => new Routine(r).play(A(a, kw, 0, 'clock'), A(a, kw, 1, 'quant'));
CLASSES.Function.im.r = (r) => new Routine(r);
CLASSES.Function.im.asRoutine = (r) => new Routine(r);
CLASSES.Function.im.defer = (r, a) => { const d = num(a[0] ?? 0); setTimeout(() => { try { LIB.I.callSync(r); } catch (e) { LIB.host.ui.error(e); } }, d * 1000); return r; };
CLASSES.Function.im.asStream = (r) => new Routine(r);

// ======================================================================
// Patterns
// ======================================================================
class Pattern { constructor(name) { this.pname = name; } }
Pattern.prototype.isPattern = true;
Pattern.prototype.scClass = 'Pattern';
Pattern.prototype.printOn = function () { return 'a ' + this.pname; };
LIB.Pattern = Pattern;
const P = (name, embed, fields) => { const f = (...args) => { const p = new Pattern(name); Object.assign(p, fields ? fields(...args) : {}); p.embed = embed; return p; }; return f; };

// stream wrapper
function streamOf(x) {
  if (x && x.isPattern) {
    let g = null, first = true, ended = false;
    const s = { isStream: true, scClass: 'Stream', printOn: () => 'a Stream',
      next(inval) { if (ended) return null; if (first) { g = x.embed(inval); first = false; } const r = g.next(inval); if (r.done) { ended = true; return null; } return r.value; },
      reset() { first = true; ended = false; g = null; } };
    return s;
  }
  if (x instanceof Routine) return { isStream: true, scClass: 'Stream', next: (iv) => x.next(iv), reset: () => x.reset(), printOn: () => 'a Routine' };
  if (x && x.isStream) return x;
  if (x instanceof SCFunction) return { isStream: true, scClass: 'Stream', next: (iv) => LIB.I.callSync(x, [iv]), reset() { }, printOn: () => 'a FuncStream' };
  return { isStream: true, scClass: 'Stream', next: () => x, reset() { }, printOn: () => 'a Stream', isConst: true };
}
LIB.streamOf = streamOf;
LIB.constStream = x => streamOf(x);
// embed one item (value or pattern) in a generator
function* embedItem(item, inval) {
  if (item && item.isPattern) return yield* item.embed(inval);
  return yield item;
}
const valNext = (s, iv) => s.next(iv);
const repN = r => r == null ? 1 : num(r);

const Pseq = P('Pseq', function* (inval) {
  const list = toArr(this.list), n = list.length, reps = repN(this.repeats), off = num(this.offset || 0);
  if (!n) return inval;
  for (let r = 0; r < reps; r++) for (let i = 0; i < n; i++) inval = yield* embedItem(list[(i + off) % n], inval);
  return inval;
}, (list, repeats = 1, offset = 0) => ({ list, repeats, offset }));
const Pser = P('Pser', function* (inval) { const list = toArr(this.list), n = list.length, reps = repN(this.repeats), off = num(this.offset || 0); for (let i = 0; i < reps && n; i++) inval = yield* embedItem(list[(i + off) % n], inval); return inval; }, (list, repeats = 1, offset = 0) => ({ list, repeats, offset }));
const Prand = P('Prand', function* (inval) { const list = toArr(this.list), reps = repN(this.repeats); for (let i = 0; i < reps && list.length; i++) inval = yield* embedItem(list[Math.floor(LIB.I.rand() * list.length)], inval); return inval; }, (list, repeats = 1) => ({ list, repeats }));
const Pxrand = P('Pxrand', function* (inval) { const list = toArr(this.list), reps = repN(this.repeats); let last = -1; for (let i = 0; i < reps && list.length; i++) { let k; do { k = Math.floor(LIB.I.rand() * list.length); } while (list.length > 1 && k === last); last = k; inval = yield* embedItem(list[k], inval); } return inval; }, (list, repeats = 1) => ({ list, repeats }));
const Pwrand = P('Pwrand', function* (inval) { const list = toArr(this.list), w = toArr(this.weights).map(num), reps = repN(this.repeats); for (let i = 0; i < reps; i++) { const x = LIB.I.rand(); let acc = 0, k = 0; for (; k < w.length - 1; k++) { acc += w[k]; if (x < acc) break; } inval = yield* embedItem(list[k], inval); } return inval; }, (list, weights, repeats = 1) => ({ list, weights, repeats }));
const Pshuf = P('Pshuf', function* (inval) { const list = LIB.shuffle(toArr(this.list).slice()), reps = repN(this.repeats); for (let r = 0; r < reps; r++) for (const x of list) inval = yield* embedItem(x, inval); return inval; }, (list, repeats = 1) => ({ list, repeats }));
function* numPat(self, inval, gen) {
  const n = self.length == null ? Infinity : num(self.length);
  const st = (self.args || []).map(streamOf);
  for (let i = 0; i < n; i++) { const v = st.map(s => s.next(inval)); if (v.some(x => x == null)) return inval; inval = yield gen(v, i); }
  return inval;
}
const Pwhite = P('Pwhite', function* (inval) { return yield* numPat(this, inval, ([lo, hi]) => (isFloat(lo) || isFloat(hi)) ? num(lo) + LIB.I.rand() * (num(hi) - num(lo)) : Math.floor(num(lo) + LIB.I.rand() * (num(hi) - num(lo) + 1))); }, (lo = 0, hi = 1, length = Infinity) => ({ args: [lo, hi], length }));
const Pexprand = P('Pexprand', function* (inval) { return yield* numPat(this, inval, ([lo, hi]) => num(lo) * Math.pow(num(hi) / num(lo), LIB.I.rand())); }, (lo = 0.0001, hi = 1, length = Infinity) => ({ args: [lo, hi], length }));
const Pgauss = P('Pgauss', function* (inval) { return yield* numPat(this, inval, ([m, d]) => num(m) + num(d) * Math.sqrt(-2 * Math.log(LIB.I.rand() + 1e-12)) * Math.cos(2 * Math.PI * LIB.I.rand())); }, (mean = 0, dev = 1, length = Infinity) => ({ args: [mean, dev], length }));
const Pbrown = P('Pbrown', function* (inval) {
  const lo0 = this.lo, hi0 = this.hi; let cur = null; const n = this.length == null ? Infinity : num(this.length);
  const F = isFloat(lo0) || isFloat(hi0) || isFloat(this.step);
  for (let i = 0; i < n; i++) { const lo = num(lo0), hi = num(hi0), st = num(this.step); if (cur == null) cur = F ? lo + LIB.I.rand() * (hi - lo) : Math.floor(lo + LIB.I.rand() * (hi - lo + 1));
    let v = cur + (F ? (LIB.I.rand() * 2 - 1) * st : Math.round((LIB.I.rand() * 2 - 1) * st)); if (v > hi) v = 2 * hi - v; if (v < lo) v = 2 * lo - v; cur = v; inval = yield cur; }
  return inval; }, (lo = 0, hi = 1, step = 0.125, length = Infinity) => ({ lo, hi, step, length }));
const Pseries = P('Pseries', function* (inval) { const n = this.length == null ? Infinity : num(this.length); const st = streamOf(this.step); let v = this.start; for (let i = 0; i < n; i++) { inval = yield v; const s = st.next(inval); if (s == null) return inval; v = LIB.binop('+', v, s); } return inval; }, (start = 0, step = 1, length = Infinity) => ({ start, step, length }));
const Pgeom = P('Pgeom', function* (inval) { const n = this.length == null ? Infinity : num(this.length); const st = streamOf(this.grow); let v = this.start; for (let i = 0; i < n; i++) { inval = yield v; const g = st.next(inval); if (g == null) return inval; v = LIB.binop('*', v, g); } return inval; }, (start = 1, grow = 1, length = Infinity) => ({ start, grow, length }));
const Pn = P('Pn', function* (inval) { const reps = repN(this.repeats); for (let r = 0; r < reps; r++) { const before = r; inval = yield* embedItem(this.pattern, inval); if (r > 100000) break; } return inval; }, (pattern, repeats = Infinity) => ({ pattern, repeats }));
const Pdup = P('Pdup', function* (inval) { const ns = streamOf(this.n), s = streamOf(this.pattern); for (;;) { const k = ns.next(inval); const v = s.next(inval); if (v == null || k == null) return inval; for (let i = 0; i < num(k); i++) inval = yield v; } }, (n, pattern) => ({ n, pattern }));
const Pfunc = P('Pfunc', function* (inval) { for (;;) { const v = LIB.I.callSync(this.fn, [inval]); if (v == null) return inval; inval = yield v; } }, (fn) => ({ fn }));
const Prout = P('Prout', function* (inval) {
  const g = LIB.I.call(this.fn, [inval]);
  for (;;) { const prev = LIB.I.thread; LIB.I.thread = { isRoutine: true, stream: true, time: prev.time, beats: prev.beats, clock: prev.clock }; let r; try { r = g.next(inval); } finally { LIB.I.thread = prev; } if (r.done) return inval; const y = r.value; inval = yield (y && y.yieldVal !== undefined ? y.yieldVal : y.wait); }
}, (fn) => ({ fn }));
const Pkey = P('Pkey', function* (inval) { for (;;) { const v = inval instanceof SCEvent ? inval.get(sname(this.key)) : null; if (v == null) return inval; inval = yield v; } }, (key) => ({ key }));
const Pfin = P('Pfin', function* (inval) { const s = streamOf(this.pattern); for (let i = 0; i < num(this.count); i++) { const v = s.next(inval); if (v == null) return inval; inval = yield v; } return inval; }, (count, pattern) => ({ count, pattern }));
const Plazy = P('Plazy', function* (inval) { const p = LIB.I.callSync(this.fn, [inval]); return yield* embedItem(p, inval); }, (fn) => ({ fn }));
const Ptrace = P('Ptrace', function* (inval) { const s = streamOf(this.pattern); for (;;) { const v = s.next(inval); if (v == null) return inval; LIB.I.post(LIB.I.str(v)); inval = yield v; } }, (pattern) => ({ pattern }));
const Pcollect = P('Pcollect', function* (inval) { const s = streamOf(this.pattern); for (;;) { const v = s.next(inval); if (v == null) return inval; inval = yield LIB.I.callSync(this.fn, [v, inval]); } }, (fn, pattern) => ({ fn, pattern }));
const Pselect = P('Pselect', function* (inval) { const s = streamOf(this.pattern); for (;;) { const v = s.next(inval); if (v == null) return inval; if (LIB.I.callSync(this.fn, [v, inval]) === this.keep) inval = yield v; } }, (fn, pattern, keep = true) => ({ fn, pattern, keep }));
const Pindex = P('Pindex', function* (inval) { const ls = streamOf(this.list), is = streamOf(this.index); const reps = repN(this.repeats); for (let r = 0; r < reps; r++) { const l = ls.next(inval), i = is.next(inval); if (l == null || i == null) return inval; const arr = toArr(l); inval = yield* embedItem(arr[((Math.floor(num(i)) % arr.length) + arr.length) % arr.length], inval); } return inval; }, (list, index, repeats = 1) => ({ list, index, repeats }));
const Pif = P('Pif', function* (inval) { const c = streamOf(this.cond), t = streamOf(this.t), f = streamOf(this.f); for (;;) { const cv = c.next(inval); if (cv == null) return inval; const v = cv ? t.next(inval) : f.next(inval); if (v == null) return inval; inval = yield v; } }, (cond, t, f) => ({ cond, t, f }));
const Pbinop = P('Pbinop', function* (inval) { const a = streamOf(this.a), b = streamOf(this.b); for (;;) { const x = a.next(inval), y = b.next(inval); if (x == null || y == null) return inval; inval = yield LIB.binop(this.op, x, y); } }, (op, a, b) => ({ op, a, b }));
const Punop = P('Punop', function* (inval) { const a = streamOf(this.a); for (;;) { const x = a.next(inval); if (x == null) return inval; inval = yield LIB.unop(this.op, x); } }, (op, a) => ({ op, a }));
LIB.Pbinop = (op, a, b) => Pbinop(op, a, b); LIB.Punop = (op, a) => Punop(op, a);
const Pchain = P('Pchain', function* (inval) { const sts = this.pats.map(streamOf).reverse(); for (;;) { let ev = inval instanceof SCEvent ? copyEv(inval) : new SCEvent(); for (const s of sts) { ev = s.next(ev); if (ev == null) return inval; } inval = yield ev; } }, (...pats) => ({ pats }));

function copyEv(e) { const n = new SCEvent(); e.d.forEach((v, k) => n.d.set(k, v)); return n; }
LIB.copyEv = copyEv;
const Pbind = P('Pbind', function* (inval) {
  const pairs = this.pairs; const streams = [];
  for (let i = 0; i + 1 < pairs.length; i += 2) streams.push([pairs[i], streamOf(pairs[i + 1])]);
  for (;;) {
    const ev = inval instanceof SCEvent ? copyEv(inval) : new SCEvent();
    for (const [k, s] of streams) {
      const v = s.next(ev);
      if (v == null) return inval;
      if (Array.isArray(k)) { k.forEach((kk, j) => ev.put(sname(kk), toArr(v)[j] ?? null)); }
      else ev.put(sname(k), v);
    }
    inval = yield ev;
  }
}, (...pairs) => { if (pairs.length % 2) err('Pbind needs key-value pairs'); return { pairs }; });
const Pmono = P('Pmono', function* (inval) { const ev0 = Pbind(...this.pairs); return yield* ev0.embed(inval); }, (instrument, ...pairs) => ({ pairs: [sym('instrument'), instrument].concat(pairs) }));
const Ppar = P('Ppar', function* (inval) {
  const reps = repN(this.repeats);
  for (let r = 0; r < reps; r++) {
    const q = toArr(this.list).map((p, i) => ({ t: 0, s: streamOf(p), i }));
    let now = 0;
    while (q.length) {
      q.sort((a, b) => a.t - b.t || a.i - b.i);
      const it = q[0];
      if (it.t > now) { inval = yield restEvent(it.t - now); now = it.t; continue; }
      const ev = it.s.next(inval instanceof SCEvent ? copyEv(inval) : new SCEvent());
      if (ev == null) { q.shift(); continue; }
      it.t += eventDelta(ev);
      const next = Math.min(...q.map(x => x.t));
      ev.put('delta', Math.max(0, next - now)); now = Math.min(next, now + Math.max(0, next - now));
      inval = yield ev;
    }
  }
  return inval;
}, (list, repeats = 1) => ({ list, repeats }));
const Ptpar = P('Ptpar', function* (inval) { const l = toArr(this.list); const pats = []; for (let i = 0; i + 1 < l.length; i += 2) pats.push(Pchain_offset(num(l[i]), l[i + 1])); return yield* Ppar(pats, this.repeats).embed(inval); }, (list, repeats = 1) => ({ list, repeats }));
function Pchain_offset(t, p) { return t > 0 ? Pseq([restEventPattern(t), p]) : p; }
function restEventPattern(t) { const pp = new Pattern('Rest'); pp.embed = function* (iv) { return yield restEvent(t); }; return pp; }
function restEvent(d) { const e = new SCEvent(); e.put('type', sym('rest')); e.put('dur', d); return e; }

const PATS = { Pseq, Pser, Prand, Pxrand, Pwrand, Pshuf, Pwhite, Pexprand, Pgauss, Pbrown, Pseries, Pgeom, Pn, Pdup, Pstutter: Pdup, Pfunc, Prout, Pkey, Pfin, Plazy, Ptrace, Pcollect, Pselect, Pindex, Pif, Pbind, Pmono, Ppar, Ptpar, Pchain };
const ARGN = {
  Pseq: ['list', 'repeats', 'offset'], Pser: ['list', 'repeats', 'offset'], Prand: ['list', 'repeats'], Pxrand: ['list', 'repeats'], Pwrand: ['list', 'weights', 'repeats'], Pshuf: ['list', 'repeats'],
  Pwhite: ['lo', 'hi', 'length'], Pexprand: ['lo', 'hi', 'length'], Pgauss: ['mean', 'dev', 'length'], Pbrown: ['lo', 'hi', 'step', 'length'], Pseries: ['start', 'step', 'length'], Pgeom: ['start', 'grow', 'length'],
  Pn: ['pattern', 'repeats'], Pdup: ['n', 'pattern'], Pstutter: ['n', 'pattern'], Pfunc: ['nextFunc'], Prout: ['routineFunc'], Pkey: ['key'], Pfin: ['count', 'pattern'], Plazy: ['func'], Ptrace: ['pattern'],
  Pindex: ['listPat', 'indexPat', 'repeats'], Pif: ['condition', 'iftrue', 'iffalse'], Ppar: ['list', 'repeats'], Ptpar: ['list', 'repeats'],
};
const DEF = { Pseq: [null, 1, 0], Pser: [null, 1, 0], Prand: [null, 1], Pxrand: [null, 1], Pwrand: [null, null, 1], Pshuf: [null, 1], Pwhite: [0, 1, Infinity], Pexprand: [0.0001, 1, Infinity], Pgauss: [0, 1, Infinity], Pbrown: [0, 1, 0.125, Infinity], Pseries: [0, 1, Infinity], Pgeom: [1, 1, Infinity], Pn: [null, Infinity], Pdup: [2, null], Pstutter: [2, null], Pindex: [null, null, 1], Ppar: [null, 1], Ptpar: [null, 1] };
const patIM = {
  asStream: r => streamOf(r), play: (r, a, kw) => playPattern(r, A(a, kw, 0, 'clock'), A(a, kw, 2, 'quant', null)),
  trace: r => Ptrace(r), repeat: (r, a) => Pn(r, a[0] ?? Infinity), loop: r => Pn(r, Infinity), stutter: (r, a) => Pdup(a[0], r),
  collect: (r, a) => Pcollect(a[0], r), select: (r, a) => Pselect(a[0], r, true), reject: (r, a) => Pselect(a[0], r, false),
  '<>': (r, a) => Pchain(r, a[0]), embedInStream: r => r,
  nextN(r, a) { const s = streamOf(r); const out = []; for (let i = 0; i < num(a[0]); i++) { const v = s.next(a[1] ?? null); if (v == null) break; out.push(v); } return out; },
  asArray(r) { const s = streamOf(r); const out = []; for (let i = 0; i < 4096; i++) { const v = s.next(null); if (v == null) break; out.push(v); } return out; },
  printOn: null,
};
const mathPat = {}; Object.keys(CLASSES.Number.im).forEach(k => { if (k in patIM) return; });
defClass('Pattern', 'AbstractFunction', patIM);
['+', '-', '*', '/', '**', '%', 'min', 'max', 'round', 'trunc', 'pow', 'mod', 'div', 'clip2', 'wrap2', 'fold2'].forEach(op => { CLASSES.Pattern.im[op] = (r, a) => Pbinop(op, r, a[0]); });
Object.keys(D.UN).forEach(op => { CLASSES.Pattern.im[op] = r => Punop(op, r); });
CLASSES.Pattern.im.clip = (r, a) => Pcollect((x) => LIB.I.sendSync(x, 'clip', a), r);
Object.keys(PATS).forEach(n => {
  defClass(n, 'Pattern', {}, {
    new(c, a, kw) {
      const names = ARGN[n]; const defs = DEF[n] || [];
      if (!names) return PATS[n](...a);
      const vals = names.map((nm, i) => { const v = A(a, kw, i, nm, undefined); return v === undefined ? (defs[i] === undefined ? undefined : defs[i]) : v; });
      if (n === 'Pfunc' || n === 'Prout' || n === 'Plazy') return PATS[n](vals[0]);
      return PATS[n](...vals);
    },
  });
});
CLASSES.Pbind.cm.new = (c, a) => Pbind(...a);
CLASSES.Pmono.cm.new = (c, a) => Pmono(...a);
CLASSES.Pchain.cm.new = (c, a) => Pchain(...a);
// stream class methods
defClass('FuncStream', 'Stream', {}, { new: (c, a) => streamOf(a[0]) });
const streamIM = {
  next: (r, a) => r.next(a[0] ?? null), value: (r, a) => r.next(a[0] ?? null), reset: r => { r.reset(); return r; },
  nextN(r, a) { const out = []; for (let i = 0; i < num(a[0]); i++) { const v = r.next(a[1] ?? null); if (v == null) break; out.push(v); } return out; },
  all(r, a) { const out = []; for (let i = 0; i < 10000; i++) { const v = r.next(a[0] ?? null); if (v == null) break; out.push(v); } return out; },
  asStream: r => r, play: (r, a) => playPattern(r, a[0], a[1]),
};
Object.assign(CLASSES.Stream.im, streamIM);
CLASSES.Stream.im.printOn = undefined;

// ======================================================================
// Scale & Tuning
// ======================================================================
const ratiomidi = r => 12 * Math.log2(r);
class Tuning { constructor(semis, octaveRatio = 2, name = '') { this.semis = semis; this.octaveRatio = octaveRatio; this.name = name; } printOn() { return 'Tuning(' + this.name + ')'; } }
Tuning.prototype.scClass = 'Tuning';
const TUNINGS = {
  et12: () => new Tuning([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 2, 'et12'),
  just: () => new Tuning([1, 16 / 15, 9 / 8, 6 / 5, 5 / 4, 4 / 3, 45 / 32, 3 / 2, 8 / 5, 5 / 3, 9 / 5, 15 / 8].map(ratiomidi), 2, 'just'),
  pythagorean: () => new Tuning([1, 256 / 243, 9 / 8, 32 / 27, 81 / 64, 4 / 3, 729 / 512, 3 / 2, 128 / 81, 27 / 16, 16 / 9, 243 / 128].map(ratiomidi), 2, 'pythagorean'),
  mean4: () => { const f = Math.pow(5, 0.25); const r = [1, 8 / (f * f * f * f * f) * 2, f * f / 2, 4 / (f * f * f), 5 / 4, 2 / f, f * f * f * f * f * f / 8, f, 8 / 5, f * f * f / 2, 4 / (f * f), f * f * f * f * f / 4]; return new Tuning(r.map(x => ratiomidi(x)).map(x => ((x % 12) + 12) % 12).sort((a, b) => a - b), 2, 'mean4'); },
  et: (n) => new Tuning(Array.from({ length: n }, (_, i) => i * 12 / n), 2, 'et' + n),
};
['et19', 'et22', 'et24', 'et31', 'et41', 'et53', 'et5', 'et7'].forEach(k => { TUNINGS[k] = () => TUNINGS.et(parseInt(k.slice(2))); });
class Scale { constructor(degrees, ppo = 12, tuning, name = '') { this.degrees = degrees.map(num); this.ppo = ppo; this.tuning = tuning || (ppo === 12 ? TUNINGS.et12() : TUNINGS.et(ppo)); this.name = name; } printOn() { return 'Scale(' + this.name + ')'; }
  semis() { return this.degrees.map(d => this.tuning.semis[Math.floor(d) % this.tuning.semis.length] + Math.floor(d / this.tuning.semis.length) * ratiomidi(this.tuning.octaveRatio)); } }
Scale.prototype.scClass = 'Scale';
const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11], ionian: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], aeolian: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10], phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11], mixolydian: [0, 2, 4, 5, 7, 9, 10], locrian: [0, 1, 3, 5, 6, 8, 10], harmonicMinor: [0, 2, 3, 5, 7, 8, 11], melodicMinor: [0, 2, 3, 5, 7, 9, 11],
  majorPentatonic: [0, 2, 4, 7, 9], minorPentatonic: [0, 3, 5, 7, 10], chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], whole: [0, 2, 4, 6, 8, 10], blues: [0, 3, 5, 6, 7, 10],
  hirajoshi: [0, 2, 3, 7, 8], iwato: [0, 1, 5, 6, 10], kumoi: [0, 2, 3, 7, 9], ritusen: [0, 2, 5, 7, 9], yu: [0, 3, 5, 7, 10], egyptian: [0, 2, 5, 7, 10], chinese: [0, 4, 6, 7, 11],
  bhairav: [0, 1, 4, 5, 7, 8, 11], todi: [0, 1, 3, 6, 7, 8, 11], purvi: [0, 1, 4, 6, 7, 8, 11], marva: [0, 1, 4, 6, 7, 9, 11], kafi: [0, 2, 3, 5, 7, 9, 10], spanish: [0, 1, 4, 5, 7, 8, 10],
  augmented: [0, 3, 4, 7, 8, 11], diminished: [0, 2, 3, 5, 6, 8, 9, 11], gong: [0, 2, 4, 7, 9], shang: [0, 2, 5, 7, 10], jiao: [0, 3, 5, 8, 10], zhi: [0, 2, 5, 7, 9],
};
LIB.SCALES = SCALES;
function degreeToKey(deg, scale, spo = 12) {
  if (Array.isArray(deg)) return deg.map(d => degreeToKey(d, scale, spo));
  if (deg && deg.scClass === 'Rest') return deg;
  if (deg instanceof Sym) return deg;
  const d = num(deg);
  let semis, size, octSemis;
  if (scale instanceof Scale) { semis = scale.semis(); size = semis.length; octSemis = ratiomidi(scale.tuning.octaveRatio); }
  else { semis = toArr(scale == null ? SCALES.major : scale).map(num); size = semis.length; octSemis = num(spo); }
  const fl_ = Math.floor(d), frac = d - fl_;
  const oct = Math.floor(fl_ / size), idx = ((fl_ % size) + size) % size;
  let k = semis[idx] + oct * octSemis;
  if (frac) { const nxt = idx + 1 < size ? semis[idx + 1] + oct * octSemis : semis[0] + (oct + 1) * octSemis; k += (nxt - k) * frac; }
  return k;
}
LIB.degreeToKey = degreeToKey;
const scaleCM = { new: (c, a, kw) => { const ppo = num(A(a, kw, 1, 'pitchesPerOctave', 12)); return new Scale(toArr(A(a, kw, 0, 'degrees', [0])), ppo, A(a, kw, 2, 'tuning', null), A(a, kw, 3, 'name', 'custom')); },
  names: () => Object.keys(SCALES).map(sym), at: (c, a) => { const n = sname(a[0]); return SCALES[n] ? new Scale(SCALES[n], 12, null, n) : null; },
  directory: () => { LIB.I.post(Object.keys(SCALES).join(', ')); return null; } };
Object.keys(SCALES).forEach(n => { scaleCM[n] = (c, a) => new Scale(SCALES[n], 12, a[0] && a[0].scClass === 'Tuning' ? a[0] : (a[0] instanceof Sym && TUNINGS[a[0].name] ? TUNINGS[a[0].name]() : null), n); });
['chromatic24', 'chromatic19', 'chromatic31', 'chromatic53'].forEach(n => { const k = parseInt(n.slice(9)); scaleCM[n] = () => new Scale(Array.from({ length: k }, (_, i) => i), k, TUNINGS.et(k), n); });
defClass('Scale', 'Object', {
  degrees: r => r.degrees, size: r => r.degrees.length, pitchesPerOctave: r => r.ppo, stepsPerOctave: r => 12, tuning: r => r.tuning, name: r => r.name, semitones: r => r.semis(),
  tuning_: (r, a) => { const t = a[0] instanceof Sym ? (TUNINGS[a[0].name] ? TUNINGS[a[0].name]() : err('Unknown tuning')) : a[0]; return new Scale(r.degrees, t.semis.length, t, r.name); },
  ratios: r => r.semis().map(x => Math.pow(2, x / 12)), cents: r => r.semis().map(x => x * 100),
  at: (r, a) => r.semis()[((num(a[0]) % r.degrees.length) + r.degrees.length) % r.degrees.length], wrapAt: (r, a) => r.semis()[((num(a[0]) % r.degrees.length) + r.degrees.length) % r.degrees.length],
  degreeToFreq: (r, a) => num(a[1] ?? 261.6255653) * Math.pow(2, (degreeToKey(num(a[0]), r) / 12) + num(a[2] ?? 0)),
  degreeToRatio: (r, a) => Math.pow(2, degreeToKey(num(a[0]), r) / 12 + num(a[1] ?? 0)),
  performDegreeToKey: (r, a) => degreeToKey(num(a[0]), r), choose: r => r.semis()[Math.floor(LIB.I.rand() * r.degrees.length)],
  asArray: r => r.semis(),
}, scaleCM);
const tunCM = { new: (c, a, kw) => new Tuning(toArr(A(a, kw, 0, 'tuning')).map(num), num(A(a, kw, 1, 'octaveRatio', 2)), A(a, kw, 2, 'name', 'custom')), et: (c, a) => TUNINGS.et(num(a[0] ?? 12)), names: () => Object.keys(TUNINGS).map(sym) };
Object.keys(TUNINGS).filter(k => k !== 'et').forEach(k => { tunCM[k] = () => TUNINGS[k](); });
defClass('Tuning', 'Object', { semitones: r => r.semis, ratios: r => r.semis.map(x => Math.pow(2, x / 12)), cents: r => r.semis.map(x => x * 100), size: r => r.semis.length, octaveRatio: r => r.octaveRatio, stepsPerOctave: () => 12, name: r => r.name, at: (r, a) => r.semis[num(a[0])] }, tunCM);

// ======================================================================
// Events
// ======================================================================
const isRestV = v => (v && v.scClass === 'Rest') || (v instanceof Sym && ['rest', 'r', ''].includes(v.name));
function evGet(e, k, def) { const v = e.get(k); return v == null ? def : v; }
function eventDelta(e) {
  const dl = e.get('delta'); if (dl != null) return num(dl && dl.scClass === 'Rest' ? dl.dur : dl);
  let d = evGet(e, 'dur', 1); if (d && d.scClass === 'Rest') d = d.dur; if (Array.isArray(d)) d = d[0];
  return num(d) * num(evGet(e, 'stretch', 1));
}
LIB.eventDelta = eventDelta;
function eventFreqs(e) {
  const f = e.get('freq');
  if (f != null) return LIB.binop('*', f, evGet(e, 'harmonic', 1));
  let mn = e.get('midinote');
  if (mn == null) {
    let note = e.get('note');
    if (note == null) {
      const deg = evGet(e, 'degree', 0), scale = evGet(e, 'scale', SCALES.major), mt = evGet(e, 'mtranspose', 0);
      const spo = scale instanceof Scale ? 12 : num(evGet(e, 'stepsPerOctave', 12));
      note = LIB.binop === undefined ? 0 : degreeToKey(LIB.binop('+', deg, mt), scale, spo);
      if (!(scale instanceof Scale) && spo !== 12) { // equal division
        const root = num(evGet(e, 'root', 0)), oct = evGet(e, 'octave', 5);
        mn = LIB.binop('*', LIB.binop('+', LIB.binop('/', LIB.binop('+', note, root), spo), oct), 12);
      }
    }
    if (mn == null) mn = LIB.binop('+', LIB.binop('+', LIB.binop('+', note, evGet(e, 'gtranspose', 0)), evGet(e, 'root', 0)), LIB.binop('*', evGet(e, 'octave', 5), 12));
  }
  return LIB.binop('*', LIB.unop('midicps', LIB.binop('+', mn, evGet(e, 'ctranspose', 0))), evGet(e, 'harmonic', 1));
}
function hasRest(e) { for (const v of e.d.values()) { if (isRestV(v)) return true; if (Array.isArray(v) && v.length && v.every(isRestV)) return true; } return false; }
LIB.playEvent = function (e, time, clock, player) {
  const type = e.get('type'); const tname = type instanceof Sym ? type.name : 'note';
  if (time == null) time = LIB.msgTime() ?? (LIB.host.engine.now() + 0.05);
  const tempo = clock ? clock.tempo : (LIB.I.thread.clock ? LIB.I.thread.clock.tempo : defaultClock.tempo);
  if (tname === 'rest' || hasRest(e)) return;
  if (tname === 'set') {
    const ids = toArr(e.get('id')); const c = {}; e.d.forEach((v, k) => { if (!['type', 'id', 'dur', 'delta', 'args'].includes(k) && (isNum(v) || Array.isArray(v))) c[k] = LIB.ctlVal(v); });
    ids.forEach(id => { const n = id && id.scClass === 'Synth' ? id.id : (id && id.scClass === 'Ndef' ? id.srcId : num(id)); LIB.host.engine.send({ type: 'n_set', id: n, controls: c, time }); });
    return;
  }
  const instr = sname(evGet(e, 'instrument', sym('default')));
  const def = LIB.defs.get(instr);
  if (!def) { err("SynthDef '" + instr + "' not found for the event. Add it first with SynthDef(...).add"); }
  const freq = eventFreqs(e);
  let amp = e.get('amp'); const db = e.get('db'); if (amp == null) amp = db != null ? LIB.unop('dbamp', db) : 0.1;
  const dur = eventDelta(e);
  let sustain = e.get('sustain'); if (sustain == null) sustain = LIB.binop('*', LIB.binop('*', evGet(e, 'dur', 1) && evGet(e, 'dur', 1).scClass === 'Rest' ? 1 : evGet(e, 'dur', 1), evGet(e, 'legato', 0.8)), evGet(e, 'stretch', 1));
  const vals = {};
  for (const c of def.controls) {
    if (c.name === 'freq') vals.freq = freq; else if (c.name === 'amp') vals.amp = amp;
    else if (c.name === 'sustain') vals.sustain = LIB.binop('/', sustain, tempo);
    else if (c.name === 'gate') continue;
    else if (e.has(c.name)) vals[c.name] = e.get(c.name);
  }
  // expansion
  let n = 1; for (const k in vals) if (Array.isArray(vals[k])) n = Math.max(n, vals[k].length);
  const sus = toArr(sustain);
  const strum = num(evGet(e, 'strum', 0)) / tempo;
  const lag = num(evGet(e, 'lag', 0)) + num(evGet(e, 'timingOffset', 0)) / tempo;
  const ids = [];
  for (let i = 0; i < n; i++) {
    const ctl = {}; for (const k in vals) { const v = vals[k]; const x = Array.isArray(v) ? v[i % v.length] : v; if (x != null && !isRestV(x)) ctl[k] = LIB.ctlVal(x); }
    const id = LIB.nextId++; ids.push(id);
    const t = time + lag + strum * i;
    LIB.host.engine.send({ type: 's_new', id, defName: instr, controls: ctl, addAction: e.get('addAction') instanceof Sym ? (e.get('addAction').name === 'addToTail' ? 'tail' : 'head') : 'head', time: t, tag: 'ev' });
    const susSec = num(sus[i % sus.length]) / tempo;
    if (def.hasGate) LIB.host.engine.send({ type: 'n_set', id, controls: { gate: 0 }, time: t + susSec });
    const fr = ctl.freq != null ? ctl.freq : null;
    LIB.host.ui.note && LIB.host.ui.note({ time: t, dur: susSec, freq: fr, amp: ctl.amp != null ? ctl.amp : 0.1, instr, player: player ? player.uid : 0, pan: ctl.pan || 0 });
  }
  e.put('id', ids.length === 1 ? ids[0] : ids);
};

// ======================================================================
// EventStreamPlayer
// ======================================================================
let playerUid = 0;
class ESP {
  constructor(stream, proto) { this.stream = stream; this.proto = proto; this.playing = false; this.token = 0; this.uid = ++playerUid; this.muted = false; }
  printOn() { return 'an EventStreamPlayer'; }
  play(clock, quant) {
    if (this.playing) return this;
    this.clock = clock && clock.scClass === 'TempoClock' ? clock : defaultClock;
    const q = quant == null ? 0 : (Array.isArray(quant) ? num(quant[0]) : num(quant));
    const th = LIB.I.thread;
    if (th.isRoutine && th.clock === this.clock && !q) this.beats = th.beats;
    else this.beats = q > 0 ? this.clock.nextOnGrid(q) : this.clock.secs2beats(LIB.host.engine.now() + 0.06);
    this.playing = true; RUNNING.add(this); const tok = ++this.token;
    Sched.add(this.clock.beats2secs(this.beats), () => this.step(tok));
    LIB.host.ui.routines && LIB.host.ui.routines(RUNNING.size);
    return this;
  }
  nextEvent() { const proto = this.proto ? copyEv(this.proto) : new SCEvent(); return this.stream.next(proto); }
  step(tok) {
    if (!this.playing || tok !== this.token) return;
    const time = this.clock.beats2secs(this.beats);
    const prev = LIB.I.thread; LIB.I.thread = { isRoutine: true, time, beats: this.beats, clock: this.clock };
    let ev;
    try { if (this.onStep) this.onStep(); ev = this.nextEvent(); }
    catch (e) { LIB.I.thread = prev; this.stop(); LIB.host.ui.error(e); return; }
    if (ev == null) { LIB.I.thread = prev; this.stop(); return; }
    if (!(ev instanceof SCEvent)) { LIB.I.thread = prev; this.stop(); LIB.host.ui.error(new L.SCError('The pattern did not return an Event. Use Pbind to make events.')); return; }
    try { if (!this.muted) LIB.playEvent(ev, time, this.clock, this); }
    catch (e) { LIB.I.thread = prev; this.stop(); LIB.host.ui.error(e); return; }
    LIB.I.thread = prev;
    const d = eventDelta(ev);
    if (!(d >= 0)) { this.stop(); return; }
    this.beats += Math.max(d, 0.0001);
    Sched.add(this.clock.beats2secs(this.beats), () => this.step(tok));
  }
  stop() { this.playing = false; this.token++; RUNNING.delete(this); LIB.host.ui.routines && LIB.host.ui.routines(RUNNING.size); return this; }
}
ESP.prototype.scClass = 'EventStreamPlayer';
function playPattern(p, clock, quant) {
  LIB.host.engine.boot();
  const s = p && p.isStream ? p : streamOf(p);
  return new ESP(s).play(clock, quant);
}
LIB.playPattern = playPattern;
defClass('EventStreamPlayer', 'Stream', { stop: r => r.stop(), play: (r, a) => r.play(a[0], a[2]), pause: r => r.stop(), resume: (r, a) => r.play(a[0]), isPlaying: r => r.playing, reset: r => { r.stream.reset(); return r; }, mute: r => { r.muted = true; return r; }, unmute: r => { r.muted = false; return r; }, printOn: null });

// ======================================================================
// Pdef / Pdefn
// ======================================================================
const PDEFS = new Map();
function getPdef(name) { let d = PDEFS.get(name); if (!d) { d = new Pattern('Pdef'); d.name = name; d.source = null; d.version = 0; d.players = new Set(); d.quant = 1; d.embed = function* (inval) { if (!this.source) return inval; return yield* embedItem(this.source, inval); }; d.printOn = () => 'Pdef(\'' + name + '\')'; d.isPdef = true; d.scClass = 'Pdef'; PDEFS.set(name, d); } return d; }
defClass('Pdef', 'Pattern', {
  play(r, a, kw) {
    if (r.player && r.player.playing) return r.player;
    const pl = new ESP(streamOf(r.source || Pseq([], 1)));
    pl.pdef = r; pl.version = r.version;
    pl.onStep = function () { if (this.version !== r.version) { this.version = r.version; this.stream = streamOf(r.source); } };
    r.player = pl; return pl.play(A(a, kw, 0, 'clock'), A(a, kw, 2, 'quant', r.quant));
  },
  stop(r) { if (r.player) r.player.stop(); return r; }, isPlaying: r => !!(r.player && r.player.playing), source: r => r.source,
  quant_: (r, a) => { r.quant = a[0]; return r; }, quant: r => r.quant, clear(r) { if (r.player) r.player.stop(); r.source = null; return r; },
  fadeTime_: r => r, pause(r) { if (r.player) r.player.stop(); return r; }, resume(r) { if (r.player) r.player.play(); return r; },
}, {
  new(c, a) { const d = getPdef(sname(a[0])); if (a.length > 1) { d.source = a[1]; d.version++; } return d; },
  removeAll: c => { PDEFS.forEach(d => d.player && d.player.stop()); PDEFS.clear(); return c; },
  all: () => [...PDEFS.values()],
});
const PDEFNS = new Map();
defClass('Pdefn', 'Pattern', { source: r => r.source }, {
  new(c, a) { const n = sname(a[0]); let d = PDEFNS.get(n); if (!d) { d = new Pattern('Pdefn'); d.source = 0; d.embed = function* (inval) { const s = streamOf(this.source); for (;;) { const v = s.next(inval); if (v == null) return inval; inval = yield v; } }; d.printOn = () => 'Pdefn(\'' + n + '\')'; d.scClass = 'Pdefn'; PDEFNS.set(n, d); } if (a.length > 1) d.source = a[1]; return d; },
});

// ======================================================================
// Ndef & ProxySpace
// ======================================================================
const NDEFS = new Map();
let ndefDefault = { fadeTime: 0.02 };
class NdefObj {
  constructor(name) { this.name = name; this.bus = null; this.numChannels = 0; this.src = null; this.srcId = null; this.srcPlayer = null; this.monId = null; this.fadeTime = ndefDefault.fadeTime; this.vol = 1; this.nodeMap = {}; this.ver = 0; this.monOut = 0; }
  printOn() { return 'Ndef(\'' + this.name + '\')'; }
  ensureBus(n) {
    n = Math.max(1, n || 2);
    if (this.bus == null || n > this.numChannels) { this.bus = LIB.busNext; LIB.busNext += n; if (LIB.busNext > 240) LIB.busNext = 4; const wasPlaying = this.monId != null; this.numChannels = n; if (wasPlaying) { this.stopMon(0.01); this.play(); } }
  }
  ar(n) { if (this.bus == null) this.ensureBus(n || 2); const k = n ? num(n) : this.numChannels; const r = LIB.makeUGen('In', 'ar', [this.bus], k, null); return r; }
  kr(n) { if (this.bus == null) this.ensureBus(n || 1); return LIB.makeUGen('In', 'ar', [this.bus], n ? num(n) : this.numChannels, null); }
  setSource(src) {
    LIB.host.engine.boot();
    const old = this.srcId, oldP = this.srcPlayer, ft = this.fadeTime;
    this.src = src; this.ver++;
    if (src == null) { this.srcId = null; }
    else if (src instanceof SCFunction || typeof src === 'function' || isNum(src) || src && src.scClass === 'UGen' || Array.isArray(src)) {
      const fn = src instanceof SCFunction ? src : (() => src);
      const def = LIB.compileDef('Ndef_' + this.name + '_' + this.ver, fn, { wrapOut: true, busControl: '__out', outbus: 0, src: src instanceof SCFunction ? src.node : null });
      this.ensureBus(def.numCh);
      LIB.sendDef(def);
      const c = Object.assign({}, this.nodeMap, { __out: this.bus });
      const id = LIB.nextId++; this.srcId = id; this.srcPlayer = null;
      const s = new LIB.LSynth(id, def.name, def); s.tag = 'ndef'; LIB.synths.set(id, s);
      LIB.host.engine.send({ type: 's_new', id, defName: def.name, controls: c, addAction: 'head', fadeIn: ft, tag: 'Ndef(' + this.name + ')', time: LIB.msgTime() });
      LIB.host.ui.synthStarted && LIB.host.ui.synthStarted(s, def);
      LIB.defs.delete(def.name);
    } else if (src && src.isPattern) {
      this.ensureBus(2); this.srcId = null;
      const self = this; const pr = new SCEvent(); pr.put('out', this.bus);
      const pl = new ESP(streamOf(src), pr); this.srcPlayer = pl; pl.play(defaultClock, 1);
    } else err('Ndef source must be a function, a pattern or a number');
    if (old != null) LIB.host.engine.send({ type: 'n_fade', id: old, fadeTime: ft, free: true, time: LIB.msgTime() });
    if (oldP) oldP.stop();
  }
  play(out, numCh, vol, fadeTime) {
    LIB.host.engine.boot();
    if (this.bus == null) this.ensureBus(2);
    if (this.monId != null) return this;
    if (out != null) this.monOut = num(out); if (vol != null) this.vol = num(vol);
    const n = this.numChannels; const self = this;
    const def = LIB.compileDef('NdefMon_' + this.name + '_' + n, () => LIB.binop('*', LIB.makeUGen('In', 'ar', [self.bus], n, null), LIB.namedControl('vol', 'kr', self.vol, 0.05)), { wrapOut: true, outbus: this.monOut });
    LIB.sendDef(def);
    const id = LIB.nextId++; this.monId = id;
    LIB.host.engine.send({ type: 's_new', id, defName: def.name, controls: { vol: this.vol }, addAction: 'tail', fadeIn: fadeTime == null ? this.fadeTime : num(fadeTime), tag: 'monitor', time: LIB.msgTime() });
    LIB.defs.delete(def.name);
    LIB.host.ui.ndefs && LIB.host.ui.ndefs();
    return this;
  }
  stopMon(ft) { if (this.monId != null) { LIB.host.engine.send({ type: 'n_fade', id: this.monId, fadeTime: ft == null ? this.fadeTime : ft, free: true, time: LIB.msgTime() }); this.monId = null; } LIB.host.ui.ndefs && LIB.host.ui.ndefs(); }
  clear(ft) { this.stopMon(ft); if (this.srcId != null) LIB.host.engine.send({ type: 'n_fade', id: this.srcId, fadeTime: ft == null ? this.fadeTime : ft, free: true }); if (this.srcPlayer) this.srcPlayer.stop(); this.srcId = null; this.srcPlayer = null; this.src = null; NDEFS.delete(this.name); LIB.host.ui.ndefs && LIB.host.ui.ndefs(); }
}
NdefObj.prototype.scClass = 'Ndef';
LIB.NDEFS = NDEFS;
function getNdef(name) { let d = NDEFS.get(name); if (!d) { d = new NdefObj(name); NDEFS.set(name, d); } return d; }
const ndefIM = {
  play(r, a, kw) { return r.play(A(a, kw, 0, 'out'), A(a, kw, 1, 'numChannels'), A(a, kw, 4, 'vol'), A(a, kw, 3, 'fadeTime')); },
  playN(r, a) { return r.play(); },
  stop(r, a) { r.stopMon(a[0] == null ? null : num(a[0])); return r; }, end(r, a) { r.clear(a[0] == null ? null : num(a[0])); return r; },
  clear(r, a) { r.clear(a[0] == null ? null : num(a[0])); return r; }, free(r, a) { r.clear(a[0] == null ? null : num(a[0])); return r; }, release(r, a) { r.stopMon(a[0] == null ? null : num(a[0])); return r; },
  fadeTime: r => r.fadeTime, fadeTime_(r, a) { r.fadeTime = num(a[0]); return r; },
  vol: r => r.vol, vol_(r, a) { r.vol = num(a[0]); if (r.monId != null) LIB.host.engine.send({ type: 'n_set', id: r.monId, controls: { vol: r.vol } }); return r; },
  set(r, a) { const c = LIB.argsToControls(a); Object.assign(r.nodeMap, c); if (r.srcId != null) LIB.host.engine.send({ type: 'n_set', id: r.srcId, controls: c, time: LIB.msgTime() }); return r; },
  xset(r, a) { return ndefIM.set(r, a); },
  unset(r, a) { a.forEach(k => delete r.nodeMap[sname(k)]); return r; },
  source: r => r.src, source_(r, a) { r.setSource(a[0]); return r; }, prime(r, a) { r.setSource(a[0]); return r; },
  isPlaying: r => r.monId != null, isMonitoring: r => r.monId != null, numChannels: r => r.numChannels, bus: r => ({ scClass: 'Bus', index: r.bus, numChannels: r.numChannels, rate: 'audio', vals: [] }), index: r => r.bus,
  ar: (r, a) => r.ar(a[0]), kr: (r, a) => r.kr(a[0]),
  scope(r) { LIB.host.ui.show('scope'); return r; }, gui(r) { LIB.I.post(LIB.host.t('err_gui')); return r; }, edit(r) { LIB.I.post(LIB.host.t('err_gui')); return r; },
  quant_: r => r, quant: () => null, key: r => sym(r.name), monitor: r => r, pause: r => { r.stopMon(0.05); return r; }, resume: r => r.play(),
  printOn: null,
};
['+', '-', '*', '/'].forEach(op => { ndefIM[op] = (r, a) => LIB.binop(op, r.ar(), a[0]); });
defClass('NodeProxy', 'Object', ndefIM);
defClass('Ndef', 'NodeProxy', {}, {
  new(c, a, kw) { const nm = sname(a[0]); const d = getNdef(nm); if (a.length > 1) d.setSource(a[1]); return d; },
  ar(c, a) { return getNdef(sname(a[0])).ar(a[1]); }, kr(c, a) { return getNdef(sname(a[0])).kr(a[1]); },
  clear(c, a) { [...NDEFS.values()].forEach(d => d.clear(a[0] == null ? null : num(a[0]))); return c; },
  all: () => [...NDEFS.values()], defaultFadeTime_: (c, a) => { ndefDefault.fadeTime = num(a[0]); return c; },
});
// ProxySpace: ~x = { ... } defines Ndef(\x)
const proxySpaceObj = {
  scClass: 'ProxySpace', fadeTime: 0.02, printOn: () => 'ProxySpace ( )',
  get(name) { const d = getNdef(name); return d; },
  put(name, v) { const d = getNdef(name); if (d.fadeTime === ndefDefault.fadeTime) d.fadeTime = proxySpaceObj.fadeTime; if (v == null) d.clear(); else d.setSource(v); },
};
defClass('ProxySpace', 'Object', {
  fadeTime_: (r, a) => { r.fadeTime = num(a[0]); ndefDefault.fadeTime = r.fadeTime; NDEFS.forEach(d => d.fadeTime = r.fadeTime); return r; }, fadeTime: r => r.fadeTime,
  pop(r) { LIB.I.proxySpace = null; return r; }, push(r) { LIB.I.proxySpace = r; return r; }, clear(r, a) { [...NDEFS.values()].forEach(d => d.clear(a[0] == null ? null : num(a[0]))); return r; },
  play: r => r, quant_: r => r, makeTempoClock: r => r, clock: () => defaultClock,
}, { push: () => { LIB.I.proxySpace = proxySpaceObj; LIB.I.post('ProxySpace pushed: ~name = { ... } now creates a NodeProxy (same as Ndef)'); return proxySpaceObj; }, new: () => proxySpaceObj, pop: c => { LIB.I.proxySpace = null; return c; } });

// ======================================================================
// MIDI (Web MIDI + on-screen keyboard)
// ======================================================================
const MIDIDEFS = new Map(); let anonMidi = 0; let midiAccess = null;
function midiDispatch(type, num_, val, chan = 0) {
  const prevT = LIB.I.thread;
  MIDIDEFS.forEach(d => {
    if (!d.enabled || d.type !== type) return;
    if (d.num != null && !toArr(d.num).map(x => +x).includes(num_)) return;
    if (d.chan != null && +d.chan !== chan) return;
    try { LIB.I.thread = { isRoutine: false, time: null }; LIB.I.callSync(d.fn, [val, num_, chan, 0]); } catch (e) { LIB.host.ui.error(e); } finally { LIB.I.thread = prevT; }
  });
}
LIB.midiDispatch = midiDispatch;
LIB.midiCount = () => MIDIDEFS.size;
function onMidiMsg(e) {
  const [st, d1, d2] = e.data; const cmd = st & 0xf0, ch = st & 0x0f;
  if (cmd === 0x90 && d2 > 0) midiDispatch('noteOn', d1, d2, ch);
  else if (cmd === 0x80 || (cmd === 0x90 && d2 === 0)) midiDispatch('noteOff', d1, d2, ch);
  else if (cmd === 0xB0) midiDispatch('cc', d1, d2, ch);
  else if (cmd === 0xE0) midiDispatch('bend', 0, (d2 << 7) | d1, ch);
  LIB.host.ui.midiActivity && LIB.host.ui.midiActivity(cmd, d1, d2);
}
function midiInit(connect) {
  if (!navigator.requestMIDIAccess) { LIB.I.post(LIB.host.t('midi_none')); return; }
  navigator.requestMIDIAccess().then(acc => {
    midiAccess = acc; const ins = [...acc.inputs.values()];
    LIB.I.post('MIDI Sources: ' + (ins.length ? ins.map(i => i.name).join(', ') : '(none)'));
    if (connect) ins.forEach(i => i.onmidimessage = onMidiMsg);
    acc.onstatechange = () => { if (connect) [...acc.inputs.values()].forEach(i => i.onmidimessage = onMidiMsg); };
  }).catch(() => LIB.I.post(LIB.host.t('midi_denied')));
}
defClass('MIDIClient', 'Object', {}, { init: c => { midiInit(false); return c; }, sources: () => midiAccess ? [...midiAccess.inputs.values()].map(i => i.name) : [] });
defClass('MIDIIn', 'Object', {}, { connectAll: c => { midiInit(true); return c; }, connect: c => { midiInit(true); return c; } });
const midiDefIM = { free(r) { MIDIDEFS.delete(r.key); return r; }, enable(r) { r.enabled = true; return r; }, disable(r) { r.enabled = false; return r; }, printOn: null };
const mkMidiDef = (type) => (c, a, kw) => {
  const key = sname(A(a, kw, 0, 'key')); const fn = A(a, kw, 1, 'func');
  if (fn == null) return MIDIDEFS.get(key) || null;
  const d = { scClass: 'MIDIdef', key, type, fn, num: A(a, kw, 2, type === 'cc' ? 'ccNum' : 'noteNum', null), chan: A(a, kw, 3, 'chan', null), enabled: true, printOn: () => 'MIDIdef(\'' + key + '\')' };
  MIDIDEFS.set(key, d); LIB.host.ui.midiDefs && LIB.host.ui.midiDefs(); return d;
};
defClass('MIDIdef', 'Object', midiDefIM, { noteOn: mkMidiDef('noteOn'), noteOff: mkMidiDef('noteOff'), cc: mkMidiDef('cc'), bend: mkMidiDef('bend'), freeAll: c => { MIDIDEFS.clear(); return c; }, new: (c, a) => MIDIDEFS.get(sname(a[0])) || null });
const mkMidiFunc = (type) => (c, a, kw) => { const key = '__mf' + (++anonMidi); return mkMidiDef(type)(c, [sym(key), A(a, kw, 0, 'func'), A(a, kw, 1, 'noteNum', null), A(a, kw, 2, 'chan', null)], []); };
defClass('MIDIFunc', 'Object', midiDefIM, { noteOn: mkMidiFunc('noteOn'), noteOff: mkMidiFunc('noteOff'), cc: mkMidiFunc('cc') });

// ======================================================================
// Stop everything (Cmd-period)
// ======================================================================
LIB.stopAll = function () {
  [...RUNNING].forEach(r => r.stop());
  Sched.clear();
  PDEFS.forEach(d => { if (d.player) d.player.stop(); });
  NDEFS.forEach(d => { d.monId = null; d.srcId = null; if (d.srcPlayer) d.srcPlayer.stop(); });
  LIB.host.engine.send({ type: 'freeAll' });
  LIB.host.ui.ndefs && LIB.host.ui.ndefs();
};
LIB.running = () => RUNNING.size;

// prelude: SC's default instrument
LIB.PRELUDE = `SynthDef(\\default, { |out = 0, freq = 440, amp = 0.1, pan = 0, gate = 1|
  var z = LPF.ar(Mix.new(VarSaw.ar(freq + [0, Rand(-0.4, 0.0), Rand(0.0, 0.4)], 0, 0.3, 0.3)), XLine.kr(Rand(4000, 5000), Rand(2500, 3200), 1)) * Linen.kr(gate, 0.01, 0.7, 0.3, 2);
  OffsetOut.ar(out, Pan2.ar(z, pan, amp));
}).add;`;
})(typeof globalThis !== 'undefined' ? globalThis : this);
