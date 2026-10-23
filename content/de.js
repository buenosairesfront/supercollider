/* SuperCollider Lab · U-MA — Deutsch */
(function () {
const R = String.raw;
(window.SC_LANG = window.SC_LANG || {}).de = {
ui: {
  nav_res: 'Ressourcen', res_title: 'Ressourcen', res_intro: 'Zum Weiterlernen mit dem Desktop-SuperCollider: offizielle Website, Dokumentation, Forum und Quellcode. Alles frei und kostenlos.', res_site: 'Offizielle Website und Downloads', res_site_d: 'SuperCollider für Windows, macOS und Linux, kostenlos und quelloffen.', res_docs: 'Offizielle Dokumentation', res_docs_d: 'Die Hilfe zu allen Klassen und UGens, dieselbe wie in der IDE.', res_tut: 'Offizielles Tutorial', res_tut_d: '«Getting Started With SuperCollider», der Einstiegskurs der Dokumentation.', res_forum: 'Community-Forum', res_forum_d: 'scsynth.org: Fragen, Projekte und Neuigkeiten.', res_sccode: 'sccode.org', res_sccode_d: 'Von der Community geteilter Code zum Lernen und Spielen.', res_src: 'Quellcode', res_src_d: 'Das SuperCollider-Repository auf GitHub.',
  nav_home: 'Start', nav_course: 'Kurs', nav_labs: 'Labor', nav_free: 'Freier Code', nav_ref: 'Referenz', nav_tips: 'Tipps', 
  tagline: 'SuperCollider im Browser lernen · U-MA',
  hero_1: 'SuperCollider', hero_2: 'im Browser',
  hero_lead: 'Ein vollständiger Kurs in Klangsynthese und Musikprogrammierung mit einer Echtzeit-Audio-Engine. Du schreibst SuperCollider-Code, führst ihn aus und siehst ihn klingen: Oszilloskop, Spektrum, UGen-Graph und Zeitleiste. Ohne Installation.',
  start: 'Loslegen', continue: 'Weiter', level: 'Stufe', lessons: 'Lektionen', streak: 'Serie', days: 'Tage', modules: 'Module', module: 'Modul',
  try_now: 'Jetzt ausprobieren', try_title: 'Dein erster Klang', try_note: 'Klicke auf ▶ oder setze den Cursor in den Code und drücke Strg + Enter (Cmd + Enter auf dem Mac). Zum Stoppen: Strg + . oder die STOP-Taste.',
  course_map: 'Kursübersicht', tip_day: 'Tipp des Tages', all_tips: 'Alle Tipps', 
  
  
  badges: 'Abzeichen', badge_new: 'Neues Abzeichen', badge_sound: 'Erster Klang', badge_labs: 'Alle Labore', badge_chall: '10 Aufgaben', badge_quiz: 'Alle Quizze',
  levelup: 'Stufe {n}: {title}', lesson_done: 'Lektion abgeschlossen', completed: 'Abgeschlossen', mark_done: 'Als abgeschlossen markieren',
  course_intro: 'Sieben Module von deiner ersten Codezeile bis zum maschinellen Hören. Jede Lektion hat Beispiele zum Bearbeiten und Ausführen, ein Quiz und eine Aufgabe, die sich selbst prüft. Beginne mit Modul 1 und gehe der Reihe nach vor oder springe direkt zum Thema, das dich interessiert.',
  example: 'Beispiel', run: 'Ausführen', reset: 'Zurücksetzen', copy: 'Kopieren', copied: 'Kopiert', open_free: 'In Freier Code öffnen',
  pro_tip: 'Profi-Tipp', 
  quiz: 'Kurze Frage', challenge: 'Aufgabe', passed: 'bestanden', your_code: 'Dein Code', criteria: 'Kriterien', hint: 'Hinweis', challenge_ok: 'Aufgabe bestanden!',
  at_line: 'in Zeile', col: 'Spalte', stopped: 'alles gestoppt', rec_saved: 'Aufnahme gespeichert ({s} s, WAV)',
  mon_graph: 'UGen-Graph', mon_tree: 'Knotenbaum', mon_timeline: 'Ereignisse', mon_post: 'Post window', clear: 'Leeren',
  mon_idle: 'Server aus · führe Code aus, um ihn zu starten', tree_empty: 'keine Synths aktiv', tl_empty: 'Patterns und Routinen erscheinen hier', nan_warn: 'Warnung: Ein Synth hat ungültige Werte (NaN/inf) erzeugt und wurde stummgeschaltet. Prüfe Filter mit extremer Resonanz oder Divisionen durch null.',
  labs_title: 'Labor', labs_intro: 'Bedienoberflächen, die in Echtzeit SuperCollider-Code schreiben. Bewege einen Regler und sieh, wie sich der Code ändert; bearbeite den Code und höre das Ergebnis. Jedes Labor nutzt Ndef oder Pdef, wie in einer Live-Coding-Session.',
  lab_live: 'LIVE', lab_code: 'Erzeugter Code', lab_codenote: 'Der Code aktualisiert sich mit jedem Regler. Du kannst ihn bearbeiten und ausführen (▶ oder Strg + Enter) oder in Freier Code übernehmen.', play: 'Spielen', stop: 'Stopp', open: 'Öffnen',
  c_wave: 'Wellenform', c_freq: 'Frequenz', c_amp: 'Amplitude', c_width: 'Pulsbreite', c_harm: 'Obertöne', c_pan: 'Panorama', c_osc: 'Oszillator', c_filter: 'Filter', c_cutoff: 'Grenzfrequenz', c_rq: 'rq (1/Q)', c_lfo: 'LFO', c_depth: 'LFO-Tiefe', c_atk: 'Attack', c_dec: 'Decay', c_sus: 'Sustain', c_rel: 'Release', c_detune: 'Verstimmung', c_keys: 'Tastatur (auch Tasten A W S E D F T G Z H U J K)', c_arp: 'Arpeggio',
  c_ratio: 'Verhältnis', c_index: 'Index', c_envidx: 'Hüllkurve auf dem Index', c_ratios: 'Typische Verhältnisse', c_harmonics: 'Obertöne (Balken ziehen)', c_stretch: 'Spreizung', c_envdraw: 'Hüllkurve (Punkte ziehen, Doppelklick fügt hinzu)', c_curve: 'Kurve', c_delpt: 'Punkt löschen', c_trigger: 'Auslösen', c_loop: 'Wiederholen',
  c_steps: 'Schritte × Skalenstufen', c_scale: 'Tonleiter', c_instrument: 'Instrument', c_tempo: 'Tempo', c_octave: 'Oktave', c_legato: 'Legato', c_clear: 'Leeren', c_random: 'Zufall',
  c_density: 'Dichte', c_size: 'Korngröße', c_spread: 'Streuung', c_circle: 'Tonhöhenkreis (gelb: reine Intervalle)', c_edo: 'Oktavteilung (EDO)', c_base: 'Grundfrequenz', c_et_chord: '12-TET-Akkord', c_just_chord: 'Reiner Akkord 4:5:6', c_edo_chord: 'Akkord in diesem EDO',
  c_source: 'Quelle', c_chain: 'Effektkette', c_drive: 'Sättigung', c_dtime: 'Echozeit', c_decay: 'Echo-Abklingen', c_mix: 'Hall-Anteil', c_room: 'Raum', c_algo: 'Algorithmus', c_chaos: 'Chaos', c_volume: 'Lautstärke', c_tempo2: 'Tempo',
  free_title: 'Freier Code', free_intro: 'Dein SuperCollider-Notizbuch. Es wird nur in diesem Browser gespeichert. **Umschalt + Enter** führt die Zeile aus, **Strg + Enter** den Block zwischen Klammern, **Strg + .** stoppt alles. Probiere die Beispiele oder füge Code aus einer Lektion ein.',
  snippets: 'Dateien', examples: 'Beispiele', new: 'Neu', delete: 'Löschen', run_region: 'Block ausführen', run_all: 'Alles ausführen', untitled: 'Ohne Titel', scratch: 'Entwurf', from_lesson: 'Aus Lektion', sure: 'Sicher?',
  keys_help: '**Umschalt + Enter**: Zeile oder Auswahl ausführen · **Strg/Cmd + Enter**: Block ( … ) ausführen · **Strg/Cmd + .**: alles stoppen · **Strg/Cmd + D**: Hilfe zum Wort unter dem Cursor · **Tab**: einrücken',
  ref_title: 'Referenz', ref_intro: 'Die Klassen und UGens, die dieses Web-SuperCollider versteht, mit Signatur, kurzer Beschreibung und einem Beispiel zum Ausprobieren. Benannte Argumente (z. B. «freq: 440») funktionieren wie im Desktop-SuperCollider.', classes: 'Klassen', search: 'Suchen', try: 'Probieren', no_results: 'Keine Ergebnisse.',
  cat_osc: 'Oszillatoren', cat_noise: 'Rauschen und Chaos', cat_filter: 'Filter und Resonatoren', cat_delay: 'Delays, Hall und Rückkopplung', cat_env: 'Hüllkurven', cat_trig: 'Trigger und Zufall auf dem Server', cat_demand: 'Demand', cat_io: 'Ein-, Ausgänge und Panorama', cat_analysis: 'Analyse und Dynamik', cat_grain: 'Granular', cat_lang: 'Sprache, Patterns und JITLib',
  tips_title: 'Tipps', tips_intro: 'Was Menschen, die täglich mit SuperCollider arbeiten, aus der Praxis gelernt haben: Gehörschutz, Fehlersuche, Performance, Stil, Mischung und Live Coding.',
  tcat_safe: 'Sicherheit', tcat_debug: 'Fehlersuche', tcat_perf: 'Performance', tcat_style: 'Stil', tcat_mix: 'Mischung', tcat_live: 'Live Coding', tcat_time: 'Zeit', tcat_synth: 'Synthese',
  
  settings: 'Einstellungen', language: 'Sprache', theme: 'Design', th_system: 'System', th_light: 'Hell', th_dark: 'Dunkel', audio: 'Audio', volume: 'Gesamtlautstärke', limiter: 'Gehörschutz: Ausgang bei 0 dBFS begrenzen',
  safety_note: 'Beginne mit niedriger Lautstärke und erhöhe sie langsam. Mit Kopfhörern umso mehr.', progress: 'Fortschritt', export: 'Exportieren', import: 'Importieren', reset_progress: 'Fortschritt löschen', progress_note: 'Fortschritt, XP und deine Dateien werden in diesem Browser gespeichert. Exportiere sie, um sie auf ein anderes Gerät zu übertragen.', imported: 'Fortschritt importiert', bad_file: 'Diese Datei ist kein SuperCollider-Lab-Fortschritt.', shortcuts: 'Tastenkürzel', close: 'Schließen',
  post_hello: 'Schreibe Code und führe ihn mit Strg + Enter aus. Der erste Klang startet den Server.',
  footer_1: '**SuperCollider Lab** ist ein Lernwerkzeug von **Buenos Aires Front · U-MA**. Es läuft in deinem Browser: ein Interpreter für eine Teilmenge von sclang in JavaScript und eine scsynth-artige Synthese-Engine auf Web Audio. SuperCollider ist freie Software (GPL), geschaffen von James McCartney und gepflegt von seiner Community: [supercollider.github.io](https://supercollider.github.io).',
  footer_disc: 'Unabhängiges Bildungsprojekt ohne Verbindung zum SuperCollider-Projekt. Erklärungen, Beispiele und Audio-Engine sind eigenständig.',
  err_gui: 'Die GUI-Klassen von SuperCollider (Window, Slider…) gibt es in der Webversion nicht. Probiere die Labore: Bedienoberflächen, die Code schreiben.',
  err_buf: 'Buffer und das Laden von Audiodateien gibt es in dieser Webversion nicht: Alles wird live synthetisiert, nichts muss geladen werden.',
  err_osc: 'OSC (NetAddr, OSCdef) ist im Browser nicht verfügbar. Nutze MIDIdef mit einer MIDI-Tastatur oder der Bildschirmtastatur.',
  midi_none: 'Dieser Browser hat kein Web MIDI (probiere Chrome oder Edge). Die Bildschirmtastatur löst deine MIDIdefs trotzdem aus.', midi_denied: 'MIDI-Zugriff verweigert.',
},
levels: ['Zuhörer:in', 'UGen-Lehrling', 'Patcher:in', 'Synthesist:in', 'Klangprogrammierer:in', 'SynthDef-Designer:in', 'Algorithmische:r Komponist:in', 'Live Coder', 'Server-Architekt:in', 'SuperCollider-Meister:in', 'scsynth-Legende'],
mod: {
  m1: { t: 'Erste Schritte', d: 'Der Interpreter, das Post window, Nachrichten, Variablen, Funktionen und Arrays. Wie die Sprache denkt.' },
  m2: { t: 'Klang: UGens', d: 'Oszillatoren, Rauschen, Steuerung, Filter, Hüllkurven und Mehrkanal-Expansion.' },
  m3: { t: 'Synthesetechniken', d: 'Additiv, FM, physikalische Modellierung, Effekte, Microsound und nicht-standardisierte Synthese.' },
  m4: { t: 'Der Server', d: 'SynthDef und Synth, Busse und Effekte, Demand-UGens, MIDI, Maus und Mikrofon.' },
  m5: { t: 'Zeit und Patterns', d: 'Routinen und Uhren, Pbind, Pdef, Ppar, Tonleitern und stochastische Algorithmen.' },
  m6: { t: 'Live Coding', d: 'JITLib mit Ndef und ProxySpace und die Tradition der SCTweets.' },
  m7: { t: 'Anwendungen', d: 'Alternative Stimmungen, Sonifikation, Verräumlichung und maschinelles Hören.' },
},
les: {
l01: { t: 'Hallo, SuperCollider', s: 'Client und Server, das Post window und dein erster Klang.',
  cells: { c1: 'Post window', c2: 'Server starten', c3: 'eine Sinuswelle', c4: 'alles stoppen' },
  body: R`SuperCollider sind eigentlich **zwei Programme, die miteinander sprechen**: die Sprache (**sclang**), die deinen Code interpretiert, und der Syntheseserver (**scsynth**), der den Klang erzeugt. Die Sprache schickt Nachrichten an den Server, der Server antwortet mit Audio. In dieser App ist es genauso: Ein in JavaScript geschriebener sclang-Interpreter spricht mit einer Synthese-Engine, die in deinem Browser läuft.

Beginnen wir ganz einfach. Führe diese Zeile mit **Umschalt + Enter** aus (oder mit ▶). Das Ergebnis erscheint im **Post window** unten rechts.

[[c1]]

Der Pfeil «->» zeigt den Wert, den der Ausdruck zurückgegeben hat. «postln» gibt ihn zusätzlich aus. Im Desktop-SuperCollider musst du vor dem ersten Klang den Server starten:

[[c2]]

Hier startet der Server von selbst, sobald zum ersten Mal etwas klingt, aber «s.boot» solltest du kennen: «s» ist eine Variable, die immer auf den lokalen Server zeigt. Jetzt Klang:

[[c3]]

Alles zwischen geschweiften Klammern «{ }» ist eine **Funktion**. Schickst du ihr die Nachricht «play», macht SuperCollider daraus einen Synthesizer und startet ihn auf dem Server. Sieh dir Oszilloskop, UGen-Graph und Knotenbaum an: Da ist dein Synth.

!! Sicherheit zuerst: Beginne mit niedriger Systemlautstärke und erhöhe sie langsam. In SuperCollider tippt man schnell eine Ziffer zu viel und erzeugt einen sehr lauten Klang. Diese App begrenzt den Ausgang bei 0 dBFS (änderbar unter ⚙).

Zum Stoppen gibt es den universellen Shortcut **Strg + .** (Cmd + . auf dem Mac). Du kannst auch die STOP-Taste benutzen oder alle Knoten auf dem Server freigeben:

[[c4]]`,
  quiz: { q: 'Welches der beiden Programme erzeugt den Klang?', o: ['sclang, der Interpreter', 'scsynth, der Syntheseserver', 'Das Post window', 'Der Code-Editor'], e: 'Die Sprache (sclang) beschreibt und sendet; der Server (scsynth) berechnet die Audio-Samples. Deshalb kann der Server auf einem anderen Rechner laufen – oder hier im Browser.' },
  ch: { task: 'Lass eine Sinuswelle mit **220 Hz** und Amplitude **0.1** erklingen. Führe den Code aus und stoppe ihn am Ende mit Strg + .', checks: ['Verwendet «SinOsc»', 'Die Frequenz ist 220', 'Es klingt'], hint: 'Kopiere Beispiel 3 und ändere 440 in 220.' } },
l02: { t: 'Nachrichten, Argumente und Verschachtelung', s: 'Empfänger.nachricht(Argumente) und Ideen verketten.',
  cells: { c1: 'Zufallszahlen', c2: '10-mal mit !', c3: 'Nachrichten mit Argumenten', c4: 'Verschachtelung', c5: 'Seeds' },
  body: R`In SuperCollider ist alles ein **Objekt**, und Dinge geschehen, indem man **Nachrichten** schickt. Die allgemeine Form ist «empfänger.nachricht(argumente)». Oft kannst du auch «nachricht(empfänger, argumente)» schreiben: «rrand(1, 100)» ist dasselbe wie «1.rrand(100)».

[[c1]]

«rand» liefert eine Zahl zwischen 0 und dem Empfänger; «rrand» zwischen zwei Werten; «exprand» wählt mit exponentieller Verteilung – ideal für Frequenzen, weil sie gleichmäßig über die Oktaven verteilt. Das Zeichen «!» wiederholt: Bei einer Funktion wird sie mehrfach ausgewertet.

[[c2]]

Jede Nachricht hat ihre Argumente. Ändere sie und errate, was sie bewirken:

[[c3]]

Eine Nachricht kann Argument einer anderen sein. Das heißt **Verschachtelung** und wird von innen nach außen gelesen: Zuerst entstehen 20 Zahlen, dann werden sie gerundet und schließlich sortiert.

[[c4]]

## Reproduzierbarer Zufall

Computer erzeugen keinen echten Zufall. Wenn du einen **Seed** festlegst, bekommst du immer dieselbe Folge – praktisch, um eine Version eines generativen Stücks zu wiederholen.

[[c5]]`,
  quiz: { q: 'Wer empfängt in «round(exprand(1, 10), 0.1)» die Nachricht «round»?', o: ['Die Zahl 0.1', 'Die Zahl 1', 'Das Ergebnis von «exprand(1, 10)»', 'Die Zahl 10'], e: 'Das erste Argument der funktionalen Schreibweise ist der Empfänger: entspricht «exprand(1, 10).round(0.1)».' },
  ch: { task: 'Erzeuge ein Array mit **8 zufälligen MIDI-Noten zwischen 48 und 72**, aufsteigend sortiert. Der letzte Ausdruck deines Codes muss das Array sein.', checks: ['Hat 8 Elemente', 'Alle zwischen 48 und 72', 'Ist sortiert'], hint: 'Probiere «{ rrand(48, 72) } ! 8» und schick «sort».' } },
l03: { t: 'Variablen, Funktionen und Rangfolge', s: 'Werte speichern, Verhalten definieren, von links nach rechts lesen.',
  cells: { c1: 'Rangfolge', c2: 'Funktionen mit Argumenten', c3: 'Umgebungsvariablen', c4: 'Interpreter-Variablen' },
  body: R`Vorab eine wichtige Eigenheit: SuperCollider kennt **keine** Operatorrangfolge wie in der Schulmathematik. Binäre Operatoren werden **von links nach rechts** ausgewertet. Nutze Klammern, wenn du eine andere Reihenfolge willst.

[[c1]]

Eine **Funktion** ist Code zwischen geschweiften Klammern, der ausgeführt wird, wenn du ihr «value» schickst (oder kurz «.()»). Argumente stehen zwischen Strichen «| |» und können Standardwerte haben. Lokale Variablen deklarierst du mit «var» am Anfang des Blocks.

[[c2]]

Drei Arten von Variablen wirst du ständig benutzen:

- **Lokale** mit «var»: Sie leben im Block oder in der Funktion.
- **Interpreter-Variablen**: die Buchstaben «a» bis «z», immer verfügbar («s» ist bereits der Server).
- **Umgebungsvariablen** mit «~», z. B. «~base». Sie entstehen bei der Zuweisung und funktionieren überall.

[[c3]]

[[c4]]

!! Siehst du «Variable 'x' not defined», musst du sie mit «var» deklarieren oder «~x» verwenden. Der häufigste Anfängerfehler.`,
  quiz: { q: 'Was ergibt «5 + 2 * 3» in SuperCollider?', o: ['11', '13', '30', '21'], e: 'Von links nach rechts: (5 + 2) = 7, und 7 * 3 = 21. Für 11 schreibe «5 + (2 * 3)».' },
  ch: { task: 'Schreibe «~mtof», eine Funktion, die eine MIDI-Note erhält und ihre Frequenz in Hz zurückgibt. «~mtof.(69)» muss 440 ergeben.', checks: ['«~mtof.(69)» ergibt 440', '«~mtof.(81)» ergibt 880'], hint: 'Zahlen verstehen «midicps». In der Funktion: «note.midicps».' } },
l04: { t: 'Arrays und Collections', s: 'Wertelisten, Transformationen und eine Zwölftonmatrix.',
  cells: { c1: 'eine Tonleiter', c2: 'collect', c3: 'do', c4: 'Zwölftonreihe', c5: 'weitere Nachrichten' },
  body: R`Ein **Array** ist eine Liste in eckigen Klammern. Das Spannende: Rechenoperationen wirken auf jedes Element. 60 zu einer Tonleiter addiert verschiebt sie in die mittlere Oktave, und «midicps» wandelt alle Noten auf einmal in Frequenzen um.

[[c1]]

«collect» verwandelt jedes Element und liefert ein neues Array; «do» durchläuft die Elemente, um mit jedem etwas zu tun (z. B. ausgeben). Beide übergeben der Funktion Element und Index. «(1..8)» ist eine Kurzform für eine Reihe.

[[c2]]

[[c3]]

Mit sehr wenig Code lassen sich ganze musikalische Strukturen bauen. Hier eine zufällige Zwölftonreihe und ihre zwölf Transpositionen, wie in Schönbergs Technik:

[[c4]]

[[c5]]

!! Arrays sind das Tor zur **Mehrkanal-Expansion**, einer der Superkräfte von SuperCollider. Mehr dazu in Lektion 10.`,
  quiz: { q: 'Was liefert «[1, 2, 3] + [10, 20]»?', o: ['[11, 22, 13]', '[11, 22]', '[11, 22, 3]', 'Einen Fehler'], e: 'Bei Arrays unterschiedlicher Länge wird das kürzere zyklisch wiederholt: 1+10, 2+20, 3+10.' },
  ch: { task: 'Gib ein Array mit den **ersten 5 Obertönen von 110 Hz** zurück: [110, 220, 330, 440, 550].', checks: ['Hat 5 Elemente', 'Sind 110, 220, 330, 440, 550'], hint: '«(1..5) * 110» oder «(1..5).collect { |n| n * 110 }».' } },
l05: { t: 'Dein erster Klang: UGens und .play', s: 'Unit Generators, Argumente, mul und add.',
  cells: { c1: 'SinOsc', c2: 'Synth speichern', c3: 'freigeben', c4: 'benannte Argumente', c5: 'plot', c6: 'mul und add' },
  body: R`**UGens** (Unit Generators) sind die Bausteine des Klangs: Oszillatoren, Filter, Hüllkurven, Rauschen. Jeder hat eine Raten-Nachricht: «ar» (Audiorate, ein Wert pro Sample) oder «kr» (Kontrollrate, günstiger, für langsame Signale).

«SinOsc.ar(freq, phase, mul, add)» erzeugt eine Sinuswelle. **mul** multipliziert den Ausgang (die Lautstärke), **add** addiert einen Wert (verschiebt das Signal).

[[c1]]

Speicherst du das Ergebnis von «play» in einer Variablen, kannst du es später steuern:

[[c2]]

[[c3]]

Die Reihenfolge der Argumente musst du dir nicht merken: Du kannst sie benennen.

[[c4]]

«plot» zeichnet das Signal, ohne es abzuspielen. Schau in das rechte Panel:

[[c5]]

[[c6]]

!! Ein Audiosignal reicht von -1 bis 1. Addierst du mehrere oder nutzt mul größer als 1, übersteuert es. Halte Amplituden niedrig (0.1 bis 0.3) und summiere mit Bedacht.`,
  quiz: { q: 'Was bewirkt das Argument «mul» eines UGens?', o: ['Ändert die Frequenz', 'Multipliziert den Ausgang (skaliert die Amplitude)', 'Addiert einen konstanten Wert', 'Wiederholt den Klang'], e: 'mul skaliert das Signal, add verschiebt es. Zusammen kann ein Oszillator jeden Wertebereich steuern.' },
  ch: { task: 'Spiele eine Sinuswelle mit **330 Hz** und Amplitude **0.15**.', checks: ['Verwendet «SinOsc»', 'Die Frequenz ist 330', 'Es klingt'], hint: '«{ SinOsc.ar(330, 0, 0.15) }.play» oder mit benannten Argumenten.' } },
l06: { t: 'Oszillatoren und Rauschen', s: 'Wellenformen, Obertöne und Rauschfarben.',
  cells: { c1: 'Sägezahn', c2: 'Puls', c3: 'vier Wellenformen', c4: 'Blip', c5: 'weißes und rosa Rauschen' },
  body: R`Jede Wellenform hat ihre eigene Klangfarbe, weil sie andere **Obertöne** enthält. Der Sinus ist rein; der Sägezahn hat alle Obertöne; der Puls (Rechteck) nur die ungeraden, und seine Breite verändert die Farbe.

[[c1]]

[[c2]]

Wellenformen zu sehen hilft beim Verstehen. Dieses «plot» zeigt vier Kanäle gleichzeitig:

[[c3]]

«Blip» ist eine Impulsfolge mit kontrollierter Anzahl von Obertönen. Bewege die Maus von links nach rechts und beobachte das Spektrum (FFT):

[[c4]]

Rauschen enthält alle Frequenzen. **Weißes** Rauschen hat in jeder Frequenz gleich viel Energie, **rosa** in jeder Oktave – es klingt wärmer.

[[c5]]

!! Oszillatoren mit «LF»-Präfix (LFSaw, LFPulse, LFTri) sind nicht bandbegrenzt: perfekt zum Steuern anderer Parameter, bei hohen Frequenzen erzeugen sie aber Aliasing. Für Audio nimm Saw, Pulse und Blip.`,
  quiz: { q: 'Welcher Oszillator enthält nur ungerade Obertöne?', o: ['Saw', 'SinOsc', 'Pulse mit Breite 0.5', 'WhiteNoise'], e: 'Die Rechteckwelle (Pulse mit Breite 0.5) hat nur ungerade Obertöne mit Amplitude 1/n.' },
  ch: { task: 'Spiele einen «Blip» mit **12 Obertönen** und Amplitude 0.2.', checks: ['Verwendet «Blip»', 'Hat 12 Obertöne', 'Es klingt'], hint: '«Blip.ar(freq, numharm, mul)».' } },
l07: { t: 'Steuerung: LFOs, Offset und Skalierung', s: 'Signale, die andere Signale bewegen.',
  cells: { c1: 'Vibrato', c2: 'Zufallsnoten', c3: 'Maus', c4: 'poll', c5: 'Bereiche skalieren' },
  body: R`Ein langsamer Oszillator (**LFO**) kann Frequenz, Amplitude oder jedes Argument eines anderen UGens steuern. Dazu bringst du seinen Ausgang (-1 bis 1) in den gewünschten Bereich: Das machen **mul** (Skalierung) und **add** (Offset). «SinOsc.kr(5, 0, 10, 440)» schwankt zwischen 430 und 450: ein Vibrato.

[[c1]]

mul und add von Hand zu schreiben ist umständlich; «range(min, max)» rechnet für dich:

[[c2]]

«MouseX» und «MouseY» machen aus der Mausposition ein Signal. Auf dem Handy: auf dem Oszilloskop tippen und ziehen.

[[c3]]

«poll» gibt den Wert eines Signals im Post window aus. Das Grundwerkzeug, um zu sehen, was im Server passiert.

[[c4]]

[[c5]]

!! Nutze «kr» für Steuersignale: Es rechnet einmal pro Block und spart CPU. «exprange» für Frequenzen, «range» für fast alles andere.`,
  quiz: { q: 'Zwischen welchen Werten schwingt «SinOsc.kr(1, 0, 300, 500)»?', o: ['Zwischen 200 und 800', 'Zwischen 300 und 500', 'Zwischen -300 und 300', 'Zwischen 0 und 800'], e: 'Der Ausgang (-1..1) wird mit 300 multipliziert (-300..300) und 500 addiert: 200 bis 800.' },
  ch: { task: 'Baue eine **Sirene**: ein «LFTri» bewegt die Frequenz eines «SinOsc» zwischen 300 und 900 Hz.', checks: ['Verwendet «LFTri»', 'Verwendet «SinOsc»', 'Es klingt'], hint: '«SinOsc.ar(LFTri.kr(0.5).range(300, 900), 0, 0.2)».' } },
l08: { t: 'Subtraktive Synthese', s: 'VCO → VCF → VCA: der Analogsynthesizer als Code.',
  cells: { c1: 'resonantes Filter', c2: 'modulierte Grenzfrequenz', c3: 'Wind', c4: 'Moog-artiges Filter' },
  body: R`Subtraktive Synthese beginnt mit einem obertonreichen Klang und **entfernt** Frequenzen mit einem Filter. Die klassische Architektur analoger Synthesizer: ein Oszillator (VCO), ein Filter (VCF) und ein Verstärker (VCA).

«RLPF» ist ein resonanter Tiefpass: Er lässt Frequenzen unterhalb der **Grenzfrequenz** durch und hebt den Bereich um die Grenzfrequenz je nach **rq** an (Kehrwert von Q: je kleiner, desto mehr Resonanz).

[[c1]]

Eine mit einem LFO modulierte Grenzfrequenz bringt Bewegung. «[100, 101]» erzeugt zwei leicht verstimmte Stimmen, eine pro Kanal:

[[c2]]

Mit Rauschen und einem schmalen Bandpass lassen sich Naturklänge modellieren:

[[c3]]

«MoogFF» imitiert Moogs Kaskadenfilter; das dritte Argument ist die Rückkopplung (Resonanz), von 0 bis 4:

[[c4]]

!! Mit sehr kleinem rq und viel Energie an der Grenzfrequenz kann ein resonantes Filter sehr laut werden. Senke mul vor dem Experimentieren.`,
  quiz: { q: 'Was passiert bei «RLPF», wenn du rq verringerst?', o: ['Das Filter lässt mehr Höhen durch', 'Die Resonanz an der Grenzfrequenz steigt', 'Die Grenzfrequenz sinkt', 'Der Klang wird stereo'], e: 'rq ist die relative Bandbreite (1/Q). Je kleiner, desto schmaler und resonanter die Spitze.' },
  ch: { task: 'Schicke einen «Pulse» durch einen «RLPF» und bewege die Grenzfrequenz mit einem LFO.', checks: ['Verwendet «Pulse»', 'Verwendet «RLPF»', 'Verwendet einen LFO (SinOsc, LFNoise, LFTri…)', 'Es klingt'], hint: '«RLPF.ar(Pulse.ar(80, 0.3, 0.2), SinOsc.kr(0.3).range(200, 3000), 0.2)».' } },
l09: { t: 'Hüllkurven', s: 'Env, EnvGen, doneAction und gate.',
  cells: { c1: 'klassische Hüllkurven', c2: 'eigene Hüllkurve', c3: 'perkussiv', c4: 'gehalten mit gate', c5: 'loslassen', c6: 'Line und XLine' },
  body: R`Eine **Hüllkurve** formt einen Parameter über die Zeit: die Lautstärke einer Note, die Helligkeit eines Filters, die Tonhöhe eines Schlags. «Env» beschreibt die Form (Pegel, Zeiten, Kurven), «EnvGen» spielt sie auf dem Server ab.

[[c1]]

Jede Form ist möglich: ein Array von Pegeln, eines von Zeiten (eins weniger als Pegel) und die Kurven (negativ: anfangs schnell; positiv: anfangs langsam).

[[c2]]

**doneAction: 2** sagt dem Server, dass er den Synth am Ende der Hüllkurve freigeben soll. Ohne das würde der Synth stumm weiter CPU verbrauchen.

[[c3]]

Hüllkurven mit **Sustain** (adsr, asr) bleiben auf dem Sustain-Pegel, solange das Argument **gate** größer als 0 ist. Bei 0 beginnt das Release:

[[c4]]

[[c5]]

«Line» und «XLine» sind einfache Rampen (linear und exponentiell), die ebenfalls doneAction akzeptieren:

[[c6]]

!! Exponentielle Kurven und negative Kurvenwerte klingen für die Lautstärke natürlicher, weil unser Gehör Lautstärke logarithmisch wahrnimmt.`,
  quiz: { q: 'Was bewirkt «doneAction: 2»?', o: ['Wiederholt die Hüllkurve zweimal', 'Verdoppelt die Amplitude', 'Gibt den Synth am Ende der Hüllkurve frei', 'Wartet zwei Sekunden vor dem Start'], e: 'Das ist der Standardweg, damit Noten sich nach dem Ende selbst vom Server entfernen.' },
  ch: { task: 'Erzeuge eine **perkussive** Note, die sich selbst freigibt: «Env.perc» + «doneAction: 2».', checks: ['Verwendet «EnvGen»', 'Verwendet doneAction: 2', 'Es klingt'], hint: 'Sieh dir Beispiel 3 an und ändere Oszillator oder Zeiten.' } },
l10: { t: 'Mehrkanal-Expansion und Stereo', s: 'Ein Array als Argument verdoppelt den ganzen Patch.',
  cells: { c1: 'Mono und Stereo', c2: 'Expansion', c3: 'Pan2', c4: 'Splay', c5: 'Mix' },
  body: R`Verwendest du ein **Array** als Argument eines UGens, dupliziert SuperCollider den Patch: eine Kopie pro Element, jede auf einem eigenen Ausgangskanal. Das ist **Mehrkanal-Expansion**.

Achtung, eine SuperCollider-Eigenheit: Ein Monoklang kommt **nur aus dem linken Kanal** (Bus 0). Schau aufs Oszilloskop: Cyan ist links, Magenta rechts.

[[c1]]

[[c2]]

«Pan2» platziert ein Monosignal im Stereofeld (-1 links, 1 rechts). «Splay» verteilt viele Stimmen zwischen links und rechts. «Mix» summiert ein Array von Kanälen zu einem. Probiere den **X/Y**-Modus des Oszilloskops, um das Stereobild zu sehen.

[[c3]]

[[c4]]

[[c5]]

!! «sig ! 2» ist der kürzeste Weg, ein Monosignal stereo zu machen (dasselbe Signal auf beiden Kanälen).`,
  quiz: { q: 'Wie viele Kanäle erzeugt «{ SinOsc.ar([300, 400], 0, 0.1) }.play»?', o: ['1', '2', '4', 'Hängt vom Server ab'], e: 'Das Array mit zwei Frequenzen erzeugt zwei SinOsc: Kanal 0 mit 300 Hz, Kanal 1 mit 400 Hz.' },
  ch: { task: 'Drei leicht verstimmte «Saw», mit «Splay» im Stereofeld verteilt.', checks: ['Verwendet «Saw»', 'Verwendet «Splay» (Pan2)', 'Ist stereo', 'Es klingt'], hint: '«Splay.ar(Saw.ar([110, 110.4, 109.7], 0.1))».' } },
l11: { t: 'Additive Synthese', s: 'Klangfarben aus Sinuswellen bauen.',
  cells: { c1: 'Obertonreihe', c2: 'nur ungerade', c3: 'unharmonische Teiltöne', c4: 'Klang' },
  body: R`Laut Fourier ist jeder periodische Klang eine Summe von Sinuswellen. **Additive** Synthese macht genau das: Du addierst Teiltöne, jeder mit eigener Frequenz und Amplitude. «Mix.fill(n, funktion)» erzeugt n Stimmen und summiert sie.

[[c1]]

Mit nur ungeraden Obertönen entsteht etwas Rechteckähnliches (vergleiche im Spektrum mit Lektion 6):

[[c2]]

Sind die Teiltöne keine ganzzahligen Vielfachen eines Grundtons, klingt das Ergebnis nach Glocke oder Metall. «ExpRand» und «Rand» wählen **einmal pro Synth** einen Zufallswert, im Server:

[[c3]]

«Klang» ist eine effiziente Bank von Sinusoszillatoren. Beachte das Backquote vor dem Array: Es friert das Array ein, damit es nicht in mehrere Kanäle expandiert.

[[c4]]

!! Sieh dir den SONO-Modus (Sonogramm) an: Additive Synthese erscheint als waagerechte Linien, eine pro Teilton.`,
  quiz: { q: 'Welche Amplitude hat der n-te Oberton eines Sägezahns üblicherweise?', o: ['n', '1', 'n²', '1/n'], e: 'Der Sägezahn hat alle Obertöne mit Amplitude 1/n; das Rechteck nur die ungeraden mit 1/n.' },
  ch: { task: 'Baue mit «Mix.fill» aus ungeraden Obertönen eine **fast rechteckige** Welle.', checks: ['Verwendet «SinOsc»', 'Verwendet «Mix.fill» oder «Klang»', 'Es klingt'], hint: 'Für i = 0, 1, 2…: n = i * 2 + 1, Frequenz f * n und Amplitude 1/n.' } },
l12: { t: 'FM und Phasenmodulation', s: 'Träger, Modulator, Index und Seitenbänder.',
  cells: { c1: 'Index auf der Maus', c2: 'FM von Hand', c3: 'FM-Glocke', c4: 'Sample & Hold' },
  body: R`Bei der **FM-Synthese** verändert ein Modulator sehr schnell die Frequenz (oder Phase) eines Trägers. Es entstehen **Seitenbänder**: neue Frequenzen zu beiden Seiten des Trägers im Abstand der Modulatorfrequenz. Wenige Oszillatoren, sehr komplexe Klangfarben.

«PMOsc.ar(träger, modulator, index)» macht Phasenmodulation. Öffne den FFT-Modus und bewege die Maus: Der **Index** bestimmt, wie viele Seitenbänder entstehen.

[[c1]]

Dasselbe von Hand: Der Modulator wird zur Trägerfrequenz addiert.

[[c2]]

Ist das Verhältnis von Modulator zu Träger nicht ganzzahlig, wird das Spektrum unharmonisch: Glocken. Klingt der Index mit der Hüllkurve ab, verblasst die Klangfarbe wie bei einem echten Instrument:

[[c3]]

«Latch» nimmt bei jedem Trigger eine Probe eines Signals und hält sie (Sample & Hold). Hier ändert es das FM-Verhältnis bei jeder Note:

[[c4]]`,
  quiz: { q: 'Bei ganzzahligem Verhältnis Modulator/Träger (1, 2, 3…) ist das Spektrum…', o: ['harmonisch', 'unharmonisch', 'weißes Rauschen', 'Stille'], e: 'Bei ganzzahligem Verhältnis liegen die Seitenbänder auf Vielfachen des Grundtons: harmonisch.' },
  ch: { task: 'Baue eine **FM-Glocke**: «PMOsc» mit einer Hüllkurve, die den Index steuert.', checks: ['Verwendet SinOsc (PMOsc)', 'Verwendet «PMOsc»', 'Verwendet «EnvGen»', 'Es klingt'], hint: 'Sieh dir Beispiel 3 an: das dritte Argument von PMOsc mal EnvGen.' } },
l13: { t: 'Physikalische Modellierung und Resonatoren', s: 'Gezupfte Saiten, Glocken und Regen.',
  cells: { c1: 'Karplus-Strong', c2: 'Saiten-Arpeggio', c3: 'Glocke mit Klank', c4: 'Regen auf Metall' },
  body: R`**Physikalische Modellierung** simuliert das Verhalten eines schwingenden Objekts. Der **Karplus-Strong**-Algorithmus regt eine Verzögerungsleitung mit einem Rauschstoß an und koppelt sie gefiltert zurück: Es klingt wie eine gezupfte Saite. In SuperCollider heißt das «Pluck».

[[c1]]

[[c2]]

**Resonatoren** sind Filter, die von selbst klingen, wenn sie einen Impuls erhalten. «Klank» ist eine Resonatorbank: Du gibst Frequenzen, Amplituden und Abklingzeiten an und regst sie mit Impulsen an.

[[c3]]

«Ringz» ist ein einzelner Resonator. Mit «Dust» (zufällige Impulse) angeregt klingt es wie Tropfen auf Metall:

[[c4]]

!! Resonatoren mit langem Abklingen sammeln Energie: Regst du sie mit Dauersignalen an, senke den Eingangspegel stark.`,
  quiz: { q: 'Was simuliert der Karplus-Strong-Algorithmus?', o: ['Eine menschliche Stimme', 'Ein Moog-Filter', 'Eine gezupfte Saite', 'Eine Pfeifenorgel'], e: 'Eine über einen Tiefpass rückgekoppelte Verzögerungsleitung: Das Anfangsrauschen wird zu einem Ton, der wie eine Saite abklingt.' },
  ch: { task: 'Ein Resonanzkörper («Klank» oder «Ringz»), angeregt durch «Dust».', checks: ['Verwendet Klank oder Ringz', 'Verwendet «Dust»', 'Es klingt'], hint: '«Klank.ar(`[[500, 1200, 2100], nil, [1, 1, 1]], Dust.ar(5, 0.1))».' } },
l14: { t: 'Effekte: Delay, Hall und Verzerrung', s: 'Echos, Räume, Sättigung und Rückkopplung.',
  cells: { c1: 'Echo mit CombN', c2: 'Hall', c3: 'Verzerrung', c4: 'Rückkopplung' },
  body: R`Zeitbasierte Effekte entstehen mit **Verzögerungsleitungen**. «CombN» ist ein Delay mit Rückkopplung: Jede Wiederholung ist leiser, gemäß der Abklingzeit.

[[c1]]

«FreeVerb» simuliert einen Raum mit einem Netz aus Kamm- und Allpassfiltern. Argumente: Mischung, Raumgröße, Dämpfung:

[[c2]]

Die einfachste Verzerrung: verstärken und durch eine weich begrenzende Funktion wie «tanh» schicken.

[[c3]]

Mit «LocalIn» und «LocalOut» baust du eigene Rückkopplungen in einem Synth. Hier ein gekreuztes Stereo-Echo (Ping-Pong) mit Filter in der Schleife:

[[c4]]

!! In einer Rückkopplungsschleife muss die Gesamtverstärkung kleiner als 1 sein. Setze immer ein Filter oder eine Sättigung («tanh») in die Schleife, damit sie nicht explodiert.`,
  quiz: { q: 'Was bedeutet die 3 in «CombN.ar(in, 0.5, 0.25, 3)»?', o: ['Genau drei Wiederholungen', 'Die Zeit (in Sekunden), bis das Echo um 60 dB abfällt', 'Die maximale Verzögerung', 'Die Anzahl der Kanäle'], e: 'Die Argumente sind: Eingang, maximale Verzögerung, Verzögerung und Abklingzeit (bis -60 dB).' },
  ch: { task: 'Ein trockener Klang + ein Echo mit «CombN» + Hall mit «FreeVerb».', checks: ['Verwendet «CombN»', 'Verwendet «FreeVerb»', 'Es klingt'], hint: 'Addiere Signal und Echo und schicke alles durch FreeVerb.' } },
l15: { t: 'Microsound und Granularsynthese', s: 'Klänge aus Partikeln.',
  cells: { c1: 'regelmäßige Körner', c2: 'Granularwolke', c3: 'ein Korn als SynthDef', c4: 'Körnerregen' },
  body: R`Ein **Korn** ist ein sehr kurzer Klang (1 bis 100 Millisekunden) mit weicher Hüllkurve. Tausende Körner pro Sekunde ergeben Texturen, Wolken und Verwandlungen, die anders unmöglich wären. Ist ein Korn sehr kurz, verschwindet seine Tonhöhe, und es wird zu einem gefärbten Klick.

[[c1]]

«GrainSin» erzeugt bei jedem Trigger Sinuskörner. Mit «Dust» (asynchron) entstehen Wolken; mit «Impulse» (synchron) Töne mit Formanten. Bewege die Maus: Dichte auf X, Korngröße auf Y.

[[c2]]

Man kann es auch aus der Sprache machen und pro Korn einen Synth starten. Zuerst definieren wir das Korn:

[[c3]]

[[c4]]

!! Nutze «OffsetOut» in Granular-SynthDefs: Es korrigiert den Versatz im Audioblock und verbessert die zeitliche Genauigkeit bei vielen Ereignissen pro Sekunde.`,
  quiz: { q: 'Was passiert, wenn Körner extrem kurz sind?', o: ['Sie klingen tiefer', 'Sie werden lauter', 'Sie werden zu weißem Rauschen', 'Die Tonhöhe verschwindet, man hört gefärbte Klicks'], e: 'Unter wenigen Millisekunden ist die Periode nicht mehr wahrnehmbar: Es bleibt ein Klick, dessen Farbe vom Inhalt abhängt.' },
  ch: { task: 'Eine **Granularwolke**: «GrainSin», ausgelöst von «Dust».', checks: ['Verwendet «GrainSin»', 'Verwendet «Dust»', 'Es klingt'], hint: 'Sieh dir Beispiel 2 an und ändere die Bereiche.' } },
l16: { t: 'Nicht-standardisierte Synthese und Chaos', s: 'Xenakis, chaotische Abbildungen und Algorithmen als Klangquelle.',
  cells: { c1: 'Gendy1', c2: 'Gendy1 auf der Maus', c3: 'Crackle', c4: 'logistische Abbildung', c5: 'Hénon-Abbildung' },
  body: R`**Nicht-standardisierte** Synthese geht nicht von der Akustik aus, sondern von Verfahren: Zahlen, Zufall, Chaos. **Gendy1** implementiert die dynamische stochastische Synthese von Iannis Xenakis: Die Wellenform besteht aus Punkten, die sich in Zufallsbewegungen verschieben.

[[c1]]

[[c2]]

**Chaotische Systeme** sind deterministisch, aber unvorhersagbar. «Crackle» und «Logistic» erkunden Gleichungen, die je nach Parameter von Ordnung in Chaos übergehen. Bewege die Maus langsam und höre auf die Übergänge.

[[c3]]

[[c4]]

[[c5]]

!! Diese Quellen können einen Gleichanteil (DC) haben. Wenn du sie danach filterst oder bearbeitest, füge «LeakDC.ar» hinzu, um sie auf null zu zentrieren.`,
  quiz: { q: 'Welcher Komponist entwickelte die dynamische stochastische Synthese (Gendy)?', o: ['John Cage', 'Iannis Xenakis', 'Karlheinz Stockhausen', 'Pauline Oliveros'], e: 'Xenakis entwickelte sie in den 1990er-Jahren (GENDYN). Gendy1 ist die Umsetzung in SuperCollider.' },
  ch: { task: 'Erzeuge deine eigene Textur mit «Gendy1».', checks: ['Verwendet «Gendy1»', 'Es klingt'], hint: 'Ändere minfreq und maxfreq oder bewege ampscale und durscale.' } },
l17: { t: 'SynthDef und Synth', s: 'Einmal definieren, oft spielen.',
  cells: { c1: 'definieren', c2: 'spielen', c3: 'ein Pad mit gate', c4: 'erzeugen', c5: 'ändern', c6: 'loslassen' },
  body: R`Jedes «{ }.play» kompiliert ein neues Instrument. Für Instrumente, die du oft nutzt, definierst du besser eine **SynthDef**: ein benanntes Rezept, das der Server aufbewahrt. Daraus erzeugst du **Synths** (Instanzen), jede mit eigenen Werten.

Die Argumente der Funktion werden zu **Controls**, die du beim Erzeugen setzen und während des Klingens ändern kannst. Üblicherweise gibt es «out», um den Ausgangsbus zu wählen, und der Ausgang wird explizit mit «Out.ar» geschrieben.

[[c1]]

[[c2]]

Ein gehaltenes Instrument braucht ein «gate»-Argument und eine Hüllkurve mit Sustain:

[[c3]]

[[c4]]

[[c5]]

[[c6]]

!! Nutze in einer SynthDef «Rand», «ExpRand» oder «TRand» für Zufall. «rrand» oder «rand» werden nur einmal beim Kompilieren ausgewertet, und alle Synths wären gleich.`,
  quiz: { q: 'Was ist der Hauptvorteil einer SynthDef gegenüber «{ }.play»?', o: ['Sie klingt lauter', 'Sie erlaubt mehr UGens', 'Sie funktioniert ohne Server', 'Sie wird einmal kompiliert und erzeugt effizient viele Synths'], e: 'Die Definition geht einmal an den Server; jeder Synth überträgt nur Namen und Argumente.' },
  ch: { task: 'Definiere eine SynthDef «\\bell» mit einem «freq»-Argument und spiele sie **zweimal** mit unterschiedlichen Frequenzen.', checks: ['Fügt eine SynthDef hinzu', 'Erzeugt mindestens 2 Synths', 'Es klingt'], hint: 'Folge Beispiel 1 und dann «Synth(\\bell, [\\freq, 600]); Synth(\\bell, [\\freq, 900]);».' } },
l18: { t: 'Busse, Reihenfolge und Effekte', s: 'Signale zwischen Synths routen.',
  cells: { c1: 'Hall und Quelle', c2: 'privater Bus und Effekt', c3: 'an den Effekt senden', c4: 'Kontrollbus' },
  body: R`Synths kommunizieren über **Busse**. Die ersten Audiobusse sind die physischen Aus- und Eingänge; die übrigen sind **privat** und verbinden Synths untereinander, wie Kabel im Studio. «Out.ar(bus, signal)» schreibt, «In.ar(bus, kanäle)» liest.

Der typische Fall ist ein gemeinsamer Effekt: Mehrere Quellen schreiben auf einen Bus, ein Hall-Synth liest ihn. Der Effekt muss in der Ausführungsreihenfolge **nach** den Quellen stehen: Deshalb wird er mit «Synth.tail» erzeugt.

[[c1]]

[[c2]]

[[c3]]

**Kontrollbusse** funktionieren genauso für «kr»-Signale: Ein einziger LFO kann viele Synths steuern.

[[c4]]

!! «Bus.audio(s, 2)» reserviert freie Busse für dich. Schreibe in großen Projekten nie Busnummern von Hand: das Rezept für versehentliche Verbindungen.`,
  quiz: { q: 'Warum wird der Effekt-Synth mit «Synth.tail» erzeugt?', o: ['Damit er lauter klingt', 'Weil tail Stereo bedeutet', 'Damit er nach den Quellen berechnet wird, die auf seinen Bus schreiben', 'Damit er sich selbst freigibt'], e: 'Der Server verarbeitet Knoten der Reihe nach. Ein Effekt muss den Bus lesen, nachdem die Quellen geschrieben haben.' },
  ch: { task: 'Schicke einen Klang auf einen **privaten Bus** und bearbeite ihn mit einem Effekt-Synth, der diesen Bus liest.', checks: ['Liest einen Bus mit «In»', 'Schreibt auf einen privaten Bus', 'Es klingt'], hint: 'Folge den Beispielen 1, 2 und 3 der Reihe nach.' } },
l19: { t: 'Demand-UGens', s: 'Sequenzen, die im Server laufen.',
  cells: { c1: 'Demand + Dseq', c2: 'Drand', c3: 'Duty', c4: 'TRand' },
  body: R`Manchmal ist es besser, wenn eine Sequenz **im** Synth lebt, samplegenau synchron. **Demand-UGens** sind serverseitige Patterns: «Dseq», «Drand», «Dwhite»… liefern jedes Mal einen neuen Wert, wenn «Demand» einen Trigger erhält.

[[c1]]

[[c2]]

«Duty» schreitet selbst voran: Das erste Argument ist die Dauer jedes Werts (die auch eine Sequenz sein kann).

[[c3]]

Für reinen Zufall pro Trigger: «TRand» (oder «TIRand», «TExpRand»):

[[c4]]

!! Demand ist ideal für schnelle Sequenzen oder solche, die perfekt mit dem Audio synchron sein müssen. Für Musik mit Noten, Stimmen und Struktur sind die Patterns der Sprache (Modul 5) flexibler.`,
  quiz: { q: 'Wann liefert «Demand.kr(trig, 0, Dseq([...], inf))» einen neuen Wert?', o: ['Bei jedem Trigger an trig', 'Einmal pro Sekunde', 'In jedem Audioblock', 'Nur beim Erzeugen des Synths'], e: 'Demand fordert bei jedem Trigger den nächsten Wert von seinen D-UGens an.' },
  ch: { task: 'Eine Melodie, im Server sequenziert mit «Demand» und «Dseq».', checks: ['Verwendet «Demand»', 'Verwendet «Dseq»', 'Es klingt'], hint: 'Beginne mit Beispiel 1 und ändere die Noten.' } },
l20: { t: 'Ein- und Ausgänge', s: 'MIDI, Maus, Mikrofon und Aufnahme.',
  cells: { c1: 'ein MIDIdef', c2: 'MIDI verbinden', c3: 'Maustaste', c4: 'Mikrofon', c5: 'aufnehmen' },
  body: R`Mit **MIDIdef** registrierst du eine Funktion, die auf MIDI-Nachrichten reagiert. Hier löst jede Note einen Synth aus. Spiele nach dem Ausführen auf der Bildschirmtastatur (oder deiner Computertastatur):

[[c1]]

Hast du eine MIDI-Tastatur und nutzt Chrome oder Edge, verbinde sie:

[[c2]]

Auch die Maus ist ein Controller: Position und Taste.

[[c3]]

«SoundIn» liest das Mikrofon. Der Browser fragt nach der Erlaubnis. **Nutze Kopfhörer**, um Rückkopplungen zu vermeiden.

[[c4]]

«s.record» nimmt alles auf, was klingt; «s.stopRecording» lädt eine WAV-Datei herunter.

[[c5]]

!! Im Desktop-SuperCollider kannst du außerdem OSC nutzen, um mit anderen Programmen zu sprechen (Processing, Pure Data, TouchDesigner). Im Browser gibt es das nicht, MIDI aber schon.`,
  quiz: { q: 'Welche Argumente erhält die Funktion von «MIDIdef.noteOn»?', o: ['Frequenz und Amplitude', 'Anschlagstärke und Notennummer (und Kanal)', 'nur die Notennummer', 'Zeit und Dauer'], e: 'Die Reihenfolge ist (val, num, chan, src): Bei noteOn ist val die Anschlagstärke und num die Note.' },
  ch: { task: 'Schreibe ein «MIDIdef», das bei jeder Taste etwas spielt, und spiele auf der Bildschirmtastatur.', checks: ['Ein MIDIdef ist aktiv', 'Es klingt'], hint: 'Beginne mit Beispiel 1. Die Bildschirmtastatur erscheint unter diesem Beispiel.' } },
l21: { t: 'Routinen und Uhren', s: 'Musikalische Zeit: fork, wait und TempoClock.',
  cells: { c1: 'eine Routine', c2: 'eine Endlosschleife', c3: 'stoppen', c4: 'Tempo', c5: 'Routine als Stream' },
  body: R`Bisher geschah alles sofort. Um Ereignisse in der Zeit zu ordnen, nutzt SuperCollider **Routinen**: Funktionen, die mit «wait» pausieren können. «fork» erzeugt eine Routine und startet sie auf der Standarduhr.

Ein Ereignis wie «(degree: 3).play» spielt eine Note mit dem Standardinstrument. Das werden wir oft benutzen.

[[c1]]

[[c2]]

[[c3]]

Wartezeiten werden in **Schlägen** der Uhr gemessen. Änderst du das Tempo von «TempoClock.default», ändert sich die Geschwindigkeit von allem, was darauf läuft:

[[c4]]

Eine Routine ist auch ein **Stream**: Jedes «next» führt sie bis zum nächsten «yield».

[[c5]]

!! Ein «loop» ohne «wait» blockiert den Interpreter. Diese App erkennt das und bricht mit einem Fehler ab, im Desktop-SuperCollider müsstest du neu starten.`,
  quiz: { q: 'Wie lange dauert «1.wait» in Sekunden bei «TempoClock.default.tempo = 2»?', o: ['2 Sekunden', '1 Sekunde', '0,5 Sekunden', 'Hängt von der Samplerate ab'], e: 'tempo = 2 bedeutet 2 Schläge pro Sekunde (120 BPM): Ein Schlag dauert 0,5 s.' },
  ch: { task: 'Eine Routine, die **mindestens 8 Noten** spielt, mit «wait» dazwischen.', checks: ['Verwendet «wait»', 'Mindestens 8 Noten erklingen'], hint: '«fork { 8.do { |i| (degree: i).play; 0.25.wait } }».' } },
l22: { t: 'Patterns: Pbind', s: 'Musik als Regeln schreiben.',
  cells: { c1: 'eine Tonleiter', c2: 'Rhythmus und Zufall', c3: 'ein Stream', c4: 'Akkorde', c5: 'Molltonleiter' },
  body: R`Ein **Pattern** beschreibt eine Wertefolge, ohne sie auszuführen. «Pbind» verbindet Schlüssel und Patterns zu **Events** (Noten). Die häufigsten Schlüssel: «degree» (Skalenstufe), «dur» (Dauer in Schlägen), «legato», «amp», «octave», «scale» und «instrument».

[[c1]]

«Pseq» durchläuft eine Liste; «Prand» wählt zufällig; «Pwhite» erzeugt Zahlen zwischen zwei Grenzen. Patterns lassen sich frei verschachteln und kombinieren.

[[c2]]

Ein Pattern ist ein Rezept. «asStream» macht daraus einen Stream, von dem du Werte abrufen kannst:

[[c3]]

Ist ein Wert ein Array, wird das Event zu einem **Akkord**:

[[c4]]

[[c5]]

!! Schau ins **Ereignisse**-Panel des Monitors: Jede Note erscheint als Rechteck in einer Piano-Roll. So siehst du am besten, was ein Pattern tut.`,
  quiz: { q: 'Was gibt der Schlüssel «dur» in einem Pbind an?', o: ['Die Klangdauer in Sekunden', 'Die Zeit bis zum nächsten Event, in Schlägen', 'Die Lautstärke', 'Die Anzahl der Wiederholungen'], e: 'dur ist der Abstand zwischen Events in Schlägen. Die tatsächliche Notenlänge hängt zusätzlich von legato ab.' },
  ch: { task: 'Ein «Pbind», das **8 Noten** in einer **Molltonleiter** spielt.', checks: ['Verwendet «Pbind»', 'Verwendet eine Tonleiter (Scale.minor…)', '8 Noten erklingen'], hint: 'Sieh dir Beispiel 5 an.' } },
l23: { t: 'Pdef, Ppar und eigene Instrumente', s: 'Die Musik ändern, während sie läuft.',
  cells: { c1: 'ein Instrument', c2: 'Pdef', c3: 'live ersetzen', c4: 'stoppen', c5: 'Ppar' },
  body: R`Patterns können mit dem Schlüssel «instrument» eigene SynthDefs verwenden. Dieses nutzt «Pluck» und gibt sich dank «DetectSilence» selbst frei, wenn der Klang verklungen ist.

[[c1]]

«Pdef» gibt einem Pattern einen Namen und erlaubt, es **während des Spielens zu ersetzen**: Die Änderung greift auf dem nächsten Schlag, ohne Unterbrechung. Die Grundlage des Live Codings mit Patterns.

[[c2]]

[[c3]]

[[c4]]

«Ppar» spielt mehrere Patterns parallel: zum Beispiel Bass und Melodie.

[[c5]]

!! Hat ein Instrument kein «gate», muss es sich selbst freigeben (doneAction oder DetectSilence). Hat es eines, schickt das Pattern am Ende jeder Note gate 0.`,
  quiz: { q: 'Was passiert, wenn du «Pdef(\\mel, ...)» während des Spielens mit einem neuen Pattern erneut auswertest?', o: ['Alles stoppt', 'Beide Patterns spielen gleichzeitig', 'Es gibt einen Fehler', 'Das neue Pattern ersetzt das alte ohne Unterbrechung'], e: 'Pdef ist ein Proxy: Der Player läuft weiter und übernimmt beim nächsten Event die neue Quelle.' },
  ch: { task: 'Spiele **zwei gleichzeitige Stimmen** mit «Ppar».', checks: ['Verwendet «Ppar»', 'Mindestens 6 Noten erklingen'], hint: 'Sieh dir Beispiel 5 an.' } },
l24: { t: 'Algorithmen: Zufall, Irrfahrten und Ketten', s: 'Stochastische Komposition.',
  cells: { c1: 'Irrfahrt', c2: 'gewichteter Zufall', c3: 'Markow-Kette', c4: 'Seeds' },
  body: R`Nicht jeder Zufall klingt gleich. Eine **Irrfahrt** («Pbrown») bewegt sich in kleinen Schritten: Sie erzeugt Melodien mit Richtung. **Gewichteter** Zufall («Pwrand») macht manche Möglichkeiten wahrscheinlicher als andere.

[[c1]]

[[c2]]

Eine **Markow-Kette** wählt den nächsten Zustand anhand des aktuellen. Hier kann jede Note nur zu bestimmten Noten gehen: Das Ergebnis hat einen erkennbaren Stil.

[[c3]]

Und mit einem Seed wird Zufall reproduzierbar:

[[c4]]

!! Kombiniere bei langen generativen Stücken Ebenen: Zufall für Details, feste Struktur (Pseq, Pn) für die Form.`,
  quiz: { q: 'Was kennzeichnet eine mit «Pbrown» erzeugte Melodie?', o: ['Jede Note liegt nahe an der vorherigen', 'Alle Noten sind gleich wahrscheinlich', 'Sie wiederholt immer dieselbe Note', 'Sie nutzt nur tiefe Noten'], e: 'Pbrown ist eine Brownsche Bewegung: Jeder Wert entfernt sich höchstens um «step» vom vorherigen.' },
  ch: { task: 'Eine Melodie, die mit «Pbrown» **umherwandert**.', checks: ['Verwendet «Pbrown»', 'Mindestens 8 Noten erklingen'], hint: '«Pbind(\\degree, Pbrown(0, 14, 2, 16), \\dur, 0.15).play».' } },
l25: { t: 'JITLib: Ndef und ProxySpace', s: 'Programmieren, während es klingt.',
  cells: { c1: 'ein Ndef', c2: 'mit Überblendung neu definieren', c3: 'Argumente und set', c4: 'Proxys verketten', c5: 'ProxySpace', c6: 'aufräumen' },
  body: R`**JITLib** (Just In Time Library) erlaubt, das Programm zu ändern, während es läuft. Ein «Ndef» ist ein **Proxy**: ein benannter Ort für eine Klangquelle. Definierst du ihn neu, ersetzt die neue Quelle die alte mit einer **Überblendung** von «fadeTime» Sekunden.

[[c1]]

[[c2]]

Die Argumente der Funktion lassen sich mit «set» ändern und bleiben erhalten, auch wenn du die Quelle neu definierst:

[[c3]]

Ein Ndef kann mit «Ndef.ar(\name)» einen anderen lesen: So baust du einen modularen Patch, den du live umverkabeln kannst.

[[c4]]

«ProxySpace» macht dasselbe mit kürzerer Syntax: Jede Variable «~name» wird zum Proxy.

[[c5]]

[[c6]]

!! Setze bei einem Auftritt «fadeTime» auf 2 bis 8 Sekunden: Deine Fehler werden zu Übergängen.`,
  quiz: { q: 'Was passiert, wenn du einen klingenden Ndef neu definierst?', o: ['Er bricht ab und beginnt neu', 'Fehler, weil er schon existiert', 'Die neue Quelle ersetzt die alte mit einer Überblendung', 'Beide spielen für immer'], e: 'Der Proxy behält Bus und Monitor; nur die Quelle wechselt, mit einer Blende von fadeTime Sekunden.' },
  ch: { task: 'Spiele einen «Ndef» und **definiere ihn mindestens zweimal neu**, während er klingt.', checks: ['Der Ndef hat 3 oder mehr Versionen', 'Es klingt'], hint: 'Führe «Ndef(\\x, { ... }).play» aus, ändere dann den Inhalt der Funktion und führe erneut aus.' } },
l26: { t: 'SCTweets: die Kunst des kompakten Codes', s: '140 Zeichen Klang.',
  cells: { c1: 'atmende Akkorde', c2: 'Tropfen im Raum', c3: 'Dreieckssequenz', c4: 'Xenakis für die Hosentasche' },
  body: R`2009 begann die SuperCollider-Community, vollständige Stücke zu teilen, die in einen Tweet passten: **140 Zeichen**. **SCTweets** sind ein Spiel, aber auch eine Schule: Sie zwingen dich, Mehrkanal-Expansion, Syntax-Abkürzungen und UGens, die mit wenig viel erreichen, genau zu kennen.

Ein paar Tricks: «play{ }» statt «{ }.play», «!8» zum Vervielfachen von Stimmen, «(1..8)» für Reihen, Ein-Buchstaben-Variablen und keine Leerzeichen.

[[c1]]

[[c2]]

[[c3]]

[[c4]]

!! Der Zähler der Aufgabe zählt Zeichen ohne führende und abschließende Leerzeichen. Bist du darüber, entferne zuerst Leerzeichen und führende Nullen.`,
  quiz: { q: 'Was entspricht «play{ SinOsc.ar }»?', o: ['«SinOsc.play»', '«play(SinOsc)»', '«SinOsc.ar.play(0)»', '«{ SinOsc.ar }.play»'], e: 'Funktionale Syntax mit nachgestellter Funktion: «play{...}» schickt die Nachricht play an die Funktion.' },
  ch: { task: 'Dein **SCTweet**: ein klingendes Stück in **höchstens 140 Zeichen**.', checks: ['Höchstens 140 Zeichen', 'Es klingt'], hint: 'Beginne mit einem Beispiel und vereinfache es. «play{Splay.ar(SinOsc.ar((1..5)*99,0,0.1))}» hat 41 Zeichen.' } },
l27: { t: 'Alternative Stimmungen', s: 'Gleichstufige Stimmung, reine Stimmung und andere Oktavteilungen.',
  cells: { c1: 'temperierter Akkord', c2: 'reiner Akkord', c3: 'reine Tonleiter', c4: '19-EDO', c5: 'japanische Tonleitern' },
  body: R`Das Klavier nutzt die zwölfstufige **gleichstufige Stimmung** (12-TET): Jeder Halbton ist die zwölfte Wurzel aus 2. Ein Kompromiss: Außer der Oktave ist kein Intervall akustisch rein. Die **reine Stimmung** nutzt ganzzahlige Verhältnisse (3/2, 5/4…). Höre den Unterschied zwischen diesen beiden Durakkorden: Der reine hat keine Schwebungen.

[[c1]]

[[c2]]

«Scale» akzeptiert Stimmungen («Tuning»): «Scale.major(\just)» ist eine reine Durtonleiter.

[[c3]]

Du kannst die Oktave auch mit «stepsPerOctave» in eine andere Zahl von Teilen teilen. 19-EDO hat fast reine kleine Terzen:

[[c4]]

SuperCollider bringt Tonleitern vieler Musiktraditionen mit, darunter japanische, chinesische und indische. Hier zwei japanische pentatonische Tonleitern:

[[c5]]`,
  quiz: { q: 'Welches Frequenzverhältnis entspricht einer reinen Quinte?', o: ['5/4', '3/2', '4/3', '2/1'], e: '3/2 ist die reine Quinte; 5/4 die große Terz; 4/3 die Quarte; 2/1 die Oktave.' },
  ch: { task: 'Spiele eine Melodie in einer Stimmung, die **nicht** 12-TET ist (rein, pythagoreisch oder anderes «stepsPerOctave»).', checks: ['Verwendet eine andere Stimmung', 'Mindestens 5 Noten erklingen'], hint: 'Sieh dir die Beispiele 3 und 4 an.' } },
l28: { t: 'Sonifikation von Daten', s: 'Zahlen hören.',
  cells: { c1: 'Daten zu Tonhöhe', c2: 'mehrere Dimensionen', c3: 'kontinuierliche Sonifikation' },
  body: R`**Sonifizieren** heißt, Daten systematisch in Klang zu verwandeln, um sie zu hören: Trends, Ausreißer, Rhythmen. Die Grundtechnik ist das **Parameter-Mapping**: Jede Dimension der Daten steuert eine Dimension des Klangs (Tonhöhe, Zeit, Lautstärke, Panorama, Klangfarbe).

«linlin» und «linexp» übersetzen einen Bereich in einen anderen. Für Tonhöhen nimm «linexp», weil wir Frequenz logarithmisch wahrnehmen.

[[c1]]

[[c2]]

Daten können auch eine kontinuierliche Hüllkurve werden:

[[c3]]

!! Wähle das Mapping bewusst: Was in den Daten steigt, sollte im Klang steigen. Und biete immer eine Referenz (ein Grundton, ein Puls), damit man vergleichen kann.`,
  quiz: { q: 'Warum eignet sich «linexp» besser, um Daten auf Frequenzen abzubilden?', o: ['Weil es schneller zu berechnen ist', 'Weil es negative Zahlen vermeidet', 'Weil wir Tonhöhe logarithmisch wahrnehmen', 'Weil Daten immer exponentiell sind'], e: 'Gleiche Abstände auf einer exponentiellen Skala hören wir als gleiche Intervalle.' },
  ch: { task: 'Sonifiziere ein Array mit **mindestens 10 Werten** mit «linlin» oder «linexp».', checks: ['Verwendet linlin, linexp oder explin', 'Mindestens 10 Noten erklingen'], hint: 'Erfinde eigene Daten oder nutze «~data» aus Beispiel 1.' } },
l29: { t: 'Verräumlichung', s: 'Klänge platzieren und bewegen.',
  cells: { c1: 'bewegtes Panorama', c2: 'Entfernung', c3: 'Doppler-Effekt', c4: 'Stereobreite' },
  body: R`Im Stereo steuert der Pegelunterschied zwischen den Kanälen die seitliche Position («Pan2»). Öffne den **X/Y**-Modus des Oszilloskops: Du siehst, wie sich das Bild bewegt.

[[c1]]

**Entfernung** nehmen wir an mehreren Hinweisen zugleich wahr: weniger Lautstärke, weniger Höhen und mehr Hall im Verhältnis zum Direktschall. MouseY steuert die Entfernung, MouseX die Richtung:

[[c2]]

Ein Objekt, das nahe vorbeifährt, ändert durch den **Doppler-Effekt** seine Tonhöhe. Modelliert wird das mit einer variablen Verzögerung («DelayL»): Verzögerungszeit = Entfernung geteilt durch Schallgeschwindigkeit.

[[c3]]

«Splay» mit variablem «spread» öffnet oder schließt das Stereobild:

[[c4]]

!! Für Mehrkanal (Quadro, Ambisonics) hat das Desktop-SuperCollider PanAz, BiPanB2 und Bibliotheken wie das ATK. Die Logik ist dieselbe wie im Stereo.`,
  quiz: { q: 'Welcher Hinweis hilft NICHT, einen Klang als weit entfernt wahrzunehmen?', o: ['Geringere Lautstärke', 'Weniger Höhen', 'Mehr relativer Hall', 'Höhere Grundfrequenz'], e: 'Die Tonhöhe hängt nicht von der Entfernung ab (außer beim Doppler-Effekt, wenn sich die Quelle bewegt).' },
  ch: { task: 'Bewege einen Klang mit «Pan2» und einem LFO durch das Stereofeld.', checks: ['Verwendet «Pan2»', 'Verwendet einen LFO', 'Es klingt'], hint: '«Pan2.ar(quelle, SinOsc.kr(0.3))».' } },
l30: { t: 'Maschinelles Hören', s: 'Der Computer hört zu.',
  cells: { c1: 'Hüllkurvenfolger', c2: 'Tonhöhenerkennung', c3: 'mit dem Mikrofon' },
  body: R`**Maschinelles Hören** gewinnt Informationen aus einem Signal: wie viel Energie («Amplitude»), welche Tonhöhe («Pitch»), wann ein Schlag beginnt. Damit kann ein System auf eine spielende Person reagieren: begleiten, nachahmen, antworten.

[[c1]]

«Pitch» schätzt die Grundfrequenz. Hier folgt ein Sinus der Melodie eine Quinte höher:

[[c2]]

Dasselbe mit deiner Stimme oder deinem Instrument über das Mikrofon (mit Kopfhörern):

[[c3]]

!! Das Desktop-SuperCollider bietet weitere FFT-basierte Analysewerkzeuge (zum Beispiel Onsets und MFCC). Dies ist nur der erste Schritt.`,
  quiz: { q: 'Was misst «Amplitude.kr(signal)»?', o: ['Die Amplitudenhüllkurve des Signals', 'Die Frequenz', 'Die Zahl der Obertöne', 'Die Stereoposition'], e: 'Ein Hüllkurvenfolger mit einstellbaren Attack- und Release-Zeiten.' },
  ch: { task: 'Nutze «Amplitude», damit ein Klang auf einen anderen reagiert.', checks: ['Verwendet «Amplitude»', 'Es klingt'], hint: 'Sieh dir Beispiel 1 an: Die Amplitude des Schlagzeugs bewegt das Filter.' } },
},
tips: [
  { t: 'Gesamtlautstärke senken', b: 'Stelle vor dem Experimentieren die Gesamtlautstärke auf -12 dB oder weniger. Ändern mit «s.volume» oder unter ⚙.' },
  { t: 'Ein Limiter am Ende', b: 'Wenn du live spielst oder mit Rückkopplung experimentierst, setze einen «Limiter» ans Ende der Kette. Deine Ohren werden es dir danken.' },
  { t: 'Strg + . ist dein Freund', b: 'Stoppt alle Klänge, Routinen und Patterns. Gewöhne dir an, es ohne Nachdenken zu drücken.' },
  { t: 'poll schaut in den Server', b: 'Signale leben im Server und lassen sich nicht mit postln ausgeben. «poll» tastet sie ab und schickt sie ins Post window.' },
  { t: 'postln und debug', b: '«postln» gibt aus und liefert denselben Wert zurück: Du kannst es mitten in einen Ausdruck setzen. «debug» fügt eine Beschriftung hinzu.' },
  { t: 'Schau dir deinen Graphen an', b: '«dumpUGens» listet die UGens einer SynthDef. In dieser App zeichnet das UGen-Graph-Panel außerdem jeden klingenden Synth samt Aktivität.' },
  { t: 'kr für Langsames', b: 'LFOs, Hüllkurven und Controls laufen mit Kontrollrate («kr»): einmal pro Block von 64 oder 128 Samples.' },
  { t: 'Einmal kompilieren', b: 'Definiere deine Instrumente zu Beginn mit SynthDef und erzeuge dann Synths. «{ }.play» ist bequem zum Testen, kompiliert aber jedes Mal.' },
  { t: '{ }.play zum Skizzieren', b: 'Für schnelle Ideen ist «{ }.play» perfekt. Gefällt dir der Klang, mach eine SynthDef mit Argumenten daraus.' },
  { t: 'Ein Block, eine Idee', b: 'Gruppiere Code in Klammern «( … )» und führe ihn mit Strg + Enter aus. Ein Block pro Idee macht deine Dateien live gut spielbar.' },
  { t: 'Benannte Argumente', b: 'Schreibe «freq:» und «mul:», statt dich auf die Reihenfolge zu verlassen. Der Code liest sich besser und Fehler sind seltener.' },
  { t: 'Rand im Server, rrand in der Sprache', b: '«rrand» wird beim Kompilieren einer SynthDef einmal ausgewertet. Damit jeder Synth anders ist, nutze «Rand», «ExpRand» oder «TRand».' },
  { t: 'Gleichanteil entfernen', b: 'Chaotische Quellen, asymmetrische Verzerrung und manche Oszillatoren haben DC. «LeakDC.ar» entfernt ihn, ohne den Klang zu ändern.' },
  { t: 'Viele Stimmen, Splay', b: 'Zum Mischen vieler Stimmen verteilt «Splay» sie im Stereo und gleicht den Pegel aus. Viel besser, als alles mono zu summieren.' },
  { t: 'In dB denken', b: 'Unser Gehör ist logarithmisch. «dbamp» und «ampdb» rechnen zwischen Dezibel und Amplitude um: -6 dB ist die Hälfte.' },
  { t: 'Lange fadeTime', b: 'Beim Live Coding mit Ndef macht eine «fadeTime» von mehreren Sekunden aus jeder Änderung einen musikalischen Übergang.' },
  { t: 'Pdef für Wechsel ohne Bruch', b: 'Mit Pdef kannst du ein Pattern umschreiben, während es spielt: Die Änderung greift auf dem nächsten Schlag.' },
  { t: 'In BPM denken', b: 'Das Tempo von TempoClock ist in Schlägen pro Sekunde: «128/60» sind 128 BPM.' },
  { t: 'wait in einer Routine', b: '«wait» funktioniert nur in «fork» oder «Routine». Siehst du «yield was called outside of a Routine», packe deinen Code ein.' },
  { t: 'Seeds für den Zufall', b: 'Setze «thisThread.randSeed» am Anfang eines generativen Stücks, um eine gelungene Version wiederholen zu können.' },
  { t: 'gate und doneAction', b: 'Ein gehaltenes Instrument braucht «gate» und eine Hüllkurve mit Sustain; ein perkussives «doneAction: 2». Sonst stapeln sich die Synths.' },
  { t: 'Benannte Controls', b: '«\\freq.kr(440, 0.1)» erzeugt einen Control namens freq mit 0,1 s Glättung, ohne Argumente zu deklarieren.' },
  { t: 'Hüllkurven testen', b: '«Env.plot» zeichnet sie, «Env.test» spielt sie mit einem Sinus. Passe Kurven an, bis Attack und Abklingen natürlich klingen.' },
  { t: 'Chorus gratis', b: 'Zwei leicht verstimmte Oszillatoren auf verschiedenen Kanälen («[440, 441]») erzeugen langsame Schwebungen und ein breites Stereobild.' },
],
ref: {
  SinOsc: 'Wavetable-Sinusoszillator. Die Grundlage fast aller Dinge.', FSinOsc: 'Sehr effizienter Sinus (Resonator), ohne Phasenmodulation.', SinOscFB: 'Sinus mit Phasenrückkopplung: vom Sinus zu etwas Sägezahnartigem.',
  Saw: 'Bandbegrenzter Sägezahn. Alle Obertöne, 1/n.', Pulse: 'Bandbegrenzter Puls mit variabler Breite.', LFSaw: 'Nicht bandbegrenzter Sägezahn, ideal als LFO.', LFPulse: 'Nicht bandbegrenzter Puls, Ausgang 0 bis 1. Rhythmen und Gates.', LFTri: 'Nicht bandbegrenztes Dreieck.', LFPar: 'Günstige Parabelwelle (fast Sinus).', LFCub: 'Günstige kubische Welle (fast Sinus).', VarSaw: 'Dreieck/Sägezahn mit variabler Flanke.', SyncSaw: 'Hart synchronisierter Sägezahn.', Blip: 'Impulsfolge mit kontrollierter Obertonzahl.', Formant: 'Formantoszillator (Grundton, Formant und Breite).', PMOsc: 'Phasenmodulation: Träger, Modulator und Index.', Klang: 'Bank von Sinusoszillatoren.', Impulse: 'Periodische Ein-Sample-Impulse. Der Trigger schlechthin.',
  WhiteNoise: 'Weißes Rauschen: gleiche Energie pro Frequenz.', PinkNoise: 'Rosa Rauschen: gleiche Energie pro Oktave.', BrownNoise: 'Braunes Rauschen: dunkler.', GrayNoise: 'Graues Rauschen (Bit-Umschaltung).', ClipNoise: 'Rauschen aus Werten -1 oder 1.', Dust: 'Zufällige Impulse (0 bis 1) mit mittlerer Dichte.', Dust2: 'Bipolare Zufallsimpulse.', LFNoise0: 'Gestufte Zufallswerte.', LFNoise1: 'Zufallswerte mit linearer Interpolation.', LFNoise2: 'Zufallswerte mit weicher Interpolation.', LFClipNoise: 'Gestufte Zufallswerte -1 oder 1.', Crackle: 'Chaotisches Knistern.', Logistic: 'Logistische Abbildung: von Ordnung zu Chaos.', HenonN: 'Hénon-Abbildung ohne Interpolation.', Gendy1: 'Dynamische stochastische Synthese nach Xenakis.',
  RLPF: 'Resonanter Tiefpass (Grenzfrequenz und rq).', RHPF: 'Resonanter Hochpass.', LPF: 'Tiefpass 2. Ordnung.', HPF: 'Hochpass 2. Ordnung.', BPF: 'Bandpass.', BRF: 'Bandsperre (Notch).', Resonz: 'Bandpass-Resonator mit konstanter Verstärkung.', Ringz: 'Resonator, der bei Impulsen nachklingt (Abklingzeit in Sekunden).', Formlet: 'Resonator mit Attack und Abklingen.', MoogFF: 'Moog-artiges Kaskadenfilter.', MidEQ: 'Parametrischer Glocken-EQ.', BLowShelf: 'Tiefen-Kuhschwanz-EQ.', BHiShelf: 'Höhen-Kuhschwanz-EQ.', OnePole: 'Einpoliges Filter (Glättung).', LeakDC: 'Entfernt den Gleichanteil.', Lag: 'Glättet abrupte Änderungen (Portamento).', Decay: 'Exponentielles Abklingen von Impulsen.', Decay2: 'Abklingen mit Attack: Hüllkurve für Impulse.', Slew: 'Begrenzt die Änderungsgeschwindigkeit.', Klank: 'Resonatorbank (Frequenzen, Amplituden, Abklingzeiten).',
  DelayN: 'Verzögerung ohne Interpolation.', DelayL: 'Verzögerung mit linearer Interpolation (zum Modulieren).', DelayC: 'Verzögerung mit kubischer Interpolation.', CombN: 'Echo mit Rückkopplung.', CombL: 'Interpoliertes Echo mit Rückkopplung.', AllpassN: 'Allpass: Diffusion für Hall.', AllpassC: 'Interpolierter Allpass.', FreeVerb: 'Freeverb-Hall (Mischung, Raum, Dämpfung).', FreeVerb2: 'Stereo-Freeverb.', GVerb: 'Stereo-Hall für große Räume.', PitchShift: 'Granularer Echtzeit-Pitchshifter.', Pluck: 'Gezupfte Saite nach Karplus-Strong.', LocalIn: 'Liest die interne Rückkopplung des Synths.', LocalOut: 'Schreibt die interne Rückkopplung des Synths.',
  Env: 'Hüllkurvenform: Pegel, Zeiten und Kurven.', EnvGen: 'Spielt eine Env ab; gate und doneAction.', Line: 'Lineare Rampe.', XLine: 'Exponentielle Rampe.', Linen: 'Einfache Trapez-Hüllkurve mit gate.', DetectSilence: 'Erkennt Stille und kann den Synth freigeben.',
  Latch: 'Sample & Hold.', TRand: 'Zufallswert bei jedem Trigger.', TIRand: 'Zufällige Ganzzahl bei jedem Trigger.', TExpRand: 'Exponentieller Zufallswert pro Trigger.', Rand: 'Zufallswert beim Start des Synths.', ExpRand: 'Exponentieller Zufallswert beim Start des Synths.', IRand: 'Zufällige Ganzzahl beim Start des Synths.', Stepper: 'Trigger-Zähler mit Grenzen.', PulseCount: 'Zählt Trigger.', PulseDivider: 'Teilt die Anzahl der Trigger.', ToggleFF: 'Wechselt bei jedem Trigger zwischen 0 und 1.', Trig: 'Hält den Triggerwert eine Zeit lang.', Trig1: 'Puls fester Länge pro Trigger.', Sweep: 'Rampe, die ein Trigger zurücksetzt.', Phasor: 'Zyklische Rampe zwischen zwei Werten.', CoinGate: 'Lässt Trigger mit einer Wahrscheinlichkeit durch.', Select: 'Wählt per Index ein Signal aus einem Array.',
  Demand: 'Fordert bei jedem Trigger Werte von D-UGens an.', Duty: 'Durchläuft eine Folge mit Dauern.', TDuty: 'Wie Duty, gibt aber Trigger aus.', Dseq: 'Serverseitige Sequenz.', Drand: 'Serverseitige Zufallsauswahl.', Dxrand: 'Zufällig ohne Wiederholung des vorigen.', Dshuf: 'Gemischte Liste.', Dwhite: 'Zufallswerte in einem Bereich.', Dseries: 'Arithmetische Reihe.',
  Out: 'Schreibt auf einen Bus (Ausgang oder privat).', In: 'Liest einen Bus.', ReplaceOut: 'Ersetzt den Inhalt eines Busses.', OffsetOut: 'Samplegenaues Out.', SoundIn: 'Mikrofoneingang.', Pan2: 'Stereo-Panner mit konstanter Leistung.', LinPan2: 'Linearer Stereo-Panner.', Balance2: 'Balance eines Stereosignals.', Rotate2: 'Dreht ein zweikanaliges Schallfeld.', Splay: 'Verteilt ein Array von Stimmen im Stereo.', Mix: 'Summiert ein Array von Signalen.', XFade2: 'Überblendung mit konstanter Leistung.', MouseX: 'Horizontale Mausposition.', MouseY: 'Vertikale Mausposition.', MouseButton: 'Zustand der Maustaste.', Bus: 'Reserviert Audio- oder Kontrollbusse.',
  Amplitude: 'Hüllkurvenfolger.', Pitch: 'Schätzung der Grundfrequenz.', ZeroCrossing: 'Frequenz aus Nulldurchgängen.', Peak: 'Höchster Spitzenwert bis zum Reset.', RunningMax: 'Laufendes Maximum.', Limiter: 'Spitzenbegrenzer.', Compander: 'Kompressor / Expander / Gate.', Poll: 'Gibt den Wert eines Signals aus.',
  GrainSin: 'Sinuskörner pro Trigger.', GrainFM: 'FM-Körner pro Trigger.',
  SynthDef: 'Definiert ein benanntes Instrument.', Synth: 'Erzeugt und steuert einen Syntheseknoten.', Routine: 'Funktion, die mit wait/yield pausieren kann.', Task: 'Routine, die pausiert und fortgesetzt werden kann.', TempoClock: 'Uhr mit Tempo in Schlägen pro Sekunde.', Pbind: 'Verbindet Schlüssel und Patterns zu Events.', Pseq: 'Durchläuft eine Liste.', Prand: 'Wählt zufällig aus einer Liste.', Pxrand: 'Zufällig ohne Wiederholung.', Pwrand: 'Gewichteter Zufall.', Pshuf: 'Gemischte Liste.', Pwhite: 'Gleichverteilte Zufallszahlen.', Pexprand: 'Exponentielle Zufallszahlen.', Pbrown: 'Irrfahrt.', Pseries: 'Arithmetische Reihe.', Pgeom: 'Geometrische Reihe.', Pn: 'Wiederholt ein Pattern.', Pdup: 'Wiederholt jeden Wert n-mal.', Pfunc: 'Wert aus einer Funktion.', Pkey: 'Liest einen anderen Schlüssel des Events.', Ppar: 'Patterns parallel.', Pdef: 'Benanntes, live ersetzbares Pattern.', Ndef: 'Benannter Klang-Proxy (JITLib).', ProxySpace: 'Umgebung, in der ~x Proxys sind.', Scale: 'Tonleitern vieler Traditionen.', Tuning: 'Stimmungen (12-TET, rein, pythagoreisch, EDO).', MIDIdef: 'Reagiert auf MIDI-Nachrichten.', Array: 'Werteliste mit vielen Operationen.', Function: 'Verzögerter Code zwischen geschweiften Klammern.', Event: 'Wörterbuch, das sich selbst spielen kann (eine Note).', Operators: 'Rechen- und Umrechnungsoperatoren.',
},
labs: {
  osc: { t: 'Oszillatoren', d: 'Wellenformen, Obertöne und Panorama. Sieh, wie sich Oszilloskop und Spektrum ändern.', tip: 'Aktiviere MouseX → freq und fahre über den Bildschirm. Erhöhe bei Blip die Obertöne und beobachte das Spektrum.' },
  sub: { t: 'Subtraktiver Synthesizer', d: 'Oszillator, resonantes Filter, ADSR-Hüllkurve und LFO, mit Tastatur. Der Code ist eine vollständige SynthDef.', tip: 'Spiele auf der Bildschirmtastatur oder dem Computer (Reihe A–K). Aktiviere das Arpeggio und bewege die Grenzfrequenz beim Spielen.' },
  fm: { t: 'FM-Synthese', d: 'Träger, Verhältnis und Index. Seitenbänder erscheinen im Spektrum.', tip: 'Ganzzahlige Verhältnisse: harmonische Klangfarben. 1.414 oder 3.5: Glocken. Mit Hüllkurve auf dem Index klingt es perkussiv.' },
  add: { t: 'Additive Synthese', d: 'Sechzehn Obertöne, die du mit der Maus zeichnest, wie die Zugriegel einer Orgel.', tip: 'Probiere die Presets und spreize dann die Reihe: Bei Werten ungleich 1 werden die Teiltöne unharmonisch.' },
  env: { t: 'Hüllkurven-Editor', d: 'Zeichne eine Env, indem du Punkte ziehst. Der Code «Env(...)» aktualisiert sich selbst.', tip: 'Doppelklick fügt einen Punkt hinzu. Eine negative Kurve ergibt schnelle Attacks und natürliches Abklingen.' },
  seq: { t: 'Pattern-Sequenzer', d: 'Sechzehn Schritte und acht Skalenstufen. Daraus wird ein Pbind in einem Pdef.', tip: 'Mehrere Felder im selben Schritt ergeben einen Akkord. Wechsle die Tonleiter ohne Stopp: Pdef übernimmt sie im nächsten Takt.' },
  gran: { t: 'Granular', d: 'Wolken aus Sinus- oder FM-Körnern. Dichte, Größe, Tonhöhe und Streuung.', tip: 'Schau aufs Sonogramm (SONO). Körner unter 5 ms verlieren die Tonhöhe; mit Impulse statt Dust entstehen Formanten.' },
  tune: { t: 'Stimmung', d: 'Teile die Oktave in N Teile und vergleiche sie mit reinen Intervallen.', tip: '12, 19, 31 und 53 EDO kommen den reinen Intervallen sehr nahe. Vergleiche die drei Akkorde.' },
  fx: { t: 'Effektkette', d: 'Sättigung, Echo, Filter und Hall auf verschiedenen Quellen.', tip: 'Die Reihenfolge zählt: Sättigung vor dem Echo klingt anders als danach. Probiere es im Code.' },
  chaos: { t: 'Chaos und nicht-standardisierte Synthese', d: 'Gendy1, chaotische Abbildungen und gestuftes Rauschen.', tip: 'Erhöhe das Chaos langsam: Es gibt Zonen, in denen der Klang sich ordnet, und andere, in denen er explodiert.' },
},
};
})();
