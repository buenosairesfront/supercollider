// Runs every code cell, example and tip of the course headless and reports errors / silence.
const fs = require('fs'), path = require('path'), vm = require('vm');
const H = require('./harness');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../content/course.js'), 'utf8'), ctx);
const C = ctx.window.SC_COURSE;
let fails = 0, total = 0;
const report = (name, env, before, acc, expectSound) => {
  total++;
  const errs = env.errors.slice(before);
  const silent = acc.pk < 1e-4;
  const bad = errs.length || (expectSound && silent) || acc.nan;
  if (bad) fails++;
  console.log((bad ? 'FAIL ' : 'ok   ') + name.padEnd(14) + ' peak ' + acc.pk.toFixed(3) + (acc.nan ? ' NAN' : '') + (errs.length ? '  ' + errs.join(' | ').slice(0, 300) : '') + ((expectSound && silent) ? '  (silent)' : ''));
};
for (const m of C.modules) for (const l of m.lessons) {
  const env = H.makeEnv();
  for (const [cid, code] of Object.entries(l.cells)) {
    const before = env.errors.length;
    env.evalCode(code);
    const acc = { sL: 0, sR: 0, n: 0, pk: 0, nan: false };
    env.advance(1.2, acc);
    const expectSound = /\.play|play\{|Synth\(|fork|Pdef|Ndef|~b = /.test(code) && !/SoundIn|MIDIdef|MouseButton/.test(code) && !/^x\.free|^r\.stop|Pdef\(\\mel\)\.stop|^Ndef\.clear/.test(code);
    report(l.id + '.' + cid, env, before, acc, expectSound);
  }
  env.LIB.stopAll();
}
for (const [name, code] of C.examples) {
  const env = H.makeEnv(); const before = env.errors.length; env.evalCode(code);
  const acc = { sL: 0, sR: 0, n: 0, pk: 0, nan: false }; env.advance(1.5, acc); report('ex:' + name.slice(0, 10), env, before, acc, true);
}
console.log('\n' + (total - fails) + '/' + total + ' passed');
process.exit(fails ? 1 : 0);
