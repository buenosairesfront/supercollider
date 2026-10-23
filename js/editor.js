/* SuperCollider Lab · U-MA — editor.js
 * Lightweight code editor with SC syntax colouring and IDE-like evaluation keys:
 *   Shift+Enter  evaluate line or selection
 *   Ctrl/Cmd+Enter  evaluate region ( ... ) or selection
 *   Ctrl/Cmd+.   stop all sound      Ctrl/Cmd+D  help for the word under the cursor
 */
(function (G) {
'use strict';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const KW = new Set(['var', 'arg', 'nil', 'true', 'false', 'this', 'thisThread', 'thisProcess', 'inf', 'pi', 'super', 'currentEnvironment']);
function highlight(src) {
  let out = '', i = 0; const n = src.length;
  const span = (c, t) => '<span class="tk-' + c + '">' + esc(t) + '</span>';
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (c === '/' && d === '/') { let j = src.indexOf('\n', i); if (j < 0) j = n; out += span('com', src.slice(i, j)); i = j; continue; }
    if (c === '/' && d === '*') { let j = src.indexOf('*/', i + 2); j = j < 0 ? n : j + 2; out += span('com', src.slice(i, j)); i = j; continue; }
    if (c === '"') { let j = i + 1; while (j < n && src[j] !== '"') { if (src[j] === '\\') j++; j++; } j = Math.min(n, j + 1); out += span('str', src.slice(i, j)); i = j; continue; }
    if (c === "'") { let j = i + 1; while (j < n && src[j] !== "'") j++; j = Math.min(n, j + 1); out += span('sym', src.slice(i, j)); i = j; continue; }
    if (c === '\\' && /[A-Za-z0-9_]/.test(d || '')) { let j = i + 1; while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++; out += span('sym', src.slice(i, j)); i = j; continue; }
    if (c === '~' && /[A-Za-z]/.test(d || '')) { let j = i + 1; while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++; out += span('env', src.slice(i, j)); i = j; continue; }
    if (c === '$' && i + 1 < n) { out += span('str', src.slice(i, i + 2)); i += 2; continue; }
    if (/[0-9]/.test(c) && !/[A-Za-z_]/.test(src[i - 1] || '')) { let j = i; while (j < n && /[0-9.e]/.test(src[j]) && !(src[j] === '.' && !/[0-9]/.test(src[j + 1] || ''))) j++; if (src.slice(j, j + 2) === 'pi') j += 2; out += span('num', src.slice(i, j)); i = j; continue; }
    if (/[A-Za-z_]/.test(c)) { let j = i; while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++; const w = src.slice(i, j); if (/^[A-Z]/.test(w)) out += span('cls', w); else if (KW.has(w)) out += span('kw', w); else if (src[j] === ':') out += span('sym', w); else out += esc(w); i = j; continue; }
    if ('(){}[];,|'.includes(c)) { out += span('pun', c); i++; continue; }
    out += esc(c); i++;
  }
  return out;
}

// Find the ( ... ) region around pos where '(' starts a line (SC IDE behaviour)
function regionAt(src, pos) {
  const stack = []; const pairs = [];
  let inStr = false, inCom = false, inLine = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inLine) { if (c === '\n') inLine = false; continue; }
    if (inCom) { if (c === '*' && src[i + 1] === '/') { inCom = false; i++; } continue; }
    if (inStr) { if (c === '\\') i++; else if (c === inStr) inStr = false; continue; }
    if (c === '/' && src[i + 1] === '/') { inLine = true; continue; }
    if (c === '/' && src[i + 1] === '*') { inCom = true; continue; }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '$') { i++; continue; }
    if (c === '(') stack.push(i);
    else if (c === ')' && stack.length) { const s = stack.pop(); pairs.push([s, i]); }
  }
  let best = null;
  for (const [s, e] of pairs) {
    if (s <= pos && pos <= e + 1) {
      const ls = src.lastIndexOf('\n', s - 1) + 1;
      if (src.slice(ls, s).trim() === '') { if (!best || (s < best[0])) best = [s, e + 1]; }
    }
  }
  return best;
}
function lineAt(src, pos) { const s = src.lastIndexOf('\n', pos - 1) + 1; let e = src.indexOf('\n', pos); if (e < 0) e = src.length; return [s, e]; }

