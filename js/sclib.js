/* SuperCollider Lab · U-MA
 * sclib.js — class library: core types, math, UGens, Env, SynthDef, Synth, Server, Bus.
 * patterns.js adds clocks, routines, patterns, events, scales, Ndef and MIDI.
 */
(function (G) {
'use strict';
const L = G.SCLang;
const { defClass, CLASSES, Sym, sym, Char, Ref, Assoc, SCFunction, ClassRef, SCEvent, A, fl, isNum, isFloat, num, SCError } = L;
const D = G.SCDSP;

const LIB = { host: null, I: null, nextId: 1000, defs: new Map(), synths: new Map(), busNext: 4, ctlBusNext: 0 };
G.SCLib = LIB;

const err = m => { throw new SCError(m); };
const isSym = (x, n) => x instanceof Sym && (n === undefined || x.name === n);
const sname = x => x instanceof Sym ? x.name : (typeof x === 'string' ? x : String(x));
const toArr = x => Array.isArray(x) ? x : [x];
LIB.util = { err, isSym, sname, toArr };

// ======================================================================
// UGen graph objects
// ======================================================================
let nodeCounter = 0;
class UGenNode {
  constructor(name, rate, inputs, nout, params) { this.name = name; this.rate = rate; this.inputs = inputs; this.nout = nout; this.params = params || {}; this.id = ++nodeCounter; }
}
class OutRef {
  constructor(node, index) { this.node = node; this.index = index; }
  ugenName() { return this.node.nout > 1 ? 'OutputProxy' : (this.node.name === 'BinaryOpUGen' || this.node.name === 'UnaryOpUGen' ? this.node.name : this.node.name); }
}
OutRef.prototype.scClass = 'UGen';
LIB.OutRef = OutRef; LIB.UGenNode = UGenNode;
const isUG = x => x instanceof OutRef;
const RATES = { ar: 2, kr: 1, ir: 0, dr: 0 };
const maxRate = (...xs) => { let r = 'ir'; for (const x of xs) if (isUG(x) && RATES[x.node.rate] > RATES[r]) r = x.node.rate; return r; };

// Unipolar UGens (used by .range)
const UNIPOLAR = new Set(['LFPulse', 'Impulse', 'Dust', 'Trig', 'Trig1', 'Sweep', 'Phasor', 'ToggleFF', 'Logistic', 'Crackle', 'Line', 'XLine', 'EnvGen', 'Linen', 'Amplitude', 'Decay', 'Decay2', 'Latch', 'TRand', 'PulseCount', 'Stepper', 'MouseX', 'MouseY']);

function sigInput(v, where) {
  if (isNum(v)) return num(v);
  if (isUG(v)) { if (v.node.nout === 0) err(where + ': ' + v.node.name + ' has no outputs to use as input'); return v; }
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (v && v.scClass === 'Bus') return v.index;
  if (v instanceof Sym) {
    const m = { exponential: 1, exp: 1, linear: 0, lin: 0 }; if (v.name in m) return m[v.name];
    err(where + ": a Symbol (\\" + v.name + ") can't be a signal input");
  }
  if (v == null) err(where + ' is nil. Check for a typo or a missing argument.');
  if (v && v.scClass === 'Ndef') return v.ar();
  if (v instanceof Ref) return sigInput(v.value, where);
  err(where + ': ' + LIB.I.str(v) + " can't be used as a UGen input");
}

// Create a UGen with multichannel expansion. inputs: array (values may be arrays → expansion)
function makeUGen(name, rate, inputs, nout, params, opts = {}) {
  const noExp = opts.noExpand || [];
  let n = 0;
  inputs.forEach((x, i) => { if (Array.isArray(x) && !noExp.includes(i)) n = Math.max(n, x.length); });
  if (n > 0) {
    const out = [];
    for (let k = 0; k < n; k++) out.push(makeUGen(name, rate, inputs.map((x, i) => (Array.isArray(x) && !noExp.includes(i)) ? (x.length ? x[k % x.length] : 0) : x), nout, params, opts));
    return out;
  }
  const argNames = opts.argNames || [];
  const flat = [];
  inputs.forEach((x, i) => {
    if (Array.isArray(x)) x.forEach((y, j) => flat.push(sigInput(y, name + ' input ' + (argNames[i] || i) + '[' + j + ']')));
    else flat.push(sigInput(x, name + " input '" + (argNames[i] || i) + "'"));
  });
  const node = new UGenNode(name, rate, flat, nout, params);
  const B = LIB.I && LIB.I.builder;
  if (B) { B.all.push(node); if (opts.side) B.side.push(node); }
  LIB.ugensMade = (LIB.ugensMade || 0) + 1;
  if (nout === 1) return new OutRef(node, 0);
  if (nout === 0) return new OutRef(node, 0);
  return Array.from({ length: nout }, (_, i) => new OutRef(node, i));
}
LIB.makeUGen = makeUGen;

// ======================================================================
// Math dispatch
// ======================================================================
const BINOPS = ['+', '-', '*', '/', '**', '%', '<', '>', '<=', '>=', 'min', 'max', 'pow', 'mod', 'div', 'hypot', 'atan2', 'round', 'trunc', 'roundUp', 'clip2', 'fold2', 'wrap2', 'excess', 'ring1', 'ring2', 'ring3', 'ring4', 'absdif', 'sqrsum', 'sqrdif', 'sumsqr', 'difsqr', 'amclip', 'scaleneg', 'thresh', 'bitAnd', 'bitOr', 'bitXor', '&', '|', '>>', '<<', 'gcd', 'lcm', 'rrand', 'exprand'];
const UNOPS = Object.keys(D.UN).concat(['asInteger', 'asInt', 'asFloat', 'rand', 'rand2', 'linrand', 'bilinrand', 'sum3rand', 'coin', 'even', 'odd', 'isPrime', 'nextPrime', 'factorial', 'isPowerOfTwo', 'nextPowerOfTwo', 'round0', 'xrand']);
const CMP = new Set(['<', '>', '<=', '>=']);

function numBin(op, a, b) {
  const x = num(a), y = num(b), F = isFloat(a) || isFloat(b);
  const ret = v => (F && Number.isInteger(v) && Number.isFinite(v)) ? fl(v) : v;
  switch (op) {
    case '+': return ret(x + y); case '-': return ret(x - y); case '*': return ret(x * y);
    case '/': return y === 0 ? (x === 0 ? NaN : x > 0 ? Infinity : -Infinity) : ret(x / y);
    case '**': case 'pow': return ret(Math.pow(x, y));
    case '%': case 'mod': return y === 0 ? 0 : ret(x - y * Math.floor(x / y));
    case 'div': return y === 0 ? 0 : Math.floor(x / y);
    case '<': return x < y; case '>': return x > y; case '<=': return x <= y; case '>=': return x >= y;
    case 'min': return ret(Math.min(x, y)); case 'max': return ret(Math.max(x, y));
    case 'round': return y === 0 ? a : ret(Math.round(x / y) * y);
    case 'roundUp': return y === 0 ? a : ret(Math.ceil(x / y) * y);
    case 'trunc': return y === 0 ? a : ret(Math.trunc(x / y) * y);
    case 'rrand': { const lo = Math.min(x, y), hi = Math.max(x, y); if (!F) return Math.floor(lo + LIB.I.rand() * (hi - lo + 1)); return lo + LIB.I.rand() * (hi - lo); }
    case 'exprand': { const lo = x || 1e-6, hi = y || 1e-6; return lo * Math.pow(hi / lo, LIB.I.rand()); }
  }
  const f = D.BIN[op]; if (!f) err('Unknown operator ' + op);
  return ret(f(x, y));
}
function numUn(op, a) {
  const x = num(a), F = isFloat(a), R = LIB.I.rand;
  switch (op) {
    case 'asInteger': case 'asInt': return Math.trunc(x);
    case 'asFloat': return fl(x);
    case 'rand': return F ? R() * x : Math.floor(R() * x);
    case 'rand2': return F ? (R() * 2 - 1) * x : Math.round((R() * 2 - 1) * x);
    case 'xrand': return Math.floor(R() * x);
    case 'linrand': return Math.min(R(), R()) * x;
    case 'bilinrand': return (R() - R()) * x;
    case 'sum3rand': return (R() + R() + R() - 1.5) * 2 / 3 * x;
    case 'coin': return R() < x;
    case 'even': return Math.abs(x) % 2 === 0; case 'odd': return Math.abs(x) % 2 === 1;
    case 'isPrime': { if (x < 2 || !Number.isInteger(x)) return false; for (let i = 2; i * i <= x; i++) if (x % i === 0) return false; return true; }
    case 'nextPrime': { let n = Math.max(2, Math.ceil(x)); for (;; n++) if (numUn('isPrime', n)) return n; }
    case 'factorial': { let r = 1; for (let i = 2; i <= x; i++) r *= i; return r; }
    case 'isPowerOfTwo': return x > 0 && (x & (x - 1)) === 0;
    case 'nextPowerOfTwo': return Math.pow(2, Math.ceil(Math.log2(Math.max(x, 1))));
    case 'floor': case 'ceil': return F ? fl(D.UN[op](x)) : D.UN[op](x);
    case 'neg': case 'abs': case 'squared': case 'cubed': { const v = D.UN[op](x); return F && Number.isInteger(v) ? fl(v) : v; }
    case 'sign': return Math.sign(x);
    case 'not': return !a;
  }
  const f = D.UN[op]; if (!f) err('Unknown unary operator ' + op);
  return f(x);
}
const isPat = x => x && x.isPattern;
LIB.isPat = isPat;

function binop(op, a, b) {
  if (Array.isArray(a) || Array.isArray(b)) {
    const aa = toArr(a), bb = toArr(b); const n = Math.max(aa.length, bb.length);
    if (aa.length === 0 || bb.length === 0) return [];
    return Array.from({ length: n }, (_, i) => binop(op, aa[i % aa.length], bb[i % bb.length]));
  }
  if (isPat(a) || isPat(b)) return LIB.Pbinop(op, a, b);
  if (isUG(a) || isUG(b)) {
    const x = sigInput(a, 'operator ' + op), y = sigInput(b, 'operator ' + op);
    if (op === '*') { if (x === 1) return y; if (y === 1) return x; if (x === 0 || y === 0) return 0; }
    if (op === '+') { if (x === 0) return y; if (y === 0) return x; }
    if (op === '-' && y === 0) return x;
    if (op === '/' && y === 1) return x;
    if (op === 'rrand' || op === 'exprand') err('Use Rand or ExpRand inside a SynthDef instead of rrand/exprand with UGens');
    return makeUGen('BinaryOpUGen', maxRate(x, y), [x, y], 1, { op: op === 'pow' ? '**' : op === 'mod' ? '%' : op });
  }
  if (a && a.scClass === 'Ndef') return binop(op, a.ar(), b);
  if (b && b.scClass === 'Ndef') return binop(op, a, b.ar());
  if (isNum(a) && isNum(b)) return numBin(op, a, b);
  if (typeof a === 'string' && op === '+') return a + ' ' + LIB.I.str(b);
  if ((typeof a === 'string') && (op === '<' || op === '>')) return op === '<' ? a < String(b) : a > String(b);
  if (a == null || b == null) err("Operator '" + op + "' with nil. Check that every variable has a value.");
  err("Operator '" + op + "' not understood by " + LIB.I.str(a));
}
function unop(op, a) {
  if (Array.isArray(a)) return a.map(x => unop(op, x));
  if (isPat(a)) return LIB.Punop(op, a);
  if (isUG(a)) {
    if (op === 'asInteger' || op === 'asInt') op = 'floor';
    if (['rand', 'rand2', 'coin', 'linrand', 'bilinrand', 'sum3rand', 'xrand'].includes(op)) err('.' + op + ' runs once in the language. Inside a SynthDef use Rand, TRand or LFNoise0.');
    if (op === 'bipolar') return a;
    if (op === 'unipolar') return binop('+', binop('*', a, 0.5), 0.5);
    return makeUGen('UnaryOpUGen', a.node.rate, [a], 1, { op });
  }
  if (a && a.scClass === 'Ndef') return unop(op, a.ar());
  if (isNum(a)) return numUn(op, a);
  if (a == null) err("Message '" + op + "' sent to nil.");
  LIB.I.dnu(a, op);
}
LIB.binop = binop; LIB.unop = unop;

// value equality
function eq(a, b) {
  if (a === b) return true;
  if (isNum(a) && isNum(b)) return num(a) === num(b);
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => eq(x, b[i]));
  if (a instanceof Char && b instanceof Char) return a.c === b.c;
  if (a instanceof SCEvent && b instanceof SCEvent) { if (a.d.size !== b.d.size) return false; for (const [k, v] of a.d) if (!eq(v, b.get(k))) return false; return true; }
  return false;
}
LIB.eq = eq;

// ======================================================================
// Objects: shared methods
// ======================================================================
const mathIM = {};
const BINDEF = { round: 1, trunc: 1, roundUp: 1, clip2: 1, fold2: 1, wrap2: 1, rrand: 0, exprand: 1 };
BINOPS.forEach(op => { mathIM[op] = function (r, args) { return binop(op, r, args[0] === undefined && op in BINDEF ? BINDEF[op] : args[0]); }; });
UNOPS.forEach(op => { mathIM[op] = function (r) { return unop(op, r); }; });
// multi-arg math
Object.assign(mathIM, {
  clip(r, a, kw) { const lo = A(a, kw, 0, 'lo', 0), hi = A(a, kw, 1, 'hi', 1); return isUG(r) || isUG(lo) || isUG(hi) || Array.isArray(r) ? clipLike('Clip', r, lo, hi) : Math.min(Math.max(num(r), num(lo)), num(hi)); },
  fold(r, a, kw) { const lo = A(a, kw, 0, 'lo', 0), hi = A(a, kw, 1, 'hi', 1); if (isUG(r) || Array.isArray(r)) return clipLike('Fold', r, lo, hi); const x = num(r), l = num(lo), h = num(hi), w = h - l; if (w <= 0) return l; let v = (x - l) % (2 * w); if (v < 0) v += 2 * w; return l + (v > w ? 2 * w - v : v); },
  wrap(r, a, kw) { const lo = A(a, kw, 0, 'lo', 0), hi = A(a, kw, 1, 'hi', 1); if (isUG(r) || Array.isArray(r)) return clipLike('Wrap', r, lo, hi); const x = num(r), l = num(lo), h = num(hi), w = h - l; if (w <= 0) return l; let v = (x - l) % w; if (v < 0) v += w; return isFloat(r) ? l + v : l + v; },
  linlin(r, a, kw) { const [a1, a2, b1, b2] = [0, 1, 2, 3].map(i => A(a, kw, i, ['inMin', 'inMax', 'outMin', 'outMax'][i], [0, 1, 0, 1][i])); const clip = A(a, kw, 4, 'clip', sym('minmax'));
    if (!isUG(r) && !Array.isArray(r) && !isPat(r) && isNum(r)) { let x = num(r); if (clip) { if (x <= num(a1)) return b1; if (x >= num(a2)) return b2; } return num(b1) + (x - num(a1)) / (num(a2) - num(a1)) * (num(b2) - num(b1)); }
    return binop('+', binop('*', binop('/', binop('-', r, a1), binop('-', a2, a1)), binop('-', b2, b1)), b1); },
  linexp(r, a, kw) { const [a1, a2, b1, b2] = [0, 1, 2, 3].map(i => A(a, kw, i, ['inMin', 'inMax', 'outMin', 'outMax'][i], [0, 1, 0.001, 1][i]));
    if (!isUG(r) && !Array.isArray(r) && !isPat(r) && isNum(r)) { let x = num(r); if (x <= num(a1)) return b1; if (x >= num(a2)) return b2; return num(b1) * Math.pow(num(b2) / num(b1), (x - num(a1)) / (num(a2) - num(a1))); }
    return binop('*', binop('**', binop('/', b2, b1), binop('/', binop('-', r, a1), binop('-', a2, a1))), b1); },
  explin(r, a, kw) { const [a1, a2, b1, b2] = [0, 1, 2, 3].map(i => A(a, kw, i, ['inMin', 'inMax', 'outMin', 'outMax'][i], [0.001, 1, 0, 1][i]));
    if (isNum(r)) { let x = num(r); if (x <= num(a1)) return b1; if (x >= num(a2)) return b2; return num(b1) + Math.log(x / num(a1)) / Math.log(num(a2) / num(a1)) * (num(b2) - num(b1)); }
    return binop('+', binop('*', binop('/', unop('log', binop('/', r, a1)), Math.log(num(a2) / num(a1))), binop('-', b2, b1)), b1); },
  expexp(r, a, kw) { const [a1, a2, b1, b2] = [0, 1, 2, 3].map(i => A(a, kw, i, '', [0.001, 1, 0.001, 1][i])); const x = num(r); return num(b1) * Math.pow(num(b2) / num(b1), Math.log(x / num(a1)) / Math.log(num(a2) / num(a1))); },
  lincurve(r, a, kw) { const [a1, a2, b1, b2, c] = [0, 1, 2, 3, 4].map(i => A(a, kw, i, ['inMin', 'inMax', 'outMin', 'outMax', 'curve'][i], [0, 1, 0, 1, -4][i]));
    const x = Math.min(Math.max((num(r) - num(a1)) / (num(a2) - num(a1)), 0), 1), cv = num(c); if (Math.abs(cv) < 0.001) return num(b1) + x * (num(b2) - num(b1)); return num(b1) + (num(b2) - num(b1)) * (1 - Math.exp(cv * x)) / (1 - Math.exp(cv)); },
  range(r, a, kw) { const lo = A(a, kw, 0, 'lo', 0), hi = A(a, kw, 1, 'hi', 1);
    if (Array.isArray(r)) return r.map(x => mathIM.range(x, [lo, hi]));
    if (!isUG(r)) err('.range is for UGens (signals). For numbers use linlin.');
    if (UNIPOLAR.has(r.node.name)) return binop('+', binop('*', r, binop('-', hi, lo)), lo);
    const mul = binop('*', binop('-', hi, lo), 0.5); return binop('+', binop('*', r, mul), binop('+', mul, lo)); },
  exprange(r, a, kw) { const lo = A(a, kw, 0, 'lo', 0.01), hi = A(a, kw, 1, 'hi', 1);
    if (Array.isArray(r)) return r.map(x => mathIM.exprange(x, [lo, hi]));
    if (!isUG(r)) err('.exprange is for UGens (signals).');
    const u = UNIPOLAR.has(r.node.name) ? r : binop('+', binop('*', r, 0.5), 0.5);
    return binop('*', binop('**', binop('/', hi, lo), u), lo); },
  unipolar(r, a, kw) { const m = A(a, kw, 0, 'mul', 1); if (isUG(r) && UNIPOLAR.has(r.node.name)) return binop('*', r, m); return binop('*', binop('+', binop('*', r, 0.5), 0.5), m); },
  bipolar(r, a, kw) { const m = A(a, kw, 0, 'mul', 1); if (isUG(r) && UNIPOLAR.has(r.node.name)) return binop('*', binop('-', binop('*', r, 2), 1), m); return binop('*', r, m); },
  madd(r, a, kw) { return binop('+', binop('*', r, A(a, kw, 0, 'mul', 1)), A(a, kw, 1, 'add', 0)); },
  blend(r, a, kw) { const t = A(a, kw, 0, 'that'), f = A(a, kw, 1, 'blendFrac', 0.5); return binop('+', r, binop('*', binop('-', t, r), f)); },
  squared(r) { return isUG(r) ? binop('*', r, r) : unop('squared', r); },
  degreeToKey(r, a, kw) { return LIB.degreeToKey(r, A(a, kw, 0, 'scale'), A(a, kw, 1, 'stepsPerOctave', 12)); },
  asStringPrec(r, a) { return String(parseFloat(num(r).toPrecision(num(a[0] || 6)))); },
});
function clipLike(name, r, lo, hi) {
  if (Array.isArray(r)) return r.map(x => clipLike(name, x, lo, hi));
  if (isUG(r) || isUG(lo) || isUG(hi)) return makeUGen(name, maxRate(r, lo, hi), [r, lo, hi], 1);
  return mathIM[name.toLowerCase()](r, [lo, hi]);
}

const objIM = {
  postln(r) { LIB.I.post(LIB.I.str(r)); return r; },
  post(r) { LIB.I.post(LIB.I.str(r), 'inline'); return r; },
  postcs(r) { LIB.I.post(cs(r)); return r; },
  cs(r) { return cs(r); },
  debug(r, a) { LIB.I.post((a[0] != null ? LIB.I.str(a[0]) + ': ' : '') + LIB.I.str(r)); return r; },
  dump(r) { LIB.I.post(LIB.I.className(r) + ': ' + LIB.I.str(r)); return r; },
  value(r) { return r; },
  valueArray(r) { return r; },
  *dup(r, a, kw) { const n = num(A(a, kw, 0, 'n', 2)); const out = []; for (let i = 0; i < n; i++) out.push((r instanceof SCFunction) ? yield* LIB.I.callFn(r, [i]) : r); return out; },
  '!': function* (r, a) { const n = num(a[0]); const out = []; for (let i = 0; i < n; i++) out.push((r instanceof SCFunction) ? yield* LIB.I.callFn(r, [i]) : r); return out; },
  '==': (r, a) => eq(r, a[0]), '!=': (r, a) => !eq(r, a[0]), '===': (r, a) => r === a[0] || (isNum(r) && isNum(a[0]) && num(r) === num(a[0])), '!==': (r, a) => r !== a[0],
  isNil: r => r == null, notNil: r => r != null,
  '?': (r, a) => r != null ? r : a[0],
  '??': function* (r, a) { return r != null ? r : yield* LIB.I.call(a[0]); },
  '->': (r, a) => new Assoc(r, a[0]),
  isNumber: r => isNum(r), isString: r => typeof r === 'string', isArray: r => Array.isArray(r), isFunction: r => r instanceof SCFunction, isKindOf(r, a) { const c = a[0] instanceof ClassRef ? a[0].cls : null; for (let k = LIB.I.classOf(r); k; k = k.sup ? CLASSES[k.sup] : null) if (k === c) return true; return false; },
  isMemberOf(r, a) { return a[0] instanceof ClassRef && LIB.I.classOf(r) === a[0].cls; },
  respondsTo(r, a) { return !!L.findMethod(LIB.I.classOf(r), sname(a[0]), 'im'); },
  class(r) { const c = LIB.I.classOf(r); return c.ref || (c.ref = new ClassRef(c)); },
  copy: r => Array.isArray(r) ? r.slice() : (r instanceof SCEvent ? new SCEvent(Object.fromEntries(r.d)) : r),
  deepCopy: r => JSON.parse(JSON.stringify(r)),
  asArray: r => Array.isArray(r) ? r : [r],
  asString: r => LIB.I.str(r), printString: r => LIB.I.str(r),
  asCompileString: r => cs(r),
  asSymbol: r => sym(LIB.I.str(r)),
  size: () => 0,
  yield: function* (r) { return yield { wait: r, yieldVal: r }; },
  isRest: r => r instanceof Sym ? (r.name === 'rest' || r.name === '' || r.name === 'r') : (r && r.scClass === 'Rest'),
  isPlaying: () => false,
  asStream: r => LIB.constStream(r),
  embedInStream: function* (r) { return yield { wait: r, yieldVal: r }; },
  play(r) { err(LIB.I.className(r) + " can't play. Try { ... }.play"); },
  help(r) { LIB.host.ui.openRef(LIB.I.className(r)); return r; },
  *switch(r, a) { for (let i = 0; i + 1 < a.length; i += 2) if (eq(r, a[i])) return yield* LIB.I.call(a[i + 1]); if (a.length % 2) return yield* LIB.I.call(a[a.length - 1]); return null; },
};
function cs(v) { if (typeof v === 'string') return '"' + v + '"'; if (v instanceof Sym) return "'" + v.name + "'"; if (Array.isArray(v)) return '[ ' + v.map(cs).join(', ') + ' ]'; return LIB.I.str(v); }

defClass('Object', null, objIM, {
  new() { return {}; },
  help(c) { LIB.host.ui.openRef(c.cls.name); return c; },
  name(c) { return sym(c.cls.name); },
});
defClass('Class', 'Object', {
  name(r) { return sym(r.cls.name); }, help(r) { LIB.host.ui.openRef(r.cls.name); return r; },
  superclass(r) { const s = r.cls.sup && CLASSES[r.cls.sup]; return s ? (s.ref || (s.ref = new ClassRef(s))) : null; },
  browse(r) { LIB.host.ui.openRef(r.cls.name); return r; }, dumpInterface(r) { LIB.I.post(Object.keys(r.cls.cm).concat(Object.keys(r.cls.im)).join(' ')); return r; },
});
defClass('Nil', 'Object', { isNil: () => true, notNil: () => false, '?': (r, a) => a[0], '??': function* (r, a) { return yield* LIB.I.call(a[0]); }, value: () => null, size: () => 0, asArray: () => [], isEmpty: () => true, play() { err("nil can't play. Did a variable lose its value?"); } });
const boolIM = {
  if: function* (r, a, kw) { const f = r ? A(a, kw, 0, 'trueFunc') : A(a, kw, 1, 'falseFunc'); return f == null ? null : yield* LIB.I.call(f); },
  and: function* (r, a) { return r ? !!(yield* LIB.I.call(a[0])) : false; }, or: function* (r, a) { return r ? true : !!(yield* LIB.I.call(a[0])); },
  '&&': function* (r, a) { return r ? !!(yield* LIB.I.call(a[0])) : false; }, '||': function* (r, a) { return r ? true : !!(yield* LIB.I.call(a[0])); },
  not: r => !r, xor: (r, a) => r !== !!a[0], binaryValue: r => r ? 1 : 0, asInteger: r => r ? 1 : 0, '==': (r, a) => r === a[0],
};
defClass('Boolean', 'Object', boolIM); defClass('True', 'Boolean', {}); defClass('False', 'Boolean', {});

// ---- numbers
const loopIM = {
  *do(r, a) { const f = a[0], n = num(r); for (let i = 0; i < n; i++) yield* LIB.I.call(f, [i, i]); return r; },
  *collect(r, a) { const f = a[0], n = num(r), out = []; for (let i = 0; i < n; i++) out.push(yield* LIB.I.call(f, [i, i])); return out; },
  *reverseDo(r, a) { const f = a[0], n = num(r); for (let i = n - 1, j = 0; i >= 0; i--, j++) yield* LIB.I.call(f, [i, j]); return r; },
  *for(r, a) { const end = num(a[0]), f = a[1]; let j = 0; if (num(r) <= end) for (let i = num(r); i <= end; i++) yield* LIB.I.call(f, [i, j++]); else for (let i = num(r); i >= end; i--) yield* LIB.I.call(f, [i, j++]); return r; },
  *forBy(r, a) { const end = num(a[0]), st = num(a[1]), f = a[2]; let j = 0; if (st === 0) return r; for (let i = num(r); st > 0 ? i <= end + 1e-9 : i >= end - 1e-9; i += st) yield* LIB.I.call(f, [i, j++]); return r; },
  *wait(r) { if (!LIB.I.thread.isRoutine) err("wait can only be used inside a Routine. Wrap your code in fork { ... } or Routine { ... }.play"); yield { wait: num(r) }; return r; },
  *yield(r) { return yield { wait: num(r), yieldVal: r }; },
  asArray: r => [r], series: (r, a) => { const out = []; const st = a[0] == null ? r + 1 : num(a[0]), end = num(a[1]); const step = st - num(r); for (let x = num(r); step > 0 ? x <= end : x >= end; x += step) out.push(x); return out; },
  isInteger: r => !isFloat(r), isFloat: r => isFloat(r), asString: r => LIB.I.fmtNum(r),
  degrad: r => num(r) * Math.PI / 180, raddeg: r => num(r) * 180 / Math.PI,
  asChar: r => new Char(String.fromCharCode(num(r))), asAscii: r => new Char(String.fromCharCode(num(r))),
  isNaN: r => Number.isNaN(num(r)), magnitude: r => Math.abs(num(r)),
  asWarp() { return this; }, midiname(r) { const n = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][((Math.round(num(r)) % 12) + 12) % 12]; return n + (Math.floor(Math.round(num(r)) / 12) - 1); },
  nthPrime(r) { let c = 0; for (let n = 2; ; n++) if (numUn('isPrime', n) && c++ === num(r)) return n; },
  asDigits(r, a) { const b = num(a[0] || 10); let x = Math.abs(Math.floor(num(r))); const d = []; do { d.unshift(x % b); x = Math.floor(x / b); } while (x > 0); return d; },
  asBinaryDigits(r, a) { const n = num(a[0] || 8); return Array.from({ length: n }, (_, i) => (num(r) >> (n - 1 - i)) & 1); },
  cpsname(r) { return loopIM.midiname(D.UN.cpsmidi(num(r))); },
};
defClass('Magnitude', 'Object', {});
defClass('Number', 'Magnitude', Object.assign({}, mathIM, loopIM));
defClass('SimpleNumber', 'Number', {}); CLASSES.Number.sup = 'Magnitude';
defClass('Integer', 'SimpleNumber', {}); defClass('Float', 'SimpleNumber', {});
CLASSES.Integer.sup = 'Number'; CLASSES.Float.sup = 'Number';
defClass('Integer', null, {}, { new: () => 0 });
defClass('Float', null, {}, {});

