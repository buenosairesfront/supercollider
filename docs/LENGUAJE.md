# Qué entiende el SuperCollider web

SuperCollider Lab no ejecuta el SuperCollider de escritorio: trae su propio intérprete de un **subconjunto de sclang** (`js/lang.js`, `js/sclib.js`, `js/patterns.js`) y un **motor tipo scsynth** (`js/dsp.js`). La meta es que el código del curso, y la mayoría del código "de aprendizaje", corra igual que en el escritorio.

## Sintaxis

- Números (enteros y flotantes, `1e-3`, `2pi`, `inf`), strings, símbolos (`\freq`, `'freq'`), caracteres (`$a`), `nil`, `true`, `false`.
- Arrays `[ ]`, literales `#[ ]`, rangos `(1..10)` y `(1, 3 .. 11)`, índices `a[0]`, `a[0] = x`, `a[1..3]`.
- Eventos `(freq: 440, dur: 0.5)`.
- Funciones `{ |a, b = 2| var x; ... }` y `{ arg a, b; ... }`, `...rest`, `f.value`, `f.()`.
- Mensajes `recv.msg(args)`, argumentos con nombre `freq: 440`, sintaxis funcional `rrand(1, 10)`, funciones al final `5.do { }`, `fork { }`, `loop { }`, `play{ }`.
- Operadores binarios evaluados **de izquierda a derecha** (como en SuperCollider), operadores con palabra `7 div: 2`, `!` (dup), `->`, `?`, `??`, `++`, `<>`.
- Asignaciones: variables `var`, variables de intérprete `a`–`z` (`s` es el servidor), variables de entorno `~x`, asignación múltiple `#a, b = [1, 2]`, setters `obj.prop = x`.
- Aplicación parcial: `[1, 2, 3].collect(_ * 2)`.
- Comentarios `//` y `/* */` (anidados).

## Clases del lenguaje

Object, Nil, Boolean, Integer/Float (aritmética, `rand`, `rrand`, `exprand`, `midicps`, `dbamp`, `linlin`, `linexp`, `round`, `do`, `for`, `wait`…), String, Symbol, Char, Array (≈100 métodos: `collect`, `select`, `inject`, `scramble`, `choose`, `wchoose`, `sort`, `rotate`, `mirror`, `stutter`, `lace`, `flop`, `clump`, `normalizeSum`, `plot`…), Function (`value`, `play`, `plot`, `scope`, `fork`, `loop`, `while`, `case`, `dup`), Event/Dictionary/Environment, Association, Ref, Rest, Date.

## Servidor y síntesis

- `s.boot`, `s.freeAll`, `s.record` / `s.stopRecording` (descarga WAV), `s.volume = -12`, `s.plotTree`, `s.meter`, `s.scope`, `s.queryAllNodes`.
- `SynthDef(\name, { |out = 0, freq = 440, gate = 1| ... }).add`, controles `t_` (trigger), `i_`, controles con nombre `\freq.kr(440, 0.1)`, lags.
- `Synth(\name, [\freq, 220])`, `.set`, `.free`, `.release`, `Synth.tail`, `Synth.head`, `Synth.after`, `Synth.before`.
- `{ ... }.play` (con fade de entrada y `release`), `{ ... }.plot(dur)` (render offline).
- `Bus.audio`, `Bus.control`, `Out`, `In`, `ReplaceOut`, `OffsetOut`, `LocalIn`/`LocalOut`, `SoundIn` (micrófono).
- Expansión multicanal, `Mix`, `Mix.fill`, `Splay`, `Pan2`, `Balance2`.
- `Env` (`perc`, `adsr`, `asr`, `dadsr`, `linen`, `sine`, `triangle`, `cutoff`, `pairs`, curvas numéricas y con nombre, nodos de release y loop), `EnvGen`, `Env.kr`, `Env.plot`, `Env.test`, `doneAction`.

### UGens disponibles

