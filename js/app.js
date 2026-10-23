/* SuperCollider Lab · U-MA — app.js
 * Router, pages, progress (XP, levels, badges), lessons, quizzes, challenges, settings.
 */
(function (G) {
'use strict';
const VERSION = '1.1';
const LANGS = ['es', 'en', 'de', 'zh', 'ja', 'hi'];
const LANG_NAMES = { es: 'Español', en: 'English', de: 'Deutsch', zh: '中文', ja: '日本語', hi: 'हिन्दी' };
const DOC_LANG = { es: 'es', en: 'en', de: 'de', zh: 'zh-Hans', ja: 'ja', hi: 'hi' };
const STORE = 'sclab.v1';
const C = G.SC_COURSE;
const E = G.SCEngine, V = G.SCViz, L = G.SCLang, LIB = G.SCLib;
const REPO = 'https://github.com/buenosairesfront/supercollider';
const IG = 'https://www.instagram.com/buenos.aires.front/';
const RESOURCES = [
  ['site', 'https://supercollider.github.io/', 'mag'],
  ['docs', 'https://doc.sccode.org/', 'cya'],
  ['tut', 'https://doc.sccode.org/Tutorials/Getting-Started/00-Getting-Started-With-SC.html', 'yel'],
  ['forum', 'https://scsynth.org/', 'mag'],
  ['sccode', 'https://sccode.org/', 'cya'],
  ['src', 'https://github.com/supercollider/supercollider', 'yel'],
];

// ---------------------------------------------------------------- helpers
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const h = (tag, attrs, ...kids) => { const e = document.createElement(tag); if (attrs) for (const k in attrs) { const v = attrs[k]; if (k === 'class') e.className = v; else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v); else if (k === 'html') e.innerHTML = v; else if (v != null && v !== false) e.setAttribute(k, v === true ? '' : v); } kids.flat().forEach(c => c != null && c !== false && e.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c)); return e; };
const md = s => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/«([^»]+)»/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*\s][^*]*)\*/g, '<em>$1</em>').replace(/\[([^\]]+)\]\((https?:[^)]+|#[^)]*)\)/g, (m, t, u) => '<a href="' + u + '"' + (u[0] === '#' ? '' : ' target="_blank" rel="noopener"') + '>' + t + '</a>');
const pad2 = n => String(n).padStart(2, '0');
const today = () => new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------- state
let P = load();
function load() { try { return Object.assign(fresh(), JSON.parse(localStorage.getItem(STORE) || '{}')); } catch (e) { return fresh(); } }
function fresh() { return { v: 1, xp: 0, lessons: {}, labs: {}, streak: { d: '', n: 0 }, last: null, snippets: [], cur: null, lang: null, theme: 'system', limit: true, vol: -6, badges: {} }; }
function save() { try { localStorage.setItem(STORE, JSON.stringify(P)); } catch (e) { } }
const LP = id => P.lessons[id] || (P.lessons[id] = { read: 0, runs: {}, quiz: 0, ch: 0, done: 0 });

// ---------------------------------------------------------------- i18n
let lang = 'es';
function pickLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (q && LANGS.includes(q)) { P.lang = q; save(); return q; }
  if (P.lang && LANGS.includes(P.lang)) return P.lang;
  return 'es';
}
const TX = () => (G.SC_LANG && G.SC_LANG[lang]) || {};
const FB = () => (G.SC_LANG && (G.SC_LANG.en || G.SC_LANG.es)) || {};
function t(k, vars) { let s = (TX().ui && TX().ui[k]) ?? (FB().ui && FB().ui[k]) ?? (G.SC_LANG.es && G.SC_LANG.es.ui[k]) ?? k; if (vars) for (const v in vars) s = s.replace('{' + v + '}', vars[v]); return s; }
const tx = (sec, id) => (TX()[sec] && TX()[sec][id]) || (FB()[sec] && FB()[sec][id]) || (G.SC_LANG.es && G.SC_LANG.es[sec] && G.SC_LANG.es[sec][id]) || null;
function loadLang(l) {
  return new Promise(res => {
    if (G.SC_LANG && G.SC_LANG[l]) return res();
    const s = document.createElement('script'); s.src = 'content/' + l + '.js?v=' + VERSION; s.onload = res; s.onerror = res; document.head.appendChild(s);
  });
}

// ---------------------------------------------------------------- course index
const LESSONS = []; C.modules.forEach((m, mi) => m.lessons.forEach((l, li) => LESSONS.push(Object.assign(l, { mod: m, mi, li, n: LESSONS.length + 1 }))));
const lessonById = id => LESSONS.find(l => l.id === id);

// ---------------------------------------------------------------- XP / levels / badges
const LEVELS = [0, 60, 150, 300, 500, 750, 1050, 1400, 1800, 2300, 3000];
function level() { let i = 0; while (i < LEVELS.length - 1 && P.xp >= LEVELS[i + 1]) i++; return i; }
function addXP(n, x, y) {
  if (!n) return; const lv0 = level(); P.xp += n;
  const d = today(); if (P.streak.d !== d) { const y0 = new Date(Date.now() - 864e5).toISOString().slice(0, 10); P.streak.n = P.streak.d === y0 ? P.streak.n + 1 : 1; P.streak.d = d; }
  save(); flyXP(n, x, y);
  if (level() > lv0) toast(t('levelup', { n: level() + 1, title: levelTitle() }));
  checkBadges(); updateHeaderXP();
}
const levelTitle = () => (TX().levels || FB().levels || [])[level()] || '';
function flyXP(n, x, y) { const f = h('div', { class: 'xpfly' }, '+' + n + ' XP'); f.style.left = (x || innerWidth / 2) + 'px'; f.style.top = (y || innerHeight / 2) + 'px'; document.body.appendChild(f); setTimeout(() => f.remove(), 1300); }
function modDone(m) { return m.lessons.every(l => P.lessons[l.id] && P.lessons[l.id].done); }
function checkBadges() {
  const b = P.badges; let nw = null;
  C.modules.forEach(m => { if (!b[m.id] && modDone(m)) { b[m.id] = 1; nw = m.id; } });
  if (!b.sound && P.firstSound) { b.sound = 1; nw = 'sound'; }
  if (!b.labs && G.SCLabs.LABS.every(l => P.labs[l.id])) { b.labs = 1; nw = 'labs'; }
  if (!b.chall && Object.values(P.lessons).filter(x => x.ch).length >= 10) { b.chall = 1; nw = 'chall'; }
  if (!b.quiz && LESSONS.every(l => P.lessons[l.id] && P.lessons[l.id].quiz)) { b.quiz = 1; nw = 'quiz'; }
  if (nw) { save(); toast(t('badge_new') + ': ' + badgeName(nw)); }
}
const BADGES = () => C.modules.map(m => m.id).concat(['sound', 'labs', 'chall', 'quiz']);
const badgeName = id => id[0] === 'm' ? (tx('mod', id) || {}).t || id : t('badge_' + id);
const badgeIcon = id => id[0] === 'm' ? id.slice(1).padStart(2, '0') : { sound: '♪', labs: '⚗', chall: '★', quiz: '?' }[id];
function lessonStars(id) { const p = P.lessons[id]; if (!p) return 0; return (Object.keys(p.runs || {}).length ? 1 : 0) + (p.quiz ? 1 : 0) + (p.ch ? 1 : 0); }
function maybeComplete(l) { const p = LP(l.id); if (!p.done && p.quiz && Object.keys(p.runs).length) { p.done = 1; save(); toast(t('lesson_done')); checkBadges(); } }

// ---------------------------------------------------------------- toast
let toastT = 0;
function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 2600); }