// ---- strings, symbols, chars
defClass('String', 'Object', {
  postln(r) { LIB.I.post(r); return r; }, post(r) { LIB.I.post(r, 'inline'); return r; },
  '++': (r, a) => r + (typeof a[0] === 'string' ? a[0] : LIB.I.str(a[0])), '+': (r, a) => r + ' ' + (typeof a[0] === 'string' ? a[0] : LIB.I.str(a[0])),
  size: r => r.length, reverse: r => r.split('').reverse().join(''), scramble: r => shuffle(r.split('')).join(''),
  at: (r, a) => r[num(a[0])] == null ? null : new Char(r[num(a[0])]), asSymbol: r => sym(r), asString: r => r, asInteger: r => parseInt(r) || 0, asFloat: r => parseFloat(r) || 0, asNumber: r => parseFloat(r) || 0,
  toUpper: r => r.toUpperCase(), toLower: r => r.toLowerCase(), isEmpty: r => r.length === 0, notEmpty: r => r.length > 0,
  split: (r, a) => r.split(a[0] instanceof Char ? a[0].c : (a[0] == null ? '/' : String(a[0]))),
  contains: (r, a) => r.includes(String(a[0])), includes: (r, a) => r.includes(a[0] instanceof Char ? a[0].c : String(a[0])), find: (r, a) => { const i = r.indexOf(String(a[0])); return i < 0 ? null : i; },
  replace: (r, a) => r.split(String(a[0])).join(String(a[1] ?? '')), stripWhiteSpace: r => r.trim(),
  format(r, a) { let i = 0; return r.replace(/%/g, () => LIB.I.str(a[i++])); },
  postf(r, a) { let i = 0; LIB.I.post(r.replace(/%/g, () => LIB.I.str(a[i++]))); return r; },
  interpret(r) { return LIB.I.interpret(r); },
  *do(r, a) { for (let i = 0; i < r.length; i++) yield* LIB.I.call(a[0], [new Char(r[i]), i]); return r; },
  *collect(r, a) { const out = []; for (let i = 0; i < r.length; i++) out.push(yield* LIB.I.call(a[0], [new Char(r[i]), i])); return out; },
  ascii: r => r.split('').map(c => c.charCodeAt(0)),
  speak(r) { try { const u = new SpeechSynthesisUtterance(r); u.lang = LIB.host.lang || 'en'; speechSynthesis.speak(u); } catch (e) { } return r; },
  '<': (r, a) => r < String(a[0]), '>': (r, a) => r > String(a[0]), '==': (r, a) => r === a[0],
  help(r) { LIB.host.ui.openRef(r); return r; },
  wrapAt: (r, a) => new Char(r[((num(a[0]) % r.length) + r.length) % r.length]),
});
defClass('Symbol', 'Object', {
  asString: r => r.name, asSymbol: r => r, '++': (r, a) => sym(r.name + (a[0] instanceof Sym ? a[0].name : LIB.I.str(a[0]))),
  postln(r) { LIB.I.post(r.name); return r; },
  kr(r, a, kw) { return LIB.namedControl(r.name, 'kr', A(a, kw, 0, 'val', 0), A(a, kw, 1, 'lag', 0)); },
  ar(r, a, kw) { return LIB.namedControl(r.name, 'ar', A(a, kw, 0, 'val', 0), A(a, kw, 1, 'lag', 0)); },
  ir(r, a, kw) { return LIB.namedControl(r.name, 'ir', A(a, kw, 0, 'val', 0), 0); },
  tr(r, a, kw) { return LIB.namedControl(r.name, 'tr', A(a, kw, 0, 'val', 0), 0); },
  envirGet: r => LIB.I.envir.get(r.name) ?? null, envirPut: (r, a) => { LIB.I.envir.put(r.name, a[0]); return r; },
  size: r => r.name.length, isRest: r => ['rest', 'r', ''].includes(r.name),
  '==': (r, a) => r === a[0],
});
defClass('Char', 'Object', { ascii: r => r.c.charCodeAt(0), asString: r => r.c, isVowel: r => /[aeiou]/i.test(r.c), toUpper: r => new Char(r.c.toUpperCase()), toLower: r => new Char(r.c.toLowerCase()), '==': (r, a) => a[0] instanceof Char && a[0].c === r.c, asSymbol: r => sym(r.c), isAlpha: r => /[a-z]/i.test(r.c), isDecDigit: r => /\d/.test(r.c), digit: r => parseInt(r.c, 36) });
defClass('Ref', 'Object', { value: r => r.value, value_: (r, a) => { r.value = a[0]; return r; }, dereference: r => r.value, asRef: r => r });
defClass('Association', 'Object', { key: r => r.key, value: r => r.value });