Osciladores: SinOsc, FSinOsc, SinOscFB, Saw, Pulse, LFSaw, LFPulse, LFTri, LFPar, LFCub, VarSaw, SyncSaw, Blip, Formant, Impulse, PMOsc, Klang.
Ruido y caos: WhiteNoise, PinkNoise, BrownNoise, GrayNoise, ClipNoise, Dust, Dust2, LFNoise0/1/2, LFDNoise0/1/3, LFClipNoise, Crackle, Logistic, HenonN/L/C, Gendy1.
Filtros: RLPF, RHPF, LPF, HPF, BPF, BRF, Resonz, Ringz, Formlet, MoogFF, MidEQ, BLowShelf, BHiShelf, OnePole, OneZero, Integrator, LeakDC, Lag, Lag2, Lag3, LagUD, Slew, Decay, Decay2, Klank, DynKlank.
Delays y reverbs: DelayN/L/C, CombN/L/C, AllpassN/L/C, FreeVerb, FreeVerb2, GVerb, PitchShift, Pluck.
Envolventes: EnvGen, Line, XLine, Linen, DetectSilence.
Disparadores y azar: Latch, Gate, TRand, TIRand, TExpRand, Rand, IRand, ExpRand, NRand, CoinGate, Select, Stepper, PulseCount, PulseDivider, ToggleFF, Trig, Trig1, TDelay, Sweep, Phasor.
Demand: Demand, Duty, TDuty, Dseq, Dser, Drand, Dxrand, Dshuf, Dwhite, Diwhite, Dbrown, Dseries, Dgeom.
Análisis y dinámica: Amplitude, Pitch, ZeroCrossing, Peak, RunningMax, Limiter, Compander, Poll (`.poll`).
Granular: GrainSin, GrainFM.
Entradas: MouseX, MouseY, MouseButton, SoundIn. Utilidades: SampleRate, SampleDur, ControlRate, ControlDur, RadiansPerSample, K2A, A2K, DC, Silent, Clip, Fold, Wrap, Schmidt, InRange, XFade2, LinXFade2.
Operadores en el servidor: `+ - * / ** %`, comparaciones, `min`, `max`, `round`, `clip2`, `wrap2`, `fold2`, `ring1`…, y unarios (`abs`, `sqrt`, `tanh`, `distort`, `softclip`, `midicps`, `dbamp`, `squared`…), además de `range`, `exprange`, `unipolar`, `bipolar`, `linlin`, `linexp`, `clip`, `fold`, `wrap`, `lag`, `madd`.

## Tiempo y patterns

- `Routine`, `Task`, `fork`, `wait`, `yield`, `next`, `nextN`, `TempoClock` (`tempo`, `beats`, `sched`), `SystemClock`, `AppClock`.
- Eventos `(degree: 2).play` con `degree`, `scale`, `octave`, `root`, `note`, `midinote`, `freq`, `ctranspose`, `mtranspose`, `stepsPerOctave`, `dur`, `legato`, `sustain`, `amp`, `db`, `pan`, `instrument`, `strum`, `type: \rest`/`\set`, acordes con arrays, y el SynthDef `\default`.
- Patterns: Pbind, Pmono, Pseq, Pser, Prand, Pxrand, Pwrand, Pshuf, Pwhite, Pexprand, Pgauss, Pbrown, Pseries, Pgeom, Pn, Pdup/Pstutter, Pfunc, Prout, Pkey, Pfin, Plazy, Ptrace, Pcollect, Pselect, Pindex, Pif, Ppar, Ptpar, Pchain (`<>`), Pdef, Pdefn; matemática sobre patterns; `asStream`, `play`, `trace`.
- `Scale` (≈40 escalas, incluidas japonesas, chinas e indias), `Tuning` (et12, just, pythagorean, mean4, et19, et22, et24, et31, et41, et53…), `degreeToKey`.

## Live coding

`Ndef` (fuente función o pattern, `play`, `stop`, `fadeTime`, `set`, `clear`, `Ndef.ar` para encadenar) y `ProxySpace.push` (`~a = { ... }`).

## MIDI

`MIDIClient.init`, `MIDIIn.connectAll`, `MIDIdef.noteOn/noteOff/cc/bend`, `MIDIFunc` — con Web MIDI y con el teclado en pantalla de la lección 20.

## Lo que no está (por diseño)

- **GUI** (`Window`, `Slider`…): en su lugar están los Laboratorios.
- **Buffers y archivos de audio** (`Buffer`, `PlayBuf`, `GrainBuf`, FFT/PV): todo se sintetiza en vivo, sin cargar nada.
- **OSC** (`NetAddr`, `OSCdef`), **NRT**, **Quarks**, **plugins**, clases propias (`Object subclass`).

Cuando usás algo de esto, la post window lo explica con un mensaje en tu idioma.
