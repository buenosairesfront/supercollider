/* SuperCollider Lab · U-MA — viz.js
 * Monitor: oscilloscope / spectrum / X-Y / sonogram, meters, UGen graph (live levels),
 * node tree, event timeline, plots and the post window.
 */
(function (G) {
'use strict';
const E = () => G.SCEngine;
const COLORS = { mag: '#D12F7D', cya: '#2A9EBF', yel: '#E1C43B', grn: '#3FA36B', paper: '#F0EFEA', red: '#D2402F' };
const PLAYER_COLORS = ['#D12F7D', '#2A9EBF', '#E1C43B', '#3FA36B', '#F3A35C', '#C79BF2', '#F0EFEA'];
const dpr = () => Math.min(2, G.devicePixelRatio || 1);
function fit(cv) { const r = cv.getBoundingClientRect(); const w = Math.max(10, Math.round(r.width * dpr())), h = Math.max(10, Math.round(r.height * dpr())); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; } return [w, h]; }
function grid(g, w, h) {
  g.fillStyle = '#050505'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = 1;
  for (let i = 1; i < 10; i++) { const x = Math.round(w * i / 10) + .5; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  for (let i = 1; i < 6; i++) { const y = Math.round(h * i / 6) + .5; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  g.strokeStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.moveTo(0, h / 2 + .5); g.lineTo(w, h / 2 + .5); g.stroke();
}

const V = {
  mode: 'scope', bufL: null, bufR: null, fL: null, fR: null, sono: null, notes: [], watch: null, graphDef: null, graphEls: null, raf: 0,
  init(root) {
    this.root = root;
    this.cv = root.querySelector('#scope'); this.g = this.cv.getContext('2d');
    this.tl = root.querySelector('#timeline'); this.tg = this.tl ? this.tl.getContext('2d') : null;
    this.postEl = root.querySelector('#post');
    this.treeEl = root.querySelector('#tree');
    this.graphEl = root.querySelector('#graph');
    this.read = { peak: root.querySelector('#r-peak'), cpu: root.querySelector('#r-cpu'), syn: root.querySelector('#r-syn'), ug: root.querySelector('#r-ug') };
    this.mL = root.querySelector('#m-l'); this.mR = root.querySelector('#m-r'); this.mLt = root.querySelector('#m-lt'); this.mRt = root.querySelector('#m-rt');
    E().on('status', st => this.onStatus(st));
    E().on('mouse', m => { this.mouse = m; });
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
    // touch → MouseX/Y over scope
    const touch = e => { const r = this.cv.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; E().send({ type: 'mouse', mouse: { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) } }); this.mouse = { x, y }; };
    this.cv.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse' && e.buttons) touch(e); });
    this.cv.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { this.cv.setPointerCapture(e.pointerId); touch(e); } });
  },
  setMode(m) { this.mode = m; this.sonoImg = null; },
  loop() {
    this.raf = requestAnimationFrame(this.loop);
    if (document.hidden) return;
    this.drawScope();
    this.drawTimeline();
  },
  drawScope() {
    const [w, h] = fit(this.cv), g = this.g; const e = E();
    if (!e.booted) { grid(g, w, h); g.fillStyle = '#77756F'; g.font = (11 * dpr()) + 'px IBM Plex Mono, monospace'; g.fillText(G.SCApp ? G.SCApp.t('mon_idle') : 'server off', 10 * dpr(), 18 * dpr()); return; }
    const aL = e.anL, aR = e.anR;
    if (!this.bufL || this.bufL.length !== aL.fftSize) { this.bufL = new Float32Array(aL.fftSize); this.bufR = new Float32Array(aR.fftSize); this.fL = new Float32Array(aL.frequencyBinCount); this.fR = new Float32Array(aR.frequencyBinCount); }
    if (this.mode === 'scope' || this.mode === 'xy') {
      aL.getFloatTimeDomainData(this.bufL); aR.getFloatTimeDomainData(this.bufR);
      grid(g, w, h);
      if (this.mode === 'xy') {
        g.strokeStyle = COLORS.yel; g.lineWidth = 1.2 * dpr(); g.globalAlpha = .9; g.beginPath();
        const s = Math.min(w, h) * 0.46;
        for (let i = 0; i < 2048; i++) { const x = w / 2 + this.bufL[i] * s, y = h / 2 - this.bufR[i] * s; i ? g.lineTo(x, y) : g.moveTo(x, y); }
        g.stroke(); g.globalAlpha = 1; return;
      }
      const N = 1024; let st = 0; const B = this.bufL;
      for (let i = 1; i < B.length - N; i++) if (B[i - 1] <= 0 && B[i] > 0) { st = i; break; }
      const drawCh = (buf, col) => { g.strokeStyle = col; g.lineWidth = 1.5 * dpr(); g.beginPath(); for (let i = 0; i < N; i++) { const x = i / (N - 1) * w, y = h / 2 - buf[st + i] * h * 0.45; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); };
      drawCh(this.bufR, COLORS.mag); drawCh(this.bufL, COLORS.cya);
      if (this.mouse) { g.fillStyle = 'rgba(225,196,59,.8)'; g.fillRect(this.mouse.x * w - 1, 0, 2 * dpr(), 6 * dpr()); }
    } else if (this.mode === 'spectrum') {
      aL.getFloatFrequencyData(this.fL); aR.getFloatFrequencyData(this.fR);
      grid(g, w, h); const sr = e.sampleRate(), bins = this.fL.length;
      g.fillStyle = 'rgba(255,255,255,.35)'; g.font = (9 * dpr()) + 'px IBM Plex Mono, monospace';
      [50, 100, 200, 500, 1000, 2000, 5000, 10000].forEach(f => { const x = Math.log(f / 20) / Math.log(1000) * w; g.fillText(f >= 1000 ? f / 1000 + 'k' : f, x + 2, h - 4); });
      const drawSp = (arr, col, fillA) => {
        g.beginPath(); g.moveTo(0, h);
        for (let x = 0; x < w; x += 2) { const f = 20 * Math.pow(1000, x / w); const b = Math.min(bins - 1, Math.round(f / (sr / 2) * bins)); const db = arr[b]; const y = h - Math.max(0, Math.min(1, (db + 100) / 90)) * h; g.lineTo(x, y); }
        g.lineTo(w, h); g.closePath(); g.fillStyle = fillA; g.fill(); g.strokeStyle = col; g.lineWidth = 1.2 * dpr(); g.stroke();
      };
      drawSp(this.fR, COLORS.mag, 'rgba(209,47,125,.18)'); drawSp(this.fL, COLORS.cya, 'rgba(42,158,191,.22)');
    } else if (this.mode === 'sono') {
      aL.getFloatFrequencyData(this.fL); const sr = e.sampleRate(), bins = this.fL.length;
      if (!this.sonoImg || this.sonoImg.width !== w || this.sonoImg.height !== h) { this.sonoImg = g.createImageData(w, h); for (let i = 3; i < this.sonoImg.data.length; i += 4) this.sonoImg.data[i] = 255; }
      const img = this.sonoImg, d = img.data, sh = 2;
      for (let y = 0; y < h; y++) { const row = y * w * 4; d.copyWithin(row, row + sh * 4, row + w * 4); }
      for (let y = 0; y < h; y++) {
        const f = 30 * Math.pow(16000 / 30, 1 - y / h); const b = Math.min(bins - 1, Math.round(f / (sr / 2) * bins)); const v = Math.max(0, Math.min(1, (this.fL[b] + 100) / 80));
        for (let k = 1; k <= sh; k++) { const o = (y * w + (w - k)) * 4; d[o] = v * 209 + (1 - v) * 5 * v; d[o + 1] = v * v * 160 + v * 40; d[o + 2] = v * 125 + (v > .7 ? 120 : 0); }
      }
      g.putImageData(img, 0, 0);
    }
  },
  onStatus(st) {
    const db = x => x <= 0.00001 ? '-∞' : (20 * Math.log10(x)).toFixed(1);
    const pk = Math.max(st.peaks[0], st.peaks[1]);
    if (this.read.peak) { this.read.peak.textContent = db(pk); this.read.cpu.textContent = st.cpu.toFixed(1) + '%'; this.read.syn.textContent = st.synths; this.read.ug.textContent = st.ugens; }
    const lvl = x => Math.max(0, Math.min(1, (20 * Math.log10(Math.max(x, 1e-5)) + 60) / 60));
    if (this.mL) { this.mL.style.clipPath = 'inset(0 ' + (100 - lvl(st.peaks[0]) * 100) + '% 0 0)'; this.mR.style.clipPath = 'inset(0 ' + (100 - lvl(st.peaks[1]) * 100) + '% 0 0)'; this.mLt.textContent = db(st.peaks[0]); this.mRt.textContent = db(st.peaks[1]); }
    if (st.nan && !this.nanWarned) { this.nanWarned = true; this.post(G.SCApp.t('nan_warn'), 'warn'); setTimeout(() => this.nanWarned = false, 5000); }
    this.renderTree(st.nodes || []);
    if (st.watch && this.graphEls && this.graphDef && st.watch.id === this.watchId) this.graphLevels(st.watch.lv);
    G.SCApp && G.SCApp.onStatus && G.SCApp.onStatus(st);
  },
  // ---------------- node tree ----------------
  renderTree(nodes) {
    if (!this.treeEl) return;
    const key = nodes.map(n => n[0]).join(',');
    if (key === this.treeKey) return; this.treeKey = key;
    const t = G.SCApp ? G.SCApp.t : (k => k);
    if (!nodes.length) { this.treeEl.innerHTML = '<li class="emptyt">' + t('tree_empty') + '</li>'; return; }
    this.treeEl.innerHTML = '';
    nodes.forEach(([id, def, tag]) => {
      const li = document.createElement('li');
      let nm = def;
      if (/^temp__/.test(def)) nm = '{ }.play'; else if (/^Ndef_(.+)_\d+$/.test(def)) nm = 'Ndef(\\' + def.match(/^Ndef_(.+)_\d+$/)[1] + ')'; else if (/^NdefMon_(.+)_\d+$/.test(def)) nm = 'monitor \\' + def.match(/^NdefMon_(.+)_\d+$/)[1];
      if (tag === 'ev') nm = '♪ ' + def;
      li.innerHTML = '<span>' + id + '</span><b title="' + def + '">' + nm.replace(/</g, '&lt;') + '</b><button title="free" aria-label="free ' + id + '">×</button>';
      li.querySelector('button').onclick = () => E().send({ type: 'n_free', id });
      li.querySelector('b').onclick = () => { const d = G.SCApp.lastDefs.get(def); if (d) this.showGraph(d, id); };
      this.treeEl.appendChild(li);
    });
  },
  // ---------------- UGen graph ----------------
  showGraph(def, synthId) {
    if (!this.graphEl || !def) return;
    this.graphDef = def; this.watchId = synthId;
    if (synthId != null) E().send({ type: 'watch', id: synthId });
    const U = def.units; const depth = new Array(U.length).fill(0);
    U.forEach((u, i) => { let d = 0; u.ins.forEach(x => { if (x[0] === 'u') d = Math.max(d, depth[x[1]] + 1); }); depth[i] = u.name === 'Control' ? 0 : Math.max(1, d); });
    const cols = []; U.forEach((u, i) => { (cols[depth[i]] || (cols[depth[i]] = [])).push(i); });
    const opSym = { '+': '+', '-': '−', '*': '×', '/': '÷', '**': '**', '%': '%' };
    const label = u => {
      if (u.name === 'Control') return '\\' + (u.params.name || 'ctl');
      let nm = u.name === 'BinaryOpUGen' ? (opSym[u.params.op] || u.params.op) : u.name === 'UnaryOpUGen' ? u.params.op : u.name;
      if (u.name === 'OutKr') nm = 'Out.kr'; if (u.name === 'InKr') nm = 'In.kr';
      const args = u.ins.map(x => x[0] === 'c' ? fmt(x[1]) : '•');
      if (u.name === 'EnvGen') return 'EnvGen(Env…)';
      return nm + (args.length ? '(' + (args.length > 5 ? args.slice(0, 5).join(', ') + ', …' : args.join(', ')) + ')' : '');
    };
    const fmt = v => Math.abs(v) >= 1000 ? Math.round(v) : (+v.toPrecision(3)).toString();
    const color = u => u.name === 'Control' ? '#F0EFEA' : /^(Out|OutKr|ReplaceOut|OffsetOut|LocalOut)$/.test(u.name) ? COLORS.mag : u.rate === 'ar' ? COLORS.cya : u.rate === 'kr' ? COLORS.yel : '#9C9B97';
    const CW = 7, NH = 22, GX = 34, GY = 10, PAD = 10;
    const widths = U.map(u => Math.min(220, 14 + label(u).length * 6.6));
    const colW = cols.map(c => Math.max(...c.map(i => widths[i])));
    const pos = []; let x = PAD; let maxY = 0;
    cols.forEach((c, k) => { c.forEach((i, r) => { pos[i] = { x, y: PAD + r * (NH + GY), w: widths[i] }; maxY = Math.max(maxY, PAD + r * (NH + GY) + NH); }); x += colW[k] + GX; });
    const W = x - GX + PAD, H = maxY + PAD;
    let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">';
    U.forEach((u, i) => u.ins.forEach((inp, k) => { if (inp[0] !== 'u') return; const a = pos[inp[1]], b = pos[i]; if (!a || !b) return; const x1 = a.x + a.w, y1 = a.y + NH / 2, x2 = b.x, y2 = b.y + 4 + Math.min(k, 5) * 3; svg += '<path class="gedge" d="M' + x1 + ',' + y1 + ' C' + (x1 + 18) + ',' + y1 + ' ' + (x2 - 18) + ',' + y2 + ' ' + x2 + ',' + y2 + '"/>'; }));
    U.forEach((u, i) => { const p = pos[i]; svg += '<g class="gnode" data-i="' + i + '" data-n="' + u.name + '"><rect x="' + p.x + '" y="' + p.y + '" width="' + p.w + '" height="' + NH + '" fill="' + color(u) + '" fill-opacity=".55"/><rect class="lv" x="' + p.x + '" y="' + (p.y + NH - 3) + '" width="0" height="3" fill="#fff"/><text x="' + (p.x + 7) + '" y="' + (p.y + 15) + '">' + label(u).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text></g>'; });
    svg += '</svg>';
    this.graphEl.innerHTML = svg;
    const title = this.root.querySelector('#graph-title'); if (title) title.textContent = (/^temp__/.test(def.name) ? '{ }.play' : /^Ndef_(.+)_\d+$/.test(def.name) ? 'Ndef(\\' + def.name.match(/^Ndef_(.+)_\d+$/)[1] + ')' : def.name) + ' · ' + U.length + ' UGens';
    this.graphEls = [...this.graphEl.querySelectorAll('.gnode')].map(gn => ({ rect: gn.querySelector('rect'), lv: gn.querySelector('.lv'), w: pos[+gn.dataset.i].w }));
    this.graphEl.querySelectorAll('.gnode').forEach(gn => gn.addEventListener('click', () => G.SCApp.openRef(gn.dataset.n === 'BinaryOpUGen' || gn.dataset.n === 'UnaryOpUGen' ? 'Operators' : gn.dataset.n)));
  },
  graphLevels(lv) {
    if (!this.graphEls || lv.length !== this.graphEls.length) return;
    lv.forEach((v, i) => { const e = this.graphEls[i]; const a = Math.min(1, v); e.rect.setAttribute('fill-opacity', (0.35 + 0.65 * Math.min(1, Math.sqrt(a))).toFixed(2)); e.lv.setAttribute('width', (e.w * Math.min(1, Math.sqrt(a))).toFixed(1)); });
  },
  // ---------------- timeline ----------------
  note(n) { this.notes.push(n); if (this.notes.length > 400) this.notes.splice(0, 100); },
  drawTimeline() {
    if (!this.tg) return; const [w, h] = fit(this.tl), g = this.tg; const e = E();
    g.fillStyle = '#050505'; g.fillRect(0, 0, w, h);
    const now = e.now(), span = 6, ahead = 0.6; const t0 = now - span, t1 = now + ahead;
    const tx = t => (t - t0) / (t1 - t0) * w;
    g.strokeStyle = 'rgba(255,255,255,.06)';
    for (let k = Math.ceil(t0); k < t1; k++) { const x = tx(k); g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    const vis = this.notes.filter(n => n.time + n.dur > t0 && n.time < t1 && n.freq);
    if (vis.length) {
      const midis = vis.map(n => 69 + 12 * Math.log2(n.freq / 440)); let lo = Math.min(...midis) - 3, hi = Math.max(...midis) + 3; if (hi - lo < 18) { const c = (hi + lo) / 2; lo = c - 9; hi = c + 9; }
      vis.forEach((n, i) => { const m = midis[i]; const y = h - (m - lo) / (hi - lo) * h; const x = tx(n.time), x2 = tx(n.time + Math.max(n.dur, 0.03)); const playing = n.time <= now && now <= n.time + n.dur;
        g.fillStyle = PLAYER_COLORS[(n.player || 0) % PLAYER_COLORS.length]; g.globalAlpha = playing ? 1 : 0.55; g.fillRect(x, y - 3 * dpr(), Math.max(2, x2 - x), 6 * dpr()); });
      g.globalAlpha = 1;
    } else { g.fillStyle = '#5E5D58'; g.font = (10.5 * dpr()) + 'px IBM Plex Mono, monospace'; g.fillText(G.SCApp ? G.SCApp.t('tl_empty') : '', 10 * dpr(), h / 2); }
    g.strokeStyle = COLORS.yel; g.lineWidth = 1.5 * dpr(); const xn = tx(now); g.beginPath(); g.moveTo(xn, 0); g.lineTo(xn, h); g.stroke();
  },
  // ---------------- plot ----------------
  plot(data, opts = {}) {
    const box = this.root.querySelector('#plotbox'); if (!box) return;
    box.hidden = false; box.querySelector('#plot-title').textContent = (opts.title || 'plot') + (opts.duration ? ' · ' + (+opts.duration.toPrecision(3)) + ' s' : '') + ' · ' + data.length + ' ch';
    const cv = box.querySelector('canvas'); const n = data.length; cv.style.height = Math.min(320, 90 + 60 * n) + 'px';
    requestAnimationFrame(() => {
      const [w, h] = fit(cv), g = cv.getContext('2d'); g.fillStyle = '#050505'; g.fillRect(0, 0, w, h);
      const ch = h / n; const cols = [COLORS.cya, COLORS.mag, COLORS.yel, COLORS.grn];
      data.forEach((arr, c) => {
        let mn = opts.minval != null ? opts.minval : Math.min(0, ...arr), mx = opts.maxval != null ? opts.maxval : Math.max(0, ...arr); if (mx - mn < 1e-9) { mx += 1; mn -= 1; }
        if (opts.minval == null && opts.maxval == null && !opts.env && mn < 0 && mx > 0) { const m = Math.max(-mn, mx); mn = -m; mx = m; }
        const y0 = c * ch; g.strokeStyle = 'rgba(255,255,255,.12)'; g.strokeRect(0.5, y0 + 0.5, w - 1, ch - 1);
        const zy = y0 + ch - (0 - mn) / (mx - mn) * ch; g.strokeStyle = 'rgba(255,255,255,.2)'; g.beginPath(); g.moveTo(0, zy); g.lineTo(w, zy); g.stroke();
        g.strokeStyle = cols[c % 4]; g.lineWidth = 1.6 * dpr(); g.beginPath();
        const L = arr.length;
        if (opts.discrete || L < 64) { g.fillStyle = cols[c % 4]; for (let i = 0; i < L; i++) { const x = (i + 0.5) / L * w, y = y0 + ch - (arr[i] - mn) / (mx - mn) * ch; g.fillRect(x - 2, y - 2, 4 * dpr(), 4 * dpr()); i ? g.lineTo(x, y) : g.moveTo(x, y); } }
        else for (let px = 0; px < w; px++) { const i0 = Math.floor(px / w * L), i1 = Math.max(i0 + 1, Math.floor((px + 1) / w * L)); let lo = Infinity, hi = -Infinity; for (let i = i0; i < i1 && i < L; i++) { lo = Math.min(lo, arr[i]); hi = Math.max(hi, arr[i]); } const ya = y0 + ch - (hi - mn) / (mx - mn) * ch, yb = y0 + ch - (lo - mn) / (mx - mn) * ch; if (px === 0) g.moveTo(px, ya); g.lineTo(px, ya); g.lineTo(px, yb); }
        g.stroke();
        g.fillStyle = 'rgba(255,255,255,.5)'; g.font = (9.5 * dpr()) + 'px IBM Plex Mono, monospace'; g.fillText((+mx.toPrecision(3)) + '', 4, y0 + 12 * dpr()); g.fillText((+mn.toPrecision(3)) + '', 4, y0 + ch - 4);
      });
    });
    if (G.SCApp && G.SCApp.revealMonitor) G.SCApp.revealMonitor();
  },
  // ---------------- post window ----------------
  post(text, kind = 'res') {
    if (!this.postEl) return;
    const d = document.createElement('div'); d.className = kind; d.textContent = text;
    this.postEl.appendChild(d);
    while (this.postEl.childNodes.length > 500) this.postEl.firstChild.remove();
    this.postEl.scrollTop = this.postEl.scrollHeight;
  },
  clearPost() { if (this.postEl) this.postEl.innerHTML = ''; },
};
G.SCViz = V;
})(window);