// ---- arrays
function shuffle(a) { const R = LIB.I.rand; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function wchoose(w) { const R = LIB.I.rand(); let acc = 0; for (let i = 0; i < w.length; i++) { acc += num(w[i]); if (R < acc) return i; } return w.length - 1; }
function flat(a, depth = Infinity) { const out = []; (function f(x, d) { for (const y of x) { if (Array.isArray(y) && d > 0) f(y, d - 1); else out.push(y); } })(a, depth); return out; }
function sumArr(a) { if (!a.length) return 0; let s = a[0]; for (let i = 1; i < a.length; i++) s = binop('+', s, a[i]); return s; }
LIB.sumArr = sumArr; LIB.flat = flat; LIB.shuffle = shuffle;
const arrIM = Object.assign({}, mathIM, {
  size: r => r.length, at(r, a) { const i = a[0]; if (Array.isArray(i)) return i.map(j => r[num(j)] ?? null); return r[num(i)] ?? null; },
  put(r, a) { const i = num(a[0]); if (i < 0 || i >= r.length) err('Index ' + i + ' out of range (size ' + r.length + ')'); r[i] = a[1]; return r; },
  clipAt: (r, a) => r[Math.min(Math.max(num(a[0]), 0), r.length - 1)], wrapAt: (r, a) => r[((Math.floor(num(a[0])) % r.length) + r.length) % r.length], foldAt: (r, a) => { const n = r.length; if (n < 2) return r[0]; const p = 2 * (n - 1); let i = ((Math.floor(num(a[0])) % p) + p) % p; return r[i < n ? i : p - i]; },
  first: r => r[0] ?? null, last: r => r[r.length - 1] ?? null, isEmpty: r => r.length === 0, notEmpty: r => r.length > 0,
  *do(r, a) { const f = a[0]; for (let i = 0; i < r.length; i++) yield* LIB.I.call(f, [r[i], i]); return r; },
  *reverseDo(r, a) { const f = a[0]; for (let i = r.length - 1, j = 0; i >= 0; i--, j++) yield* LIB.I.call(f, [r[i], j]); return r; },
  *collect(r, a) { const f = a[0], out = []; for (let i = 0; i < r.length; i++) out.push(yield* LIB.I.call(f, [r[i], i])); return out; },
  *select(r, a) { const f = a[0], out = []; for (let i = 0; i < r.length; i++) if (yield* LIB.I.call(f, [r[i], i])) out.push(r[i]); return out; },
  *reject(r, a) { const f = a[0], out = []; for (let i = 0; i < r.length; i++) if (!(yield* LIB.I.call(f, [r[i], i]))) out.push(r[i]); return out; },
  *detect(r, a) { const f = a[0]; for (let i = 0; i < r.length; i++) if (yield* LIB.I.call(f, [r[i], i])) return r[i]; return null; },
  *detectIndex(r, a) { const f = a[0]; for (let i = 0; i < r.length; i++) if (yield* LIB.I.call(f, [r[i], i])) return i; return null; },
  *any(r, a) { for (let i = 0; i < r.length; i++) if (yield* LIB.I.call(a[0], [r[i], i])) return true; return false; },
  *every(r, a) { for (let i = 0; i < r.length; i++) if (!(yield* LIB.I.call(a[0], [r[i], i]))) return false; return true; },
  *count(r, a) { let c = 0; for (let i = 0; i < r.length; i++) if (yield* LIB.I.call(a[0], [r[i], i])) c++; return c; },
  *inject(r, a) { let acc = a[0]; for (let i = 0; i < r.length; i++) acc = yield* LIB.I.call(a[1], [acc, r[i], i]); return acc; },
  *doAdjacentPairs(r, a) { for (let i = 0; i < r.length - 1; i++) yield* LIB.I.call(a[0], [r[i], r[i + 1], i]); return r; },
  *pairsDo(r, a) { for (let i = 0; i + 1 < r.length; i += 2) yield* LIB.I.call(a[0], [r[i], r[i + 1], i]); return r; },
  *sum(r, a) { if (a[0]) { const v = []; for (let i = 0; i < r.length; i++) v.push(yield* LIB.I.call(a[0], [r[i], i])); return sumArr(v); } return sumArr(r); },
  product: r => r.reduce((x, y) => binop('*', x, y), 1),
  mean: r => binop('/', sumArr(r), r.length), maxItem: r => r.reduce((x, y) => num(y) > num(x) ? y : x), minItem: r => r.reduce((x, y) => num(y) < num(x) ? y : x),
  maxIndex: r => r.reduce((bi, x, i) => num(x) > num(r[bi]) ? i : bi, 0), minIndex: r => r.reduce((bi, x, i) => num(x) < num(r[bi]) ? i : bi, 0),
  reverse: r => r.slice().reverse(), scramble: r => shuffle(r.slice()), choose: r => r[Math.floor(LIB.I.rand() * r.length)] ?? null,
  wchoose: (r, a) => r[wchoose(a[0])], windex: r => wchoose(r),
  sort(r, a) { if (a[0]) { r.sort((x, y) => LIB.I.callSync(a[0], [x, y]) ? -1 : 1); return r; } r.sort((x, y) => isNum(x) && isNum(y) ? num(x) - num(y) : String(LIB.I.str(x)).localeCompare(LIB.I.str(y))); return r; },
  order: r => r.map((x, i) => i).sort((i, j) => num(r[i]) - num(r[j])),
  add(r, a) { r.push(a[0]); return r; }, addAll(r, a) { r.push(...toArr(a[0])); return r; }, addFirst(r, a) { r.unshift(a[0]); return r; },
  insert(r, a) { r.splice(num(a[0]), 0, a[1]); return r; }, removeAt(r, a) { return r.splice(num(a[0]), 1)[0] ?? null; },
  remove(r, a) { const i = r.findIndex(x => eq(x, a[0])); if (i >= 0) return r.splice(i, 1)[0]; return null; }, pop: r => r.pop() ?? null,
  includes: (r, a) => r.some(x => eq(x, a[0])), indexOf: (r, a) => { const i = r.findIndex(x => eq(x, a[0])); return i < 0 ? null : i; },
  indexOfGreaterThan: (r, a) => { const i = r.findIndex(x => num(x) > num(a[0])); return i < 0 ? null : i; },
  '++': (r, a) => r.concat(toArr(a[0])), copy: r => r.slice(), copyRange: (r, a) => r.slice(num(a[0]), a[1] == null ? undefined : num(a[1]) + 1),
  keep: (r, a) => num(a[0]) >= 0 ? r.slice(0, num(a[0])) : r.slice(num(a[0])), drop: (r, a) => num(a[0]) >= 0 ? r.slice(num(a[0])) : r.slice(0, num(a[0])),
  rotate: (r, a) => { const n = r.length; if (!n) return []; const k = ((num(a[0] ?? 1) % n) + n) % n; return r.slice(n - k).concat(r.slice(0, n - k)); },
  mirror: r => r.concat(r.slice(0, -1).reverse()), mirror1: r => r.concat(r.slice(1, -1).reverse()), mirror2: r => r.concat(r.slice().reverse()),
  pyramid: (r) => { const out = []; for (let i = 1; i <= r.length; i++) out.push(...r.slice(0, i)); return out; },
  stutter: (r, a) => { const n = num(a[0] ?? 2), out = []; r.forEach(x => { for (let i = 0; i < n; i++) out.push(x); }); return out; },
  dupEach: (r, a) => arrIM.stutter(r, a),
  lace: (r, a) => { const n = a[0] == null ? r.reduce((m, x) => Math.max(m, toArr(x).length), 0) * r.length : num(a[0]); const out = []; for (let i = 0; i < n; i++) { const s = toArr(r[i % r.length]); out.push(s[Math.floor(i / r.length) % s.length]); } return out; },
  flat: r => flat(r), flatten: (r, a) => flat(r, num(a[0] ?? 1)),
  flop: r => { const n = r.reduce((m, x) => Math.max(m, toArr(x).length), 0); return Array.from({ length: n }, (_, i) => r.map(x => { const s = toArr(x); return s[i % s.length]; })); },
  clump: (r, a) => { const n = num(a[0]), out = []; for (let i = 0; i < r.length; i += n) out.push(r.slice(i, i + n)); return out; },
  normalizeSum: r => { const s = r.reduce((x, y) => x + num(y), 0); return r.map(x => num(x) / s); },
  normalize: (r, a) => { const lo = num(a[0] ?? 0), hi = num(a[1] ?? 1), mn = Math.min(...r.map(num)), mx = Math.max(...r.map(num)); return r.map(x => mx === mn ? lo : lo + (num(x) - mn) / (mx - mn) * (hi - lo)); },
  integrate: r => { let s = 0; return r.map(x => s = binop('+', s, x)); }, differentiate: r => r.map((x, i) => i ? binop('-', x, r[i - 1]) : x),
  asString: r => LIB.I.str(r), join: (r, a) => r.map(x => typeof x === 'string' ? x : LIB.I.str(x)).join(a[0] == null ? '' : (a[0] instanceof Char ? a[0].c : String(a[0]))),
  swap: (r, a) => { const i = num(a[0]), j = num(a[1]); [r[i], r[j]] = [r[j], r[i]]; return r; }, fill: (r, a) => r.fill(a[0]),
  perfectShuffle: r => { const h = Math.ceil(r.length / 2); const out = []; for (let i = 0; i < h; i++) { out.push(r[i]); if (i + h < r.length) out.push(r[i + h]); } return out; },
  asArray: r => r, asList: r => r, isArray: () => true, plot(r, a, kw) { const name = A(a, kw, 0, 'name', ''); const data = r.length && Array.isArray(r[0]) ? r.map(x => x.map(num)) : [r.map(num)]; LIB.host.ui.plot(data, { title: LIB.I.str(name) || 'Array', discrete: !!A(a, kw, 2, 'discrete', false), minval: A(a, kw, 4, 'minval', null), maxval: A(a, kw, 5, 'maxval', null) }); return r; },
  sputter: (r, a) => { const p = num(a[0] ?? 0.25), mx = num(a[1] ?? 100), out = []; let i = 0; while (i < r.length && out.length < mx) { out.push(r[i]); if (LIB.I.rand() >= p) i++; } return out; },
  scope(r) { LIB.host.ui.show('scope'); return r; },
  '==': (r, a) => eq(r, a[0]),
  degreeToKey: (r, a, kw) => r.map(x => LIB.degreeToKey(x, A(a, kw, 0, 'scale'), A(a, kw, 1, 'stepsPerOctave', 12))),
  asStream: r => LIB.constStream(r),
  isSequenceableCollection: () => true,
  resamp1: (r, a) => { const n = num(a[0]), out = []; for (let i = 0; i < n; i++) { const p = i * (r.length - 1) / Math.max(n - 1, 1), k = Math.floor(p), f = p - k; out.push(num(r[k]) + (num(r[Math.min(k + 1, r.length - 1)]) - num(r[k])) * f); } return out; },
  powerset: r => { const out = [[]]; for (const x of r) { const n = out.length; for (let i = 0; i < n; i++) out.push(out[i].concat([x])); } return out; },
  allTuples: r => { let out = [[]]; for (const s of r) { const nx = []; for (const t of out) for (const x of toArr(s)) nx.push(t.concat([x])); out = nx; } return out; },
  *play(r) { const out = []; for (const x of r) out.push(yield* LIB.I.send(x, 'play', [])); return out; },
  wrapExtend: (r, a) => Array.from({ length: num(a[0]) }, (_, i) => r[i % r.length]),
  extend: (r, a) => Array.from({ length: num(a[0]) }, (_, i) => i < r.length ? r[i] : (a[1] ?? null)),
  quantize: (r, a) => r.map(x => numBin('round', x, a[0] ?? 1)),
  sum3: r => r,
});
// ugens/arrays: clip etc. elementwise handled through mathIM (arrays route through binop/unop)
defClass('Collection', 'Object', {}); defClass('SequenceableCollection', 'Collection', {}); defClass('ArrayedCollection', 'SequenceableCollection', {});
defClass('Array', 'ArrayedCollection', arrIM, {
  *fill(c, a, kw) { const n = num(a[0]), f = a[1], out = []; for (let i = 0; i < n; i++) out.push(yield* LIB.I.call(f, [i])); return out; },
  *fill2D(c, a) { const r = num(a[0]), k = num(a[1]), f = a[2], out = []; for (let i = 0; i < r; i++) { const row = []; for (let j = 0; j < k; j++) row.push(yield* LIB.I.call(f, [i, j])); out.push(row); } return out; },
  series(c, a, kw) { const n = num(A(a, kw, 0, 'size', 0)), s = A(a, kw, 1, 'start', 0), st = A(a, kw, 2, 'step', 1); return Array.from({ length: n }, (_, i) => numBin('+', s, numBin('*', st, i))); },
  geom(c, a, kw) { const n = num(A(a, kw, 0, 'size', 0)), s = num(A(a, kw, 1, 'start', 1)), g = num(A(a, kw, 2, 'grow', 2)); return Array.from({ length: n }, (_, i) => s * Math.pow(g, i)); },
  rand(c, a, kw) { const n = num(a[0]), lo = a[1] ?? 0, hi = a[2] ?? 1; return Array.from({ length: n }, () => numBin('rrand', lo, hi)); },
  rand2(c, a) { const n = num(a[0]), v = a[1] ?? 1; return Array.from({ length: n }, () => numUn('rand2', v)); },
  exprand(c, a) { const n = num(a[0]), lo = a[1] ?? 0.01, hi = a[2] ?? 1; return Array.from({ length: n }, () => numBin('exprand', lo, hi)); },
  linrand(c, a) { const n = num(a[0]), lo = num(a[1] ?? 0), hi = num(a[2] ?? 1); return Array.from({ length: n }, () => lo + Math.min(LIB.I.rand(), LIB.I.rand()) * (hi - lo)); },
  interpolation(c, a) { const n = num(a[0]), s = num(a[1] ?? 0), e = num(a[2] ?? 1); return Array.from({ length: n }, (_, i) => n < 2 ? s : s + (e - s) * i / (n - 1)); },
  newClear(c, a) { return new Array(num(a[0] ?? 0)).fill(null); }, new(c, a) { return []; }, with(c, a) { return a.slice(); },
  fib(c, a) { const n = num(a[0]); const out = [0, 1]; while (out.length < n) out.push(out[out.length - 1] + out[out.length - 2]); return out.slice(0, n); },
});
defClass('List', 'Array', {}, { new: () => [] });
defClass('Signal', 'Array', {}, { sineFill(c, a) { const n = num(a[0]), amps = a[1] || [1]; return Array.from({ length: n }, (_, i) => amps.reduce((s, am, h) => s + num(am) * Math.sin(2 * Math.PI * (h + 1) * i / n), 0)); }, newClear: (c, a) => new Array(num(a[0])).fill(0) });

// ---- events / dictionaries
const evIM = {
  at: (r, a) => { const v = r.get(sname(a[0])); return v === undefined ? null : v; }, put: (r, a) => { r.put(sname(a[0]), a[1]); return r; },
  removeAt: (r, a) => { const k = sname(a[0]); const v = r.get(k); r.d.delete(k); return v ?? null; },
  keys: r => [...r.d.keys()].map(sym), values: r => [...r.d.values()], size: r => r.d.size, includesKey: (r, a) => r.has(sname(a[0])),
  *keysValuesDo(r, a) { for (const [k, v] of r.d) yield* LIB.I.call(a[0], [sym(k), v]); return r; },
  *do(r, a) { let i = 0; for (const v of r.d.values()) yield* LIB.I.call(a[0], [v, i++]); return r; },
  *collect(r, a) { const e = new SCEvent(); for (const [k, v] of r.d) e.put(k, yield* LIB.I.call(a[0], [v, sym(k)])); return e; },
  copy: r => { const e = new SCEvent(Object.fromEntries(r.d)); e.scClass = r.scClass; return e; },
  play(r) { LIB.playEvent(r); return r; },
  isEmpty: r => r.d.size === 0, asEvent: r => r,
  use: function* (r, a) { return yield* LIB.I.call(a[0]); },
  next: r => r, delta: r => LIB.eventDelta(r),
};
defClass('Dictionary', 'Collection', evIM, { new: () => { const e = new SCEvent(); e.scClass = 'Dictionary'; return e; } });
defClass('IdentityDictionary', 'Dictionary', {}, { new: () => { const e = new SCEvent(); e.scClass = 'IdentityDictionary'; return e; } });
defClass('Environment', 'IdentityDictionary', {}, { new: () => { const e = new SCEvent(); e.scClass = 'Environment'; return e; } });
defClass('Event', 'Environment', {}, { new: () => new SCEvent(), default: () => new SCEvent() });

// ---- functions
const fnIM = {
  *value(r, a, kw) { return yield* LIB.I.call(r, a, kw); },
  *valueArray(r, a) { return yield* LIB.I.call(r, toArr(a[0] || [])); },
  *valueEnvir(r, a) { return yield* LIB.I.call(r, a); },
  *loop(r) { for (;;) yield* LIB.I.call(r); },
  *while(r, a) { let guard = 0; while (yield* LIB.I.call(r)) { if (a[0]) yield* LIB.I.call(a[0]); if (++guard > 1e6) err('while: too many iterations'); } return null; },
  *case(r, a) { const fs = [r, ...a]; for (let i = 0; i < fs.length; i += 2) { if (i + 1 >= fs.length) return yield* LIB.I.call(fs[i]); if (yield* LIB.I.call(fs[i])) return yield* LIB.I.call(fs[i + 1]); } return null; },
  numArgs: r => r instanceof SCFunction ? r.node.params.length : 0,
  argNames: r => r instanceof SCFunction ? r.node.params.map(p => sym(p.name)) : [],
  def: r => r,
  *dup(r, a, kw) { const n = num(A(a, kw, 0, 'n', 2)); const out = []; for (let i = 0; i < n; i++) out.push(yield* LIB.I.call(r, [i])); return out; },
  '!': function* (r, a) { const n = num(a[0]); const out = []; for (let i = 0; i < n; i++) out.push(yield* LIB.I.call(r, [i])); return out; },
  play(r, a, kw) { return LIB.functionPlay(r, A(a, kw, 0, 'target'), A(a, kw, 1, 'outbus', 0), A(a, kw, 2, 'fadeTime', 0.02), A(a, kw, 3, 'addAction', sym('addToHead')), A(a, kw, 4, 'args', [])); },
  plot(r, a, kw) { return LIB.functionPlot(r, num(A(a, kw, 0, 'duration', 0.01)), A(a, kw, 3, 'minval'), A(a, kw, 4, 'maxval')); },
  plotAudio(r, a, kw) { return LIB.functionPlot(r, num(A(a, kw, 0, 'duration', 0.01))); },
  scope(r, a, kw) { const x = LIB.functionPlay(r, null, 0, A(a, kw, 3, 'fadeTime', 0.02)); LIB.host.ui.show('scope'); return x; },
  freqscope(r) { const x = LIB.functionPlay(r, null, 0, 0.02); LIB.host.ui.show('spectrum'); return x; },
  asSynthDef(r, a, kw) { return LIB.compileDef(A(a, kw, 1, 'name', 'temp__' + (LIB.nextId)), r, { wrapOut: true }); },
};
defClass('AbstractFunction', 'Object', {});
defClass('Function', 'AbstractFunction', fnIM);
// math on functions -> function composition (lazy)
BINOPS.forEach(op => { CLASSES.Function.im[op] = function (r, a) { const b = a[0]; return LIB.composeFn((x, y) => binop(op, x, y), r, b); }; });
LIB.composeFn = (f, a, b) => function (...args) { const I = LIB.I; const va = (a instanceof SCFunction || typeof a === 'function') ? I.callSync(a, args) : a; const vb = (b instanceof SCFunction || typeof b === 'function') ? I.callSync(b, args) : b; return f(va, vb); };

// ---- UGen instance methods
defClass('UGen', 'AbstractFunction', Object.assign({}, mathIM, {
  lag: (r, a) => makeUGen('Lag', r.node.rate, [r, a[0] ?? 0.1], 1), lag2: (r, a) => makeUGen('Lag2', r.node.rate, [r, a[0] ?? 0.1], 1), lag3: (r, a) => makeUGen('Lag3', r.node.rate, [r, a[0] ?? 0.1], 1),
  lagud: (r, a) => makeUGen('LagUD', r.node.rate, [r, a[0] ?? 0.1, a[1] ?? 0.1], 1),
  varlag: (r, a) => makeUGen('Lag', r.node.rate, [r, a[0] ?? 0.1], 1),
  poll(r, a, kw) { const tr = A(a, kw, 0, 'trig', 10), label = A(a, kw, 1, 'label', null); const t = isNum(tr) ? makeUGen('Impulse', 'kr', [tr, 0], 1) : tr; makeUGen('Poll', r.node.rate, [t, r], 1, { label: label == null ? r.ugenName() : LIB.I.str(label) }, { side: true }); return r; },
  rate: r => sym(r.node.rate), numChannels: () => 1, isUGen: () => true, signalRange: r => sym(UNIPOLAR.has(r.node.name) ? 'unipolar' : 'bipolar'),
  dup: function* (r, a, kw) { const n = num(A(a, kw, 0, 'n', 2)); return Array.from({ length: n }, () => r); },
  '!': function* (r, a) { return Array.from({ length: num(a[0]) }, () => r); },
  printOn: null,
  clip(r, a, kw) { return clipLike('Clip', r, A(a, kw, 0, 'lo', 0), A(a, kw, 1, 'hi', 1)); },
  fold(r, a, kw) { return clipLike('Fold', r, A(a, kw, 0, 'lo', 0), A(a, kw, 1, 'hi', 1)); },
  wrap(r, a, kw) { return clipLike('Wrap', r, A(a, kw, 0, 'lo', 0), A(a, kw, 1, 'hi', 1)); },
  sanitize: r => r, checkBadValues: r => r,
  play(r) { return LIB.functionPlay(() => r, null, 0, 0.02); },
  plot() { err('Plot a function instead: { ... }.plot'); },
  '==': (r, a) => r === a[0],
}));
// arrays of signals: lag, poll etc.
['lag', 'lag2', 'lag3', 'lagud', 'poll'].forEach(m => { arrIM[m] = (r, a, kw) => r.map(x => isUG(x) ? CLASSES.UGen.im[m](x, a, kw) : x); CLASSES.Array.im[m] = arrIM[m]; });

// ======================================================================
// UGen classes
// ======================================================================
// spec: 'arg=default ...' ; flags: ma (mul/add), nout, uni, side, noExpand, rates
const SPEC = {};
function S(names, args, o = {}) { names.split(' ').forEach(n => SPEC[n] = Object.assign({ args: parseArgs(args), ma: true, nout: 1 }, o)); }
function parseArgs(s) { if (!s) return []; return s.split(' ').map(t => { const [n, d] = t.split('='); return [n, d === undefined ? undefined : (d === 'nil' ? null : parseFloat(d))]; }); }
S('SinOsc', 'freq=440 phase=0'); S('FSinOsc', 'freq=440 iphase=0'); S('SinOscFB', 'freq=440 feedback=0');
S('Saw', 'freq=440'); S('Pulse', 'freq=440 width=0.5'); S('LFSaw', 'freq=440 iphase=0'); S('LFPulse', 'freq=440 iphase=0 width=0.5');
S('LFTri LFPar LFCub', 'freq=440 iphase=0'); S('VarSaw', 'freq=440 iphase=0 width=0.5'); S('SyncSaw', 'syncFreq=440 sawFreq=440');
S('Blip', 'freq=440 numharm=200'); S('Formant', 'fundfreq=440 formfreq=1760 bwfreq=880'); S('Impulse', 'freq=440 phase=0');
S('Dust Dust2', 'density=0'); S('WhiteNoise PinkNoise BrownNoise GrayNoise ClipNoise', '');
S('LFNoise0 LFNoise1 LFNoise2 LFDNoise0 LFDNoise1 LFDNoise3 LFClipNoise', 'freq=500');
S('Crackle', 'chaosParam=1.5'); S('Logistic', 'chaosParam=3 freq=1000 init=0.5'); S('HenonN HenonL HenonC', 'freq=22050 a=1.4 b=0.3 x0=0 x1=0', { dspName: 'HenonN' });
S('Gendy1', 'ampdist=1 durdist=1 adparam=1 ddparam=1 minfreq=440 maxfreq=660 ampscale=0.5 durscale=0.5 initCPs=12 knum=12');
S('RLPF RHPF BPF BRF', 'in=0 freq=440 rq=1'); S('LPF HPF', 'in=0 freq=440'); S('Resonz', 'in=0 freq=440 bwr=1'); S('MidEQ', 'in=0 freq=440 rq=1 db=0');
S('BLowShelf BHiShelf', 'in=0 freq=1200 rs=1 db=0'); S('Ringz', 'in=0 freq=440 decaytime=1'); S('Formlet', 'in=0 freq=440 attacktime=1 decaytime=1');
S('MoogFF', 'in freq=100 gain=2 reset=0'); S('OnePole OneZero', 'in=0 coef=0.5'); S('Integrator', 'in=0 coef=1'); S('LeakDC', 'in=0 coef=0.995');
S('Lag Lag2 Lag3', 'in=0 lagTime=0.1'); S('LagUD', 'in=0 lagTimeU=0.1 lagTimeD=0.1'); S('Slew', 'in=0 up=1 dn=1');
S('Decay', 'in=0 decayTime=1'); S('Decay2', 'in=0 attackTime=0.01 decayTime=1');
S('DelayN DelayL DelayC', 'in=0 maxdelaytime=0.2 delaytime=0.2'); S('CombN CombL CombC AllpassN AllpassL AllpassC', 'in=0 maxdelaytime=0.2 delaytime=0.2 decaytime=1');
S('FreeVerb', 'in mix=0.33 room=0.5 damp=0.5'); S('FreeVerb2', 'in in2 mix=0.33 room=0.5 damp=0.5', { nout: 2 });
S('GVerb', 'in roomsize=10 revtime=3 damping=0.5 inputbw=0.5 spread=15 drylevel=1 earlyreflevel=0.7 taillevel=0.5 maxroomsize=300', { nout: 2 });
S('Pluck', 'in=0 trig=1 maxdelaytime=0.2 delaytime=0.2 decaytime=1 coef=0.5'); S('PitchShift', 'in=0 windowSize=0.2 pitchRatio=1 pitchDispersion=0 timeDispersion=0');
S('Line', 'start=0 end=1 dur=1 doneAction=0', { done: 3 }); S('XLine', 'start=1 end=2 dur=1 doneAction=0', { done: 3 });
S('Linen', 'gate=1 attackTime=0.01 susLevel=1 releaseTime=1 doneAction=0', { done: 4 });
S('Latch Gate', 'in=0 trig=0'); S('TRand', 'lo=0 hi=1 trig=0'); S('TIRand', 'lo=0 hi=127 trig=0'); S('TExpRand', 'lo=0.01 hi=1 trig=0');
S('Rand', 'lo=0 hi=1', { ma: false }); S('IRand', 'lo=0 hi=127', { ma: false }); S('ExpRand', 'lo=0.01 hi=1', { ma: false }); S('NRand', 'lo=0 hi=1 n=0', { ma: false });
S('CoinGate', 'prob in'); S('Stepper', 'trig=0 reset=0 min=0 max=7 step=1 resetval=nil'); S('PulseCount', 'trig=0 reset=0'); S('PulseDivider', 'trig=0 div=2 start=0');
S('ToggleFF', 'trig=0'); S('Trig Trig1', 'in=0 dur=0.1'); S('TDelay', 'in=0 dur=0.1'); S('Sweep', 'trig=0 rate=1'); S('Phasor', 'trig=0 rate=1 start=0 end=1 resetPos=0');
S('DetectSilence', 'in=0 amp=0.0001 time=0.1 doneAction=0', { done: 3, ma: false });
S('Amplitude', 'in=0 attackTime=0.01 releaseTime=0.01'); S('Peak RunningMax', 'in=0 trig=0'); S('ZeroCrossing', 'in=0');
S('Pitch', 'in=0 initFreq=440 minFreq=60 maxFreq=4000', { nout: 2, ma: false });
S('Limiter', 'in=0 level=1 dur=0.01', { ma: false }); S('Compander', 'in=0 control=0 thresh=0.5 slopeBelow=1 slopeAbove=1 clampTime=0.01 relaxTime=0.1');
S('Pan2 LinPan2', 'in pos=0 level=1', { nout: 2, ma: false }); S('Balance2', 'left right pos=0 level=1', { nout: 2, ma: false }); S('Rotate2', 'x y pos=0', { nout: 2, ma: false });
S('XFade2', 'inA inB=0 pan=0 level=1', { ma: false }); S('LinXFade2', 'inA inB=0 pan=0 level=1', { ma: false });
S('SoundIn', 'bus=0'); S('MouseX MouseY', 'minval=0 maxval=1 warp=0 lag=0.2', { ma: false }); S('MouseButton', 'minval=0 maxval=1 lag=0.2', { ma: false });
S('SampleRate SampleDur ControlRate ControlDur RadiansPerSample', '', { ma: false, rates: ['ir'] });
S('K2A A2K DC', 'in=0', { ma: false }); S('Clip Fold Wrap Schmidt InRange', 'in=0 lo=0 hi=1', { ma: false });
LIB.SPEC = SPEC;

function ugenCall(name, rate, a, kw) {
  const sp = SPEC[name];
  const names = sp.args.map(x => x[0]);
  const vals = sp.args.map((x, i) => {
    let v = A(a, kw, i, x[0], undefined);
    if (v === undefined) { v = x[1]; if (v === undefined) err(name + ": missing argument '" + x[0] + "'"); }
    return v;
  });
  if (name === 'Stepper' && vals[5] == null) vals[5] = vals[2];
  let mul = 1, add = 0;
  if (sp.ma) { mul = A(a, kw, names.length, 'mul', 1); add = A(a, kw, names.length + 1, 'add', 0); }
  const done = sp.done != null ? vals[sp.done] : 0;
  const side = done != null && (isUG(done) || num(done) >= 2);
  const dspName = sp.dspName || name;
  const r = makeUGen(dspName, rate, vals, sp.nout, null, { argNames: names, side });
  const fix = x => (name === 'SoundIn' && LIB.host.engine.needMic && LIB.host.engine.needMic(), x);
  fix();
  return (mul === 1 && add === 0) ? r : binop('+', binop('*', r, mul), add);
}
const ugenCM = (name, rates) => {
  const cm = {};
  (rates || ['ar', 'kr']).forEach(rt => { cm[rt] = (c, a, kw) => ugenCall(name, rt, a, kw); });
  cm.new = (c, a, kw) => ugenCall(name, 'ar', a, kw);
  return cm;
};
Object.keys(SPEC).forEach(n => defClass(n, 'UGen', {}, ugenCM(n, SPEC[n].rates || ['ar', 'kr', 'ir'])));

// --- special UGens
const specialCM = {};
// EnvGen
function envFlat(env) {
  if (!env || env.scClass !== 'Env') {
    if (Array.isArray(env)) return env;
    err('EnvGen needs an Env, e.g. Env.perc');
  }
  const lv = env.levels, tm = env.times, n = tm.length;
  const out = [lv[0], n, env.releaseNode == null ? -99 : env.releaseNode, env.loopNode == null ? -99 : env.loopNode];
  for (let i = 0; i < n; i++) { const c = Array.isArray(env.curves) ? env.curves[i % env.curves.length] : env.curves; const [sh, cv] = shapeOf(c); out.push(lv[i + 1] ?? 0, tm[i], sh, cv); }
  return out;
}
function shapeOf(c) {
  if (isNum(c)) return [5, num(c)];
  if (isUG(c)) return [5, c];
  const n = c instanceof Sym ? c.name : String(c);
  const map = { step: 0, lin: 1, linear: 1, exp: 2, exponential: 2, sin: 3, sine: 3, wel: 4, welch: 4, sqr: 6, squared: 6, cub: 7, cubed: 7, hold: 8 };
  if (!(n in map)) err("Unknown Env curve \\" + n);
  return [map[n], 0];
}
LIB.envFlat = envFlat; LIB.shapeOf = shapeOf;
function envGen(rate, a, kw) {
  const env = A(a, kw, 0, 'envelope'), gate = A(a, kw, 1, 'gate', 1), ls = A(a, kw, 2, 'levelScale', 1), lb = A(a, kw, 3, 'levelBias', 0), ts = A(a, kw, 4, 'timeScale', 1), da = A(a, kw, 5, 'doneAction', 0);
  const mul = A(a, kw, 6, 'mul', 1), add = A(a, kw, 7, 'add', 0);
  if (Array.isArray(env)) err('EnvGen: pass one Env (multichannel envelopes are not supported here)');
  const flatEnv = envFlat(env);
  const side = isUG(da) || num(da) >= 2;
  const mk = (g) => makeUGen('EnvGen', rate, [g, ls, lb, ts, da, flatEnv], 1, null, { noExpand: [5], side, argNames: ['gate', 'levelScale', 'levelBias', 'timeScale', 'doneAction', 'envelope'] });
  const r = Array.isArray(gate) ? gate.map(mk) : mk(gate);
  return (mul === 1 && add === 0) ? r : binop('+', binop('*', r, mul), add);
}
defClass('EnvGen', 'UGen', {}, { ar: (c, a, kw) => envGen('ar', a, kw), kr: (c, a, kw) => envGen('kr', a, kw), new: (c, a, kw) => envGen('ar', a, kw) });
defClass('EnvGate', 'UGen', {}, { new: (c, a, kw) => makeUGen('EnvGate', 'kr', [A(a, kw, 0, 'i_level', 1) && LIB.namedControl('gate', 'kr', 1, 0), LIB.namedControl('fadeTime', 'kr', A(a, kw, 3, 'fadeTime', 0.02), 0)], 1, null, { side: true }) });
// Out & co.
function outUGen(dsp, rate, a, kw) {
  const bus = A(a, kw, 0, 'bus', 0), ch = A(a, kw, 1, 'channelsArray');
  if (ch == null) err(dsp + ': nothing to output (channelsArray is nil)');
  const chans = flat(toArr(ch));
  if (Array.isArray(bus)) return bus.map(b => outUGen(dsp, rate, [b, ch], []));
  return makeUGen(rate === 'kr' && dsp === 'Out' ? 'OutKr' : dsp, rate, [bus, chans], 0, null, { noExpand: [1], side: true, argNames: ['bus', 'channelsArray'] });
}
['Out', 'ReplaceOut', 'OffsetOut'].forEach(n => defClass(n, 'UGen', {}, { ar: (c, a, kw) => outUGen(n, 'ar', a, kw), kr: (c, a, kw) => outUGen(n === 'Out' ? 'Out' : n, 'kr', a, kw) }));
defClass('LocalOut', 'UGen', {}, { ar: (c, a, kw) => makeUGen('LocalOut', 'ar', [flat(toArr(A(a, kw, 0, 'channelsArray')))], 0, null, { noExpand: [0], side: true }), kr: (c, a, kw) => makeUGen('LocalOut', 'kr', [flat(toArr(A(a, kw, 0, 'channelsArray')))], 0, null, { noExpand: [0], side: true }) });
function inUGen(name, rate, a, kw) {
  const bus = A(a, kw, 0, 'bus', 0), n = num(A(a, kw, 1, 'numChannels', 1));
  const dsp = rate === 'kr' && name === 'In' ? 'InKr' : name;
  const r = makeUGen(dsp, rate, [bus], n, null, { argNames: ['bus'] });
  return r;
}
['In', 'InFeedback'].forEach(n => defClass(n, 'UGen', {}, { ar: (c, a, kw) => inUGen(n === 'InFeedback' ? 'In' : n, 'ar', a, kw), kr: (c, a, kw) => inUGen('In', 'kr', a, kw) }));
defClass('LocalIn', 'UGen', {}, { ar: (c, a, kw) => makeUGen('LocalIn', 'ar', [], num(A(a, kw, 0, 'numChannels', 1)), null), kr: (c, a, kw) => makeUGen('LocalIn', 'kr', [], num(A(a, kw, 0, 'numChannels', 1)), null) });
defClass('Silent', 'UGen', {}, { ar: (c, a) => { const n = num(a[0] ?? 1); const r = Array.from({ length: n }, () => makeUGen('Silent', 'ar', [], 1)); return n === 1 ? r[0] : r; } });
defClass('Select', 'UGen', {}, { ar: (c, a, kw) => selectU('ar', a, kw), kr: (c, a, kw) => selectU('kr', a, kw) });
function selectU(rate, a, kw) { const w = A(a, kw, 0, 'which'), arr = A(a, kw, 1, 'array'); if (!Array.isArray(arr)) err('Select needs an array'); if (arr.some(Array.isArray)) { return arr[0].map((_, i) => selectU(rate, [w, arr.map(x => toArr(x)[i])], [])); } return makeUGen('Select', rate, [w, arr], 1, null, { noExpand: [1] }); }
defClass('Mix', 'UGen', {}, {
  new: (c, a) => mix(a[0]), ar: (c, a) => mix(a[0]), kr: (c, a) => mix(a[0]),
  *fill(c, a) { const n = num(a[0]), f = a[1], out = []; for (let i = 0; i < n; i++) out.push(yield* LIB.I.call(f, [i])); return mix(out); },
});
function mix(arr) {
  if (!Array.isArray(arr)) return arr;
  if (!arr.length) return 0;
  if (arr.some(Array.isArray)) { // channel-wise
    const n = Math.max(...arr.map(x => toArr(x).length)); return Array.from({ length: n }, (_, i) => mix(arr.map(x => toArr(x)[i % toArr(x).length])));
  }
  const ug = arr.filter(isUG), nums = arr.filter(x => !isUG(x)).reduce((s, x) => s + num(x), 0);
  if (!ug.length) return nums;
  let r = ug.length === 1 ? ug[0] : makeUGen('Mix', maxRate(...ug), [ug], 1, null, { noExpand: [0] });
  if (nums) r = binop('+', r, nums);
  return r;
}
LIB.mix = mix;
defClass('Splay', 'UGen', {}, { ar: (c, a, kw) => splay(a, kw), kr: (c, a, kw) => splay(a, kw), new: (c, a, kw) => splay(a, kw) });
function splay(a, kw) {
  const inp = toArr(A(a, kw, 0, 'inArray')), spread = A(a, kw, 1, 'spread', 1), level = A(a, kw, 2, 'level', 1), center = A(a, kw, 3, 'center', 0), comp = A(a, kw, 4, 'levelComp', true);
  const n = inp.length; const lvl = comp ? binop('*', level, Math.sqrt(1 / n)) : level;
  const pans = inp.map((x, i) => makeUGen('Pan2', 'ar', [x, n === 1 ? center : binop('+', binop('*', spread, (i / (n - 1)) * 2 - 1), center), 1], 2));
  return [mix(pans.map(p => p[0])), mix(pans.map(p => p[1]))].map(x => binop('*', x, lvl));
}
defClass('PMOsc', 'UGen', {}, { ar: (c, a, kw) => pmosc('ar', a, kw), kr: (c, a, kw) => pmosc('kr', a, kw) });
function pmosc(rate, a, kw) {
  const cf = A(a, kw, 0, 'carfreq'), mf = A(a, kw, 1, 'modfreq'), pi = A(a, kw, 2, 'pmindex', 0), mp = A(a, kw, 3, 'modphase', 0), mul = A(a, kw, 4, 'mul', 1), add = A(a, kw, 5, 'add', 0);
  const mod = binop('*', makeUGen('SinOsc', rate, [mf, mp], 1, null), pi);
  const r = makeUGen('SinOsc', rate, [cf, mod], 1, null);
  return (mul === 1 && add === 0) ? r : binop('+', binop('*', r, mul), add);
}
defClass('Klank', 'UGen', {}, { ar: (c, a, kw) => klank(a, kw), new: (c, a, kw) => klank(a, kw) });
defClass('DynKlank', 'UGen', {}, { ar: (c, a, kw) => klank(a, kw), kr: (c, a, kw) => klank(a, kw) });
function klank(a, kw) {
  let spec = A(a, kw, 0, 'specificationsArrayRef'); if (spec instanceof Ref) spec = spec.value;
  const inp = A(a, kw, 1, 'input'), fs = A(a, kw, 2, 'freqscale', 1), fo = A(a, kw, 3, 'freqoffset', 0), ds = A(a, kw, 4, 'decayscale', 1);
  if (!Array.isArray(spec)) err('Klank needs `[freqs, amps, ringtimes]');
  const freqs = toArr(spec[0]), amps = spec[1] == null ? null : toArr(spec[1]), rings = spec[2] == null ? null : toArr(spec[2]);
  const voices = freqs.map((f, i) => binop('*', makeUGen('Ringz', 'ar', [inp, binop('+', binop('*', f, fs), fo), binop('*', rings ? rings[i % rings.length] : 1, ds)], 1), amps ? amps[i % amps.length] : 1));
  return mix(voices);
}
defClass('Klang', 'UGen', {}, { ar: (c, a, kw) => { let spec = A(a, kw, 0, 'specificationsArrayRef'); if (spec instanceof Ref) spec = spec.value; const fs = A(a, kw, 1, 'freqscale', 1), fo = A(a, kw, 2, 'freqoffset', 0); const fr = toArr(spec[0]), am = spec[1] ? toArr(spec[1]) : null, ph = spec[2] ? toArr(spec[2]) : null;
  return mix(fr.map((f, i) => binop('*', makeUGen('SinOsc', 'ar', [binop('+', binop('*', f, fs), fo), ph ? ph[i % ph.length] : 0], 1), am ? am[i % am.length] : 1))); } });
defClass('GrainSin', 'UGen', {}, { ar: (c, a, kw) => grain('GrainSin', a, kw) });
defClass('GrainFM', 'UGen', {}, { ar: (c, a, kw) => grain('GrainFM', a, kw) });
function grain(name, a, kw) {
  const nc = num(A(a, kw, 0, 'numChannels', 1));
  const ins = name === 'GrainSin' ? [A(a, kw, 1, 'trigger', 0), A(a, kw, 2, 'dur', 1), A(a, kw, 3, 'freq', 440), A(a, kw, 4, 'pan', 0)]
    : [A(a, kw, 1, 'trigger', 0), A(a, kw, 2, 'dur', 1), A(a, kw, 3, 'carfreq', 440), A(a, kw, 4, 'modfreq', 200), A(a, kw, 5, 'index', 1), A(a, kw, 6, 'pan', 0)];
  const mul = A(a, kw, name === 'GrainSin' ? 7 : 9, 'mul', 1), add = A(a, kw, name === 'GrainSin' ? 8 : 10, 'add', 0);
  const r = makeUGen(name, 'ar', ins, nc === 1 ? 1 : 2, null);
  return (mul === 1 && add === 0) ? r : binop('+', binop('*', r, mul), add);
}
defClass('Poll', 'UGen', {}, { ar: (c, a, kw) => poll(a, kw), kr: (c, a, kw) => poll(a, kw), new: (c, a, kw) => poll(a, kw) });
function poll(a, kw) { const tr = A(a, kw, 0, 'trig', 10), x = A(a, kw, 1, 'in'), label = A(a, kw, 2, 'label', sym('UGen')); const t = isNum(tr) ? makeUGen('Impulse', 'kr', [tr, 0], 1) : tr; return makeUGen('Poll', 'kr', [t, x], 1, { label: LIB.I.str(label) }, { side: true }); }
// Demand
class DSpec { constructor(d, o) { this.d = d; Object.assign(this, o); } }
DSpec.prototype.scClass = 'DUGen';
LIB.DSpec = DSpec;
function dlist(x) { return toArr(x).map(v => { if (v instanceof DSpec) return v; if (isNum(v)) return num(v); if (Array.isArray(v)) return dlist(v); err('Demand UGens here accept numbers or other D-UGens (Dseq, Drand...)'); }); }
const rep = v => v == null ? 1 : (num(v) === Infinity ? 1e12 : num(v));
defClass('DUGen', 'Object', { '*': (r, a) => err('Math on demand UGens is not supported here; write the values directly in the list') });
const dmk = (d, f) => defClass(d, 'DUGen', {}, { new: f });
dmk('Dseq', (c, a, kw) => new DSpec('Dseq', { list: dlist(A(a, kw, 0, 'list')), repeats: rep(A(a, kw, 1, 'repeats', 1)) }));
dmk('Dser', (c, a, kw) => new DSpec('Dser', { list: dlist(A(a, kw, 0, 'list')), repeats: rep(A(a, kw, 1, 'repeats', 1)) }));
dmk('Drand', (c, a, kw) => new DSpec('Drand', { list: dlist(A(a, kw, 0, 'list')), repeats: rep(A(a, kw, 1, 'repeats', 1)) }));
dmk('Dxrand', (c, a, kw) => new DSpec('Dxrand', { list: dlist(A(a, kw, 0, 'list')), repeats: rep(A(a, kw, 1, 'repeats', 1)) }));
dmk('Dshuf', (c, a, kw) => new DSpec('Dshuf', { list: dlist(A(a, kw, 0, 'list')), repeats: rep(A(a, kw, 1, 'repeats', 1)) }));
dmk('Dwhite', (c, a, kw) => new DSpec('Dwhite', { lo: num(A(a, kw, 0, 'lo', 0)), hi: num(A(a, kw, 1, 'hi', 1)), length: rep(A(a, kw, 2, 'length', Infinity)) }));
dmk('Diwhite', (c, a, kw) => new DSpec('Diwhite', { lo: num(A(a, kw, 0, 'lo', 0)), hi: num(A(a, kw, 1, 'hi', 1)), length: rep(A(a, kw, 2, 'length', Infinity)) }));
dmk('Dbrown', (c, a, kw) => new DSpec('Dbrown', { lo: num(A(a, kw, 0, 'lo', 0)), hi: num(A(a, kw, 1, 'hi', 1)), step: num(A(a, kw, 2, 'step', 0.01)), length: rep(A(a, kw, 3, 'length', Infinity)) }));
dmk('Dseries', (c, a, kw) => new DSpec('Dseries', { start: num(A(a, kw, 0, 'start', 1)), step: num(A(a, kw, 1, 'step', 1)), length: rep(A(a, kw, 2, 'length', Infinity)) }));
dmk('Dgeom', (c, a, kw) => new DSpec('Dgeom', { start: num(A(a, kw, 0, 'start', 1)), grow: num(A(a, kw, 1, 'grow', 2)), length: rep(A(a, kw, 2, 'length', Infinity)) }));
function demandU(rate, a, kw) {
  const trig = A(a, kw, 0, 'trig'), reset = A(a, kw, 1, 'reset', 0), d = A(a, kw, 2, 'demandUGens');
  const specs = toArr(d).map(x => x instanceof DSpec ? x : (isNum(x) ? num(x) : err('Demand needs Dseq, Drand...')));
  const r = makeUGen('Demand', rate, [trig, reset], specs.length, { specs });
  return r;
}
defClass('Demand', 'UGen', {}, { ar: (c, a, kw) => demandU('ar', a, kw), kr: (c, a, kw) => demandU('kr', a, kw) });
function dutyU(name, rate, a, kw) {
  const dur = A(a, kw, 0, 'dur', 1), reset = A(a, kw, 1, 'reset', 0), level = A(a, kw, 2, 'level', 1), da = num(A(a, kw, 3, 'doneAction', 0));
  const durSpec = dur instanceof DSpec ? dur : null;
  const levelSpec = level instanceof DSpec ? level : num(level);
  const r = makeUGen(name, rate, [durSpec ? 0 : dur, reset], 1, { durSpec, levelSpec, doneAction: da }, { side: da >= 2 });
  const mul = A(a, kw, 4, 'mul', 1), add = A(a, kw, 5, 'add', 0);
  return (mul === 1 && add === 0) ? r : binop('+', binop('*', r, mul), add);
}
defClass('Duty', 'UGen', {}, { ar: (c, a, kw) => dutyU('Duty', 'ar', a, kw), kr: (c, a, kw) => dutyU('Duty', 'kr', a, kw) });
defClass('TDuty', 'UGen', {}, { ar: (c, a, kw) => dutyU('TDuty', 'ar', a, kw), kr: (c, a, kw) => dutyU('TDuty', 'kr', a, kw) });
defClass('Done', 'Object', {}, { none: () => 0, pauseSelf: () => 1, freeSelf: () => 2, freeSelfAndPrev: () => 2, freeSelfAndNext: () => 2, freeAll: () => 2, freeGroup: () => 2 });
defClass('LinLin', 'UGen', {}, { ar: (c, a) => mathIM.linlin(a[0], a.slice(1)), kr: (c, a) => mathIM.linlin(a[0], a.slice(1)) });
defClass('LinExp', 'UGen', {}, { ar: (c, a) => mathIM.linexp(a[0], a.slice(1)), kr: (c, a) => mathIM.linexp(a[0], a.slice(1)) });
defClass('MulAdd', 'UGen', {}, { new: (c, a) => binop('+', binop('*', a[0], a[1] ?? 1), a[2] ?? 0) });

// ======================================================================
// Env
// ======================================================================
class Env {
  constructor(levels, times, curves, rel, loop) { this.levels = levels; this.times = times; this.curves = curves; this.releaseNode = rel; this.loopNode = loop; }
  duration() { return this.times.reduce((s, t) => s + (isNum(t) ? num(t) : 0), 0); }
  // sample envelope (numbers only) for plotting
  sample(n = 400, sustainTime = 0.6) {
    const lv = this.levels.map(x => isNum(x) ? num(x) : 0.5), tm = this.times.map(x => isNum(x) ? num(x) : 0.1);
    const segs = []; let t = 0;
    for (let i = 0; i < tm.length; i++) { if (this.releaseNode != null && i === this.releaseNode) t += sustainTime; segs.push({ t0: t, t1: t + tm[i], a: lv[i], b: lv[i + 1] ?? 0, c: Array.isArray(this.curves) ? this.curves[i % this.curves.length] : this.curves }); t += tm[i]; }
    const total = t || 1; const pts = [];
    for (let k = 0; k <= n; k++) {
      const tt = total * k / n; let v = lv[0];
      for (const s of segs) { if (tt >= s.t1) v = s.b; else if (tt >= s.t0) { const [sh, cv] = shapeOf(s.c); v = envInterpJS(sh, isNum(cv) ? num(cv) : 0, s.a, s.b, s.t1 > s.t0 ? (tt - s.t0) / (s.t1 - s.t0) : 1); break; } }
      pts.push(v);
    }
    return { pts, total, segs };
  }
}
Env.prototype.scClass = 'Env';
function envInterpJS(shape, curve, a, b, pos) {
  switch (shape) {
    case 0: return b; case 1: return a + (b - a) * pos;
    case 2: { const A_ = Math.abs(a) < 1e-4 ? 1e-4 : a, B_ = Math.abs(b) < 1e-4 ? 1e-4 : b; return A_ * Math.pow(B_ / A_, pos); }
    case 3: return a + (b - a) * (0.5 - 0.5 * Math.cos(Math.PI * pos));
    case 4: return a < b ? a + (b - a) * Math.sin(Math.PI / 2 * pos) : b + (a - b) * Math.sin(Math.PI / 2 * (1 - pos));
    case 5: if (Math.abs(curve) < 0.001) return a + (b - a) * pos; return a + (b - a) * (1 - Math.exp(curve * pos)) / (1 - Math.exp(curve));
    case 6: { const s = Math.sqrt(Math.max(a, 0)), e = Math.sqrt(Math.max(b, 0)); const v = s + (e - s) * pos; return v * v; }
    case 7: { const s = Math.cbrt(a), e = Math.cbrt(b); const v = s + (e - s) * pos; return v * v * v; }
    case 8: return pos < 1 ? a : b;
  }
  return b;
}
LIB.Env = Env;
const mkEnv = (l, t, c, r, lp) => new Env(toArr(l), toArr(t), c == null ? sym('lin') : c, r == null ? null : num(r), lp == null ? null : num(lp));
defClass('Env', 'Object', {
  levels: r => r.levels, times: r => r.times, curves: r => r.curves, releaseNode: r => r.releaseNode, loopNode: r => r.loopNode,
  duration: r => r.duration(), totalDuration: r => r.duration(),
  levels_: (r, a) => { r.levels = toArr(a[0]); return r; }, times_: (r, a) => { r.times = toArr(a[0]); return r; }, curves_: (r, a) => { r.curves = a[0]; return r; }, releaseNode_: (r, a) => { r.releaseNode = a[0]; return r; },
  plot(r, a, kw) { const s = r.sample(500); LIB.host.ui.plot([s.pts], { title: 'Env', duration: s.total, env: true, minval: A(a, kw, 3, 'minval', null), maxval: A(a, kw, 4, 'maxval', null) }); return r; },
  asArray: r => envFlat(r), at(r, a) { const s = r.sample(1000, 0); const t = num(a[0]); return s.pts[Math.min(1000, Math.max(0, Math.round(t / (s.total || 1) * 1000)))]; },
  kr(r, a, kw) { return envGen('kr', [r, A(a, kw, 1, 'gate', 1), 1, 0, A(a, kw, 2, 'timeScale', 1), A(a, kw, 0, 'doneAction', 0), A(a, kw, 3, 'mul', 1), A(a, kw, 4, 'add', 0)], []); },
  ar(r, a, kw) { return envGen('ar', [r, A(a, kw, 1, 'gate', 1), 1, 0, A(a, kw, 2, 'timeScale', 1), A(a, kw, 0, 'doneAction', 0), A(a, kw, 3, 'mul', 1), A(a, kw, 4, 'add', 0)], []); },
  test(r, a) { const rt = num(a[0] ?? 3); const env = r; LIB.functionPlay(() => binop('*', makeUGen('SinOsc', 'ar', [800, 0], 1), binop('*', envGen('kr', [env, 1, 1, 0, 1, 2], []), 0.2)), null, 0, 0.005); return r; },
  delay(r, a) { return mkEnv([r.levels[0]].concat(r.levels), [num(a[0])].concat(r.times), Array.isArray(r.curves) ? [sym('lin')].concat(r.curves) : r.curves, r.releaseNode == null ? null : r.releaseNode + 1, r.loopNode == null ? null : r.loopNode + 1); },
  '*': (r, a) => mkEnv(r.levels.map(x => binop('*', x, a[0])), r.times, r.curves, r.releaseNode, r.loopNode),
  range(r, a) { const lo = num(a[0] ?? 0), hi = num(a[1] ?? 1); const l = r.levels.map(num); const mn = Math.min(...l), mx = Math.max(...l); return mkEnv(l.map(x => lo + (x - mn) / ((mx - mn) || 1) * (hi - lo)), r.times, r.curves, r.releaseNode, r.loopNode); },
  circle(r) { return r; },
}, {
  new: (c, a, kw) => mkEnv(A(a, kw, 0, 'levels', [0, 1, 0]), A(a, kw, 1, 'times', [1, 1]), A(a, kw, 2, 'curve', sym('lin')), A(a, kw, 3, 'releaseNode', null), A(a, kw, 4, 'loopNode', null)),
  perc: (c, a, kw) => { const at = A(a, kw, 0, 'attackTime', 0.01), rt = A(a, kw, 1, 'releaseTime', 1), lv = A(a, kw, 2, 'level', 1), cv = A(a, kw, 3, 'curve', -4); return mkEnv([0, lv, 0], [at, rt], cv); },
  adsr: (c, a, kw) => { const at = A(a, kw, 0, 'attackTime', 0.01), dt = A(a, kw, 1, 'decayTime', 0.3), sl = A(a, kw, 2, 'sustainLevel', 0.5), rt = A(a, kw, 3, 'releaseTime', 1), pk = A(a, kw, 4, 'peakLevel', 1), cv = A(a, kw, 5, 'curve', -4), b = A(a, kw, 6, 'bias', 0);
    return mkEnv([0, pk, binop('*', pk, sl), 0].map(x => binop('+', x, b)), [at, dt, rt], cv, 2); },
  asr: (c, a, kw) => { const at = A(a, kw, 0, 'attackTime', 0.01), sl = A(a, kw, 1, 'sustainLevel', 1), rt = A(a, kw, 2, 'releaseTime', 1), cv = A(a, kw, 3, 'curve', -4); return mkEnv([0, sl, 0], [at, rt], cv, 1); },
  dadsr: (c, a, kw) => { const dl = A(a, kw, 0, 'delayTime', 0.1), at = A(a, kw, 1, 'attackTime', 0.01), dt = A(a, kw, 2, 'decayTime', 0.3), sl = A(a, kw, 3, 'sustainLevel', 0.5), rt = A(a, kw, 4, 'releaseTime', 1), pk = A(a, kw, 5, 'peakLevel', 1), cv = A(a, kw, 6, 'curve', -4); return mkEnv([0, 0, pk, binop('*', pk, sl), 0], [dl, at, dt, rt], cv, 3); },
  linen: (c, a, kw) => { const at = A(a, kw, 0, 'attackTime', 0.01), st = A(a, kw, 1, 'sustainTime', 1), rt = A(a, kw, 2, 'releaseTime', 1), lv = A(a, kw, 3, 'level', 1), cv = A(a, kw, 4, 'curve', sym('lin')); return mkEnv([0, lv, lv, 0], [at, st, rt], cv); },
  triangle: (c, a, kw) => { const h = binop('*', A(a, kw, 0, 'dur', 1), 0.5), lv = A(a, kw, 1, 'level', 1); return mkEnv([0, lv, 0], [h, h]); },
  sine: (c, a, kw) => { const h = binop('*', A(a, kw, 0, 'dur', 1), 0.5), lv = A(a, kw, 1, 'level', 1); return mkEnv([0, lv, 0], [h, h], sym('sin')); },
  cutoff: (c, a, kw) => { const rt = A(a, kw, 0, 'releaseTime', 0.1), lv = A(a, kw, 1, 'level', 1), cv = A(a, kw, 2, 'curve', sym('lin')); return mkEnv([lv, 0], [rt], cv, 0); },
  pairs: (c, a, kw) => { const p = A(a, kw, 0, 'pairs'), cv = A(a, kw, 1, 'curve', sym('lin')); const tms = p.map(x => num(x[0])); return mkEnv(p.map(x => x[1]), tms.slice(1).map((t, i) => t - tms[i]), cv); },
  step: (c, a, kw) => { const l = A(a, kw, 0, 'levels', [0, 1]), t = A(a, kw, 1, 'times', [1, 1]); return mkEnv([l[0]].concat(l), t, sym('step')); },
});

// ======================================================================
// SynthDef compilation
// ======================================================================
function newBuilder() { return { all: [], side: [], controls: [], ctlMap: new Map(), ctlIndex: 0 }; }
function makeControl(B, name, def, lag, kind) {
  if (B.ctlMap.has(name)) return B.ctlMap.get(name);
  const defaults = toArr(def).map(v => isNum(v) ? num(v) : (typeof v === 'boolean' ? (v ? 1 : 0) : (v && v.scClass === 'Bus' ? v.index : (v == null ? 0 : err("Default value of argument '" + name + "' must be a number or an array of numbers")))));
  const size = defaults.length || 1;
  const rate = kind === 'ar' ? 'ar' : kind === 'ir' ? 'ir' : 'kr';
  const node = new UGenNode('Control', rate, [], size, { index: B.ctlIndex, name });
  B.all.push(node);
  B.controls.push({ name, index: B.ctlIndex, size, defaults, lag: isNum(lag) ? num(lag) : 0, trig: kind === 'tr', rate });
  B.ctlIndex += size;
  const r = size === 1 && !Array.isArray(def) ? new OutRef(node, 0) : Array.from({ length: size }, (_, i) => new OutRef(node, i));
  B.ctlMap.set(name, r);
  return r;
}
LIB.namedControl = (name, kind, def, lag) => {
  const B = LIB.I.builder;
  if (!B) err("Named controls (\\" + name + ".kr) only work inside a SynthDef or { }.play");
  return makeControl(B, name, def, lag, kind);
};

function serialize(name, B, roots) {
  const order = [], idx = new Map();
  const visiting = new Set();
  const visit = (n) => {
    if (idx.has(n)) return;
    if (visiting.has(n)) err('Cycle in UGen graph');
    visiting.add(n);
    for (const x of n.inputs) if (x instanceof OutRef) visit(x.node);
    visiting.delete(n);
    idx.set(n, order.length); order.push(n);
  };
  // controls first (stable layout), then roots
  B.all.filter(n => n.name === 'Control').forEach(visit);
  roots.forEach(visit);
  if (order.length > 4000) err('SynthDef too large (' + order.length + ' UGens)');
  const units = order.map(n => ({
    name: n.name, rate: n.rate, nout: n.nout, params: n.params,
    ins: n.inputs.map(x => x instanceof OutRef ? ['u', idx.get(x.node), x.index] : ['c', x]),
  }));
  const ctlIndex = {}; let hasGate = false;
  B.controls.forEach(c => { ctlIndex[c.name] = c.index; if (c.name === 'gate') hasGate = true; });
  return { name, units, controls: B.controls, ctlIndex, numControls: B.ctlIndex, hasGate };
}

// compile an SC function into a def. opts: { wrapOut, outbus, lags, rates }
function compileDef(name, fn, opts = {}) {
  const I = LIB.I; const B = newBuilder(); const prev = I.builder; I.builder = B;
  try {
    const args = [];
    if (fn instanceof SCFunction) {
      const lags = opts.lags ? toArr(opts.lags) : [];
      fn.node.params.forEach((p, i) => {
        let def = 0;
        if (p.def) { def = I.runSync(I.ev(p.def, fn.closure)); }
        let kind = 'kr'; if (p.name.startsWith('t_')) kind = 'tr'; else if (p.name.startsWith('i_')) kind = 'ir'; else if (p.name.startsWith('a_')) kind = 'ar';
        if (opts.rates && opts.rates[i] instanceof Sym) { const rr = opts.rates[i].name; if (rr === 'tr') kind = 'tr'; else if (rr === 'ir') kind = 'ir'; else if (rr === 'ar') kind = 'ar'; }
        const lag = lags[i] != null && isNum(lags[i]) ? num(lags[i]) : 0;
        args.push(makeControl(B, p.name, def, lag, kind));
      });
    }
    let result = (fn instanceof SCFunction) ? I.callSync(fn, args) : fn();
    if (result && result.scClass === 'Ndef') result = result.ar();
    const roots = B.side.slice();
    let numCh = 0;
    if (opts.wrapOut) {
      const isOutResult = isUG(result) && result.node.nout === 0;
      if (result != null && !isOutResult) {
        let chans = flat(toArr(result));
        chans = chans.map(x => (isNum(x) || isUG(x)) ? x : (x && x.scClass === 'Ndef' ? x.ar() : err('The function returned ' + I.str(x) + ', which is not a signal. End the function with a UGen.')));
        chans = flat(chans);
        numCh = chans.length;
        if (numCh > 64) err('Too many channels (' + numCh + ')');
        const bus = opts.busControl ? makeControl(B, opts.busControl, opts.outbus || 0, 0, 'kr') : (opts.outbus || 0);
        const outNode = makeUGen('Out', 'ar', [bus, chans], 0, null, { noExpand: [1], side: false });
        roots.push(outNode.node);
      }
    } else if (result != null && isUG(result) && result.node.nout !== 0) {
      // a SynthDef that returns a signal without Out: keep it reachable (silent) – SC also ignores it
    }
    if (!roots.length && opts.wrapOut) err('The function produced no sound (it returned ' + I.str(result) + ').');
    const def = serialize(name, B, roots);
    def.numCh = numCh;
    def.src = opts.src || null;
    return def;
  } finally { I.builder = prev; }
}
LIB.compileDef = compileDef;

function sendDef(def) { LIB.defs.set(def.name, def); LIB.host.engine.send({ type: 'd_recv', def }); }
LIB.sendDef = sendDef;

// ======================================================================
// Synth / Server / Bus / Group
// ======================================================================
class LSynth {
  constructor(id, defName, def) { this.id = id; this.defName = defName; this.def = def; this.isPlaying = true; this.isRunning = true; this.onFreeFns = []; }
  printOn() { return 'Synth(\'' + this.defName + '\' : ' + this.id + ')'; }
}
LSynth.prototype.scClass = 'Synth';
LIB.LSynth = LSynth;
function argsToControls(args) {
  const c = {};
  if (args instanceof SCEvent) { args.d.forEach((v, k) => c[k] = ctlVal(v)); return c; }
  const a = toArr(args || []);
  for (let i = 0; i + 1 < a.length; i += 2) {
    const k = a[i] instanceof Sym ? a[i].name : (typeof a[i] === 'string' ? a[i] : isNum(a[i]) ? String(num(a[i])) : err('Synth args must be pairs: [\\freq, 440, \\amp, 0.2]'));
    c[k] = ctlVal(a[i + 1]);
  }
  return c;
}
function ctlVal(v) {
  if (isNum(v)) return num(v); if (typeof v === 'boolean') return v ? 1 : 0;
  if (Array.isArray(v)) return v.map(ctlVal);
  if (v && v.scClass === 'Bus') return v.index;
  if (v instanceof Sym && /^[ca]\d+$/.test(v.name)) return 0;
  if (v == null) return 0;
  err('Synth control values must be numbers (got ' + LIB.I.str(v) + ')');
}
LIB.argsToControls = argsToControls; LIB.ctlVal = ctlVal;
function msgTime() { const t = LIB.I.thread; return t && t.isRoutine && t.time != null ? t.time : undefined; }
LIB.msgTime = msgTime;
function newSynth(defName, args, target, addAction, extra = {}) {
  const name = sname(defName);
  const def = LIB.defs.get(name);
  if (!def) err("SynthDef '" + name + "' not found. Did you call .add on it?");
  LIB.host.engine.boot();
  const id = LIB.nextId++;
  const s = new LSynth(id, name, def);
  const act = addAction instanceof Sym ? addAction.name : (addAction || 'addToHead');
  const actMap = { addToHead: 'head', addToTail: 'tail', addBefore: 'before', addAfter: 'after', addReplace: 'replace', head: 'head', tail: 'tail', before: 'before', after: 'after', replace: 'replace' };
  let tgt = null;
  if (target && target.scClass === 'Synth') tgt = target.id;
  if (target && target.scClass === 'Group') { target.members.push(s); s.group = target; }
  LIB.synths.set(id, s);
  LIB.host.engine.send(Object.assign({ type: 's_new', id, defName: name, controls: argsToControls(args), addAction: actMap[act] || 'head', target: tgt, time: msgTime() }, extra));
  LIB.host.ui.synthStarted && LIB.host.ui.synthStarted(s, def);
  return s;
}
LIB.newSynth = newSynth;
LIB.onEnded = ids => { ids.forEach(id => { const s = LIB.synths.get(id); if (s) { s.isPlaying = false; LIB.synths.delete(id); s.onFreeFns.forEach(f => { try { LIB.I.callSync(f, [s]); } catch (e) { LIB.host.ui.error(e); } }); } }); };

defClass('Node', 'Object', {});
defClass('Synth', 'Node', {
  set(r, a) { if (!r.isPlaying) return r; LIB.host.engine.send({ type: 'n_set', id: r.id, controls: argsToControls(a), time: msgTime() }); return r; },
  setn(r, a) { return CLASSES.Synth.im.set(r, a); }, xset(r, a) { return CLASSES.Synth.im.set(r, a); },
  free(r) { LIB.host.engine.send({ type: 'n_free', id: r.id, time: msgTime() }); return r; },
  release(r, a) { const t = a[0]; if (r.def && r.def.hasGate && !r.def.isFn) LIB.host.engine.send({ type: 'n_set', id: r.id, controls: { gate: 0 }, time: msgTime() }); else LIB.host.engine.send({ type: 'n_fade', id: r.id, fadeTime: t == null ? (r.fadeTime || 0.02) : num(t), free: true, time: msgTime() }); return r; },
  run(r, a) { return r; }, nodeID: r => r.id, defName: r => sym(r.defName), isPlaying: r => r.isPlaying, isRunning: r => r.isPlaying,
  register(r) { return r; }, onFree(r, a) { r.onFreeFns.push(a[0]); return r; },
  get(r, a) { LIB.I.post('(get is asynchronous in SC; this web version cannot read values back from the server)'); return r; },
  map(r) { return r; }, moveAfter: r => r, moveBefore: r => r, moveToHead: r => r, moveToTail: r => r,
  trace(r) { LIB.host.ui.showGraph(r.def, r.id); return r; },
}, {
  new: (c, a, kw) => newSynth(A(a, kw, 0, 'defName'), A(a, kw, 1, 'args', []), A(a, kw, 2, 'target'), A(a, kw, 3, 'addAction', sym('addToHead'))),
  head: (c, a) => newSynth(a[1], a[2], a[0], sym('addToHead')),
  tail: (c, a) => newSynth(a[1], a[2], a[0], sym('addToTail')),
  after: (c, a) => newSynth(a[1], a[2], a[0], sym('addAfter')),
  before: (c, a) => newSynth(a[1], a[2], a[0], sym('addBefore')),
  replace: (c, a) => newSynth(a[1], a[2], a[0], sym('addReplace')),
  grain: (c, a, kw) => { newSynth(A(a, kw, 0, 'defName'), A(a, kw, 1, 'args', []), A(a, kw, 2, 'target'), A(a, kw, 3, 'addAction')); return null; },
});
defClass('Group', 'Node', {
  free(r) { r.members.forEach(s => CLASSES.Synth.im.free(s)); r.members = []; return r; },
  set(r, a) { r.members.forEach(s => CLASSES.Synth.im.set(s, a)); return r; },
  release(r, a) { r.members.forEach(s => CLASSES.Synth.im.release(s, a)); return r; },
  freeAll(r) { return CLASSES.Group.im.free(r); }, deepFree(r) { return CLASSES.Group.im.free(r); },
}, { new: () => ({ scClass: 'Group', id: LIB.nextId++, members: [] }), head: () => ({ scClass: 'Group', id: LIB.nextId++, members: [] }), tail: () => ({ scClass: 'Group', id: LIB.nextId++, members: [] }), after: () => ({ scClass: 'Group', id: LIB.nextId++, members: [] }), basicNew: () => ({ scClass: 'Group', id: LIB.nextId++, members: [] }) });
defClass('ParGroup', 'Group', {}, CLASSES.Group.cm);

defClass('SynthDef', 'Object', {
  add(r) { sendDef(r.def); LIB.host.ui.defAdded && LIB.host.ui.defAdded(r.def); return r; },
  send(r) { return CLASSES.SynthDef.im.add(r); }, store(r) { return CLASSES.SynthDef.im.add(r); }, load(r) { return CLASSES.SynthDef.im.add(r); }, writeDefFile(r) { return r; },
  play(r, a, kw) { sendDef(r.def); return newSynth(r.def.name, A(a, kw, 1, 'args', []), A(a, kw, 0, 'target'), A(a, kw, 2, 'addAction', sym('addToHead'))); },
  name: r => sym(r.def.name), dumpUGens(r) { r.def.units.forEach((u, i) => { const nm = (u.name === 'BinaryOpUGen' || u.name === 'UnaryOpUGen') ? u.name + ' ' + u.params.op : u.name; LIB.I.post('[' + i + '] ' + nm + ' ' + u.rate + ' ' + JSON.stringify(u.ins.map(x => x[0] === 'c' ? x[1] : '[' + x[1] + ']'))); }); return r; },
  plot(r) { LIB.host.ui.showGraph(r.def, null); return r; },
  graph(r) { LIB.host.ui.showGraph(r.def, null); return r; },
  allControlNames: r => r.def.controls.map(c => sym(c.name)),
}, {
  new(c, a, kw) {
    const name = sname(A(a, kw, 0, 'name')); const fn = A(a, kw, 1, 'ugenGraphFunc');
    if (!(fn instanceof SCFunction)) err('SynthDef needs a name and a function: SynthDef(\\name, { ... })');
    const rates = A(a, kw, 2, 'rates', null);
    const def = compileDef(name, fn, { lags: rates && Array.isArray(rates) ? rates.map(x => isNum(x) ? x : 0) : null, rates: rates && Array.isArray(rates) ? rates : null, src: fn.node });
    return { scClass: 'SynthDef', def, printOn: () => 'a SynthDef' };
  },
  removeAt(c, a) { LIB.defs.delete(sname(a[0])); return c; },
});
defClass('SynthDescLib', 'Object', {}, { global: c => c, read: c => c, at: (c, a) => LIB.defs.get(sname(a[0])) ? { scClass: 'Object' } : null });

// Function.play
LIB.functionPlay = function (fn, target, outbus, fadeTime, addAction, args) {
  LIB.host.engine.boot();
  const name = 'temp__' + (LIB.nextId);
  const def = compileDef(name, fn, { wrapOut: true, outbus: num(outbus || 0), src: fn instanceof SCFunction ? fn.node : null });
  def.isFn = true;
  sendDef(def);
  const s = newSynth(name, args || [], target, addAction, { fadeIn: num(fadeTime == null ? 0.02 : fadeTime), tag: 'fn' });
  s.fadeTime = num(fadeTime == null ? 0.02 : fadeTime);
  LIB.defs.delete(name);
  return s;
};
LIB.functionPlot = function (fn, dur, minval, maxval) {
  const def = compileDef('plot__', fn, { wrapOut: true });
  const data = LIB.host.engine.renderOffline(def, def.numCh || 1, Math.min(Math.max(dur, 0.0005), 10));
  LIB.host.ui.plot(data, { title: 'plot', duration: dur, minval: minval == null ? null : num(minval), maxval: maxval == null ? null : num(maxval) });
  return fn;
};

// Server
const serverObj = { scClass: 'Server', name: 'localhost', printOn: () => 'localhost' };
LIB.server = serverObj;
let recPath = null;
defClass('Server', 'Object', {
  boot(r) { LIB.host.engine.boot(true); return r; },
  reboot(r) { LIB.host.engine.send({ type: 'freeAll' }); LIB.stopAll && LIB.stopAll(); LIB.host.engine.boot(true); return r; },
  quit(r) { LIB.stopAll && LIB.stopAll(); LIB.host.engine.send({ type: 'freeAll' }); LIB.I.post("/quit sent (the web server keeps running: press boot again whenever you want)"); return r; },
  waitForBoot: function* (r, a) { LIB.host.engine.boot(true); if (a[0]) return yield* LIB.I.call(a[0]); return r; },
  doWhenBooted: function* (r, a) { if (a[0]) return yield* LIB.I.call(a[0]); return r; },
  bind: function* (r, a) { return yield* LIB.I.call(a[0]); }, makeBundle: function* (r, a) { return yield* LIB.I.call(a[1]); },
  sync(r) { return r; }, freeAll(r) { LIB.host.engine.send({ type: 'freeAll' }); return r; },
  plotTree(r) { LIB.host.ui.show('tree'); return r; }, meter(r) { LIB.host.ui.show('meter'); return r; },
  scope(r) { LIB.host.ui.show('scope'); return r; }, freqscope(r) { LIB.host.ui.show('spectrum'); return r; },
  makeWindow(r) { LIB.host.ui.show('server'); return r; }, makeGui(r) { LIB.host.ui.show('server'); return r; },
  record(r) { LIB.host.engine.startRecording(); LIB.I.post('Recording started. Stop with s.stopRecording'); return r; },
  stopRecording(r) { LIB.host.engine.stopRecording(); return r; },
  volume(r) { return { scClass: 'Volume', printOn: () => LIB.host.engine.volumeDb().toFixed(1) + ' dB' }; },
  volume_(r, a) { LIB.host.engine.setVolumeDb(num(a[0])); return r; },
  mute(r) { LIB.host.engine.setMute(true); return r; }, unmute(r) { LIB.host.engine.setMute(false); return r; },
  sampleRate: () => LIB.host.engine.sampleRate(), actualSampleRate: () => LIB.host.engine.sampleRate(),
  latency: () => 0.2, latency_: r => r, options: () => optionsObj, serverRunning: () => true, isLocal: () => true, hasBooted: () => true,
  numSynths: () => LIB.host.engine.status.synths || 0, numUGens: () => LIB.host.engine.status.ugens || 0, avgCPU: () => LIB.host.engine.status.cpu || 0, peakCPU: () => LIB.host.engine.status.cpu || 0,
  defaultGroup: () => ({ scClass: 'Group', id: 1, members: [] }), nextNodeID: () => LIB.nextId++,
  queryAllNodes(r) { const st = LIB.host.engine.status; LIB.I.post('NODE TREE Group 0\n   1 group' + (st.nodes || []).map(n => '\n      ' + n[0] + ' ' + n[1]).join('')); return r; },
  name: () => sym('localhost'), addr: () => null, sendMsg(r) { LIB.I.post('(OSC messages are not available in the web version)'); return r; },
  dumpOSC: r => r, notify: r => r, ping: r => r, inputBus: () => ({ scClass: 'Bus', index: 2, numChannels: 2 }), outputBus: () => ({ scClass: 'Bus', index: 0, numChannels: 2 }),
}, { default: () => serverObj, local: () => serverObj, internal: () => serverObj, killAll: c => { LIB.host.engine.send({ type: 'freeAll' }); return c; }, new: () => serverObj });
const optionsObj = { scClass: 'ServerOptions' };
defClass('ServerOptions', 'Object', {}, { new: () => optionsObj });
LIB.I_fallbackOptions = true;

// Bus
defClass('Bus', 'Object', {
  index: r => r.index, numChannels: r => r.numChannels, rate: r => sym(r.rate),
  set(r, a) { a.forEach((v, i) => { r.vals[i] = num(v); LIB.host.engine.send({ type: 'c_set', index: r.index + i, value: num(v), time: msgTime() }); }); return r; },
  setSynchronous(r, a) { return CLASSES.Bus.im.set(r, a); },
  get: function* (r, a) { const v = r.numChannels === 1 ? r.vals[0] : r.vals.slice(); if (a[0]) yield* LIB.I.call(a[0], [v]); return v; },
  getSynchronous: r => r.vals[0], free: r => r, asMap: r => sym((r.rate === 'audio' ? 'a' : 'c') + r.index), kr(r) { return inUGen('In', 'kr', [r.index, r.numChannels], []); }, ar(r) { return inUGen('In', 'ar', [r.index, r.numChannels], []); },
  subBus: (r, a) => ({ scClass: 'Bus', rate: r.rate, index: r.index + num(a[0]), numChannels: num(a[1] ?? 1), vals: [0], printOn: r.printOn }),
  printOn: null,
}, {
  audio(c, a) { const n = num(a[1] ?? 1); const b = { scClass: 'Bus', rate: 'audio', index: LIB.busNext, numChannels: n, vals: [] }; LIB.busNext += n; if (LIB.busNext > 240) LIB.busNext = 4; b.printOn = () => 'Bus(audio, ' + b.index + ', ' + n + ')'; return b; },
  control(c, a) { const n = num(a[1] ?? 1); const b = { scClass: 'Bus', rate: 'control', index: LIB.ctlBusNext, numChannels: n, vals: new Array(n).fill(0) }; LIB.ctlBusNext += n; b.printOn = () => 'Bus(control, ' + b.index + ', ' + n + ')'; return b; },
});

// Thread / Main helpers
defClass('Thread', 'Object', {
  randSeed_: (r, a) => { LIB.I.setSeed(num(a[0])); return r; }, seconds: () => (LIB.I.thread.time ?? LIB.host.engine.now()), beats: () => LIB.I.thread.isRoutine ? LIB.I.thread.beats : (LIB.TempoClock ? LIB.TempoClock.default.beats() : 0),
  clock: () => LIB.I.thread.clock || (LIB.TempoClock && LIB.TempoClock.default), randData_: r => r, isPlaying: () => LIB.I.thread.isRoutine,
});
defClass('Main', 'Object', { platform: () => ({ scClass: 'Object' }), recompile: r => r });
defClass('Platform', 'Object', {}, { userAppSupportDir: () => '/', resourceDir: () => '/', ideName: () => 'scweb', name: () => sym('web') });
defClass('Date', 'Object', { hour: r => r.d.getHours(), minute: r => r.d.getMinutes(), second: r => r.d.getSeconds(), asString: r => r.d.toString() }, { localtime: () => ({ scClass: 'Date', d: new Date(), printOn: () => new Date().toString() }), getDate: () => ({ scClass: 'Date', d: new Date(), printOn: () => new Date().toString() }) });
defClass('Rest', 'Object', { dur: r => r.dur, value: r => r.dur, isRest: () => true, printOn: null }, { new: (c, a) => ({ scClass: 'Rest', dur: a[0] == null ? 1 : num(a[0]), printOn: () => 'Rest(' + (a[0] == null ? 1 : num(a[0])) + ')' }) });
CLASSES.Rest.im.printOn = undefined;

// Friendly stubs
const STUB = (names, msg) => names.split(' ').forEach(n => defClass(n, 'Object', {}, { new() { err(msg()); }, read() { err(msg()); }, alloc() { err(msg()); }, front() { err(msg()); } }));
STUB('Window Slider Knob Button View StaticText NumberBox EnvelopeView MultiSliderView Stethoscope ScopeView QWindow Pen UserView CompositeView FlowLayout HLayout VLayout', () => LIB.host.t('err_gui'));
STUB('Buffer PlayBuf RecordBuf BufRd BufWr GrainBuf TGrains Warp1 Osc COsc Shaper OscN VOsc FFT IFFT PV_MagFreeze PV_BrickWall DiskIn DiskOut VDiskIn', () => LIB.host.t('err_buf'));
STUB('NetAddr OSCdef OSCFunc OSCresponder', () => LIB.host.t('err_osc'));
defClass('FreqScope', 'Object', {}, { new: () => { LIB.host.ui.show('spectrum'); return null; } });
defClass('Stethoscope', 'Object', {}, { new: () => { LIB.host.ui.show('scope'); return null; } });
defClass('CmdPeriod', 'Object', {}, { run: c => { LIB.host.stopAll(); return c; }, add: c => c, doOnce: c => c });
defClass('Quarks', 'Object', {}, { install: () => { err('Quarks cannot be installed in the web version.'); }, gui: () => { err('Quarks cannot be installed in the web version.'); } });
defClass('Interpreter', 'Object', {}, {});
defClass('Help', 'Object', {}, { gui: c => { LIB.host.ui.openRef(''); return c; } });
defClass('HelpBrowser', 'Object', {}, { openHelpFor: (c, a) => { LIB.host.ui.openRef(LIB.I.str(a[0])); return c; }, front: c => { LIB.host.ui.openRef(''); return c; } });
defClass('Server_', 'Object', {});

// fallback: unknown methods on numbers that are UGen ops etc.
LIB.fallback = function (recv, sel, args, kw) {
  if (Array.isArray(recv)) {
    // forward unknown messages elementwise when every element understands them (e.g. [osc1, osc2].lag)
    return undefined;
  }
  return undefined;
};
})(typeof globalThis !== 'undefined' ? globalThis : this);
