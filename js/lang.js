/* SuperCollider Lab · U-MA
 * lang.js — a subset of sclang: lexer, parser and a generator-based interpreter
 * (generators let Routines suspend on .wait / .yield anywhere in the call stack).
 */
(function (G) {
'use strict';

class SCError extends Error { constructor(msg, extra) { super(msg); this.sc = true; this.extra = extra; } }

// ---------------- values ----------------
class Sym { constructor(n) { this.name = n; } toString() { return this.name; } }
const SYMS = new Map();
const sym = n => { let s = SYMS.get(n); if (!s) { s = new Sym(n); SYMS.set(n, s); } return s; };
class Char { constructor(c) { this.c = c; } }
class Ref { constructor(v) { this.value = v; } }
class Assoc { constructor(k, v) { this.key = k; this.value = v; } }
class SCFunction { constructor(node, closure, interp) { this.node = node; this.closure = closure; this.I = interp; } }
class ClassRef { constructor(c) { this.cls = c; } }
class SCEvent { constructor(obj) { this.d = new Map(); if (obj) for (const k in obj) this.d.set(k, obj[k]); } get(k) { return this.d.get(k); } put(k, v) { if (v == null) this.d.delete(k); else this.d.set(k, v); } has(k) { return this.d.has(k); } }
const fl = v => { const n = new Number(v); n.isFloat = true; return n; };
const isNum = x => typeof x === 'number' || x instanceof Number;
const isFloat = x => (x instanceof Number && x.isFloat) || (typeof x === 'number' && !Number.isInteger(x));
const num = x => +x;

// ---------------- lexer ----------------
const OPCH = '+-*/%<>=!|&@^?';
function lex(src) {
  const toks = []; let i = 0, line = 1, col = 1;
  const N = src.length;
  const push = (t, v, extra) => { const tk = { t, v, line: tl, col: tc, pos: tp, end: i }; if (extra) Object.assign(tk, extra); toks.push(tk); };
  let tl, tc, tp;
  const adv = (k = 1) => { for (let j = 0; j < k; j++) { if (src[i] === '\n') { line++; col = 1; } else col++; i++; } };
  const isD = c => c >= '0' && c <= '9';
  const isA = c => /[A-Za-z_]/.test(c || '');
  const isAN = c => /[A-Za-z0-9_]/.test(c || '');
  const valueEnd = () => { const p = toks[toks.length - 1]; if (!p) return false; return ['num', 'str', 'sym', 'id', 'cls', 'env', 'char'].includes(p.t) || (p.t === 'punc' && (p.v === ')' || p.v === ']' || p.v === '}')); };
  while (i < N) {
    const c = src[i], d = src[i + 1];
    tl = line; tc = col; tp = i;
    if (c === ' ' || c === '\t' || c === '\r' || c === '\n') { adv(); continue; }
    if (c === '/' && d === '/') { while (i < N && src[i] !== '\n') adv(); continue; }
    if (c === '/' && d === '*') { let depth = 0; do { if (src[i] === '/' && src[i + 1] === '*') { depth++; adv(2); } else if (src[i] === '*' && src[i + 1] === '/') { depth--; adv(2); } else adv(); } while (i < N && depth > 0); continue; }
    // numbers (incl. negative literal)
    if (isD(c) || (c === '-' && isD(d) && !valueEnd())) {
      let s = ''; if (c === '-') { s = '-'; adv(); }
      while (isD(src[i])) { s += src[i]; adv(); }
      let isF = false;
      if (src[i] === '.' && isD(src[i + 1])) { isF = true; s += '.'; adv(); while (isD(src[i])) { s += src[i]; adv(); } }
      if ((src[i] === 'e' || src[i] === 'E') && (isD(src[i + 1]) || ((src[i + 1] === '-' || src[i + 1] === '+') && isD(src[i + 2])))) { isF = true; s += 'e'; adv(); if (src[i] === '-' || src[i] === '+') { s += src[i]; adv(); } while (isD(src[i])) { s += src[i]; adv(); } }
      let v = parseFloat(s);
      if (src[i] === 'p' && src[i + 1] === 'i' && !isAN(src[i + 2])) { adv(2); v *= Math.PI; isF = true; }
      push('num', v, { isF }); continue;
    }
    if (c === '"') { adv(); let s = ''; while (i < N && src[i] !== '"') { if (src[i] === '\\') { adv(); const e = src[i]; s += e === 'n' ? '\n' : e === 't' ? '\t' : e; adv(); } else { s += src[i]; adv(); } } if (i >= N) throw new SCError('syntax error, unterminated string', { line: tl, col: tc }); adv(); push('str', s); continue; }
    if (c === "'") { adv(); let s = ''; while (i < N && src[i] !== "'") { if (src[i] === '\\') adv(); s += src[i]; adv(); } adv(); push('sym', s); continue; }
    if (c === '\\' && (isA(d) || isD(d))) { adv(); let s = ''; while (isAN(src[i])) { s += src[i]; adv(); } push('sym', s); continue; }
    if (c === '\\') { adv(); push('sym', ''); continue; }
    if (c === '$') { adv(); let ch = src[i]; if (ch === '\\') { adv(); ch = src[i] === 'n' ? '\n' : src[i] === 't' ? '\t' : src[i]; } adv(); push('char', ch); continue; }
    if (c === '~' && isA(d)) { adv(); let s = ''; while (isAN(src[i])) { s += src[i]; adv(); } push('env', s); continue; }
    if (isA(c)) {
      let s = ''; while (isAN(src[i])) { s += src[i]; adv(); }
      if (src[i] === ':' && src[i + 1] !== ':') { adv(); push('kw', s); continue; }
      push(/[A-Z]/.test(s[0]) ? 'cls' : 'id', s); continue;
    }
    if (c === '.' && d === '.') { if (src[i + 2] === '.') { adv(3); push('punc', '...'); } else { adv(2); push('punc', '..'); } continue; }
    if ('()[]{},;.#`'.includes(c)) { adv(); push('punc', c); continue; }
    if (c === ':' ) { adv(); push('punc', ':'); continue; }
    if (OPCH.includes(c)) {
      let s = '';
      while (i < N && OPCH.includes(src[i])) {
        if (s.length && src[i] === '-' && s !== '<') break;
        if (s === '=' && src[i] !== '=' ) break;
        if (s.length && s !== '=' && src[i] === '=' && src[i+1] !== '=' && !['<', '>', '!', '='].includes(s[s.length - 1])) break;
        if (s === '|' && src[i] !== '|' ) break;
        s += src[i]; adv();
      }
      push('op', s); continue;
    }
    throw new SCError('syntax error, unexpected character \'' + c + '\'', { line: tl, col: tc });
  }
  tl = line; tc = col; tp = i;
  push('eof', null);
  return toks;
}

// ---------------- parser ----------------
function parse(src) {
  const T = lex(src); let p = 0;
  const peek = (k = 0) => T[p + k];
  const next = () => T[p++];
  const is = (t, v, k = 0) => { const x = T[p + k]; return x.t === t && (v === undefined || x.v === v); };
  const err = (msg, tk) => { tk = tk || peek(); throw new SCError('syntax error, ' + msg + (tk.t === 'eof' ? ' (end of code)' : ' near \'' + (tk.v ?? '') + '\''), { line: tk.line, col: tk.col }); };
  const expect = (t, v) => { if (!is(t, v)) err('expected \'' + (v || t) + '\''); return next(); };
  const node = (k, tk, o) => Object.assign({ k, line: tk ? tk.line : 0, col: tk ? tk.col : 0 }, o);

  function parseSeq(endTok) {
    const items = [];
    while (!is('eof') && !(endTok && is('punc', endTok))) {
      if (is('punc', ';')) { next(); continue; }
      items.push(parseStatement());
      if (!is('punc', ';')) break;
      next();
    }
    return items;
  }
  function parseStatement() {
    if (is('id', 'var')) {
      const tk = next(); const decls = [];
      do {
        const nm = expect('id').v; let init = null;
        if (is('op', '=')) { next(); init = parseExpr(); }
        decls.push({ name: nm, init });
      } while (is('punc', ',') && next());
      return node('var', tk, { decls });
    }
    return parseExpr();
  }
  function parseExpr() {
    // assignment
    const start = p;
    if ((is('id') || is('env')) && is('op', '=', 1)) {
      const tk = next(); next(); const v = parseExpr();
      return node(tk.t === 'env' ? 'envset' : 'assign', tk, { name: tk.v, value: v });
    }
    if (is('punc', '#') && is('punc', '[', 1) === false && is('id', undefined, 1)) {
      // multiple assignment #a, b = [1, 2]
      const tk = next(); const names = []; do { names.push(expect('id').v); } while (is('punc', ',') && next());
      expect('op', '='); const v = parseExpr(); return node('massign', tk, { names, value: v });
    }
    const lhs = parseBinop();
    if (is('op', '=')) {
      const tk = next(); const v = parseExpr();
      if (lhs.k === 'call' && lhs.args.length === 0 && !lhs.kw.length && !lhs.fnCall) return node('call', tk, { recv: lhs.recv, sel: lhs.sel + '_', args: [v], kw: [] });
      if (lhs.k === 'index') return node('call', tk, { recv: lhs.recv, sel: 'put', args: [lhs.index, v], kw: [] });
      err('invalid assignment', tk);
    }
    return lhs;
  }
  function parseBinop() {
    let left = parseUnaryChain();
    for (;;) {
      if (is('op') && peek().v !== '=') {
        const tk = next(); const right = parseUnaryChain();
        left = node('call', tk, { recv: left, sel: tk.v, args: [right], kw: [], binop: true });
      } else if (is('kw')) {
        const tk = next(); const right = parseUnaryChain();
        left = node('call', tk, { recv: left, sel: tk.v, args: [right], kw: [], binop: true });
      } else break;
    }
    return left;
  }
  // partial application: f(_.midicps) -> f({ |x| x.midicps })
  function partial(e) {
    let count = 0;
    const walk = (n) => { if (!n || typeof n !== 'object') return; if (n.k === 'fn') return; if (n.k === 'id' && n.name === '_') { n.name = '__p' + (count++); return; }
      for (const key in n) { const v = n[key]; if (Array.isArray(v)) v.forEach(x => Array.isArray(x) ? x.forEach(walk) : walk(x)); else if (v && typeof v === 'object' && v.k) walk(v); } };
    walk(e);
    if (!count) return e;
    return { k: 'fn', line: e.line, col: e.col, params: Array.from({ length: count }, (_, i) => ({ name: '__p' + i, def: null })), rest: null, body: [e] };
  }
  function parseArgs(close) {
    const args = [], kw = [];
    while (!is('punc', close)) {
      if (is('kw')) { const k = next().v; kw.push([k, partial(parseExpr())]); }
      else { if (kw.length) err('positional argument after keyword'); args.push(partial(parseExpr())); }
      if (is('punc', ',')) { next(); continue; }
      if (!is('punc', close)) err('expected \',\' or \'' + close + '\'');
    }
    next();
    return { args, kw };
  }
  function trailingFns(args) {
    while (is('punc', '{')) args.push(parseFunction());
  }
  function parseUnaryChain() {
    let e = parsePrimary();
    for (;;) {
      if (is('punc', '.')) {
        const tk = next();
        if (is('punc', '(')) { next(); const a = parseArgs(')'); e = node('call', tk, { recv: e, sel: 'value', args: a.args, kw: a.kw, fnCall: true }); continue; }
        if (is('punc', '[')) { next(); const ix = parseExpr(); expect('punc', ']'); e = node('index', tk, { recv: e, index: ix }); continue; }
        if (!(is('id') || is('cls'))) err('expected method name after \'.\'');
        const sel = next().v;
        let args = [], kw = [];
        if (is('punc', '(')) { next(); const a = parseArgs(')'); args = a.args; kw = a.kw; }
        trailingFns(args);
        e = node('call', tk, { recv: e, sel, args, kw });
        continue;
      }
      if (is('punc', '[')) { const tk = next(); const ix = parseExpr(); if (is('punc', '..')) { next(); const hi = is('punc', ']') ? null : parseExpr(); expect('punc', ']'); e = node('call', tk, { recv: e, sel: 'copyRange', args: [ix, hi || node('nil', tk)], kw: [] }); continue; } expect('punc', ']'); e = node('index', tk, { recv: e, index: ix }); continue; }
      break;
    }
    return e;
  }
  function parseFunction() {
    const tk = expect('punc', '{');
    const params = []; let rest = null;
    const parseParam = () => { if (is('punc', '...')) { next(); rest = expect('id').v; return; } const nm = expect('id').v; let def = null; if (is('op', '=')) { next(); def = parseUnaryChain(); } params.push({ name: nm, def }); };
    if (is('op', '||')) next();
    else if (is('op', '|')) { next(); while (!is('op', '|')) { parseParam(); if (is('punc', ',')) next(); else if (!is('op', '|')) err('expected \'|\''); } next(); }
    else if (is('id', 'arg')) { next(); while (!is('punc', ';')) { parseParam(); if (is('punc', ',')) next(); else if (!is('punc', ';')) err('expected \';\' after args'); } next(); }
    const body = parseSeq('}'); expect('punc', '}');
    return node('fn', tk, { params, rest, body });
  }
  function parsePrimary() {
    const tk = peek();
    switch (tk.t) {
      case 'num': next(); return node('num', tk, { v: tk.v, f: tk.isF });
      case 'str': { next(); let s = tk.v; while (is('str')) s += next().v; return node('str', tk, { v: s }); }
      case 'sym': next(); return node('sym', tk, { v: tk.v });
      case 'char': next(); return node('char', tk, { v: tk.v });
      case 'env': next(); return node('env', tk, { name: tk.v });
      case 'cls': {
        next();
        if (is('punc', '(')) { next(); const a = parseArgs(')'); trailingFns(a.args); return node('call', tk, { recv: node('cls', tk, { name: tk.v }), sel: 'new', args: a.args, kw: a.kw }); }
        if (is('punc', '{')) { const a = []; trailingFns(a); return node('call', tk, { recv: node('cls', tk, { name: tk.v }), sel: 'new', args: a, kw: [] }); }
        return node('cls', tk, { name: tk.v });
      }
      case 'id': {
        next();
        if (is('punc', '(')) { // functional message syntax: foo(a, b) -> a.foo(b)
          next(); const a = parseArgs(')'); trailingFns(a.args);
          if (!a.args.length) err('message \'' + tk.v + '\' needs a receiver', tk);
          return node('call', tk, { recv: a.args[0], sel: tk.v, args: a.args.slice(1), kw: a.kw });
        }
        if (is('punc', '{') && !['var', 'arg'].includes(tk.v) && /^(loop|fork|while|if|forBy|for|do|collect|case|defer|play|scope|plot)$/.test(tk.v)) {
          const a = []; trailingFns(a); return node('call', tk, { recv: a[0], sel: tk.v, args: a.slice(1), kw: [] });
        }
        return node('id', tk, { name: tk.v });
      }
      case 'punc':
        if (tk.v === '(') {
          next();
          if (is('punc', ')')) { next(); return node('event', tk, { pairs: [] }); }
          if (is('kw')) { // event literal
            const pairs = []; while (!is('punc', ')')) { const k = expect('kw').v; pairs.push([k, parseExpr()]); if (is('punc', ',')) next(); else if (!is('punc', ')')) err('expected \',\''); } next();
            return node('event', tk, { pairs });
          }
          const first = parseStatement();
          if (is('punc', '..')) { next(); const hi = parseExpr(); expect('punc', ')'); return node('range', tk, { lo: first, hi }); }
          if (is('punc', ',') && T[p + 2] && T[p + 2].t === 'punc' && T[p + 2].v === '..') { next(); const second = parseExpr(); expect('punc', '..'); const hi = parseExpr(); expect('punc', ')'); return node('range', tk, { lo: first, hi, second }); }
          const items = [first];
          while (is('punc', ';')) { next(); if (is('punc', ')')) break; items.push(parseStatement()); }
          expect('punc', ')');
          return node('seq', tk, { items, paren: true });
        }
        if (tk.v === '[') { next(); const a = parseArgs(']'); return node('array', tk, { items: a.args }); }
        if (tk.v === '#' ) { next(); if (is('punc', '[')) { next(); const a = parseArgs(']'); return node('array', tk, { items: a.args, literal: true }); } if (is('punc', '{')) { const f = parseFunction(); return f; } err('unexpected #'); }
        if (tk.v === '{') return parseFunction();
        if (tk.v === '`') { next(); const v = parseUnaryChain(); return node('ref', tk, { v }); }
        break;
      case 'op':
        if (tk.v === '-') { next(); const v = parseUnaryChain(); return node('call', tk, { recv: v, sel: 'neg', args: [], kw: [] }); }
        break;
      case 'kw': err('unexpected keyword \'' + tk.v + ':\'');
    }
    err('unexpected ' + (tk.t === 'eof' ? 'end of code' : 'token'));
  }
  const items = parseSeq(null);
  if (!is('eof')) err('unexpected token');
  return { k: 'seq', items, line: 1, col: 1 };
}

// ---------------- class system ----------------
const CLASSES = Object.create(null);
function defClass(name, sup, im, cm) {
  let c = CLASSES[name];
  if (!c) { c = CLASSES[name] = { name, sup: sup || (name === 'Object' ? null : 'Object'), im: Object.create(null), cm: Object.create(null) }; }
  if (sup !== undefined && sup !== null) c.sup = sup;
  if (im) for (const k in im) { if (typeof im[k] !== 'function') continue; c.im[k] = im[k]; c.im[k].isGen = im[k].constructor.name === 'GeneratorFunction'; }
  if (cm) for (const k in cm) { if (typeof cm[k] !== 'function') continue; c.cm[k] = cm[k]; c.cm[k].isGen = cm[k].constructor.name === 'GeneratorFunction'; }
  return c;
}
function findMethod(cls, sel, side) {
  for (let c = cls; c; c = c.sup ? CLASSES[c.sup] : null) { const m = c[side][sel]; if (m) return m; }
  return null;
}

// ---------------- interpreter ----------------
class Scope { constructor(parent) { this.parent = parent; this.vars = new Map(); }
  find(n) { for (let s = this; s; s = s.parent) if (s.vars.has(n)) return s; return null; } }

class Interpreter {
  constructor(hooks = {}) {
    this.hooks = hooks; this.post = hooks.post || ((t) => console.log(t));
    this.globals = new Map(); 'abcdefghijklmnopqrstuvwxyz'.split('').forEach(c => this.globals.set(c, null));
    this.envir = new SCEvent(); this.builder = null;
    this.thread = { isRoutine: false, beats: 0, time: null, clock: null };
    this.seed = (Date.now() & 0x7fffffff) || 1; this.rand = this.makeRng(this.seed);
    this.steps = 0; this.stepLimit = 3e6;
    this.lines = 0;
  }
  makeRng(seed) { let s = seed >>> 0; return () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  setSeed(n) { this.rand = this.makeRng(Math.floor(n) * 2654435761 + 1); }
  classOf(v) {
    if (v == null) return CLASSES.Nil;
    switch (typeof v) {
      case 'boolean': return v ? CLASSES.True : CLASSES.False;
      case 'number': return Number.isInteger(v) ? CLASSES.Integer : CLASSES.Float;
      case 'string': return CLASSES.String;
      case 'function': return CLASSES.Function;
    }
    if (v instanceof Number) return v.isFloat || !Number.isInteger(+v) ? CLASSES.Float : CLASSES.Integer;
    if (Array.isArray(v)) return CLASSES.Array;
    if (v instanceof Sym) return CLASSES.Symbol;
    if (v instanceof SCFunction) return CLASSES.Function;
    if (v instanceof SCEvent) return CLASSES[v.scClass || 'Event'];
    if (v instanceof Char) return CLASSES.Char;
    if (v instanceof Ref) return CLASSES.Ref;
    if (v instanceof Assoc) return CLASSES.Association;
    if (v.scClass && CLASSES[v.scClass]) return CLASSES[v.scClass];
    return CLASSES.Object;
  }
  className(v) { if (v && v.ugenName) return v.ugenName(); if (v instanceof ClassRef) return 'Meta_' + v.cls.name; return this.classOf(v).name; }
  // ---- printing ----
  fmtNum(x) {
    const v = +x;
    if (v === Infinity) return 'inf'; if (v === -Infinity) return '-inf'; if (Number.isNaN(v)) return 'nan';
    if (Number.isInteger(v)) return (x instanceof Number && x.isFloat) ? v + '.0' : String(v);
    let s = String(parseFloat(v.toPrecision(12)));
    if (/e/.test(s)) s = v.toExponential(6).replace(/\.?0+e/, 'e');
    return s;
  }
  str(v, depth = 0, inColl = false) {
    if (depth > 6) return '...';
    if (v == null) return 'nil';
    if (typeof v === 'boolean') return String(v);
    if (isNum(v)) return this.fmtNum(v);
    if (typeof v === 'string') return v;
    if (v instanceof Sym) return inColl ? v.name : v.name;
    if (v instanceof Char) return v.c;
    if (Array.isArray(v)) { if (v.length > 200) return '[ ' + v.slice(0, 200).map(x => this.str(x, depth + 1, true)).join(', ') + ', ...etc... ]'; return '[ ' + v.map(x => this.str(x, depth + 1, true)).join(', ') + ' ]'; }
    if (v instanceof SCEvent) { const parts = []; v.d.forEach((x, k) => parts.push(k + ': ' + this.str(x, depth + 1, true))); return v.scClass && v.scClass !== 'Event' ? (v.scClass + '[ ' + parts.join(', ') + ' ]') : '( ' + parts.join(', ') + ' )'; }
    if (v instanceof SCFunction || typeof v === 'function') return 'a Function';
    if (v instanceof Ref) return '`(' + this.str(v.value, depth + 1, true) + ')';
    if (v instanceof Assoc) return '(' + this.str(v.key, depth + 1, true) + ' -> ' + this.str(v.value, depth + 1, true) + ')';
    if (v instanceof ClassRef) return v.cls.name;
    if (v.printOn) return v.printOn(this);
    const n = this.className(v); return (/^[AEIOU]/.test(n) ? 'an ' : 'a ') + n;
  }
  // ---- errors ----
  error(msg, extra) { throw new SCError(msg, extra); }
  dnu(recv, sel) { this.error("Message '" + sel + "' not understood.", { receiver: this.str(recv).slice(0, 80) }); }
  // ---- evaluation entry ----
  compile(src) { return parse(src); }
  interpret(src) {
    const ast = parse(src);
    const scope = new Scope(null);
    this.steps = 0;
    const gen = this.ev(ast, scope);
    return this.runSync(gen, 'interpret');
  }
  runSync(gen, where) {
    let r = gen.next();
    while (!r.done) {
      const y = r.value;
      if (y && y.wait !== undefined) this.error("yield was called outside of a Routine. Use fork { } or Routine { } to wait.");
      r = gen.next();
    }
    return r.value;
  }
  // call any callable synchronously
  callSync(f, args = [], kw = []) { return this.runSync(this.call(f, args, kw)); }
  *call(f, args = [], kw = []) {
    if (f instanceof SCFunction) return yield* this.callFn(f, args, kw);
    if (typeof f === 'function') { const r = f(...args); if (r && r.isGenObj) return yield* r.g; return r; }
    return f; // Object.value -> self
  }
  *callFn(f, args, kw) {
    const n = f.node, sc = new Scope(f.closure);
    for (let i = 0; i < n.params.length; i++) {
      const p = n.params[i]; let v = args[i];
      if (v === undefined && kw) { const k = kw.find(x => x[0] === p.name); if (k) v = k[1]; }
      if (v === undefined && p.def) v = yield* this.ev(p.def, sc);
      sc.vars.set(p.name, v === undefined ? null : v);
    }
    if (n.rest) sc.vars.set(n.rest, args.slice(n.params.length));
    let r = null;
    for (const it of n.body) r = yield* this.ev(it, sc);
    return r;
  }
  lookup(name, sc, node) {
    switch (name) {
      case 'nil': return null; case 'true': return true; case 'false': return false;
      case 'inf': return Infinity; case 'pi': return Math.PI;
      case 'thisThread': return this.threadObj || (this.threadObj = { scClass: 'Thread' });
      case 'thisProcess': return { scClass: 'Main' };
      case 'currentEnvironment': case 'topEnvironment': return this.envir;
    }
    const s = sc && sc.find(name); if (s) return s.vars.get(name);
    if (this.globals.has(name)) return this.globals.get(name);
    this.error("Variable '" + name + "' not defined.", { line: node && node.line });
  }
  assign(name, v, sc, node) {
    const s = sc && sc.find(name); if (s) { s.vars.set(name, v); return v; }
    if (this.globals.has(name)) { this.globals.set(name, v); return v; }
    this.error("Variable '" + name + "' not defined. Declare it with var " + name + "; or use ~" + name + ".", { line: node && node.line });
  }
  *ev(n, sc) {
    if (++this.steps > this.stepLimit) { this.steps = 0; this.error('Too many steps: is there an infinite loop without .wait?'); }
    switch (n.k) {
      case 'num': return n.f && Number.isInteger(n.v) ? fl(n.v) : n.v;
      case 'str': return n.v;
      case 'sym': return sym(n.v);
      case 'char': return new Char(n.v);
      case 'nil': return null;
      case 'id': return this.lookup(n.name, sc, n);
      case 'cls': { const c = CLASSES[n.name]; if (!c) this.error("Class not defined: " + n.name, { line: n.line }); return c.ref || (c.ref = new ClassRef(c)); }
      case 'env': if (this.proxySpace) return this.proxySpace.get(n.name); return this.envir.has(n.name) ? this.envir.get(n.name) : null;
      case 'envset': { const v = yield* this.ev(n.value, sc); if (this.proxySpace) { this.proxySpace.put(n.name, v); return v; } this.envir.put(n.name, v); return v; }
      case 'assign': { const v = yield* this.ev(n.value, sc); return this.assign(n.name, v, sc, n); }
      case 'massign': { const v = yield* this.ev(n.value, sc); n.names.forEach((nm, i) => this.assign(nm, Array.isArray(v) ? (v[i] ?? null) : null, sc, n)); return v; }
      case 'var': { for (const d of n.decls) { const v = d.init ? yield* this.ev(d.init, sc) : null; (sc || (sc = new Scope(null))).vars.set(d.name, v); } return null; }
      case 'seq': { let r = null; const inner = n.paren ? sc : sc; for (const it of n.items) r = yield* this.ev(it, inner); return r; }
      case 'array': { const a = []; for (const it of n.items) a.push(yield* this.ev(it, sc)); return a; }
      case 'fn': return new SCFunction(n, sc, this);
      case 'ref': return new Ref(yield* this.ev(n.v, sc));
      case 'event': { const e = new SCEvent(); for (const [k, x] of n.pairs) e.put(k, yield* this.ev(x, sc)); return e; }
      case 'range': {
        const lo = num(yield* this.ev(n.lo, sc)), hi = num(yield* this.ev(n.hi, sc));
        let step = lo <= hi ? 1 : -1; if (n.second) step = num(yield* this.ev(n.second, sc)) - lo;
        const a = []; if (step === 0) return a; for (let x = lo; step > 0 ? x <= hi + 1e-9 : x >= hi - 1e-9; x += step) { a.push(x); if (a.length > 1e6) break; } return a;
      }
      case 'index': { const r = yield* this.ev(n.recv, sc), i = yield* this.ev(n.index, sc); return yield* this.send(r, 'at', [i], [], n); }
      case 'call': {
        const recv = yield* this.ev(n.recv, sc);
        const args = []; for (const a of n.args) args.push(yield* this.ev(a, sc));
        const kw = []; for (const [k, a] of n.kw) kw.push([k, yield* this.ev(a, sc)]);
        return yield* this.send(recv, n.sel, args, kw, n);
      }
    }
    this.error('cannot evaluate ' + n.k);
  }
  *send(recv, sel, args, kw = [], node) {
    let m;
    if (recv instanceof ClassRef) {
      m = findMethod(recv.cls, sel, 'cm');
      if (!m) m = findMethod(CLASSES.Class, sel, 'im');
    } else m = findMethod(this.classOf(recv), sel, 'im');
    if (!m) {
      if (recv instanceof SCEvent) { // event pseudo-methods
        if (sel.endsWith('_') && args.length) { recv.put(sel.slice(0, -1), args[0]); return recv; }
        if (recv.has(sel)) { const v = recv.get(sel); if (v instanceof SCFunction) return yield* this.callFn(v, [recv, ...args], kw); return v; }
        if (!args.length) return null;
      }
      if (this.hooks.fallback) { const r = this.hooks.fallback(recv, sel, args, kw); if (r !== undefined) { if (r && r.isGenObj) return yield* r.g; return r; } }
      try { this.dnu(recv instanceof ClassRef ? recv.cls.name : recv, sel); } catch (e) { if (node) e.extra = Object.assign({ line: node.line, col: node.col }, e.extra || {}); throw e; }
    }
    try {
      if (m.isGen) return yield* m.call(this, recv, args, kw, node);
      return m.call(this, recv, args, kw, node);
    } catch (e) {
      if (e.sc && node && !(e.extra && e.extra.line)) e.extra = Object.assign({ line: node.line, col: node.col }, e.extra || {});
      throw e;
    }
  }
  sendSync(recv, sel, args = [], kw = []) { return this.runSync(this.send(recv, sel, args, kw)); }
}

// argument helper: positional / keyword / default
function A(args, kw, i, name, def) {
  if (args.length > i && args[i] !== undefined) return args[i];
  if (kw) for (const k of kw) if (k[0] === name) return k[1];
  return def;
}

G.SCLang = { lex, parse, Interpreter, Scope, SCError, Sym, sym, Char, Ref, Assoc, SCFunction, ClassRef, SCEvent, CLASSES, defClass, findMethod, A, fl, isNum, isFloat, num };
})(typeof globalThis !== 'undefined' ? globalThis : this);
