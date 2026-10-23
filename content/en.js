/* SuperCollider Lab · U-MA — English */
(function () {
const R = String.raw;
(window.SC_LANG = window.SC_LANG || {}).en = {
ui: {
  nav_res: 'Resources', res_title: 'Resources', res_intro: 'To keep learning with desktop SuperCollider: the official site, the documentation, the forum and the source code. All free.', res_site: 'Official site and downloads', res_site_d: 'SuperCollider for Windows, macOS and Linux, free and open source.', res_docs: 'Official documentation', res_docs_d: 'Help for every class and UGen, the same that ships with the IDE.', res_tut: 'Official tutorial', res_tut_d: '«Getting Started With SuperCollider», the introductory tour in the documentation.', res_forum: 'Community forum', res_forum_d: 'scsynth.org: questions, projects and news.', res_sccode: 'sccode.org', res_sccode_d: 'Code shared by the community to study and play.', res_src: 'Source code', res_src_d: 'The SuperCollider repository on GitHub.',
  nav_home: 'Home', nav_course: 'Course', nav_labs: 'Lab', nav_free: 'Free code', nav_ref: 'Reference', nav_tips: 'Tips', 
  tagline: 'Learn SuperCollider in your browser · U-MA',
  hero_1: 'SuperCollider', hero_2: 'in your browser',
  hero_lead: 'A complete course in sound synthesis and music programming with a real-time audio engine. You write SuperCollider code, run it and watch it sound: oscilloscope, spectrum, UGen graph and timeline. Nothing to install.',
  start: 'Start', continue: 'Continue', level: 'Level', lessons: 'lessons', streak: 'Streak', days: 'days', modules: 'modules', module: 'Module',
  try_now: 'Try it now', try_title: 'Your first sound', try_note: 'Click ▶ or put the cursor in the code and press Ctrl + Enter (Cmd + Enter on a Mac). To stop: Ctrl + . or the STOP button.',
  course_map: 'Course map', tip_day: 'Tip of the day', all_tips: 'All tips', 
  
  
  badges: 'Badges', badge_new: 'New badge', badge_sound: 'First sound', badge_labs: 'All labs', badge_chall: '10 challenges', badge_quiz: 'All quizzes',
  levelup: 'Level {n}: {title}', lesson_done: 'Lesson completed', completed: 'Completed', mark_done: 'Mark as completed',
  course_intro: 'Seven modules that take you from your first line of code to machine listening. Every lesson has examples you can edit and run, a quiz and a self-checking challenge. Start with module 1 and go in order, or jump straight to the topic you need.',
  example: 'Example', run: 'Run', reset: 'Reset', copy: 'Copy', copied: 'Copied', open_free: 'Open in Free code',
  pro_tip: 'Pro tip', 
  quiz: 'Quick question', challenge: 'Challenge', passed: 'passed', your_code: 'Your code', criteria: 'Criteria', hint: 'Hint', challenge_ok: 'Challenge passed!',
  at_line: 'at line', col: 'column', stopped: 'everything stopped', rec_saved: 'Recording saved ({s} s, WAV)',
  mon_graph: 'UGen graph', mon_tree: 'Node tree', mon_timeline: 'Events', mon_post: 'Post window', clear: 'Clear',
  mon_idle: 'server off · run some code to boot it', tree_empty: 'no synths playing', tl_empty: 'patterns and routines show up here', nan_warn: 'Warning: a synth produced invalid values (NaN/inf) and was muted. Check filters with extreme resonance or divisions by zero.',
  labs_title: 'Lab', labs_intro: 'Control surfaces that write SuperCollider code in real time. Move a control and watch the code change; edit the code and hear the result. Every lab uses Ndef or Pdef, just like a live coding session.',
  lab_live: 'LIVE', lab_code: 'Generated code', lab_codenote: 'The code updates with every control. You can edit and run it (▶ or Ctrl + Enter) or take it to Free code.', play: 'Play', stop: 'Stop', open: 'Open',
  c_wave: 'Waveform', c_freq: 'Frequency', c_amp: 'Amplitude', c_width: 'Pulse width', c_harm: 'Harmonics', c_pan: 'Pan', c_osc: 'Oscillator', c_filter: 'Filter', c_cutoff: 'Cutoff', c_rq: 'rq (1/Q)', c_lfo: 'LFO', c_depth: 'LFO depth', c_atk: 'Attack', c_dec: 'Decay', c_sus: 'Sustain', c_rel: 'Release', c_detune: 'Detune', c_keys: 'Keyboard (also keys A W S E D F T G Y H U J K)', c_arp: 'Arpeggio',
  c_ratio: 'Ratio', c_index: 'Index', c_envidx: 'Envelope on the index', c_ratios: 'Typical ratios', c_harmonics: 'Harmonics (drag the bars)', c_stretch: 'Stretch', c_envdraw: 'Envelope (drag the points, double-click adds)', c_curve: 'Curve', c_delpt: 'Delete point', c_trigger: 'Trigger', c_loop: 'Repeat',
  c_steps: 'Steps × scale degrees', c_scale: 'Scale', c_instrument: 'Instrument', c_tempo: 'Tempo', c_octave: 'Octave', c_legato: 'Legato', c_clear: 'Clear', c_random: 'Random',
  c_density: 'Density', c_size: 'Grain size', c_spread: 'Spread', c_circle: 'Pitch circle (yellow: just intervals)', c_edo: 'Octave divisions (EDO)', c_base: 'Base frequency', c_et_chord: '12-TET chord', c_just_chord: 'Just chord 4:5:6', c_edo_chord: 'Chord in this EDO',
  c_source: 'Source', c_chain: 'Effects chain', c_drive: 'Drive', c_dtime: 'Echo time', c_decay: 'Echo decay', c_mix: 'Reverb mix', c_room: 'Room', c_algo: 'Algorithm', c_chaos: 'Chaos', c_volume: 'Volume', c_tempo2: 'Tempo',
  free_title: 'Free code', free_intro: 'Your SuperCollider notebook. It is saved in this browser only. **Shift + Enter** runs the line, **Ctrl + Enter** runs the block between parentheses, **Ctrl + .** stops everything. Try the examples or paste code from a lesson.',
  snippets: 'files', examples: 'Examples', new: 'New', delete: 'Delete', run_region: 'Run block', run_all: 'Run all', untitled: 'Untitled', scratch: 'Scratch', from_lesson: 'From lesson', sure: 'Are you sure?',
  keys_help: '**Shift + Enter**: run line or selection · **Ctrl/Cmd + Enter**: run block ( … ) · **Ctrl/Cmd + .**: stop everything · **Ctrl/Cmd + D**: help for the word under the cursor · **Tab**: indent',
  ref_title: 'Reference', ref_intro: 'The classes and UGens this web SuperCollider understands, with their signature, a short description and an example to try. Keyword arguments (for example «freq: 440») work just like in desktop SuperCollider.', classes: 'classes', search: 'Search', try: 'Try', no_results: 'No results.',
  cat_osc: 'Oscillators', cat_noise: 'Noise and chaos', cat_filter: 'Filters and resonators', cat_delay: 'Delays, reverbs and feedback', cat_env: 'Envelopes', cat_trig: 'Triggers and randomness on the server', cat_demand: 'Demand', cat_io: 'Inputs, outputs and panning', cat_analysis: 'Analysis and dynamics', cat_grain: 'Granular', cat_lang: 'Language, patterns and JITLib',
  tips_title: 'Tips', tips_intro: 'What people who use SuperCollider every day have learned through practice: hearing safety, debugging, performance, style, mixing and live coding.',
  tcat_safe: 'Safety', tcat_debug: 'Debugging', tcat_perf: 'Performance', tcat_style: 'Style', tcat_mix: 'Mixing', tcat_live: 'Live coding', tcat_time: 'Time', tcat_synth: 'Synthesis',
  
  settings: 'Settings', language: 'Language', theme: 'Theme', th_system: 'System', th_light: 'Light', th_dark: 'Dark', audio: 'Audio', volume: 'Master volume', limiter: 'Hearing protection: clip the output at 0 dBFS',
  safety_note: 'Start with a low volume and raise it slowly. Even more so with headphones.', progress: 'Progress', export: 'Export', import: 'Import', reset_progress: 'Reset progress', progress_note: 'Progress, XP and your files are stored in this browser. Export them to move them to another device.', imported: 'Progress imported', bad_file: 'That file is not a SuperCollider Lab progress file.', shortcuts: 'Shortcuts', close: 'Close',
  post_hello: 'Write code and run it with Ctrl + Enter. The first sound boots the server.',
  footer_1: '**SuperCollider Lab** is an educational tool by **Buenos Aires Front · U-MA**. It runs in your browser: an interpreter for a subset of sclang written in JavaScript and an scsynth-style synthesis engine on top of Web Audio. SuperCollider is free software (GPL) created by James McCartney and maintained by its community: [supercollider.github.io](https://supercollider.github.io).',
  footer_disc: 'Independent educational project, not affiliated with the SuperCollider project. The explanations, examples and audio engine are original.',
  err_gui: 'SuperCollider GUI classes (Window, Slider…) are not available in the web version. Try the Labs: they are control surfaces that write code.',
  err_buf: 'Buffers and audio file loading are not available in this web version: everything is synthesized live, nothing to load.',
  err_osc: 'OSC (NetAddr, OSCdef) is not available in the browser. Use MIDIdef with a MIDI keyboard or the on-screen keyboard.',
  midi_none: 'This browser has no Web MIDI (try Chrome or Edge). The on-screen keyboard still triggers your MIDIdefs.', midi_denied: 'MIDI permission denied.',
},
levels: ['Listener', 'UGen apprentice', 'Patcher', 'Synthesist', 'Sound programmer', 'SynthDef designer', 'Algorithmic composer', 'Live coder', 'Server architect', 'SuperCollider master', 'scsynth legend'],
mod: {
  m1: { t: 'First steps', d: 'The interpreter, the post window, messages, variables, functions and arrays. How the language thinks.' },
  m2: { t: 'Sound: UGens', d: 'Oscillators, noise, control, filters, envelopes and multichannel expansion.' },
  m3: { t: 'Synthesis techniques', d: 'Additive, FM, physical modelling, effects, microsound and non-standard synthesis.' },
  m4: { t: 'The server', d: 'SynthDef and Synth, buses and effects, Demand UGens, MIDI, mouse and microphone.' },
  m5: { t: 'Time and patterns', d: 'Routines and clocks, Pbind, Pdef, Ppar, scales and stochastic algorithms.' },
  m6: { t: 'Live coding', d: 'JITLib with Ndef and ProxySpace, and the SCTweets tradition.' },
  m7: { t: 'Applications', d: 'Alternative tunings, sonification, spatialization and machine listening.' },
},
les: {
l01: { t: 'Hello, SuperCollider', s: 'Client and server, the post window and your first sound.',
  cells: { c1: 'post window', c2: 'boot the server', c3: 'a sine wave', c4: 'stop everything' },
  body: R`SuperCollider is actually **two programs talking to each other**: the language (**sclang**), which interprets what you write, and the synthesis server (**scsynth**), which makes the sound. The language sends messages to the server and the server answers with audio. This app works the same way: a sclang interpreter written in JavaScript talks to a synthesis engine running in your browser.

Let's start with the simplest thing. Run this line with **Shift + Enter** (or the ▶ button). The result appears in the **post window**, bottom right.

[[c1]]

The arrow «->» shows the value the expression returned. «postln» also prints it. In desktop SuperCollider you have to boot the server before making sound:

[[c2]]

Here the server boots by itself the first time something sounds, but «s.boot» is worth knowing: «s» is a variable that always points to the local server. Now, sound:

[[c3]]

Whatever sits between braces «{ }» is a **function**. When you send it the message «play», SuperCollider turns it into a synthesizer and starts it on the server. Look at the oscilloscope, the UGen graph and the node tree: there is your synth.

!! Safety first: start with your system volume low and raise it slowly. In SuperCollider it is easy to type one digit too many and make a very loud sound. This app clips the output at 0 dBFS (you can change that in ⚙).

To stop the sound, the universal shortcut is **Ctrl + .** (Cmd + . on a Mac). You can also use the STOP button or free every node on the server:

[[c4]]`,
  quiz: { q: 'Which of the two programs makes the sound?', o: ['sclang, the interpreter', 'scsynth, the synthesis server', 'The post window', 'The code editor'], e: 'The language (sclang) describes and sends; the server (scsynth) computes the audio samples. That is why the server can live on another machine, or here, inside the browser.' },
  ch: { task: 'Play a sine wave at **220 Hz** with amplitude **0.1**. Run your code and, when you are done, stop it with Ctrl + .', checks: ['Uses «SinOsc»', 'The frequency is 220', 'It sounds'], hint: 'Copy example 3 and change 440 to 220.' } },
l02: { t: 'Messages, arguments and nesting', s: 'receiver.message(arguments) and chaining ideas.',
  cells: { c1: 'random numbers', c2: '10 times with !', c3: 'messages with arguments', c4: 'nesting', c5: 'seeds' },
  body: R`In SuperCollider everything is an **object**, and things happen by sending **messages**. The general form is «receiver.message(arguments)». You can often also write it as «message(receiver, arguments)»: «rrand(1, 100)» is the same as «1.rrand(100)».

[[c1]]

«rand» gives a number between 0 and the receiver; «rrand» between two values; «exprand» picks with an exponential distribution, ideal for frequencies because it spreads evenly across octaves. The «!» sign repeats: with a function, it evaluates it several times.

[[c2]]

Each message has its own arguments. Try changing them to guess what each one does:

[[c3]]

A message can be the argument of another one. This is called **nesting** and reads from the inside out: first 20 numbers are generated, then rounded and finally sorted.

[[c4]]

## Reproducible randomness

Computers don't produce true randomness. If you set a **seed**, you always get the same sequence: handy to repeat a version of a generative piece.

[[c5]]`,
  quiz: { q: 'In «round(exprand(1, 10), 0.1)», who receives the message «round»?', o: ['The number 0.1', 'The number 1', 'The result of «exprand(1, 10)»', 'The number 10'], e: 'The first argument of the functional form is the receiver: it is equivalent to «exprand(1, 10).round(0.1)».' },
  ch: { task: 'Generate an array of **8 random MIDI notes between 48 and 72**, sorted from low to high. The last expression of your code must be the array.', checks: ['It has 8 elements', 'All between 48 and 72', 'It is sorted'], hint: 'Try «{ rrand(48, 72) } ! 8» and send it «sort».' } },
l03: { t: 'Variables, functions and precedence', s: 'Store values, define behaviour and read left to right.',
  cells: { c1: 'precedence', c2: 'functions with arguments', c3: 'environment variables', c4: 'interpreter variables' },
  body: R`Before going on, an important quirk: SuperCollider has **no** operator precedence like school maths. Binary operators are evaluated **from left to right**. Use parentheses when you want a different order.

[[c1]]

A **function** is code between braces that runs when you send it «value» (or the short form «.()»). Arguments are declared between bars «| |» and can have default values. Local variables are declared with «var» at the start of the block.

[[c2]]

There are three kinds of variables you will use all the time:

- **Local** with «var»: they live inside the block or function.
- **Interpreter** variables: the letters «a» to «z», always available («s» is already the server).
- **Environment** variables with «~», for example «~base». They are created when assigned and work anywhere.

[[c3]]

[[c4]]

!! If you see «Variable 'x' not defined», you need to declare it with «var» or use «~x». It is the most common beginner error.`,
  quiz: { q: 'What does «5 + 2 * 3» give in SuperCollider?', o: ['11', '13', '30', '21'], e: 'It is evaluated left to right: (5 + 2) = 7, and 7 * 3 = 21. To get 11 write «5 + (2 * 3)».' },
  ch: { task: 'Write «~mtof», a function that takes a MIDI note and returns its frequency in Hz. «~mtof.(69)» must give 440.', checks: ['«~mtof.(69)» gives 440', '«~mtof.(81)» gives 880'], hint: 'Numbers understand «midicps». Inside the function: «note.midicps».' } },
l04: { t: 'Arrays and collections', s: 'Lists of values, transformations and a twelve-tone matrix.',
  cells: { c1: 'a scale', c2: 'collect', c3: 'do', c4: 'twelve-tone row', c5: 'other messages' },
  body: R`An **array** is a list between square brackets. The interesting part is that maths applies to each element: adding 60 to a scale moves it to the middle octave, and «midicps» converts all the notes to frequencies at once.

[[c1]]

«collect» transforms each element and returns a new array; «do» walks through the elements to do something with each one (for example print it). Both pass the element and its index to the function. «(1..8)» is a short way of writing a series.

[[c2]]

[[c3]]

With very little code you can build entire musical structures. Here is a random twelve-tone row and its twelve transpositions, as in Schoenberg's technique:

[[c4]]

[[c5]]

!! Arrays are the door to **multichannel expansion**, one of SuperCollider's superpowers. We'll see it in lesson 10.`,
  quiz: { q: 'What does «[1, 2, 3] + [10, 20]» return?', o: ['[11, 22, 13]', '[11, 22]', '[11, 22, 3]', 'An error'], e: 'Operations between arrays of different sizes wrap the shorter one: 1+10, 2+20, 3+10.' },
  ch: { task: 'Return an array with the **first 5 harmonics of 110 Hz**: [110, 220, 330, 440, 550].', checks: ['It has 5 elements', 'They are 110, 220, 330, 440, 550'], hint: '«(1..5) * 110» or «(1..5).collect { |n| n * 110 }».' } },
l05: { t: 'Your first sound: UGens and .play', s: 'Unit generators, arguments, mul and add.',
  cells: { c1: 'SinOsc', c2: 'keep the synth', c3: 'free it', c4: 'keyword arguments', c5: 'plot', c6: 'mul and add' },
  body: R`**UGens** (unit generators) are the building blocks of sound: oscillators, filters, envelopes, noises. Each one has a rate message: «ar» (audio rate, one value per audio sample) or «kr» (control rate, cheaper, for slow signals).

«SinOsc.ar(freq, phase, mul, add)» generates a sine wave. **mul** multiplies the output (it is the volume) and **add** adds a value to it (it offsets the signal).

[[c1]]

If you store the result of «play» in a variable, you can control it later:

[[c2]]

[[c3]]

You don't need to remember the order of the arguments: you can name them.

[[c4]]

«plot» draws the signal without playing it. Look at the panel on the right:

[[c5]]

[[c6]]

!! An audio signal goes from -1 to 1. If you add several or use a mul greater than 1, it will clip. Keep amplitudes low (0.1 to 0.3) and add things up carefully.`,
  quiz: { q: 'What does a UGen\'s «mul» argument do?', o: ['Changes the frequency', 'Multiplies the output (scales the amplitude)', 'Adds a constant value', 'Repeats the sound'], e: 'mul scales the signal; add offsets it. Together they let you use an oscillator to control any range of values.' },
  ch: { task: 'Play a **330 Hz** sine wave with amplitude **0.15**.', checks: ['Uses «SinOsc»', 'The frequency is 330', 'It sounds'], hint: '«{ SinOsc.ar(330, 0, 0.15) }.play» or with keyword arguments.' } },
l06: { t: 'Oscillators and noise', s: 'Waveforms, harmonics and colours of noise.',
  cells: { c1: 'sawtooth', c2: 'pulse', c3: 'four waveforms', c4: 'Blip', c5: 'white and pink noise' },
  body: R`Each waveform has its own timbre because it contains different **harmonics**. The sine is pure; the sawtooth has every harmonic; the pulse (square) only the odd ones, and its width changes the colour.

[[c1]]

[[c2]]

Seeing the waveforms helps to understand them. This «plot» shows four channels at once:

[[c3]]

«Blip» is a pulse train with a controlled number of harmonics. Move the mouse from left to right and look at the spectrum (FFT):

[[c4]]

Noise contains every frequency. **White** noise has the same energy at every frequency; **pink** noise the same energy in every octave, and sounds warmer.

[[c5]]

!! Oscillators with an «LF» prefix (LFSaw, LFPulse, LFTri) are not band-limited: perfect for controlling other parameters, but at high frequencies they alias. For audio use Saw, Pulse and Blip.`,
  quiz: { q: 'Which oscillator contains only odd harmonics?', o: ['Saw', 'SinOsc', 'Pulse with width 0.5', 'WhiteNoise'], e: 'The square wave (Pulse with width 0.5) has only odd harmonics, with amplitude 1/n.' },
  ch: { task: 'Play a «Blip» with **12 harmonics** at amplitude 0.2.', checks: ['Uses «Blip»', 'It has 12 harmonics', 'It sounds'], hint: '«Blip.ar(freq, numharm, mul)».' } },
l07: { t: 'Control: LFOs, offset and scale', s: 'Signals that move other signals.',
  cells: { c1: 'vibrato', c2: 'random notes', c3: 'mouse', c4: 'poll', c5: 'scaling ranges' },
  body: R`A slow oscillator (**LFO**) can control the frequency, the amplitude or any argument of another UGen. To do that you bring its output (-1 to 1) into the range you need: that is what **mul** (scale) and **add** (offset) do. «SinOsc.kr(5, 0, 10, 440)» swings between 430 and 450: a vibrato.

[[c1]]

Writing mul and add by hand is awkward; «range(min, max)» does the maths for you:

[[c2]]

«MouseX» and «MouseY» turn the mouse position into a signal. On a phone, touch and drag on the oscilloscope.

[[c3]]

«poll» prints the value of a signal in the post window. It is the basic tool for debugging what happens inside the server.

[[c4]]

[[c5]]

!! Use «kr» for control signals: it computes once per block and saves CPU. Use «exprange» for frequencies and «range» for almost everything else.`,
  quiz: { q: 'Between which values does «SinOsc.kr(1, 0, 300, 500)» oscillate?', o: ['Between 200 and 800', 'Between 300 and 500', 'Between -300 and 300', 'Between 0 and 800'], e: 'The output (-1..1) is multiplied by 300 (-300..300) and 500 is added: from 200 to 800.' },
  ch: { task: 'Make a **siren**: an «LFTri» moving the frequency of a «SinOsc» between 300 and 900 Hz.', checks: ['Uses «LFTri»', 'Uses «SinOsc»', 'It sounds'], hint: '«SinOsc.ar(LFTri.kr(0.5).range(300, 900), 0, 0.2)».' } },
l08: { t: 'Subtractive synthesis', s: 'VCO → VCF → VCA: the analogue synthesizer in code.',
  cells: { c1: 'resonant filter', c2: 'modulated cutoff', c3: 'wind', c4: 'Moog-style filter' },
  body: R`Subtractive synthesis starts from a sound rich in harmonics and **removes** frequencies with a filter. It is the classic architecture of analogue synthesizers: an oscillator (VCO), a filter (VCF) and an amplifier (VCA).

«RLPF» is a resonant low-pass filter: it lets through the frequencies below the **cutoff** and boosts the cutoff region according to **rq** (the reciprocal of Q: the smaller, the more resonance).

[[c1]]

Modulating the cutoff with an LFO gives movement. Notice how «[100, 101]» makes two slightly detuned voices, one per channel:

[[c2]]

With noise and a narrow band-pass you can model natural sounds:

[[c3]]

«MoogFF» imitates Moog's ladder filter; its third argument is the feedback (resonance), from 0 to 4:

[[c4]]

!! With a very small rq and a lot of energy at the cutoff, a resonant filter can get very loud. Lower mul before experimenting.`,
  quiz: { q: 'In «RLPF», what happens when you lower rq?', o: ['The filter lets more highs through', 'Resonance at the cutoff frequency increases', 'The cutoff frequency drops', 'The sound becomes stereo'], e: 'rq is the relative bandwidth (1/Q). The smaller it is, the narrower and more resonant the peak at the cutoff.' },
  ch: { task: 'Run a «Pulse» through an «RLPF» and move the cutoff frequency with an LFO.', checks: ['Uses «Pulse»', 'Uses «RLPF»', 'Uses an LFO (SinOsc, LFNoise, LFTri…)', 'It sounds'], hint: '«RLPF.ar(Pulse.ar(80, 0.3, 0.2), SinOsc.kr(0.3).range(200, 3000), 0.2)».' } },
l09: { t: 'Envelopes', s: 'Env, EnvGen, doneAction and gate.',
  cells: { c1: 'classic envelopes', c2: 'your own envelope', c3: 'percussive', c4: 'sustained with gate', c5: 'release', c6: 'Line and XLine' },
  body: R`An **envelope** shapes a parameter over time: the volume of a note, the brightness of a filter, the pitch of a hit. «Env» describes the shape (levels, times, curves) and «EnvGen» plays it on the server.

[[c1]]

You can define any shape: an array of levels, one of times (one fewer than the levels) and the curves (negative numbers: fast at first; positive: slow at first).

[[c2]]

**doneAction: 2** tells the server to free the synth when the envelope ends. Without it, the synth would keep using CPU in silence.

[[c3]]

Envelopes with a **sustain** (adsr, asr) stay at the sustain level while the **gate** argument is greater than 0. Setting it to 0 starts the release:

[[c4]]

[[c5]]

«Line» and «XLine» are simple ramps (linear and exponential) that also accept doneAction:

[[c6]]

!! Exponential curves and negative curve values sound more natural for volume, because our ears perceive loudness logarithmically.`,
  quiz: { q: 'What does «doneAction: 2» do?', o: ['Repeats the envelope twice', 'Doubles the amplitude', 'Frees the synth when the envelope ends', 'Waits two seconds before starting'], e: 'It is the standard way for notes to remove themselves from the server when they finish.' },
  ch: { task: 'Make a **percussive** note that frees itself: «Env.perc» + «doneAction: 2».', checks: ['Uses «EnvGen»', 'Uses doneAction: 2', 'It sounds'], hint: 'Look at example 3 and change the oscillator or the times.' } },
l10: { t: 'Multichannel expansion and stereo', s: 'An array as an argument duplicates the whole patch.',
  cells: { c1: 'mono and stereo', c2: 'expansion', c3: 'Pan2', c4: 'Splay', c5: 'Mix' },
  body: R`If you use an **array** as the argument of a UGen, SuperCollider duplicates the patch: one copy per element, each going to an output channel. This is **multichannel expansion**.

Watch out for a SuperCollider habit: a mono sound comes out of **the left channel only** (bus 0). Look at the oscilloscope: cyan is left, magenta is right.

[[c1]]

[[c2]]

«Pan2» places a mono signal in the stereo field (-1 left, 1 right). «Splay» spreads many voices between left and right. «Mix» sums an array of channels into one. Try the scope's **X/Y** mode to see the stereo image.

[[c3]]

[[c4]]

[[c5]]

!! «sig ! 2» is the shortest way to turn a mono signal into stereo (the same signal on both channels).`,
  quiz: { q: 'How many channels does «{ SinOsc.ar([300, 400], 0, 0.1) }.play» produce?', o: ['1', '2', '4', 'It depends on the server'], e: 'The two-frequency array creates two SinOscs: channel 0 at 300 Hz and channel 1 at 400 Hz.' },
  ch: { task: 'Three slightly detuned «Saw» oscillators spread in stereo with «Splay».', checks: ['Uses «Saw»', 'Uses «Splay» (Pan2)', 'It is stereo', 'It sounds'], hint: '«Splay.ar(Saw.ar([110, 110.4, 109.7], 0.1))».' } },
l11: { t: 'Additive synthesis', s: 'Building timbres by adding sine waves.',
  cells: { c1: 'harmonic series', c2: 'odd only', c3: 'inharmonic partials', c4: 'Klang' },
  body: R`According to Fourier, any periodic sound is a sum of sine waves. **Additive** synthesis does exactly that: you add partials, each with its own frequency and amplitude. «Mix.fill(n, function)» creates n voices and sums them.

[[c1]]

If you use only the odd harmonics you get something like a square wave (compare with lesson 6 in the spectrum):

[[c2]]

When partials are not integer multiples of a fundamental, the result sounds like a bell or metal. «ExpRand» and «Rand» pick a random value **once per synth**, inside the server:

[[c3]]

«Klang» is an efficient bank of sine oscillators. Notice the backquote before the array: it freezes the array so it doesn't expand into several channels.

[[c4]]

!! Look at the monitor's SONO mode (sonogram): additive synthesis shows up as horizontal lines, one per partial.`,
  quiz: { q: 'What amplitude does harmonic n usually have in a sawtooth?', o: ['n', '1', 'n²', '1/n'], e: 'The sawtooth has every harmonic with amplitude 1/n; the square only the odd ones with 1/n.' },
  ch: { task: 'Build an **almost square** wave by adding odd harmonics with «Mix.fill».', checks: ['Uses «SinOsc»', 'Uses «Mix.fill» or «Klang»', 'It sounds'], hint: 'For i = 0, 1, 2…: n = i * 2 + 1, frequency f * n and amplitude 1/n.' } },
l12: { t: 'FM and phase modulation', s: 'Carrier, modulator, index and sidebands.',
  cells: { c1: 'index on the mouse', c2: 'FM by hand', c3: 'FM bell', c4: 'sample & hold' },
  body: R`In **FM synthesis** a modulator changes the frequency (or phase) of a carrier very quickly. **Sidebands** appear: new frequencies on both sides of the carrier, spaced by the modulator frequency. Few oscillators, very complex timbres.

«PMOsc.ar(carrier, modulator, index)» does phase modulation. Open the monitor's FFT mode and move the mouse: the **index** controls how many sidebands appear.

[[c1]]

The same thing by hand: the modulator is added to the carrier frequency.

[[c2]]

If the ratio between modulator and carrier is not an integer, the spectrum is inharmonic: bells. And if the index decays with the envelope, the timbre fades like a real instrument:

[[c3]]

«Latch» takes a sample of a signal every time a trigger arrives and holds it (sample & hold). Here it changes the FM ratio on every note:

[[c4]]`,
  quiz: { q: 'With an integer modulator/carrier ratio (1, 2, 3…), the spectrum is…', o: ['Harmonic', 'Inharmonic', 'White noise', 'Silence'], e: 'Sidebands fall on multiples of the fundamental when the ratio is an integer: the result is harmonic.' },
  ch: { task: 'Make an **FM bell**: «PMOsc» with an envelope controlling the index.', checks: ['Uses SinOsc (PMOsc)', 'Uses «PMOsc»', 'Uses «EnvGen»', 'It sounds'], hint: 'Look at example 3: PMOsc\'s third argument multiplied by EnvGen.' } },
l13: { t: 'Physical modelling and resonators', s: 'Plucked strings, bells and rain.',
  cells: { c1: 'Karplus-Strong', c2: 'string arpeggio', c3: 'bell with Klank', c4: 'rain on metal' },
  body: R`**Physical modelling** simulates the behaviour of a vibrating object. The **Karplus-Strong** algorithm excites a delay line with a burst of noise and feeds it back through a filter: it sounds like a plucked string. In SuperCollider it is «Pluck».

[[c1]]

[[c2]]

**Resonators** are filters that ring by themselves when they receive an impulse. «Klank» is a bank of resonators: you give it frequencies, amplitudes and decay times, and excite it with impulses.

[[c3]]

«Ringz» is a single resonator. Excited by «Dust» (random impulses) it sounds like drops on something metallic:

[[c4]]

!! Long-decay resonators build up energy: if you excite them with continuous signals, turn the input way down.`,
  quiz: { q: 'What does the Karplus-Strong algorithm simulate?', o: ['A human voice', 'A Moog filter', 'A plucked string', 'A pipe organ'], e: 'A delay line fed back through a low-pass filter: the initial noise turns into a tone that decays like a string.' },
  ch: { task: 'A resonant body («Klank» or «Ringz») excited by «Dust».', checks: ['Uses Klank or Ringz', 'Uses «Dust»', 'It sounds'], hint: '«Klank.ar(`[[500, 1200, 2100], nil, [1, 1, 1]], Dust.ar(5, 0.1))».' } },
l14: { t: 'Effects: delay, reverb and distortion', s: 'Echoes, rooms, saturation and feedback.',
  cells: { c1: 'echo with CombN', c2: 'reverb', c3: 'distortion', c4: 'feedback' },
  body: R`Time-based effects are built with **delay lines**. «CombN» is a delay with feedback: every repeat is quieter, according to the decay time.

[[c1]]

«FreeVerb» simulates a room with a network of comb and allpass filters. Its arguments are mix, room size and damping:

[[c2]]

The simplest distortion: amplify and run the signal through a soft-clipping function such as «tanh».

[[c3]]

With «LocalIn» and «LocalOut» you can build your own feedback loops inside a synth. Here is a crossed stereo echo (ping-pong) with a filter in the loop:

[[c4]]

!! In a feedback loop the total gain must be less than 1. Always put a filter or a saturation («tanh») inside the loop so it doesn't blow up.`,
  quiz: { q: 'In «CombN.ar(in, 0.5, 0.25, 3)», what does 3 mean?', o: ['Exactly three repeats', 'The time (in seconds) for the echo to fall by 60 dB', 'The maximum delay', 'The number of channels'], e: 'The arguments are: input, maximum delay, delay and decay time (down to -60 dB).' },
  ch: { task: 'A dry sound + an echo with «CombN» + reverb with «FreeVerb».', checks: ['Uses «CombN»', 'Uses «FreeVerb»', 'It sounds'], hint: 'Add the signal and its echo, and run everything through FreeVerb.' } },
l15: { t: 'Microsound and granular synthesis', s: 'Sounds made of particles.',
  cells: { c1: 'regular grains', c2: 'granular cloud', c3: 'a grain as a SynthDef', c4: 'a rain of grains' },
  body: R`A **grain** is a very short sound (1 to 100 milliseconds) with a smooth envelope. Thousands of grains per second make textures, clouds and transformations that are impossible otherwise. When a grain is very short its pitch disappears and it becomes a coloured click.

[[c1]]

«GrainSin» generates sine grains every time it receives a trigger. With «Dust» (asynchronous) you get clouds; with «Impulse» (synchronous), tones with formants. Move the mouse: density on X, grain size on Y.

[[c2]]

You can also do it from the language, launching one synth per grain. First we define the grain:

[[c3]]

[[c4]]

!! Use «OffsetOut» in grain SynthDefs: it corrects the offset within the audio block and improves timing accuracy when there are many events per second.`,
  quiz: { q: 'What happens when grains are extremely short?', o: ['They sound lower', 'They get louder', 'They turn into white noise', 'You lose the pitch and hear them as coloured clicks'], e: 'Below a few milliseconds the period can no longer be perceived: only a click remains, whose colour depends on its content.' },
  ch: { task: 'A **granular cloud**: «GrainSin» triggered by «Dust».', checks: ['Uses «GrainSin»', 'Uses «Dust»', 'It sounds'], hint: 'Look at example 2 and change the ranges.' } },
l16: { t: 'Non-standard synthesis and chaos', s: 'Xenakis, chaotic maps and algorithms as sound sources.',
  cells: { c1: 'Gendy1', c2: 'Gendy1 on the mouse', c3: 'Crackle', c4: 'logistic map', c5: 'Hénon map' },
  body: R`**Non-standard** synthesis does not start from acoustics but from procedures: numbers, chance, chaos. **Gendy1** implements Iannis Xenakis's dynamic stochastic synthesis: the waveform is made of points that move along random walks.

[[c1]]

[[c2]]

**Chaotic systems** are deterministic but unpredictable. «Crackle» and «Logistic» explore equations that move from order to chaos depending on a parameter. Move the mouse slowly and listen to the transitions.

[[c3]]

[[c4]]

[[c5]]

!! These sources can have a DC component. If you filter or process them afterwards, add «LeakDC.ar» to centre them on zero.`,
  quiz: { q: 'Which composer devised dynamic stochastic synthesis (Gendy)?', o: ['John Cage', 'Iannis Xenakis', 'Karlheinz Stockhausen', 'Pauline Oliveros'], e: 'Xenakis developed it in the 1990s (GENDYN). Gendy1 is its SuperCollider implementation.' },
  ch: { task: 'Create your own texture with «Gendy1».', checks: ['Uses «Gendy1»', 'It sounds'], hint: 'Change minfreq and maxfreq, or move ampscale and durscale.' } },
l17: { t: 'SynthDef and Synth', s: 'Define once, play many times.',
  cells: { c1: 'define', c2: 'play', c3: 'a pad with gate', c4: 'create', c5: 'change', c6: 'release' },
  body: R`Every time you do «{ }.play», SuperCollider compiles a new instrument. For instruments you'll use many times it's better to define a **SynthDef**: a named recipe the server keeps. Then you create **Synths** (instances) from it, each with its own values.

The function's arguments become **controls** you can set when creating the synth and change while it plays. By convention you include «out» to choose the output bus, and you write the output explicitly with «Out.ar».

[[c1]]

[[c2]]

A sustained instrument needs a «gate» argument and an envelope with a sustain:

[[c3]]

[[c4]]

[[c5]]

[[c6]]

!! Inside a SynthDef use «Rand», «ExpRand» or «TRand» for randomness. «rrand» or «rand» are evaluated only once, when the definition is compiled, and every synth would come out the same.`,
  quiz: { q: 'What is the main advantage of a SynthDef over «{ }.play»?', o: ['It sounds louder', 'It allows more UGens', 'It works without a server', 'It is compiled once and creates many synths efficiently'], e: 'The definition is sent once to the server; each Synth only transmits its name and arguments.' },
  ch: { task: 'Define a SynthDef «\\bell» with a «freq» argument and play it **twice** with different frequencies.', checks: ['Adds a SynthDef', 'Creates at least 2 synths', 'It sounds'], hint: 'Follow example 1 and then «Synth(\\bell, [\\freq, 600]); Synth(\\bell, [\\freq, 900]);».' } },
l18: { t: 'Buses, order and effects', s: 'Routing signals between synths.',
  cells: { c1: 'reverb and source', c2: 'private bus and effect', c3: 'send to the effect', c4: 'control bus' },
  body: R`Synths talk to each other through **buses**. The first audio buses are the physical outputs and inputs; the rest are **private** and connect synths to one another, like cables in a studio. «Out.ar(bus, signal)» writes; «In.ar(bus, channels)» reads.

The typical case is a shared effect: several sources write to a bus and a reverb synth reads it. The effect has to come **after** the sources in the order of execution: that's why it's created with «Synth.tail».

[[c1]]

[[c2]]

[[c3]]

**Control buses** work the same way for «kr» signals: a single LFO can control many synths.

[[c4]]

!! «Bus.audio(s, 2)» reserves free buses for you. Never write bus numbers by hand in a big project: it is the recipe for connecting things by accident.`,
  quiz: { q: 'Why is the effect synth created with «Synth.tail»?', o: ['So it sounds louder', 'Because tail means stereo', 'So it is computed after the sources that write to its bus', 'So it frees itself'], e: 'The server processes nodes in order. An effect must read the bus after the sources have written to it.' },
  ch: { task: 'Send a sound to a **private bus** and process it with an effect synth that reads that bus.', checks: ['Reads a bus with «In»', 'Writes to a private bus', 'It sounds'], hint: 'Follow examples 1, 2 and 3 in order.' } },
l19: { t: 'Demand UGens', s: 'Sequences that run inside the server.',
  cells: { c1: 'Demand + Dseq', c2: 'Drand', c3: 'Duty', c4: 'TRand' },
  body: R`Sometimes it's better for a sequence to live **inside** the synth, sample-synchronised. **Demand UGens** are server-side patterns: «Dseq», «Drand», «Dwhite»… produce a new value every time «Demand» receives a trigger.

[[c1]]

[[c2]]

«Duty» moves on by itself: the first argument is the duration of each value (which can also be a sequence).

[[c3]]

For pure randomness per trigger, «TRand» (or «TIRand», «TExpRand»):

[[c4]]

!! Demand is ideal for fast sequences or ones that must be perfectly in sync with the audio. For music with notes, voices and structure, the language's patterns (module 5) are more flexible.`,
  quiz: { q: 'When does «Demand.kr(trig, 0, Dseq([...], inf))» produce a new value?', o: ['Every time it receives a trigger on trig', 'Once per second', 'Every audio block', 'Only when the synth is created'], e: 'Demand asks its D-UGens for the next value on every trigger.' },
  ch: { task: 'A melody sequenced on the server with «Demand» and «Dseq».', checks: ['Uses «Demand»', 'Uses «Dseq»', 'It sounds'], hint: 'Start from example 1 and change the notes.' } },
l20: { t: 'Inputs and outputs', s: 'MIDI, mouse, microphone and recording.',
  cells: { c1: 'a MIDIdef', c2: 'connect MIDI', c3: 'mouse button', c4: 'microphone', c5: 'record' },
  body: R`With **MIDIdef** you register a function that responds to MIDI messages. Here every note triggers a synth. Play the on-screen keyboard (or your computer keys) after running the example:

[[c1]]

If you have a MIDI keyboard and use Chrome or Edge, connect it:

[[c2]]

The mouse is a controller too: position and button.

[[c3]]

«SoundIn» reads the microphone. The browser will ask for permission. **Use headphones** to avoid feedback.

[[c4]]

«s.record» records everything that sounds; «s.stopRecording» downloads a WAV file.

[[c5]]

!! In desktop SuperCollider you can also use OSC to talk to other programs (Processing, Pure Data, TouchDesigner). That's not available in the browser, but MIDI is.`,
  quiz: { q: 'What arguments does the «MIDIdef.noteOn» function receive?', o: ['frequency and amplitude', 'velocity and note number (and channel)', 'only the note number', 'time and duration'], e: 'The order is (val, num, chan, src): for noteOn, val is the velocity and num the note.' },
  ch: { task: 'Write a «MIDIdef» that plays something for every key, and play the on-screen keyboard.', checks: ['There is an active MIDIdef', 'It sounds'], hint: 'Start from example 1. The on-screen keyboard appears below that example.' } },
l21: { t: 'Routines and clocks', s: 'Musical time: fork, wait and TempoClock.',
  cells: { c1: 'a routine', c2: 'an infinite loop', c3: 'stop it', c4: 'tempo', c5: 'a routine as a stream' },
  body: R`So far everything happened at once. To organise events in time, SuperCollider uses **routines**: functions that can pause with «wait». «fork» creates a routine and starts it on the default clock.

An event such as «(degree: 3).play» plays a note with the default instrument. We'll use it a lot.

[[c1]]

[[c2]]

[[c3]]

Waits are measured in **beats** of the clock. Changing the tempo of «TempoClock.default» changes the speed of everything running on it:

[[c4]]

A routine is also a **stream**: each «next» advances it to the next «yield».

[[c5]]

!! A «loop» without «wait» blocks the interpreter. This app detects it and stops it with an error, but in desktop SuperCollider you'd have to restart.`,
  quiz: { q: 'With «TempoClock.default.tempo = 2», how long is «1.wait» in seconds?', o: ['2 seconds', '1 second', '0.5 seconds', 'It depends on the sample rate'], e: 'tempo = 2 means 2 beats per second (120 BPM): one beat lasts 0.5 s.' },
  ch: { task: 'A routine that plays **at least 8 notes**, with «wait» between them.', checks: ['Uses «wait»', 'At least 8 notes sound'], hint: '«fork { 8.do { |i| (degree: i).play; 0.25.wait } }».' } },
l22: { t: 'Patterns: Pbind', s: 'Writing music as rules.',
  cells: { c1: 'a scale', c2: 'rhythm and chance', c3: 'a stream', c4: 'chords', c5: 'minor scale' },
  body: R`A **pattern** describes a sequence of values without running it. «Pbind» joins keys and patterns to generate **events** (notes). The most common keys: «degree» (scale degree), «dur» (duration in beats), «legato», «amp», «octave», «scale» and «instrument».

[[c1]]

«Pseq» walks through a list; «Prand» picks at random; «Pwhite» generates numbers between two limits. Patterns can be nested and combined freely.

[[c2]]

A pattern is a recipe. «asStream» turns it into a stream you can ask for values:

[[c3]]

If a value is an array, the event expands into a **chord**:

[[c4]]

[[c5]]

!! Look at the monitor's **Events** panel: each note appears as a rectangle in a piano roll. It is the best way to see what a pattern does.`,
  quiz: { q: 'In a Pbind, what does the «dur» key indicate?', o: ['The length of the sound in seconds', 'The time until the next event, in beats', 'The volume', 'The number of repeats'], e: 'dur is the delta between events in clock beats. The actual length of the note also depends on legato.' },
  ch: { task: 'A «Pbind» that plays **8 notes** in a **minor scale**.', checks: ['Uses «Pbind»', 'Uses a scale (Scale.minor…)', '8 notes sound'], hint: 'Look at example 5.' } },
l23: { t: 'Pdef, Ppar and your own instruments', s: 'Change the music while it plays.',
  cells: { c1: 'an instrument', c2: 'Pdef', c3: 'replace it live', c4: 'stop', c5: 'Ppar' },
  body: R`Patterns can use your own SynthDefs with the «instrument» key. This one uses «Pluck» and frees itself when the sound dies away thanks to «DetectSilence».

[[c1]]

«Pdef» names a pattern and lets you **replace it while it plays**: the change comes in on the next beat, with no cuts. It is the basis of live coding with patterns.

[[c2]]

[[c3]]

[[c4]]

«Ppar» plays several patterns in parallel: for example a bass line and a melody.

[[c5]]

!! If an instrument has no «gate», it has to free itself (doneAction or DetectSilence). If it has one, the pattern sends gate 0 at the end of each note.`,
  quiz: { q: 'What happens when you evaluate «Pdef(\\mel, ...)» again with a new pattern while it plays?', o: ['Everything stops', 'Both patterns play at once', 'It gives an error', 'The new pattern replaces the old one without cutting'], e: 'Pdef is a proxy: the player keeps running and picks up the new source on the next event.' },
  ch: { task: 'Play **two simultaneous parts** with «Ppar».', checks: ['Uses «Ppar»', 'At least 6 notes sound'], hint: 'Look at example 5.' } },
l24: { t: 'Algorithms: chance, walks and chains', s: 'Stochastic composition.',
  cells: { c1: 'random walk', c2: 'weighted chance', c3: 'Markov chain', c4: 'seeds' },
  body: R`Not all randomness sounds the same. A **random walk** («Pbrown») moves in small steps: it makes melodies with direction. **Weighted** randomness («Pwrand») makes some choices more likely than others.

[[c1]]

[[c2]]

A **Markov chain** chooses the next state based on the current one. Here each note can only go to certain notes: the result has a recognisable style.

[[c3]]

And with a seed, randomness becomes reproducible:

[[c4]]

!! For long generative pieces, combine levels: chance for the details, a fixed structure (Pseq, Pn) for the form.`,
  quiz: { q: 'What characterises a melody generated with «Pbrown»?', o: ['Each note is close to the previous one', 'All notes are equally likely', 'It always repeats the same note', 'It only uses low notes'], e: 'Pbrown is a Brownian motion: each value moves away from the previous one by at most «step».' },
  ch: { task: 'A melody that **wanders** with «Pbrown».', checks: ['Uses «Pbrown»', 'At least 8 notes sound'], hint: '«Pbind(\\degree, Pbrown(0, 14, 2, 16), \\dur, 0.15).play».' } },
l25: { t: 'JITLib: Ndef and ProxySpace', s: 'Programming while it plays.',
  cells: { c1: 'an Ndef', c2: 'redefine with a crossfade', c3: 'arguments and set', c4: 'chaining proxies', c5: 'ProxySpace', c6: 'clean up' },
  body: R`**JITLib** (Just In Time library) lets you change the program while it runs. An «Ndef» is a **proxy**: a named place where you put a sound source. If you redefine it, the new source replaces the old one with a **crossfade** of «fadeTime» seconds.

[[c1]]

[[c2]]

The function's arguments can be changed with «set», and they are kept even if you redefine the source:

[[c3]]

An Ndef can read another one with «Ndef.ar(\name)»: that's how you build a modular patch you can rewire live.

[[c4]]

«ProxySpace» does the same with a shorter syntax: each «~name» variable becomes a proxy.

[[c5]]

[[c6]]

!! In a performance, set «fadeTime» to 2–8 seconds: your mistakes become transitions.`,
  quiz: { q: 'What happens when you redefine an Ndef that is playing?', o: ['It cuts and starts again', 'It gives an error because it already exists', 'The new source replaces the old one with a crossfade', 'Both play forever'], e: 'The proxy keeps its bus and its monitor; only the source changes, with a fade of fadeTime seconds.' },
  ch: { task: 'Play an «Ndef» and **redefine it at least twice** while it plays.', checks: ['The Ndef has 3 or more versions', 'It sounds'], hint: 'Run «Ndef(\\x, { ... }).play», then change the contents of the function and run it again.' } },
l26: { t: 'SCTweets: the art of compact code', s: '140 characters of sound.',
  cells: { c1: 'breathing chords', c2: 'drops in a room', c3: 'triangular sequence', c4: 'pocket Xenakis' },
  body: R`In 2009 the SuperCollider community started sharing complete pieces that fit in a tweet: **140 characters**. **SCTweets** are a game, but also a school: they force you to know multichannel expansion, syntax shortcuts and the UGens that do a lot with little.

Some tricks: «play{ }» instead of «{ }.play», «!8» to multiply voices, «(1..8)» for series, one-letter variables and no spaces.

[[c1]]

[[c2]]

[[c3]]

[[c4]]

!! The challenge counter counts characters without leading or trailing spaces. If you go over, start by removing spaces and leading zeros.`,
  quiz: { q: 'What is «play{ SinOsc.ar }» equivalent to?', o: ['«SinOsc.play»', '«play(SinOsc)»', '«SinOsc.ar.play(0)»', '«{ SinOsc.ar }.play»'], e: 'Functional syntax with a trailing function: «play{...}» sends the message play to the function.' },
  ch: { task: 'Your **SCTweet**: a piece that sounds, in **140 characters or fewer**.', checks: ['140 characters or fewer', 'It sounds'], hint: 'Start from an example and simplify it. «play{Splay.ar(SinOsc.ar((1..5)*99,0,0.1))}» is 41 characters.' } },
l27: { t: 'Alternative tunings', s: 'Equal temperament, just intonation and other divisions of the octave.',
  cells: { c1: 'tempered chord', c2: 'just chord', c3: 'just scale', c4: '19-EDO', c5: 'Japanese scales' },
  body: R`The piano uses 12-note **equal temperament** (12-TET): each semitone is the twelfth root of 2. It is a compromise: no interval except the octave is acoustically pure. **Just intonation** uses whole-number ratios (3/2, 5/4…). Listen to the difference between these two major chords: the just one has no beating.

[[c1]]

[[c2]]

«Scale» accepts tunings («Tuning»): «Scale.major(\just)» is a just major scale.

[[c3]]

You can also divide the octave into another number of parts with «stepsPerOctave». 19-EDO has almost pure minor thirds:

[[c4]]

SuperCollider ships with scales from many musical traditions, including Japanese, Chinese and Indian ones. Here are two Japanese pentatonic scales:

[[c5]]`,
  quiz: { q: 'Which frequency ratio is a just perfect fifth?', o: ['5/4', '3/2', '4/3', '2/1'], e: '3/2 is the perfect fifth; 5/4 the major third; 4/3 the fourth; 2/1 the octave.' },
  ch: { task: 'Play a melody in a tuning that is **not** 12-TET (just, Pythagorean or another «stepsPerOctave»).', checks: ['Uses another tuning', 'At least 5 notes sound'], hint: 'Look at examples 3 and 4.' } },
l28: { t: 'Data sonification', s: 'Listening to numbers.',
  cells: { c1: 'data to pitch', c2: 'several dimensions', c3: 'continuous sonification' },
  body: R`To **sonify** is to turn data into sound systematically so you can listen to it: trends, anomalies, rhythms. The basic technique is **parameter mapping**: each dimension of the data controls one dimension of the sound (pitch, time, loudness, panning, timbre).

«linlin» and «linexp» translate one range into another. For pitch use «linexp», because we perceive frequency logarithmically.

[[c1]]

[[c2]]

Data can also become a continuous envelope:

[[c3]]

!! Choose your mapping on purpose: what goes up in the data should go up in the sound. And always offer a reference (a base tone, a pulse) so things can be compared.`,
  quiz: { q: 'Why is «linexp» better for mapping data to frequency?', o: ['Because it is faster to compute', 'Because it avoids negative numbers', 'Because we perceive pitch logarithmically', 'Because data is always exponential'], e: 'Equal distances on an exponential scale are heard as equal intervals.' },
  ch: { task: 'Sonify an array of **at least 10 values** using «linlin» or «linexp».', checks: ['Uses linlin, linexp or explin', 'At least 10 notes sound'], hint: 'Make up your own data or use «~data» from example 1.' } },
l29: { t: 'Spatialization', s: 'Placing and moving sounds.',
  cells: { c1: 'moving pan', c2: 'distance', c3: 'Doppler effect', c4: 'stereo width' },
  body: R`In stereo, lateral position is controlled with the level difference between channels («Pan2»). Open the oscilloscope's **X/Y** mode: you'll see the image move.

[[c1]]

**Distance** is perceived through several cues at once: lower volume, fewer highs and more reverberation relative to the direct sound. MouseY controls distance; MouseX, direction:

[[c2]]

An object passing close by changes pitch through the **Doppler effect**. It is modelled with a variable delay («DelayL»): the delay time is the distance divided by the speed of sound.

[[c3]]

«Splay» with a variable «spread» opens or closes the stereo image:

[[c4]]

!! For multichannel (quad, ambisonics) desktop SuperCollider has PanAz, BiPanB2 and libraries such as the ATK. The logic is the same as in stereo.`,
  quiz: { q: 'Which cue does NOT help you perceive that a sound is far away?', o: ['Lower volume', 'Fewer highs', 'More relative reverberation', 'A higher fundamental frequency'], e: 'Pitch doesn\'t depend on distance (except for the Doppler effect when the source moves).' },
  ch: { task: 'Move a sound around the stereo field with «Pan2» and an LFO.', checks: ['Uses «Pan2»', 'Uses an LFO', 'It sounds'], hint: '«Pan2.ar(source, SinOsc.kr(0.3))».' } },
l30: { t: 'Machine listening', s: 'Let the computer listen.',
  cells: { c1: 'envelope follower', c2: 'pitch tracking', c3: 'with the microphone' },
  body: R`**Machine listening** extracts information from a signal: how much energy it has («Amplitude»), what pitch («Pitch»), when a hit starts. With that a system can react to a performer: accompany, imitate, answer.

[[c1]]

«Pitch» estimates the fundamental frequency. Here a sine follows the melody a fifth above:

[[c2]]

The same with your voice or instrument through the microphone (with headphones):

[[c3]]

!! Desktop SuperCollider has more FFT-based analysis tools (Onsets and MFCC, for example). This is just the first step.`,
  quiz: { q: 'What does «Amplitude.kr(signal)» measure?', o: ['The amplitude envelope of the signal', 'The frequency', 'The number of harmonics', 'The stereo position'], e: 'It is an envelope follower with adjustable attack and release times.' },
  ch: { task: 'Use «Amplitude» to make one sound react to another.', checks: ['Uses «Amplitude»', 'It sounds'], hint: 'Look at example 1: the drums\' amplitude moves the filter.' } },
},
tips: [
  { t: 'Lower the master volume', b: 'Before experimenting, set the master volume to -12 dB or less. Change it with «s.volume» or from ⚙.' },
  { t: 'A limiter at the end', b: 'If you play live or experiment with feedback, put a «Limiter» at the end of the chain. Your ears will thank you.' },
  { t: 'Ctrl + . is your friend', b: 'It stops every sound, routine and pattern. Get used to pressing it without thinking.' },
  { t: 'poll to look inside the server', b: 'Signals live on the server and can\'t be printed with postln. «poll» samples them and sends them to the post window.' },
  { t: 'postln and debug', b: '«postln» prints and returns the same value: you can drop it in the middle of an expression. «debug» adds a label.' },
  { t: 'Look at your graph', b: '«dumpUGens» lists the UGens of a SynthDef. In this app, the UGen graph panel also draws every playing synth and shows its activity.' },
  { t: 'kr for slow things', b: 'LFOs, envelopes and controls go at control rate («kr»): they are computed once per block of 64 or 128 samples.' },
  { t: 'Compile once', b: 'Define your instruments with SynthDef at the start and then create Synths. «{ }.play» is handy for trying things, but it compiles every time.' },
  { t: '{ }.play for sketching', b: 'For quick ideas, «{ }.play» is perfect. When you like the sound, turn it into a SynthDef with arguments.' },
  { t: 'One block, one idea', b: 'Group code between parentheses «( … )» and run it with Ctrl + Enter. One block per idea makes your files easy to play live.' },
  { t: 'Keyword arguments', b: 'Write «freq:» and «mul:» instead of relying on order. The code reads better and is harder to get wrong.' },
  { t: 'Rand on the server, rrand in the language', b: '«rrand» is evaluated once when a SynthDef compiles. To make each synth different use «Rand», «ExpRand» or «TRand».' },
  { t: 'Remove DC', b: 'Chaotic sources, asymmetric distortion and some oscillators have DC. «LeakDC.ar» removes it without changing the sound.' },
  { t: 'Many voices, Splay', b: 'To mix many voices, «Splay» spreads them in stereo and compensates the level. Much better than summing everything in mono.' },
  { t: 'Think in dB', b: 'Our hearing is logarithmic. «dbamp» and «ampdb» convert between decibels and amplitude: -6 dB is half.' },
  { t: 'Long fadeTime', b: 'In live coding with Ndef, a «fadeTime» of several seconds turns every change into a musical transition.' },
  { t: 'Pdef to change without cuts', b: 'With Pdef you can rewrite a pattern while it plays: the change comes in on the next beat.' },
  { t: 'Think in BPM', b: 'TempoClock tempo is in beats per second: «128/60» is 128 BPM.' },
  { t: 'wait inside a routine', b: '«wait» only works inside «fork» or «Routine». If you see «yield was called outside of a Routine», wrap your code.' },
  { t: 'Seeds for chance', b: 'Set «thisThread.randSeed» at the start of a generative piece so you can repeat a version you liked.' },
  { t: 'gate and doneAction', b: 'A sustained instrument needs «gate» and an envelope with a sustain; a percussive one, «doneAction: 2». Otherwise synths pile up.' },
  { t: 'Named controls', b: '«\\freq.kr(440, 0.1)» creates a control called freq with 0.1 s of smoothing, without declaring arguments.' },
  { t: 'Test your envelopes', b: '«Env.plot» draws them and «Env.test» plays them with a sine. Adjust curves until attack and decay sound natural.' },
  { t: 'Free chorus', b: 'Two slightly detuned oscillators on different channels («[440, 441]») produce slow beating and a wide stereo image.' },
],
ref: {
  SinOsc: 'Wavetable sine oscillator. The basis of almost everything.', FSinOsc: 'Very efficient sine (resonator), no phase modulation.', SinOscFB: 'Sine with phase feedback: from sine to something like a saw.',
  Saw: 'Band-limited sawtooth. Every harmonic, 1/n.', Pulse: 'Band-limited pulse with variable width.', LFSaw: 'Non-band-limited saw, ideal as an LFO.', LFPulse: 'Non-band-limited pulse, output 0 to 1. Rhythms and gates.', LFTri: 'Non-band-limited triangle.', LFPar: 'Cheap parabolic (almost sine) wave.', LFCub: 'Cheap cubic (almost sine) wave.', VarSaw: 'Triangle/saw with variable slope.', SyncSaw: 'Hard-synced saw.', Blip: 'Pulse train with a controlled number of harmonics.', Formant: 'Formant oscillator (fundamental, formant and width).', PMOsc: 'Phase modulation: carrier, modulator and index.', Klang: 'Bank of sine oscillators.', Impulse: 'Periodic one-sample impulses. The trigger par excellence.',
  WhiteNoise: 'White noise: equal energy per frequency.', PinkNoise: 'Pink noise: equal energy per octave.', BrownNoise: 'Brownian noise: darker.', GrayNoise: 'Gray noise (bit flipping).', ClipNoise: 'Noise of -1 or 1 values.', Dust: 'Random impulses (0 to 1) with an average density.', Dust2: 'Bipolar random impulses.', LFNoise0: 'Stepped random values.', LFNoise1: 'Random values with linear interpolation.', LFNoise2: 'Random values with smooth interpolation.', LFClipNoise: 'Random -1 or 1 values, stepped.', Crackle: 'Chaotic crackling noise.', Logistic: 'Logistic map: from order to chaos.', HenonN: 'Non-interpolating Hénon map.', Gendy1: 'Xenakis\'s dynamic stochastic synthesis.',
  RLPF: 'Resonant low-pass (cutoff and rq).', RHPF: 'Resonant high-pass.', LPF: 'Second-order low-pass.', HPF: 'Second-order high-pass.', BPF: 'Band-pass.', BRF: 'Band-reject (notch).', Resonz: 'Constant-gain band-pass resonator.', Ringz: 'Resonator that rings on impulses (decay in seconds).', Formlet: 'Resonator with attack and decay.', MoogFF: 'Moog-style ladder filter.', MidEQ: 'Parametric peak EQ.', BLowShelf: 'Low-shelf EQ.', BHiShelf: 'High-shelf EQ.', OnePole: 'One-pole filter (smoothing).', LeakDC: 'Removes DC.', Lag: 'Smooths sudden changes (portamento).', Decay: 'Exponential decay of impulses.', Decay2: 'Decay with attack: an envelope for impulses.', Slew: 'Limits the rate of change.', Klank: 'Bank of resonators (frequencies, amplitudes, decays).',
  DelayN: 'Non-interpolating delay.', DelayL: 'Linear-interpolating delay (for modulation).', DelayC: 'Cubic-interpolating delay.', CombN: 'Echo with feedback.', CombL: 'Interpolating echo with feedback.', AllpassN: 'Allpass: diffusion for reverbs.', AllpassC: 'Interpolating allpass.', FreeVerb: 'Freeverb reverb (mix, room, damping).', FreeVerb2: 'Stereo Freeverb.', GVerb: 'Large-room stereo reverb.', PitchShift: 'Real-time granular pitch shifter.', Pluck: 'Karplus-Strong plucked string.', LocalIn: 'Reads the synth\'s internal feedback.', LocalOut: 'Writes the synth\'s internal feedback.',
  Env: 'Envelope shape: levels, times and curves.', EnvGen: 'Plays an Env; gate and doneAction.', Line: 'Linear ramp.', XLine: 'Exponential ramp.', Linen: 'Simple trapezoid envelope with gate.', DetectSilence: 'Detects silence and can free the synth.',
  Latch: 'Sample & hold.', TRand: 'Random value on each trigger.', TIRand: 'Random integer on each trigger.', TExpRand: 'Exponential random value per trigger.', Rand: 'Random value when the synth starts.', ExpRand: 'Exponential random value when the synth starts.', IRand: 'Random integer when the synth starts.', Stepper: 'Trigger counter with limits.', PulseCount: 'Counts triggers.', PulseDivider: 'Divides the number of triggers.', ToggleFF: 'Toggles between 0 and 1 on each trigger.', Trig: 'Holds the trigger value for a time.', Trig1: 'Fixed-length pulse per trigger.', Sweep: 'Ramp reset by a trigger.', Phasor: 'Cyclic ramp between two values.', CoinGate: 'Lets triggers through with a probability.', Select: 'Chooses a signal from an array by index.',
  Demand: 'Asks D-UGens for values on each trigger.', Duty: 'Steps through a sequence with durations.', TDuty: 'Like Duty, but outputs triggers.', Dseq: 'Server-side sequence.', Drand: 'Server-side random choice.', Dxrand: 'Random without repeating the previous one.', Dshuf: 'Shuffled list.', Dwhite: 'Random values in a range.', Dseries: 'Arithmetic series.',
  Out: 'Writes to a bus (output or private).', In: 'Reads a bus.', ReplaceOut: 'Replaces the contents of a bus.', OffsetOut: 'Sample-accurate Out.', SoundIn: 'Microphone input.', Pan2: 'Equal-power stereo panner.', LinPan2: 'Linear stereo panner.', Balance2: 'Balance of a stereo signal.', Rotate2: 'Rotates a two-channel sound field.', Splay: 'Spreads an array of voices in stereo.', Mix: 'Sums an array of signals.', XFade2: 'Equal-power crossfade.', MouseX: 'Horizontal mouse position.', MouseY: 'Vertical mouse position.', MouseButton: 'Mouse button state.', Bus: 'Allocates audio or control buses.',
  Amplitude: 'Envelope follower.', Pitch: 'Fundamental frequency estimation.', ZeroCrossing: 'Frequency from zero crossings.', Peak: 'Maximum peak until reset.', RunningMax: 'Running maximum.', Limiter: 'Peak limiter.', Compander: 'Compressor / expander / gate.', Poll: 'Prints the value of a signal.',
  GrainSin: 'Sine grains per trigger.', GrainFM: 'FM grains per trigger.',
  SynthDef: 'Defines a named instrument.', Synth: 'Creates and controls a synthesis node.', Routine: 'A function that can pause with wait/yield.', Task: 'A routine that can be paused and resumed.', TempoClock: 'Clock with a tempo in beats per second.', Pbind: 'Joins keys and patterns into events.', Pseq: 'Walks through a list.', Prand: 'Picks randomly from a list.', Pxrand: 'Random without repeats.', Pwrand: 'Weighted random.', Pshuf: 'Shuffled list.', Pwhite: 'Uniform random numbers.', Pexprand: 'Exponential random numbers.', Pbrown: 'Random walk.', Pseries: 'Arithmetic series.', Pgeom: 'Geometric series.', Pn: 'Repeats a pattern.', Pdup: 'Repeats each value n times.', Pfunc: 'Value computed by a function.', Pkey: 'Reads another key of the event.', Ppar: 'Patterns in parallel.', Pdef: 'Named pattern, replaceable live.', Ndef: 'Named sound proxy (JITLib).', ProxySpace: 'Environment where ~x are proxies.', Scale: 'Scales from many traditions.', Tuning: 'Tunings (12-TET, just, Pythagorean, EDO).', MIDIdef: 'Responds to MIDI messages.', Array: 'List of values with many operations.', Function: 'Deferred code between braces.', Event: 'Dictionary that knows how to play itself (a note).', Operators: 'Maths and conversion operators.',
},
labs: {
  osc: { t: 'Oscillators', d: 'Waveforms, harmonics and panning. Watch the oscilloscope and spectrum change.', tip: 'Turn on MouseX → freq and sweep across the screen. With Blip, raise the harmonics and look at the spectrum.' },
  sub: { t: 'Subtractive synthesizer', d: 'Oscillator, resonant filter, ADSR envelope and LFO, with a keyboard. The code is a complete SynthDef.', tip: 'Play with the on-screen keyboard or your computer (row A–K). Turn on the arpeggio and move the cutoff while it plays.' },
  fm: { t: 'FM synthesis', d: 'Carrier, ratio and index. Sidebands appear in the spectrum.', tip: 'Integer ratios: harmonic timbres. 1.414 or 3.5: bells. Turn on the envelope on the index for percussive sounds.' },
  add: { t: 'Additive synthesis', d: 'Sixteen harmonics you draw with the mouse, like an organ\'s drawbars.', tip: 'Try the presets and then stretch the series: with values other than 1 the partials become inharmonic.' },
  env: { t: 'Envelope editor', d: 'Draw an Env by dragging points. The «Env(...)» code updates itself.', tip: 'Double-click adds a point. A negative curve gives fast attacks and natural decays.' },
  seq: { t: 'Pattern sequencer', d: 'Sixteen steps and eight scale degrees. It becomes a Pbind inside a Pdef.', tip: 'Several cells on the same step make a chord. Change the scale without stopping: Pdef picks it up on the next bar.' },
  gran: { t: 'Granular', d: 'Clouds of sine or FM grains. Density, size, pitch and spread.', tip: 'Look at the sonogram (SONO). Grains shorter than 5 ms lose their pitch; with Impulse instead of Dust, formants appear.' },
  tune: { t: 'Tuning', d: 'Divide the octave into N parts and compare them with just intervals.', tip: '12, 19, 31 and 53 EDO come very close to just intervals. Compare the three chords.' },
  fx: { t: 'Effects chain', d: 'Saturation, echo, filter and reverb on different sources.', tip: 'Order matters: saturating before the echo doesn\'t sound the same as after. Try it in the code.' },
  chaos: { t: 'Chaos and non-standard synthesis', d: 'Gendy1, chaotic maps and stepped noise.', tip: 'Raise the chaos slowly: there are zones where the sound settles and others where it explodes.' },
},
};
})();