// ---------------------------------------------------------------- SC runtime
const I = new L.Interpreter({ post: (txt, kind) => post(txt, kind === 'inline' ? 'res' : 'res'), fallback: (r, s, a, k) => LIB.fallback(r, s, a, k) });
LIB.I = I;
const lastDefs = new Map();
let track = null, capture = null;
function post(text, kind = 'res') { V.post(text, kind); if (capture) { const d = h('div', { class: kind === 'err' ? 'err' : kind === 'ok' ? 'ok' : '' }, text); capture.appendChild(d); capture.classList.add('on'); capture.scrollTop = capture.scrollHeight; } }
function postError(e) {
  if (!e) return;
  const ex = e.extra || {};
  let msg = (e.sc ? 'ERROR: ' : 'ERROR (internal): ') + (e.message || String(e));
  if (ex.receiver) msg += '\nRECEIVER: ' + ex.receiver;
  if (ex.line) msg += '\n  ' + t('at_line') + ' ' + ex.line + (ex.col ? ', ' + t('col') + ' ' + ex.col : '');
  post(msg, 'err');
  if (!e.sc) console.error(e);
}
LIB.host = {
  engine: E, t, get lang() { return lang; },
  stopAll: () => stopAll(),
  ui: {
    plot: (d, o) => V.plot(d, o),
    show: m => { if (['scope', 'spectrum', 'xy', 'sono'].includes(m)) setScope(m); revealMonitor(); },
    openRef: n => openRef(n),
    showGraph: (def, id) => V.showGraph(def, id),
    error: e => postError(e),
    note: n => { V.note(n); if (track) track.notes++; },
    synthStarted: (s, def) => { if (def) { lastDefs.set(def.name, def); if (s.tag !== 'ev' || !V.graphDef) V.showGraph(def, s.id); } if (track) { track.synths++; addDefInfo(def); } if (!P.firstSound) { P.firstSound = 1; save(); setTimeout(checkBadges, 500); } },
    defAdded: def => { lastDefs.set(def.name, def); if (track) { track.defs++; addDefInfo(def); } },
    routines: n => { const el = $('#srv-r'); if (el) el.textContent = n ? n + 'r' : ''; },
    ndefs: () => { },
    midiDefs: () => { },
  },
};
function addDefInfo(def) {
  if (!def || !track) return;
  def.units.forEach(u => { track.ugens.add(u.name); if ((u.name === 'Out' || u.name === 'OffsetOut') && u.ins[0]) { const b = u.ins[0]; if (b[0] === 'c' && b[1] >= 4) track.busOut = true; if (b[0] === 'u') track.busOutCtl = true; } });
  track.channels = Math.max(track.channels, def.numCh || 0);
  const outU = def.units.filter(u => u.name === 'Out' || u.name === 'OffsetOut'); outU.forEach(u => { track.channels = Math.max(track.channels, u.ins.length - 1); });
}
I.globals.set('s', LIB.server);
try { I.interpret(LIB.PRELUDE); } catch (e) { console.error(e); }
E.on('ended', ids => LIB.onEnded(ids));
E.on('post', p => post(p.text, p.kind === 'error' ? 'err' : p.kind));
E.on('recorded', r => { const url = URL.createObjectURL(r.blob); const a = h('a', { href: url, download: 'sclab-' + Date.now() + '.wav' }); document.body.appendChild(a); a.click(); a.remove(); post(t('rec_saved', { s: r.seconds.toFixed(1) }), 'ok'); });
E.on('rec', on => { const b = $('#recdot'); if (b) b.hidden = !on; });

function splitTop(code) {
  // split into top-level ( ... ) blocks + loose lines when the whole thing has several blocks
  const lines = code.split('\n'); const blocks = []; let cur = [], depth = 0;
  for (const ln of lines) {
    const tr = ln.trim();
    if (depth === 0 && tr === '(' ) { if (cur.join('').trim()) blocks.push(cur.join('\n')); cur = [ln]; depth = 1; continue; }
    cur.push(ln);
    if (depth > 0 && tr === ')' || (depth > 0 && /^\)\s*;?\s*$/.test(tr))) { blocks.push(cur.join('\n')); cur = []; depth = 0; }
  }
  if (cur.join('').trim()) blocks.push(cur.join('\n'));
  return blocks;
}
function evaluate(code, opts = {}) {
  E.boot();
  if (opts.track) track = opts.track;
  const prevCap = capture; capture = opts.out || null;
  if (capture) capture.innerHTML = '';
  let value, error = null;
  try {
    try { I.compile(code); value = I.interpret(code); }
    catch (e) {
      const blocks = splitTop(code);
      if (e.sc && /syntax error/.test(e.message) && blocks.length > 1) { for (const b of blocks) value = I.interpret(b); }
      else throw e;
    }
    if (!opts.quiet) post('-> ' + I.str(value), 'res');
  } catch (e) { error = e; postError(e); }
  capture = prevCap;
  if (!opts.keepTrack) track = null;
  return { value, error };
}
function stopAll() { LIB.stopAll(); post('CmdPeriod: ' + t('stopped'), 'info'); }
G.SCApp = { t, openRef: n => openRef(n), lastDefs, onStatus: st => onStatus(st), revealMonitor: () => revealMonitor() };