function create(host, opts = {}) {
  const el = document.createElement('div'); el.className = 'ed' + (opts.big ? ' big' : '');
  el.innerHTML = '<div class="gut" aria-hidden="true"></div><div class="wrap"><div style="position:relative;display:inline-block;min-width:100%"><pre aria-hidden="true"></pre><textarea spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="SuperCollider code"></textarea></div></div>';
  const gut = el.querySelector('.gut'), pre = el.querySelector('pre'), ta = el.querySelector('textarea'), inner = el.querySelector('.wrap>div');
  ta.value = opts.code || '';
  if (opts.readOnly) ta.readOnly = true;
  let lastLines = -1;
  function render() {
    const v = ta.value; pre.innerHTML = highlight(v) + '\n';
    const lines = v.split('\n').length;
    if (lines !== lastLines) { gut.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n'); lastLines = lines; }
    if (opts.onChange) opts.onChange(v);
  }
  render();
  host.appendChild(el);
  function lh() { return parseFloat(getComputedStyle(pre).lineHeight) || 21; }
  function flash(s, e) {
    const v = ta.value; const l0 = v.slice(0, s).split('\n').length - 1, l1 = v.slice(0, e).split('\n').length - 1;
    const f = document.createElement('div'); f.className = 'flash'; const h = lh();
    f.style.top = (10 + l0 * h) + 'px'; f.style.height = ((l1 - l0 + 1) * h) + 'px';
    inner.appendChild(f); setTimeout(() => f.remove(), 500);
  }
  function evalRange(kind) {
    const v = ta.value; let s = ta.selectionStart, e = ta.selectionEnd;
    if (s === e) {
      if (kind === 'region') { const r = regionAt(v, s); if (r) { [s, e] = r; } else { [s, e] = lineAt(v, s); } }
      else if (kind === 'all') { s = 0; e = v.length; }
      else [s, e] = lineAt(v, s);
    }
    const code = v.slice(s, e);
    if (!code.trim()) return;
    flash(s, e);
    opts.onEval && opts.onEval(code, { start: s, line: v.slice(0, s).split('\n').length });
  }
  ta.addEventListener('input', render);
  ta.addEventListener('keydown', ev => {
    const mod = ev.ctrlKey || ev.metaKey;
    if (ev.key === 'Enter' && ev.shiftKey && !mod) { ev.preventDefault(); evalRange('line'); return; }
    if (ev.key === 'Enter' && mod) { ev.preventDefault(); evalRange(opts.runAll ? 'all' : 'region'); return; }
    if (ev.key === '.' && mod) { ev.preventDefault(); opts.onStop && opts.onStop(); return; }
    if ((ev.key === 'd' || ev.key === 'D') && mod) { ev.preventDefault(); const w = wordAt(); if (w && opts.onHelp) opts.onHelp(w); return; }
    if (ev.key === 'Tab' && !opts.readOnly) {
      ev.preventDefault(); const v = ta.value, s = ta.selectionStart, e = ta.selectionEnd;
      if (ev.shiftKey) { const ls = v.lastIndexOf('\n', s - 1) + 1; if (v.slice(ls, ls + 2) === '  ') { ta.value = v.slice(0, ls) + v.slice(ls + 2); ta.selectionStart = ta.selectionEnd = Math.max(ls, s - 2); render(); } return; }
      ta.value = v.slice(0, s) + '  ' + v.slice(e); ta.selectionStart = ta.selectionEnd = s + 2; render(); return;
    }
    if (ev.key === 'Enter' && !opts.readOnly) {
      const v = ta.value, s = ta.selectionStart; const ls = v.lastIndexOf('\n', s - 1) + 1; const ind = (v.slice(ls, s).match(/^\s*/) || [''])[0];
      const extra = /[({\[]\s*$/.test(v.slice(ls, s)) ? '  ' : '';
      ev.preventDefault(); const ins = '\n' + ind + extra; ta.value = v.slice(0, s) + ins + v.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = s + ins.length; render();
    }
  });
  function wordAt() { const v = ta.value, p = ta.selectionStart; let s = p, e = p; while (s > 0 && /\w/.test(v[s - 1])) s--; while (e < v.length && /\w/.test(v[e])) e++; return v.slice(s, e); }
  return {
    el, ta,
    get: () => ta.value,
    set(v) { ta.value = v; render(); },
    focus() { ta.focus(); },
    run(kind = 'all') { evalRange(kind); },
    flashAll() { flash(0, ta.value.length); },
  };
}
G.SCEditor = { create, highlight, regionAt };
})(window);
