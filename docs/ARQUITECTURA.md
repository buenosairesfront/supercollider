# Arquitectura

Todo es JavaScript plano, sin build ni dependencias. Los archivos se cargan como scripts clásicos (también funciona desde `file://`).

```
index.html
css/app.css            estilo U-MA (paneles tipo ficha técnica, magenta/cian/amarillo)
js/dsp.js              motor de síntesis: UGens + Server (corre en el AudioWorklet y en el hilo principal)
js/worklet.js          AudioWorkletProcessor que envuelve SCDSP.Server
js/engine.js           AudioContext, worklet o ScriptProcessor, analizadores, grabación WAV, render offline
js/lang.js             lexer, parser y evaluador (generadores) de sclang
js/sclib.js            biblioteca: objetos, matemática, UGens, Env, SynthDef, Synth, Server, Bus
js/patterns.js         relojes, Routine, patterns y streams, eventos, Scale/Tuning, Pdef, Ndef, ProxySpace, MIDI
js/editor.js           editor con resaltado y atajos del IDE
js/viz.js              monitor: scope/FFT/XY/sonograma, medidores, grafo de UGens, árbol de nodos, eventos, plots, post window
js/labs.js             los 10 laboratorios
js/app.js              rutas, páginas, progreso, quizzes, desafíos, ajustes
content/course.js      estructura del curso: módulos, lecciones, código, checks, citas, consejos, referencia, ejemplos
content/<lang>.js      textos de la interfaz y del curso (es, en, de, zh, ja, hi)
sw.js, manifest.webmanifest, icons/   PWA
tests/                 harness en Node, test de todo el código del curso, chequeo de idiomas
```

## El intérprete (sclang)

- `lex` → tokens (números con `pi`, símbolos, `~env`, keywords `freq:`…). `parse` → AST con la gramática de sclang: precedencia **izquierda a derecha** para binarios, sintaxis funcional `msg(recv, …)`, funciones finales `5.do { }`, eventos, rangos, aplicación parcial `_`.
- El evaluador es un **generador** (`function* ev`): cualquier llamada puede suspenderse. Así `0.25.wait` funciona dentro de `do`, `collect`, `loop`, etc., a cualquier profundidad, y una `Routine` es sólo un generador que el planificador reanuda.
- Las clases se definen con `defClass(nombre, super, métodosDeInstancia, métodosDeClase)`. La búsqueda de métodos sube por la jerarquía; los métodos que reciben funciones son generadores para propagar `wait`.
- Errores con el formato de SuperCollider (`ERROR: Message 'x' not understood.`, `Variable 'x' not defined.`) y número de línea.
- Un límite de pasos corta los bucles infinitos sin `wait`.

## UGens y SynthDef

- Un UGen en el lenguaje es un `UGenNode` y sus salidas son `OutRef`. Las operaciones matemáticas con UGens crean `BinaryOpUGen`/`UnaryOpUGen` (con plegado de constantes). Los arrays como argumento producen **expansión multicanal**.
- `compileDef` evalúa la función del SynthDef con controles como argumentos, toma como raíces los UGens con efectos laterales (Out, Poll, doneAction ≥ 2…) y recorre el grafo para obtener un orden topológico. El resultado se serializa (`units`, `controls`) y se manda al servidor.
- `{ }.play` envuelve la salida en `Out`, con fade de entrada; `release` hace fade de salida y libera.

## El servidor (scsynth.js)

- `Server` tiene una lista ordenada de nodos, buses de audio (doble buffer: leer un bus que todavía no se escribió en el bloque devuelve el bloque anterior, como `InFeedback`), buses de control y una cola de mensajes con timestamp.
- Cada `Synth` instancia sus unidades: cada UGen es una fábrica `(u, ctx) => process(n)` que procesa bloques de 128 muestras.
- Mensajes: `d_recv`, `s_new`, `n_set`, `n_free`, `n_fade`, `freeAll`, `mouse`, `volume`, `limit`, `watch`, `c_set`. El servidor publica `status` (CPU, picos, nodos, niveles por UGen del synth observado) unas 20 veces por segundo.
- Salida con volumen maestro y recorte a 0 dBFS (protección auditiva, desactivable). Los valores NaN se silencian y se avisa.

## Tiempo

`Sched` despierta cada 15 ms (en un Web Worker para que no lo frene el navegador) y ejecuta lo que cae dentro de los próximos 120 ms. Cada rutina y cada `EventStreamPlayer` conoce su tiempo lógico, así que los mensajes al servidor llevan el **tiempo exacto** del AudioContext: el timing no depende de la carga de la página.

## Visualización

- Scope con disparo en el cruce por cero, FFT log, X/Y (Lissajous) y sonograma.
- Grafo de UGens dibujado en SVG por profundidad; el servidor informa el nivel de cada unidad del synth observado y los nodos se iluminan según la señal.
- Piano roll de eventos (`ui.note`) sincronizado con el reloj de audio.

## Tests

- `tests/harness.js` carga el motor y el intérprete en Node (`vm`) y avanza el tiempo de audio a mano.
- `tests/run-tests.js` ejecuta todos los bloques de código de las 30 lecciones y los ejemplos y falla si hay errores o silencio donde debería sonar.
- `tests/check-i18n.js` verifica que los 6 idiomas tengan todas las claves, lecciones, quizzes, desafíos, consejos, referencias y laboratorios.
