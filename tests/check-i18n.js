// Checks that every language file has the same structure as Spanish (the base language).
const fs = require('fs'), path = require('path'), vm = require('vm');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../content/course.js'), 'utf8'), ctx);
const langs = ['es', 'en', 'de', 'zh', 'ja', 'hi'];
for (const l of langs) { const f = path.join(__dirname, '../content/' + l + '.js'); if (fs.existsSync(f)) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f }); }
const C = ctx.window.SC_COURSE, S = ctx.window.SC_LANG, base = S.es;
let problems = 0; const bad = (l, m) => { problems++; console.log(l + ': ' + m); };
const tokens = s => (String(s).match(/\[\[[^\]]+\]\]/g) || []).sort().join(' ');
for (const l of langs) {
  const L = S[l]; if (!L) { bad(l, 'missing file'); continue; }
  for (const k of Object.keys(base.ui)) if (!(k in L.ui)) bad(l, 'ui.' + k);
  if ((L.levels || []).length !== base.levels.length) bad(l, 'levels');
  for (const k of Object.keys(base.mod)) if (!L.mod[k] || !L.mod[k].t || !L.mod[k].d) bad(l, 'mod.' + k);
  for (const m of C.modules) for (const les of m.lessons) {
    const T = L.les[les.id]; if (!T) { bad(l, 'les.' + les.id); continue; }
    ['t', 's', 'body'].forEach(k => { if (!T[k]) bad(l, les.id + '.' + k); });
    if (tokens(T.body) !== tokens(base.les[les.id].body)) bad(l, les.id + ' body tokens differ: ' + tokens(T.body));
    for (const c of Object.keys(les.cells)) if (!T.cells || !T.cells[c]) bad(l, les.id + '.cells.' + c);
    if (!T.quiz || T.quiz.o.length !== 4 || !T.quiz.q || !T.quiz.e) bad(l, les.id + '.quiz');
    if (!T.ch || !T.ch.task || !T.ch.hint || (T.ch.checks || []).length !== les.challenge.checks.length) bad(l, les.id + '.ch checks ' + (T.ch && T.ch.checks || []).length + ' vs ' + les.challenge.checks.length);
  }
  if (l !== 'en') for (const k of Object.keys(C.quotes)) if (!L.quotes[k]) bad(l, 'quotes.' + k);
  if ((L.tips || []).length !== C.tips.length) bad(l, 'tips ' + (L.tips || []).length);
  (L.tips || []).forEach((t, i) => { if (!t.t || !t.b) bad(l, 'tip ' + i); });
  for (const k of Object.values(C.ref).flat()) if (!L.ref[k]) bad(l, 'ref.' + k);
  for (const k of Object.keys(base.labs)) if (!L.labs[k] || !L.labs[k].t || !L.labs[k].d || !L.labs[k].tip) bad(l, 'labs.' + k);
  if (!L.book || !L.book.about || (L.book.disclaimer || []).length !== base.book.disclaimer.length || (L.book.how || []).length !== base.book.how.length) bad(l, 'book');
}
console.log(problems ? problems + ' problems' : 'all languages complete');
process.exit(problems ? 1 : 0);