// ---------------------------------------------------------------- layout
function shellHTML() {
  return `
<div class="shell">
  <header class="top"><div class="bar">
    <a class="brand" href="#/" aria-label="SuperCollider Lab">
      <svg class="logo" viewBox="0 0 84 44" aria-hidden="true"><rect x="1" y="1" width="82" height="42" fill="var(--paper)" stroke="var(--paperFg)" stroke-width="2"/><text x="42" y="27" text-anchor="middle" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-weight="800" font-size="22" fill="var(--paperFg)">SC·LAB</text><rect x="6" y="33" width="7" height="6" fill="#D12F7D"/><rect x="15" y="33" width="7" height="6" fill="#2A9EBF"/><rect x="24" y="33" width="7" height="6" fill="#E1C43B"/><text x="78" y="39" text-anchor="end" font-family="Noto Sans JP, sans-serif" font-weight="900" font-size="7" fill="var(--paperFg)">コライダー</text></svg>
    </a>
    <a class="brand" href="#/"><b>SuperCollider Lab</b><small id="sub">U-MA · Buenos Aires Front</small></a>
    <nav class="nav" id="nav" aria-label="main"></nav>
    <div class="tools">
      <button class="srv" id="srv" type="button" title="server"><i class="dot"></i><span id="srv-l">s.boot</span><span class="nums" id="srv-n"></span><span class="nums" id="srv-r"></span><span id="recdot" hidden style="color:var(--red)">● REC</span></button>
      <button class="stopbtn" id="stop" type="button" title="Ctrl + ."><i></i><span>STOP</span></button>
      <button class="iconbtn" id="settings" type="button" aria-label="settings">⚙</button>
    </div>
  </div></header>
  <div class="layout">
    <main class="mainc" id="main" tabindex="-1"></main>
    <aside class="aside" id="aside" aria-label="monitor">
      <div class="monhead"><button class="btn sm" id="mon-toggle" type="button">▲ MONITOR</button><span class="grow"></span><span class="pill" id="mon-mini"></span></div>
      <section class="panel p-ink mon"><div class="in">
        <div class="monbar"><div class="seg" id="scope-modes"></div><span class="meta" style="gap:6px"><span id="mon-sr"></span></span></div>
        <canvas id="scope" aria-label="oscilloscope"></canvas>
        <div class="readout"><div><span>PEAK dB</span><b id="r-peak">-∞</b></div><div><span>CPU</span><b id="r-cpu">0%</b></div><div><span>SYNTHS</span><b id="r-syn">0</b></div><div><span>UGENS</span><b id="r-ug">0</b></div></div>
        <div class="meter"><span>L</span><div class="m"><i id="m-l"></i></div><em id="m-lt">-∞</em></div>
        <div class="meter"><span>R</span><div class="m"><i id="m-r"></i></div><em id="m-rt">-∞</em></div>
      </div></section>
      <div class="mon-extra">
        <section class="panel p-ink" id="plotbox" hidden><div class="in"><div class="monbar"><span class="meta" id="plot-title">PLOT</span><button class="btn sm" type="button" id="plot-x" style="--pb:#000;--pf:#ECEBE6">×</button></div><canvas style="height:140px"></canvas></div></section>
        <section class="panel p-ink"><div class="in"><div class="monbar"><span class="meta"><span id="mon-graph-l"></span></span><span class="meta" id="graph-title"></span></div><div class="graph" id="graph"></div></div></section>
        <section class="panel p-paper"><div class="in"><div class="monbar"><span class="meta"><span id="mon-tree-l"></span></span><button class="btn sm" type="button" id="freeall">s.freeAll</button></div><ul class="tree" id="tree"></ul></div></section>
        <section class="panel p-ink"><div class="in"><div class="monbar"><span class="meta"><span id="mon-tl-l"></span></span></div><canvas id="timeline"></canvas></div></section>
        <section class="panel p-ink"><div class="in"><div class="monbar"><span class="meta"><span id="mon-post-l"></span></span><button class="btn sm" type="button" id="postclear" style="--pb:#000;--pf:#ECEBE6"></button></div><div class="post" id="post" role="log" aria-live="polite"></div></div></section>
      </div>
    </aside>
  </div>
</div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}
const NAV = [['home', '#/'], ['course', '#/course'], ['labs', '#/labs'], ['free', '#/free'], ['ref', '#/ref'], ['tips', '#/tips'], ['res', '#/res']];
function renderChrome() {
  document.documentElement.lang = DOC_LANG[lang];
  $('#nav').innerHTML = NAV.map(([k, href]) => `<a href="${href}" data-k="${k}">${esc(t('nav_' + k))}</a>`).join('');
  $('#sub').textContent = t('tagline');
  $('#mon-graph-l').textContent = t('mon_graph'); $('#mon-tree-l').textContent = t('mon_tree'); $('#mon-tl-l').textContent = t('mon_timeline'); $('#mon-post-l').textContent = t('mon_post');
  $('#postclear').textContent = t('clear');
  const sm = $('#scope-modes'); sm.innerHTML = '';
  [['scope', 'SCOPE'], ['spectrum', 'FFT'], ['xy', 'X/Y'], ['sono', 'SONO']].forEach(([m, l]) => { const b = h('button', { type: 'button', 'aria-pressed': String(V.mode === m) }, l); b.onclick = () => setScope(m); sm.appendChild(b); });
  updateNav();
}
function setScope(m) { V.setMode(m); [...$('#scope-modes').children].forEach((b, i) => b.setAttribute('aria-pressed', String(['scope', 'spectrum', 'xy', 'sono'][i] === m))); }
function updateNav() { const r = route().name; $('#nav').querySelectorAll('a').forEach(a => { const k = a.dataset.k; const on = k === r || (k === 'course' && (r === 'lesson')) || (k === 'labs' && r === 'lab'); on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'); }); }
function updateHeaderXP() { }
function revealMonitor() { if (innerWidth <= 1100) $('#aside').classList.add('open'); }
let lastStatus = null;
function onStatus(st) {
  lastStatus = st;
  const on = E.booted;
  $('#srv').classList.toggle('on', on);
  $('#srv-l').textContent = on ? 'SERVER' : 's.boot';
  $('#srv-n').textContent = on ? st.cpu.toFixed(1) + '% · ' + st.synths + 's · ' + st.ugens + 'u' : '';
  $('#mon-mini').textContent = st.synths + ' synths · ' + st.cpu.toFixed(0) + '%';
  $('#mon-sr').textContent = (E.sampleRate() / 1000).toFixed(1) + ' kHz · ' + (E.mode === 'worklet' ? 'worklet' : 'compat');
  if (track && Math.max(st.peaks[0], st.peaks[1]) > 0.001) track.heard = true;
}

// ---------------------------------------------------------------- router
function route() {
  const hsh = location.hash.replace(/^#\/?/, ''); const [a, b] = hsh.split('/');
  if (!a) return { name: 'home' };
  if (a === 'l' && b) return { name: 'lesson', id: b };
  if (a === 'lab' && b) return { name: 'lab', id: b };
  if (a === 'ref') return { name: 'ref', id: b ? decodeURIComponent(b) : '' };
  return { name: a };
}
let leaveFns = [];
function onLeave(fn) { leaveFns.push(fn); }
function render() {
  leaveFns.forEach(f => { try { f(); } catch (e) { } }); leaveFns = [];
  const r = route(); const main = $('#main'); main.innerHTML = '';
  updateNav();
  const pages = { home: pageHome, course: pageCourse, lesson: pageLesson, labs: pageLabs, lab: pageLab, free: pageFree, ref: pageRef, tips: pageTips, res: pageRes };
  (pages[r.name] || pageHome)(main, r);
  main.appendChild(footer());
  if (!r.keepScroll) window.scrollTo(0, 0);
}

// ---------------------------------------------------------------- components
function sheetHead(o) {
  return h('div', { class: 'sh' },
    h('div', { class: 'meta' }, h('span', null, o.left || ''), h('span', null, o.mid || ''), h('span', null, o.right || '')),
    h('div', { class: 'shm' }, o.num != null ? h('div', { class: 'num' }, o.num) : null, h('div', { class: 'sq' }, h('i', { class: 'm' }), h('i', { class: 'c' }), h('i', { class: 'y' })), h(o.h1 ? 'h1' : 'h2', null, o.title), o.aside || null));
}
function barcode(seed) {
  let x = 0; for (const c of seed) x = (x * 31 + c.charCodeAt(0)) >>> 0;
  let s = ''; let pos = 0; while (pos < 300) { x = (x * 1103515245 + 12345) >>> 0; const w = 1 + (x >> 8) % 4; if ((x >> 4) & 1) s += `<rect x="${pos}" y="0" width="${w}" height="30"/>`; pos += w + 1; }
  const d = document.createElement('div'); d.innerHTML = '<svg class="bc" viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden="true"><g fill="currentColor">' + s + '</g></svg>'; return d.firstChild;
}
function tipBox(text) { return h('aside', { class: 'panel p-yel callout' }, h('div', { class: 'in' }, h('h4', null, '◆ ' + t('pro_tip')), h('p', { html: md(text) }))); }

// code cell
function cell(code, opts = {}) {
  const wrap = h('div', { class: 'cell' });
  const head = h('div', { class: 'ch' });
  const ttl = h('span', { class: 'ttl' }, opts.title || '');
  const run = h('button', { class: 'btn run', type: 'button', title: 'Ctrl + Enter' }, '▶ ' + t('run'));
  const stop = h('button', { class: 'btn stop', type: 'button', title: 'Ctrl + .' }, '■');
  const reset = h('button', { class: 'btn', type: 'button', title: t('reset') }, '↺');
  const copy = h('button', { class: 'btn', type: 'button', title: t('copy') }, '⧉');
  const free = h('button', { class: 'btn', type: 'button', title: t('open_free') }, '↗');
  head.append(ttl, run, stop, reset, copy, free);
  if (opts.counter) { const cnt = h('span', { class: 'ttl', style: 'flex:0 0 auto;min-width:0' }, ''); head.insertBefore(cnt, run); opts.counterEl = cnt; }
  wrap.appendChild(head);
  const out = h('div', { class: 'out', role: 'status' });
  const ed = G.SCEditor.create(wrap, {
    code, runAll: true,
    onEval: (c) => doRun(c), onStop: () => stopAll(), onHelp: w => openRef(w),
    onChange: v => { if (opts.counterEl) { opts.counterEl.textContent = v.trim().length + ' / 140'; opts.counterEl.style.color = v.trim().length > 140 ? '#FF7A6B' : '#9AD07F'; } },
  });
  wrap.appendChild(out);
  function doRun(c) { const r = evaluate(c, { out, track: opts.track && opts.track(), keepTrack: !!opts.track }); opts.onRun && opts.onRun(r, c); }
  run.onclick = () => ed.run('all');
  stop.onclick = () => stopAll();
  reset.onclick = () => ed.set(code);
  copy.onclick = () => { navigator.clipboard && navigator.clipboard.writeText(ed.get()); toast(t('copied')); };
  free.onclick = () => openFree(ed.get());
  if (opts.counterEl) opts.counterEl.textContent = code.trim().length + ' / 140';
  return { el: wrap, ed, out };
}

// ---------------------------------------------------------------- HOME
function pageHome(main) {
  const done = LESSONS.filter(l => P.lessons[l.id] && P.lessons[l.id].done).length;
  const next = P.last ? lessonById(P.last) : LESSONS.find(l => !(P.lessons[l.id] && P.lessons[l.id].done)) || LESSONS[0];
  const hero = h('section', { class: 'panel p-paper hero' }, h('div', { class: 'in' },
    h('div', { class: 'meta' }, h('span', null, 'SC-LAB / REV ' + VERSION), h('span', null, 'ID SCL-0001'), h('span', null, '6 LANG · WEB AUDIO')),
    h('h1', { html: esc(t('hero_1')) + '<br><em>' + esc(t('hero_2')) + '</em>' }),
    h('p', { class: 'lead' }, t('hero_lead')),
    h('div', { class: 'row' },
      h('a', { class: 'btn lg mag', href: '#/l/' + next.id }, (P.last ? t('continue') : t('start')) + ' → ' + pad2(next.n) + ' ' + ((tx('les', next.id) || {}).t || '')),
      h('a', { class: 'btn lg', href: '#/labs' }, '⚗ ' + t('nav_labs')),
      h('a', { class: 'btn lg', href: '#/free' }, '{ } ' + t('nav_free'))),
    h('div', { class: 'stats' },
      h('div', null, h('span', null, 'XP'), h('b', null, String(P.xp))),
      h('div', null, h('span', null, t('level')), h('b', { title: levelTitle() }, (level() + 1) + ' · ' + levelTitle())),
      h('div', null, h('span', null, t('lessons')), h('b', null, done + '/' + LESSONS.length)),
      h('div', null, h('span', null, t('streak')), h('b', null, (P.streak.n || 0) + ' ' + t('days')))),
    barcode('sclab-home'), h('div', { class: 'bcl' }, h('span', null, 'SCL-' + VERSION.replace('.', '') + '-HOME'), h('span', null, 'scsynth.js ≈ 120 UGENS'))));
  main.appendChild(hero);
  // try now
  const tryp = h('section', { class: 'panel p-ink mt' }, h('div', { class: 'in' },
    h('div', { class: 'sh' }, h('div', { class: 'meta' }, h('span', null, t('try_now')), h('span', null, 'Ctrl + Enter · Shift + Enter · Ctrl + .'), h('span', null, '')),
      h('div', { class: 'shm' }, h('div', { class: 'num' }, '▶'), h('h2', null, t('try_title')))),
    h('p', { class: 'note', style: 'color:#9C9B97;margin-top:0' }, t('try_note'))));
  tryp.querySelector('.in').appendChild(cell('// Ctrl + Enter\n{ SinOsc.ar([440, 442], 0, 0.15) * LFPulse.kr([2, 3]).lag(0.02) }.play;\n\n// Ctrl + .  stops the sound', { title: 'HELLO, SCSYNTH' }).el);
  main.appendChild(tryp);
  // modules
  const mods = h('section', { class: 'mt' }, h('div', { class: 'grid3' }, C.modules.map((m, i) => modCard(m, i))));
  main.appendChild(h('div', { class: 'lbl mt' }, t('course_map')));
  main.appendChild(mods);
  // tip + resources
  const tips = TX().tips || FB().tips || []; const ti = Math.floor(Date.now() / 864e5) % Math.max(1, tips.length); const tp = tips[ti] || { t: '', b: '' };
  main.appendChild(h('div', { class: 'grid2 mt' },
    h('section', { class: 'panel p-yel tipc' }, h('div', { class: 'in' }, h('div', { class: 'meta' }, h('span', null, t('tip_day')), h('span', null, '#' + pad2(ti + 1))), h('h4', { style: 'margin-top:8px' }, tp.t), h('p', { html: md(tp.b) }), C.tips[ti] ? h('pre', null, C.tips[ti].code) : null, h('a', { class: 'btn sm mt', href: '#/tips', style: '--pb:var(--yel);--pf:#101010' }, t('all_tips') + ' →'))),
    h('section', { class: 'panel p-ink' }, h('div', { class: 'in' }, h('div', { class: 'meta' }, h('span', null, t('nav_res')), h('span', null, 'OPEN SOURCE · GPL')), h('h3', { style: 'font:700 24px/1 var(--disp);text-transform:uppercase;margin:10px 0 8px' }, t('res_title')), h('p', { style: 'margin:0 0 10px;font-size:13px', html: md(t('res_intro')) }), h('div', { class: 'row' }, h('a', { class: 'btn sm cya', href: '#/res' }, t('nav_res') + ' →'), h('a', { class: 'btn sm', href: RESOURCES[0][1], target: '_blank', rel: 'noopener', style: '--pb:#000;--pf:#ECEBE6' }, 'supercollider.github.io ↗'))))));
  // badges
  main.appendChild(h('div', { class: 'lbl mt' }, t('badges')));
  main.appendChild(h('div', { class: 'badges' }, BADGES().map(b => h('span', { class: 'badge p-paper' + (P.badges[b] ? ' on' : ''), title: badgeName(b), style: '--pb:var(--paper);--pf:var(--paperFg);--pa:var(--mag);--pat:#fff' }, badgeIcon(b)))));
}
function modCard(m, i) {
  const T = tx('mod', m.id) || { t: m.id, d: '' };
  const n = m.lessons.filter(l => P.lessons[l.id] && P.lessons[l.id].done).length;
  return h('a', { class: 'panel p-' + m.color + ' modcard', href: '#/course#' + m.id }, h('div', { class: 'in' },
    h('div', { class: 'meta' }, h('span', null, t('module') + ' ' + pad2(i + 1)), h('span', null, n + '/' + m.lessons.length)),
    h('div', { class: 'mn', style: 'margin-top:6px' }, pad2(i + 1)), h('h3', null, T.t), h('p', null, T.d),
    h('div', { class: 'prog' }, h('i', { style: 'width:' + (n / m.lessons.length * 100) + '%' }))));
}

// ---------------------------------------------------------------- COURSE
function pageCourse(main) {
  main.appendChild(h('section', { class: 'panel p-paper' }, h('div', { class: 'in' }, sheetHead({ left: t('course_map'), mid: LESSONS.length + ' ' + t('lessons'), right: C.modules.length + ' ' + t('modules'), num: '30', title: t('nav_course'), h1: true }), h('p', { class: 'note', style: 'font-size:13.5px' }, t('course_intro')))));
  C.modules.forEach((m, i) => {
    const T = tx('mod', m.id) || { t: m.id, d: '' };
    const sec = h('section', { class: 'panel p-paper mt', id: m.id }, h('div', { class: 'in' },
      sheetHead({ left: t('module') + ' ' + pad2(i + 1), mid: m.lessons.length + ' ' + t('lessons'), right: m.lessons.filter(l => P.lessons[l.id] && P.lessons[l.id].done).length + '/' + m.lessons.length, num: pad2(i + 1), title: T.t }),
      h('p', { class: 'note', style: 'margin:0 0 10px' }, T.d),
      h('ul', { class: 'lessons' }, m.lessons.map(l => {
        const LT = tx('les', l.id) || { t: l.id, s: '' }; const p = P.lessons[l.id]; const stars = lessonStars(l.id);
        return h('li', null, h('a', { href: '#/l/' + l.id }, h('span', { class: 'n' }, pad2(l.n)), h('span', null, h('span', { class: 't' }, LT.t), h('br'), h('span', { class: 's' }, (LT.s || '') + ' · ≈' + l.min + ' min · ' + '★'.repeat(stars) + '☆'.repeat(3 - stars))), h('span', { class: 'st' + (p && p.done ? ' done' : (p && p.read ? ' part' : '')) }, p && p.done ? '✓' : '')));
      }))));
    main.appendChild(sec);
  });
  if (location.hash.includes('#m')) { const id = location.hash.split('#')[2]; setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 50); }
}

// ---------------------------------------------------------------- LESSON
function pageLesson(main, r) {
  const l = lessonById(r.id); if (!l) { location.hash = '#/course'; return; }
  const T = tx('les', l.id) || { t: l.id, body: '' };
  const MT = tx('mod', l.mod.id) || { t: '' };
  const p = LP(l.id); P.last = l.id;
  if (!p.read) { p.read = 1; save(); setTimeout(() => addXP(10), 600); } else save();
  const head = h('section', { class: 'panel p-paper' }, h('div', { class: 'in' },
    sheetHead({ left: t('module') + ' ' + pad2(l.mi + 1) + ' · ' + MT.t, mid: 'ID SCL-' + pad2(l.mi + 1) + pad2(l.li + 1), right: '≈ ' + l.min + ' MIN', num: pad2(l.n), title: T.t, h1: true }),
    h('div', { class: 'row' }, T.s ? h('span', { class: 'note', style: 'margin:0;flex:1;min-width:200px' }, T.s) : null,
      h('span', { class: 'pill' }, '★'.repeat(lessonStars(l.id)) + '☆'.repeat(3 - lessonStars(l.id))))));
  main.appendChild(head);
  const body = h('section', { class: 'panel p-paper mt' }, h('div', { class: 'in prose' }));
  const bin = body.firstChild;
  let cellN = 0;
  const blocks = String(T.body || '').split(/\n\s*\n/);
  blocks.forEach(raw => {
    const b = raw.trim(); if (!b) return;
    let m;
    if ((m = b.match(/^\[\[(c\d+)\]\]$/))) {
      const code = l.cells[m[1]]; if (code == null) return; cellN++;
      const ct = (T.cells && T.cells[m[1]]) || '';
      const c = cell(code, { title: t('example') + ' ' + cellN + (ct ? ' · ' + ct : ''), onRun: (res) => { if (!res.error && !p.runs[m[1]]) { p.runs[m[1]] = 1; save(); addXP(5); maybeComplete(l); } } });
      bin.appendChild(c.el);
      if (l.kbd && /MIDIdef/.test(code)) bin.appendChild(h('div', { style: 'margin:-6px 0 14px' }, keyboard(48, 25, (note, on) => LIB.midiDispatch(on ? 'noteOn' : 'noteOff', note, on ? 100 : 0))));
      return;
    }
    if (b.startsWith('!! ')) { bin.appendChild(tipBox(b.slice(3))); return; }
    if (b.startsWith('## ')) { bin.appendChild(h('h3', null, b.slice(3))); return; }
    if (/^- /.test(b)) { bin.appendChild(h('ul', null, b.split('\n').map(x => h('li', { html: md(x.replace(/^- /, '')) })))); return; }
    bin.appendChild(h('p', { html: md(b).replace(/\n/g, '<br>') }));
  });
  main.appendChild(body);
  // quiz
  if (T.quiz) main.appendChild(quizBox(l, T.quiz));
  // challenge
  if (T.ch && l.challenge) main.appendChild(challengeBox(l, T.ch));
  // nav
  const i = LESSONS.indexOf(l); const prev = LESSONS[i - 1], nxt = LESSONS[i + 1];
  const doneBtn = h('button', { class: 'btn ' + (p.done ? '' : 'mag'), type: 'button' }, p.done ? '✓ ' + t('completed') : t('mark_done'));
  doneBtn.onclick = () => { if (!p.done) { p.done = 1; save(); addXP(10); checkBadges(); doneBtn.textContent = '✓ ' + t('completed'); doneBtn.className = 'btn'; } };
  main.appendChild(h('div', { class: 'lessonnav' }, prev ? h('a', { class: 'btn', href: '#/l/' + prev.id }, '← ' + pad2(prev.n)) : h('span'), doneBtn, nxt ? h('a', { class: 'btn fill', href: '#/l/' + nxt.id }, pad2(nxt.n) + ' · ' + ((tx('les', nxt.id) || {}).t || '') + ' →') : h('a', { class: 'btn fill', href: '#/labs' }, t('nav_labs') + ' →')));
}
function quizBox(l, Q) {
  const p = LP(l.id); const ans = l.quiz.answer;
  const box = h('section', { class: 'panel p-paper mt quiz' }, h('div', { class: 'in' },
    h('div', { class: 'sh' }, h('div', { class: 'meta' }, h('span', null, 'QUIZ'), h('span', null, '+20 XP'), h('span', null, p.quiz ? '✓' : '')), h('div', { class: 'shm' }, h('div', { class: 'num' }, '?'), h('h2', null, t('quiz')))),
    h('p', { style: 'margin:0;font-size:15px', html: md(Q.q) })));
  const opts = h('div', { class: 'opts' }); const exp = h('div', { class: 'exp', hidden: true, html: md(Q.e || '') });
  Q.o.forEach((o, k) => {
    const b = h('button', { class: 'opt', type: 'button' }, h('b', null, 'ABCD'[k]), h('span', { html: md(o) }));
    b.onclick = () => {
      if (k === ans) { b.classList.add('right'); exp.hidden = false; if (!p.quiz) { p.quiz = 1; save(); const r = b.getBoundingClientRect(); addXP(20, r.left + 40, r.top); maybeComplete(l); } opts.querySelectorAll('button').forEach(x => x.disabled = true); }
      else { b.classList.add('wrong'); b.disabled = true; }
    };
    opts.appendChild(b);
  });
  box.firstChild.append(opts, exp);
  return box;
}
function challengeBox(l, Ch) {
  const p = LP(l.id); const checks = l.challenge.checks;
  const box = h('section', { class: 'panel p-mag mt' }, h('div', { class: 'in' },
    h('div', { class: 'sh' }, h('div', { class: 'meta' }, h('span', null, t('challenge')), h('span', null, '+40 XP'), h('span', null, p.ch ? '✓ ' + t('passed') : '')), h('div', { class: 'shm' }, h('div', { class: 'num' }, '★'), h('h2', null, t('challenge')))),
    h('p', { style: 'margin:0 0 6px;font-size:15px', html: md(Ch.task) })));
  const list = h('ul', { class: 'checks' }, checks.map((c, i) => h('li', null, h('i', null, ''), h('span', { html: md((Ch.checks && Ch.checks[i]) || JSON.stringify(c)) }))));
  let tk = null, checkTimer = 0, lastCode = '', lastValue;
  const c = cell(p.chCode || l.challenge.starter, {
    title: t('your_code'), counter: checks.some(x => x.maxChars),
    track: () => (tk = { ugens: new Set(), synths: 0, defs: 0, notes: 0, channels: 0, busOut: false, heard: false }),
    onRun: (res, code) => { lastCode = code; lastValue = res.value; p.chCode = c.ed.get(); save(); clearInterval(checkTimer); let n = 0; evalChecks(); checkTimer = setInterval(() => { evalChecks(); if (++n > 14) clearInterval(checkTimer); }, 300); },
  });
  onLeave(() => { clearInterval(checkTimer); track = null; });
  function evalChecks() {
    if (!tk) return; const T2 = tk; const NDEF = LIB.NDEFS;
    const ctx = { I, LIB, value: lastValue, code: lastCode };
    const okList = checks.map(ck => {
      try {
        if (ck.ugen) return T2.ugens.has(ck.ugen);
        if (ck.anyUgen) return ck.anyUgen.some(u => T2.ugens.has(u));
        if (ck.sound) return T2.synths > 0 || T2.notes > 0 || T2.heard;
        if (ck.notes) return T2.notes >= ck.notes;
        if (ck.value) return !!ck.value(lastValue);
        if (ck.fn) return !!ck.fn(ctx);
        if (ck.code) return ck.code.test(c.ed.get());
        if (ck.maxChars) return c.ed.get().trim().length <= ck.maxChars && c.ed.get().trim().length > 6;
        if (ck.defAdded) return T2.defs > 0;
        if (ck.synths) return T2.synths >= ck.synths;
        if (ck.channels) return T2.channels >= ck.channels;
        if (ck.busOut) return T2.busOut || T2.busOutCtl;
        if (ck.midi) return LIB.midiCount() > 0;
        if (ck.ndefVersions) return [...NDEF.values()].some(d => d.ver >= ck.ndefVersions);
      } catch (e) { return false; }
      return false;
    });
    okList.forEach((ok, i) => { const li = list.children[i]; li.classList.toggle('ok', ok); li.firstChild.textContent = ok ? '✓' : ''; });
    if (okList.every(Boolean) && !p.ch) { p.ch = 1; save(); clearInterval(checkTimer); const r = list.getBoundingClientRect(); addXP(40, r.left + 60, r.top); toast(t('challenge_ok')); box.querySelector('.meta span:last-child').textContent = '✓ ' + t('passed'); }
  }
  const hint = h('button', { class: 'btn sm', type: 'button', style: '--pb:var(--mag);--pf:#101010' }, '? ' + t('hint'));
  const hintP = h('p', { class: 'note', hidden: true, style: 'color:#101010', html: md(Ch.hint || '') });
  hint.onclick = () => hintP.hidden = !hintP.hidden;
  box.firstChild.append(c.el, h('div', { class: 'lbl', style: 'color:rgba(0,0,0,.7)' }, t('criteria')), list, h('div', { class: 'row mt' }, hint), hintP);
  return box;
}

// keyboard widget (on-screen + computer keys)
function keyboard(start, count, cb) {
  const k = h('div', { class: 'kbd', role: 'group', 'aria-label': 'keyboard' });
  const whites = []; const isBlack = n => [1, 3, 6, 8, 10].includes(n % 12);
  const keys = new Map(); let wi = 0;
  const totalW = Array.from({ length: count }, (_, i) => !isBlack(start + i)).filter(Boolean).length;
  for (let i = 0; i < count; i++) { const n = start + i; if (!isBlack(n)) { const el = h('div', { class: 'w' }, n % 12 === 0 ? 'C' + (Math.floor(n / 12) - 1) : ''); k.appendChild(el); keys.set(n, el); wi++; } }
  wi = 0;
  for (let i = 0; i < count; i++) { const n = start + i; if (isBlack(n)) { const el = h('div', { class: 'b' }); el.style.left = 'calc(' + (wi / totalW * 100) + '% - ' + (100 / totalW * 0.3) + '%)'; el.style.width = (100 / totalW * 0.6) + '%'; k.appendChild(el); keys.set(n, el); } else wi++; }
  const down = new Set();
  const on = n => { if (down.has(n)) return; down.add(n); keys.get(n) && keys.get(n).classList.add('on'); E.boot(); cb(n, true); };
  const off = n => { if (!down.has(n)) return; down.delete(n); keys.get(n) && keys.get(n).classList.remove('on'); cb(n, false); };
  keys.forEach((el, n) => { el.addEventListener('pointerdown', e => { e.preventDefault(); el.setPointerCapture(e.pointerId); on(n); }); el.addEventListener('pointerup', () => off(n)); el.addEventListener('pointercancel', () => off(n)); el.addEventListener('pointerleave', e => { if (e.buttons) off(n); }); });
  const map = 'awsedftgyhujkolpñ';
  const ku = e => { const i = map.indexOf(e.key.toLowerCase()); if (i >= 0) off(start + i); };
  const kd2 = e => { if (e.target.closest('textarea,input')) return; const i = map.indexOf(e.key.toLowerCase()); if (i >= 0 && !e.repeat && start + i < start + count) on(start + i); };
  addEventListener('keydown', kd2); addEventListener('keyup', ku);
  onLeave(() => { removeEventListener('keydown', kd2); removeEventListener('keyup', ku); down.forEach(off); });
  return k;
}

// ---------------------------------------------------------------- LABS
function pageLabs(main) {
  main.appendChild(h('section', { class: 'panel p-paper' }, h('div', { class: 'in' }, sheetHead({ left: t('nav_labs'), mid: G.SCLabs.LABS.length + ' LABS', right: Object.keys(P.labs).length + '/' + G.SCLabs.LABS.length, num: '⚗', title: t('labs_title'), h1: true }), h('p', { class: 'note', style: 'font-size:13.5px' }, t('labs_intro')))));
  main.appendChild(h('div', { class: 'grid3 mt' }, G.SCLabs.LABS.map((lb, i) => { const T = tx('labs', lb.id) || { t: lb.id, d: '' }; return h('a', { class: 'panel ' + (['p-paper', 'p-ink', 'p-mag', 'p-cya', 'p-yel'][i % 5]) + ' labcard', href: '#/lab/' + lb.id, style: 'text-decoration:none' }, h('div', { class: 'in' }, h('div', { class: 'meta' }, h('span', null, 'LAB ' + lb.num), h('span', null, P.labs[lb.id] ? '✓' : '+15 XP')), h('div', { class: 'lid', style: 'margin-top:6px' }, lb.num), h('h3', null, T.t), h('p', null, T.d), h('span', { class: 'btn sm' }, t('open') + ' →'))); })));
}
function pageLab(main, r) {
  const lb = G.SCLabs.LABS.find(x => x.id === r.id); if (!lb) { location.hash = '#/labs'; return; }
  const root = h('div'); main.appendChild(root);
  const api = {
    root, t, lt: id => tx('labs', id) || { t: id, d: '', tip: '' },
    run: code => evaluate(code), quiet: (code, fn) => { if (fn) return fn(); return evaluate(code, { quiet: true }); },
    stopAll, openRef, openFree, markLab: id => { if (!P.labs[id]) { P.labs[id] = 1; save(); addXP(15); } },
    scope: m => { if (m === 'timeline') return; setScope(m); }, keyboard, onLeave,
    newSynth: (name, ctl) => { E.boot(); const args = []; for (const k in ctl) args.push(L.sym(k), ctl[k]); try { return LIB.newSynth(L.sym(name), args); } catch (e) { postError(e); return null; } },
    setSynth: (sy, ctl) => { if (!sy) return; const c = {}; for (const k in ctl) c[k] = +ctl[k]; E.send({ type: 'n_set', id: sy.id, controls: c }); },
  };
  onLeave(() => { try { I.interpret('Ndef(\\lab).stop(0.3); Pdef(\\seq).stop; Pdef(\\labarp).stop;'); } catch (e) { } });
  lb.render(api, lb);
  const nav = h('div', { class: 'lessonnav' });
  const i = G.SCLabs.LABS.indexOf(lb); const pv = G.SCLabs.LABS[i - 1], nx = G.SCLabs.LABS[i + 1];
  nav.append(pv ? h('a', { class: 'btn', href: '#/lab/' + pv.id }, '← LAB ' + pv.num) : h('a', { class: 'btn', href: '#/labs' }, '← ' + t('nav_labs')), nx ? h('a', { class: 'btn fill', href: '#/lab/' + nx.id }, 'LAB ' + nx.num + ' →') : h('a', { class: 'btn fill', href: '#/free' }, t('nav_free') + ' →'));
  main.appendChild(nav);
}

// ---------------------------------------------------------------- FREE CODE
function openFree(code) { const id = 's' + Date.now(); P.snippets.unshift({ id, name: t('from_lesson') + ' ' + new Date().toLocaleTimeString().slice(0, 5), code }); P.cur = id; save(); location.hash = '#/free'; }
function pageFree(main) {
  if (!P.snippets.length) { P.snippets.push({ id: 's0', name: t('scratch'), code: C.examples[0][1] }); P.cur = 's0'; save(); }
  let cur = P.snippets.find(s => s.id === P.cur) || P.snippets[0];
  main.appendChild(h('section', { class: 'panel p-paper' }, h('div', { class: 'in' }, sheetHead({ left: t('nav_free'), mid: 'sclang ⇄ scsynth', right: P.snippets.length + ' ' + t('snippets'), num: '{ }', title: t('free_title'), h1: true }),
    h('p', { class: 'note', style: 'font-size:13.5px', html: md(t('free_intro')) }))));
  const sel = h('select', { class: 'btn', 'aria-label': t('snippets') });
  const fill = () => { sel.innerHTML = ''; P.snippets.forEach(s => sel.appendChild(h('option', { value: s.id, selected: s.id === cur.id }, s.name))); };
  fill();
  const exSel = h('select', { class: 'btn', 'aria-label': t('examples') }, h('option', { value: '' }, t('examples') + '…'), C.examples.map(([n], i) => h('option', { value: i }, n)));
  const name = h('input', { class: 'btn', value: cur.name, 'aria-label': 'name', style: 'text-transform:none;min-width:120px;flex:1' });
  const bNew = h('button', { class: 'btn', type: 'button' }, '+ ' + t('new'));
  const bDel = h('button', { class: 'btn', type: 'button' }, t('delete'));
  const bDl = h('button', { class: 'btn', type: 'button' }, '↓ .scd');
  const bRun = h('button', { class: 'btn cya', type: 'button' }, '▶ ' + t('run_region'));
  const bAll = h('button', { class: 'btn', type: 'button' }, '▶▶ ' + t('run_all'));
  const panel = h('section', { class: 'panel p-ink mt' }, h('div', { class: 'in' }, h('div', { class: 'row', style: 'margin-bottom:10px;--pb:#121314;--pf:#ECEBE6' }, sel, name, exSel, bNew, bDel, bDl)));
  const edHost = h('div', { class: 'cell', style: 'margin:0' });
  const out = h('div', { class: 'out' });
  const ed = G.SCEditor.create(edHost, { code: cur.code, big: true, onEval: c => evaluate(c, { out }), onStop: stopAll, onHelp: w => openRef(w), onChange: v => { cur.code = v; saveSoon(); } });
  edHost.appendChild(out);
  panel.firstChild.append(edHost, h('div', { class: 'row mt', style: '--pb:#121314;--pf:#ECEBE6' }, bRun, bAll, h('button', { class: 'btn', type: 'button', onclick: stopAll }, '■ STOP'), h('button', { class: 'btn', type: 'button', onclick: () => { evaluate('s.record'); } }, '● REC'), h('button', { class: 'btn', type: 'button', onclick: () => evaluate('s.stopRecording') }, '■ REC → WAV')),
    h('p', { class: 'note', style: 'color:#9C9B97', html: md(t('keys_help')) }));
  main.appendChild(panel);
  let st = 0; const saveSoon = () => { clearTimeout(st); st = setTimeout(save, 400); };
  sel.onchange = () => { cur = P.snippets.find(s => s.id === sel.value); P.cur = cur.id; save(); ed.set(cur.code); name.value = cur.name; };
  name.oninput = () => { cur.name = name.value; save(); fill(); };
  exSel.onchange = () => { if (exSel.value === '') return; const [n, c] = C.examples[+exSel.value]; const id = 's' + Date.now(); cur = { id, name: n, code: c }; P.snippets.unshift(cur); P.cur = id; save(); fill(); ed.set(c); name.value = n; exSel.value = ''; };
  bNew.onclick = () => { const id = 's' + Date.now(); cur = { id, name: t('untitled') + ' ' + (P.snippets.length + 1), code: '' }; P.snippets.unshift(cur); P.cur = id; save(); fill(); ed.set(''); name.value = cur.name; ed.focus(); };
  bDel.onclick = () => { if (P.snippets.length <= 1) return; if (!confirm(t('sure'))) return; P.snippets = P.snippets.filter(s => s !== cur); cur = P.snippets[0]; P.cur = cur.id; save(); fill(); ed.set(cur.code); name.value = cur.name; };
  bDl.onclick = () => { const a = h('a', { href: URL.createObjectURL(new Blob([ed.get()], { type: 'text/plain' })), download: (cur.name || 'sclab').replace(/[^\w-]+/g, '_') + '.scd' }); document.body.appendChild(a); a.click(); a.remove(); };
  bRun.onclick = () => ed.run('region');
  bAll.onclick = () => ed.run('all');
  setTimeout(() => ed.focus(), 50);
}

// ---------------------------------------------------------------- REFERENCE
const REF_EXTRA = {
  EnvGen: 'envelope, gate: 1, levelScale: 1, levelBias: 0, timeScale: 1, doneAction: 0', Env: 'levels, times, curve, releaseNode, loopNode · perc · adsr · asr · linen · sine · triangle',
  Out: 'bus, channelsArray', ReplaceOut: 'bus, channelsArray', OffsetOut: 'bus, channelsArray', In: 'bus: 0, numChannels: 1', LocalIn: 'numChannels: 1', LocalOut: 'channelsArray',
  Mix: 'array · Mix.fill(n, func)', Splay: 'inArray, spread: 1, level: 1, center: 0', PMOsc: 'carfreq, modfreq, pmindex: 0, modphase: 0, mul, add', Klank: '`[freqs, amps, ringtimes], input, freqscale: 1, freqoffset: 0, decayscale: 1', Klang: '`[freqs, amps, phases], freqscale: 1, freqoffset: 0',
  GrainSin: 'numChannels: 1, trigger, dur: 1, freq: 440, pan: 0', GrainFM: 'numChannels: 1, trigger, dur: 1, carfreq: 440, modfreq: 200, index: 1, pan: 0', Select: 'which, array', Poll: 'trig: 10, in, label',
  Demand: 'trig, reset, demandUGens', Duty: 'dur, reset, level, doneAction', TDuty: 'dur, reset, level, doneAction', Dseq: 'list, repeats: 1', Drand: 'list, repeats: 1', Dxrand: 'list, repeats: 1', Dshuf: 'list, repeats: 1', Dwhite: 'lo: 0, hi: 1, length: inf', Dseries: 'start: 1, step: 1, length: inf',
  SynthDef: 'name, ugenGraphFunc · .add · .play', Synth: 'defName, args, target, addAction · .set · .free · .release', Routine: 'func · .play · .stop · .next', Task: 'func · .play · .pause · .resume', TempoClock: 'tempo · .tempo_ · .beats · .sched',
  Pbind: '\\key, pattern, ...', Pseq: 'list, repeats: 1, offset: 0', Prand: 'list, repeats: 1', Pxrand: 'list, repeats: 1', Pwrand: 'list, weights, repeats: 1', Pshuf: 'list, repeats: 1', Pwhite: 'lo: 0, hi: 1, length: inf', Pexprand: 'lo, hi, length: inf', Pbrown: 'lo, hi, step, length: inf', Pseries: 'start: 0, step: 1, length: inf', Pgeom: 'start: 1, grow: 1, length: inf', Pn: 'pattern, repeats: inf', Pdup: 'n, pattern', Pfunc: 'func', Pkey: '\\key', Ppar: 'list, repeats: 1', Pdef: '\\name, pattern · .play · .stop', Ndef: '\\name, source · .play · .fadeTime_ · .set · .clear', ProxySpace: '.push · ~name = { } · .pop', Scale: 'Scale.major · .minor · .dorian · ...', Tuning: 'Tuning.et12 · .just · .pythagorean · .et(n)', MIDIdef: 'MIDIdef.noteOn(\\key, func, noteNum, chan) · .noteOff · .cc', Bus: 'Bus.audio(s, n) · Bus.control(s, n)',
  Array: 'fill · series · geom · rand · collect · do · scramble · choose · ...', Function: 'value · play · plot · fork · dup · !', Event: '(key: value).play', Operators: '+ - * / ** % · midicps · dbamp · range · linlin · clip · tanh · ...',
};
const REF_EX = { In: '// see lesson 18', Out: '{ Out.ar(0, SinOsc.ar([300, 301]) * 0.1) }.play;', Env: 'Env.adsr(0.1, 0.3, 0.5, 1).plot;', EnvGen: '{ SinOsc.ar * EnvGen.kr(Env.perc, doneAction: 2) * 0.2 ! 2 }.play;', SynthDef: 'SynthDef(\\x, { |freq = 440| Out.ar(0, SinOsc.ar(freq) * EnvGen.kr(Env.perc, doneAction: 2) * 0.2 ! 2) }).add;\nSynth(\\x, [\\freq, 660]);', Pbind: 'Pbind(\\degree, Pseq([0, 2, 4, 7], 2), \\dur, 0.2).play;', Ndef: 'Ndef(\\a, { SinOsc.ar([200, 201]) * 0.1 }).play;', Splay: '{ Splay.ar(SinOsc.ar([200, 300, 400, 500], 0, 0.1)) }.play;', Mix: '{ Mix(SinOsc.ar([200, 300, 400], 0, 0.1)) ! 2 }.play;', PMOsc: '{ PMOsc.ar(300, 450, 4) * 0.2 ! 2 }.play;', Klank: '{ Klank.ar(`[[400, 1071, 1353], nil, [1, 1, 1]], Impulse.ar(1, 0, 0.1)) ! 2 }.play;', GrainSin: '{ GrainSin.ar(2, Dust.kr(40), 0.05, 800) * 0.3 }.play;', Demand: '{ SinOsc.ar(Demand.kr(Impulse.kr(4), 0, Dseq([300, 400, 500], inf))) * 0.1 ! 2 }.play;', Duty: '{ SinOsc.ar(Duty.kr(0.25, 0, Dseq([300, 450, 600], inf))) * 0.1 ! 2 }.play;', MIDIdef: 'MIDIdef.noteOn(\\k, { |vel, note| (midinote: note).play });', Scale: 'Pbind(\\scale, Scale.dorian, \\degree, Pseq((0..7)), \\dur, 0.2).play;', Routine: 'fork { 4.do { |i| (degree: i).play; 0.3.wait } };', TempoClock: 'TempoClock.default.tempo = 2;', Pan2: '{ Pan2.ar(PinkNoise.ar(0.2), SinOsc.kr(0.5)) }.play;', MouseX: '{ SinOsc.ar(MouseX.kr(200, 2000, 1)) * 0.1 ! 2 }.play;', Pitch: '{ var p = Pitch.kr(SinOsc.ar(LFNoise0.kr(2).range(200, 600)))[0]; SinOsc.ar(p * 1.5) * 0.1 ! 2 }.play;', Amplitude: '{ SinOsc.ar(Amplitude.kr(Decay.ar(Impulse.ar(2), 0.5)).linexp(0, 1, 200, 2000)) * 0.1 ! 2 }.play;', Bus: 'b = Bus.audio(s, 2);', Operators: '[60, 64, 67].midicps;\n-6.dbamp;\n{ SinOsc.ar(SinOsc.kr(0.5).range(200, 800)) * 0.1 }.play;' };
function refExample(name) {
  if (REF_EX[name]) return REF_EX[name];
  const sp = LIB.SPEC[name];
  if (!sp) return name + '.help;';
  const args = sp.args.map(a => a[0]);
  const isFilter = args[0] === 'in';
  const inSig = /^(Ringz|Formlet|Decay|Decay2|Comb|Allpass|Delay|FreeVerb|GVerb|Pluck)/.test(name) ? 'Impulse.ar(2, 0, 0.3)' : /^(Lag|Slew|OnePole|LeakDC|Integrator)/.test(name) ? 'LFPulse.kr(2)' : 'Saw.ar(110, 0.3)';
  if (name === 'Pluck') return '{ Pluck.ar(WhiteNoise.ar(0.3), Impulse.kr(2), 0.01, 220.reciprocal, 3) ! 2 }.play;';
  if (/^(Lag|Lag2|Lag3|Slew|LagUD)$/.test(name)) return `{ SinOsc.ar(${name}.kr(LFPulse.kr(2).range(300, 600), 0.1)) * 0.1 ! 2 }.play;`;
  if (/^(Latch|Gate)$/.test(name)) return `{ SinOsc.ar(${name}.kr(LFNoise1.kr(5).range(200, 800), Impulse.kr(4))) * 0.1 ! 2 }.play;`;
  if (/^(TRand|TIRand|TExpRand)$/.test(name)) return `{ SinOsc.ar(${name}.kr(200, 800, Impulse.kr(5))) * 0.1 ! 2 }.play;`;
  if (sp.rates && sp.rates[0] === 'ir') return name + '.ir.poll;   // inside a synth: { ' + name + '.ir.poll; Silent.ar }.play';
  if (isFilter) return `{ ${name}.ar(${inSig}${args.length > 1 ? ', ' + sp.args.slice(1, 3).map(a => a[1] == null ? 0 : a[1]).join(', ') : ''}) * 0.5 ! 2 }.play;`;
  if (/^(Dust|Dust2|Impulse|Crackle|Logistic|LFNoise|Gendy|HenonN|WhiteNoise|PinkNoise|BrownNoise|GrayNoise|ClipNoise|LFClipNoise)/.test(name)) return `{ ${name}.ar(${name === 'Dust' || name === 'Dust2' ? 20 : name === 'Impulse' ? 4 : ''}) * 0.2 ! 2 }.play;`;
  return `{ ${name}.ar(${sp.args[0] && sp.args[0][0] === 'freq' ? 220 : ''}) * 0.15 ! 2 }.play;`;
}
function signature(name) {
  if (REF_EXTRA[name]) return name + '(' + REF_EXTRA[name] + ')';
  const sp = LIB.SPEC[name]; if (!sp) return name;
  const rates = (sp.rates || ['ar', 'kr']).join(' / ');
  return name + '.' + rates + '(' + sp.args.map(a => a[0] + (a[1] != null ? ': ' + a[1] : '')).concat(sp.ma ? ['mul: 1', 'add: 0'] : []).join(', ') + ')';
}
function openRef(name) { location.hash = '#/ref/' + encodeURIComponent(name || ''); }
function pageRef(main, r) {
  main.appendChild(h('section', { class: 'panel p-paper' }, h('div', { class: 'in' }, sheetHead({ left: t('nav_ref'), mid: Object.values(C.ref).flat().length + ' ' + t('classes'), right: '', num: 'Ω', title: t('ref_title'), h1: true }), h('p', { class: 'note', style: 'font-size:13.5px', html: md(t('ref_intro')) }))));
  const q = h('input', { class: 'search mt', placeholder: t('search') + '…', 'aria-label': t('search') });
  main.appendChild(q);
  const wrap = h('div'); main.appendChild(wrap);
  const draw = () => {
    const s = q.value.trim().toLowerCase(); wrap.innerHTML = '';
    Object.entries(C.ref).forEach(([cat, names]) => {
      const list = names.filter(n => !s || n.toLowerCase().includes(s) || String(tx('ref', n) || '').toLowerCase().includes(s));
      if (!list.length) return;
      wrap.appendChild(h('div', { class: 'lbl mt' }, t('cat_' + cat)));
      wrap.appendChild(h('div', { class: 'refl' }, list.map(n => {
        const used = LESSONS.filter(l => Object.values(l.cells).some(c => new RegExp('\\b' + n + '\\b').test(c))).slice(0, 4);
        const card = h('div', { class: 'refi p-paper', id: 'ref-' + n, style: (r.id === n ? 'outline:3px solid var(--mag)' : '') },
          h('h4', null, h('span', null, n), h('span', { class: 'tag' }, cat)), h('code', null, signature(n)), h('p', { html: md(tx('ref', n) || '') }),
          h('div', { class: 'row' }, h('button', { class: 'btn sm cya', type: 'button', onclick: () => openFree(refExample(n)) }, '▶ ' + t('try')), used.map(l => h('a', { class: 'btn sm', href: '#/l/' + l.id }, pad2(l.n)))));
        return card;
      })));
    });
    if (!wrap.children.length) wrap.appendChild(h('p', { class: 'note' }, t('no_results')));
  };
  q.oninput = draw; draw();
  if (r.id) setTimeout(() => { const el = document.getElementById('ref-' + r.id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 60);
}

// ---------------------------------------------------------------- TIPS
function pageTips(main) {
  const tips = TX().tips || FB().tips || [];
  main.appendChild(h('section', { class: 'panel p-paper' }, h('div', { class: 'in' }, sheetHead({ left: t('nav_tips'), mid: tips.length + ' TIPS', right: '', num: '◆', title: t('tips_title'), h1: true }), h('p', { class: 'note', style: 'font-size:13.5px' }, t('tips_intro')))));
  const cats = [...new Set(C.tips.map(x => x.cat))];
  cats.forEach(cat => {
    main.appendChild(h('div', { class: 'lbl mt' }, t('tcat_' + cat)));
    main.appendChild(h('div', { class: 'grid2' }, C.tips.map((tp, i) => tp.cat !== cat ? null : h('section', { class: 'panel ' + (['p-yel', 'p-paper', 'p-ink'][i % 3]) + ' tipc' }, h('div', { class: 'in' },
      h('div', { class: 'meta' }, h('span', null, '#' + pad2(i + 1)), h('span', null, t('tcat_' + cat))), h('h4', { style: 'margin-top:8px' }, (tips[i] || {}).t || ''), h('p', { html: md((tips[i] || {}).b || '') }), h('pre', null, tp.code)))).filter(Boolean)));
  });
}

// ---------------------------------------------------------------- RESOURCES
function pageRes(main) {
  main.appendChild(h('section', { class: 'panel p-ink' }, h('div', { class: 'in' },
    sheetHead({ left: t('nav_res'), mid: 'OPEN SOURCE · GPL', right: RESOURCES.length + ' LINKS', num: '↗', title: t('res_title'), h1: true }),
    h('p', { class: 'note', style: 'color:#C9C7C0;font-size:14px', html: md(t('res_intro')) }))));
  main.appendChild(h('div', { class: 'grid2 mt' }, RESOURCES.map(([k, url, col], i) =>
    h('a', { class: 'panel p-paper res', href: url, target: '_blank', rel: 'noopener', style: 'text-decoration:none;color:inherit' }, h('div', { class: 'in' },
      h('div', { class: 'meta' }, h('span', null, pad2(i + 1)), h('span', null, url.replace(/^https:\/\//, '').split('/')[0])),
      h('div', { class: 'shm' }, h('div', { class: 'sq' }, h('i', { class: col[0] })), h('h3', { style: 'margin:0;font:700 22px/1.05 var(--disp);text-transform:uppercase' }, t('res_' + k) + ' ↗')),
      h('p', { class: 'note', style: 'margin:6px 0 0' }, t('res_' + k + '_d')))))));
}

// ---------------------------------------------------------------- footer & settings
function footer() {
  return h('footer', { class: 'foot' },
    h('div', { class: 'hz', style: '--pf:var(--paperFg);margin-bottom:12px' }),
    h('p', { html: md(t('footer_1')) }),
    h('p', { html: md(t('footer_disc')) }),
    h('p', null, h('a', { href: REPO, target: '_blank', rel: 'noopener' }, 'GitHub'), ' · ', h('a', { href: IG, target: '_blank', rel: 'noopener' }, 'Instagram @buenos.aires.front'), ' · ', h('a', { href: '#/res' }, t('nav_res')), ' · v' + VERSION));
}
function settings() {
  const m = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' });
  const close = () => m.remove();
  m.addEventListener('click', e => { if (e.target === m) close(); });
  const vol = G.SCLabs.slider({ t: k => ({ c_volume: t('volume') })[k] || k }, { key: 'volume', min: -60, max: 0, val: P.vol, step: 1, unit: 'dB' }, v => { P.vol = v; save(); E.setVolumeDb(v); });
  const fileIn = h('input', { type: 'file', accept: '.json,application/json', hidden: true });
  fileIn.onchange = () => { const f = fileIn.files[0]; if (!f) return; f.text().then(s => { try { const d = JSON.parse(s); if (d.v !== 1) throw 0; P = Object.assign(fresh(), d); save(); toast(t('imported')); close(); render(); } catch (e) { toast(t('bad_file')); } }); };
  const panel = h('section', { class: 'panel p-paper' }, h('div', { class: 'in' },
    sheetHead({ left: t('settings'), mid: 'SC-LAB ' + VERSION, right: '', num: '⚙', title: t('settings') }),
    h('div', { class: 'lbl' }, t('language')), h('div', { class: 'row' }, LANGS.map(l => { const b = h('button', { class: 'btn sm', type: 'button', 'aria-pressed': String(l === lang) }, LANG_NAMES[l]); b.onclick = () => { setLang(l); close(); }; return b; })),
    h('div', { class: 'lbl' }, t('theme')), h('div', { class: 'seg' }, ['system', 'light', 'dark'].map(th => { const b = h('button', { type: 'button', 'aria-pressed': String(P.theme === th) }, t('th_' + th)); b.onclick = () => { P.theme = th; save(); applyTheme(); close(); settings(); }; return b; })),
    h('div', { class: 'lbl' }, t('audio')), vol.el,
    h('label', { class: 'row', style: 'margin-top:8px;font-size:13px' }, (() => { const c = h('input', { type: 'checkbox' }); c.checked = P.limit; c.onchange = () => { P.limit = c.checked; save(); E.setLimit(P.limit); }; return c; })(), t('limiter')),
    h('p', { class: 'note' }, t('safety_note')),
    h('div', { class: 'lbl' }, t('progress')),
    h('div', { class: 'row' },
      h('button', { class: 'btn', type: 'button', onclick: () => { const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(P, null, 1)], { type: 'application/json' })), download: 'sclab-progress.json' }); document.body.appendChild(a); a.click(); a.remove(); } }, '↓ ' + t('export')),
      h('button', { class: 'btn', type: 'button', onclick: () => fileIn.click() }, '↑ ' + t('import')), fileIn,
      h('button', { class: 'btn', type: 'button', onclick: () => { if (confirm(t('sure'))) { const keep = { lang: P.lang, theme: P.theme }; P = Object.assign(fresh(), keep); save(); close(); render(); } } }, t('reset_progress'))),
    h('p', { class: 'note' }, t('progress_note')),
    h('div', { class: 'lbl' }, t('shortcuts')), h('p', { class: 'note', html: md(t('keys_help')) }),
    h('div', { class: 'row mt' }, h('button', { class: 'btn fill', type: 'button', onclick: close }, t('close')))));
  m.appendChild(panel); document.body.appendChild(m);
  addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); removeEventListener('keydown', k); } });
}
function applyTheme() { const r = document.documentElement; if (P.theme === 'system') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', P.theme); }
async function setLang(l) { lang = l; P.lang = l; save(); await loadLang(l); renderChrome(); render(); const u = new URL(location.href); u.searchParams.set('lang', l); history.replaceState(null, '', u); }

// ---------------------------------------------------------------- boot
async function start() {
  lang = pickLang();
  await loadLang('es'); if (lang !== 'es') await loadLang(lang); if (lang !== 'en') loadLang('en');
  document.body.innerHTML = shellHTML();
  applyTheme();
  V.init(document.body);
  renderChrome();
  E.volDb = P.vol; E.limit = P.limit;
  $('#srv').onclick = () => { if (!E.booted) { E.boot(true); } else { evaluate('s.boot', { quiet: true }); } };
  $('#stop').onclick = () => stopAll();
  $('#settings').onclick = settings;
  $('#freeall').onclick = () => stopAll();
  $('#postclear').onclick = () => V.clearPost();
  $('#plot-x').onclick = () => { $('#plotbox').hidden = true; };
  $('#mon-toggle').onclick = () => { const a = $('#aside'); a.classList.toggle('open'); $('#mon-toggle').textContent = (a.classList.contains('open') ? '▼' : '▲') + ' MONITOR'; };
  addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === '.') { e.preventDefault(); stopAll(); } });
  addEventListener('hashchange', render);
  post('SuperCollider Lab ' + VERSION + ' · sclang (js) + scsynth (Web Audio)', 'info');
  post(t('post_hello'), 'info');
  render();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => { });
}
G.SCApp.start = start;
document.addEventListener('DOMContentLoaded', start);
})(window);
