/* SuperCollider Lab · U-MA — Español (idioma base) */
(function () {
const R = String.raw;
(window.SC_LANG = window.SC_LANG || {}).es = {
ui: {
  nav_home: 'Inicio', nav_course: 'Curso', nav_labs: 'Laboratorio', nav_free: 'Código libre', nav_ref: 'Referencia', nav_tips: 'Consejos', nav_book: 'Libro',
  tagline: 'Aprendé SuperCollider en el navegador · U-MA',
  hero_1: 'SuperCollider', hero_2: 'en el navegador',
  hero_lead: 'Un curso completo de síntesis y programación musical con un motor de audio en tiempo real. Escribís código de SuperCollider, lo ejecutás y lo ves sonar: osciloscopio, espectro, grafo de UGens y línea de tiempo. Sin instalar nada.',
  start: 'Empezar', continue: 'Seguir', level: 'Nivel', lessons: 'lecciones', streak: 'Racha', days: 'días', modules: 'módulos', module: 'Módulo',
  try_now: 'Probalo ahora', try_title: 'Tu primer sonido', try_note: 'Hacé clic en ▶ o poné el cursor en el código y apretá Ctrl + Enter (Cmd + Enter en Mac). Para cortar: Ctrl + . o el botón STOP.',
  course_map: 'Mapa del curso', tip_day: 'Consejo del día', all_tips: 'Todos los consejos', reference_book: 'Libro de referencia',
  book_short: 'Este curso toma como referencia *The SuperCollider Book* (2.ª ed., MIT Press). Citamos frases breves con fines educativos. Si el libro te sirve, comprá un ejemplar: es la mejor manera de apoyar a sus autores.',
  book_read_more: 'Sobre el libro y aviso legal', buy_book: 'Comprar el libro', book_code: 'Código oficial del libro',
  badges: 'Insignias', badge_new: 'Nueva insignia', badge_sound: 'Primer sonido', badge_labs: 'Todos los laboratorios', badge_chall: '10 desafíos', badge_quiz: 'Todos los quizzes',
  levelup: 'Nivel {n}: {title}', lesson_done: 'Lección completada', completed: 'Completada', mark_done: 'Marcar como completada',
  course_intro: 'Siete módulos que van de tu primera línea de código a la escucha automática. Cada lección tiene ejemplos que podés editar y ejecutar, un quiz y un desafío que se corrige solo. El orden sigue la ruta que propone el libro para quienes empiezan: tutorial, UGens, composición, entradas y salidas, y después los temas avanzados.',
  book_ch: 'Libro, cap.', example: 'Ejemplo', run: 'Ejecutar', reset: 'Restaurar', copy: 'Copiar', copied: 'Copiado', open_free: 'Abrir en Código libre',
  pro_tip: 'Consejo pro', from_book: 'Del libro', free_tr: 'Traducción libre', book_more: 'sobre el libro',
  quiz: 'Pregunta rápida', challenge: 'Desafío', passed: 'superado', your_code: 'Tu código', criteria: 'Criterios', hint: 'Pista', challenge_ok: '¡Desafío superado!',
  at_line: 'en la línea', col: 'columna', stopped: 'todo detenido', rec_saved: 'Grabación guardada ({s} s, WAV)',
  mon_graph: 'Grafo de UGens', mon_tree: 'Árbol de nodos', mon_timeline: 'Eventos', mon_post: 'Post window', clear: 'Limpiar',
  mon_idle: 'servidor apagado · ejecutá código para encenderlo', tree_empty: 'sin synths sonando', tl_empty: 'los patterns y rutinas aparecen acá', nan_warn: 'Aviso: un synth produjo valores inválidos (NaN/inf) y se silenció. Revisá filtros con resonancia extrema o divisiones por cero.',
  labs_title: 'Laboratorio', labs_intro: 'Superficies de control que escriben código de SuperCollider en tiempo real. Mové un control y mirá cómo cambia el código; editá el código y escuchá el resultado. Cada laboratorio usa Ndef o Pdef, igual que en una sesión de live coding.',
  lab_live: 'EN VIVO', lab_code: 'Código generado', lab_codenote: 'El código se actualiza con cada control. Podés editarlo y ejecutarlo (▶ o Ctrl + Enter) o llevarlo a Código libre.', play: 'Tocar', stop: 'Parar', open: 'Abrir',
  c_wave: 'Forma de onda', c_freq: 'Frecuencia', c_amp: 'Amplitud', c_width: 'Ancho de pulso', c_harm: 'Armónicos', c_pan: 'Panorama', c_osc: 'Oscilador', c_filter: 'Filtro', c_cutoff: 'Corte', c_rq: 'rq (1/Q)', c_lfo: 'LFO', c_depth: 'Profundidad LFO', c_atk: 'Ataque', c_dec: 'Decaimiento', c_sus: 'Sostenido', c_rel: 'Relajación', c_detune: 'Desafinación', c_keys: 'Teclado (también teclas A W S E D F T G Y H U J K)', c_arp: 'Arpegio',
  c_ratio: 'Ratio', c_index: 'Índice', c_envidx: 'Envolvente en el índice', c_ratios: 'Ratios típicos', c_harmonics: 'Armónicos (arrastrá las barras)', c_stretch: 'Estiramiento', c_envdraw: 'Envolvente (arrastrá los puntos, doble clic agrega)', c_curve: 'Curva', c_delpt: 'Borrar punto', c_trigger: 'Disparar', c_loop: 'Repetir',
  c_steps: 'Pasos × grados de la escala', c_scale: 'Escala', c_instrument: 'Instrumento', c_tempo: 'Tempo', c_octave: 'Octava', c_legato: 'Legato', c_clear: 'Borrar', c_random: 'Al azar',
  c_density: 'Densidad', c_size: 'Tamaño de grano', c_spread: 'Dispersión', c_circle: 'Círculo de alturas (amarillo: intervalos justos)', c_edo: 'Divisiones de octava (EDO)', c_base: 'Frecuencia base', c_et_chord: 'Acorde 12-TET', c_just_chord: 'Acorde justo 4:5:6', c_edo_chord: 'Acorde en este EDO',
  c_source: 'Fuente', c_chain: 'Cadena de efectos', c_drive: 'Saturación', c_dtime: 'Tiempo de eco', c_decay: 'Decaimiento del eco', c_mix: 'Mezcla de reverb', c_room: 'Sala', c_algo: 'Algoritmo', c_chaos: 'Caos', c_volume: 'Volumen', c_tempo2: 'Tempo',
  free_title: 'Código libre', free_intro: 'Tu cuaderno de SuperCollider. Se guarda solo en este navegador. **Shift + Enter** ejecuta la línea, **Ctrl + Enter** ejecuta el bloque entre paréntesis, **Ctrl + .** corta todo. Probá los ejemplos o pegá código de una lección.',
  snippets: 'archivos', examples: 'Ejemplos', new: 'Nuevo', delete: 'Borrar', run_region: 'Ejecutar bloque', run_all: 'Ejecutar todo', untitled: 'Sin título', scratch: 'Borrador', from_lesson: 'Desde lección', sure: '¿Seguro?',
  keys_help: '**Shift + Enter**: ejecutar línea o selección · **Ctrl/Cmd + Enter**: ejecutar bloque ( … ) · **Ctrl/Cmd + .**: parar todo · **Ctrl/Cmd + D**: ayuda de la palabra bajo el cursor · **Tab**: indentar',
  ref_title: 'Referencia', ref_intro: 'Las clases y UGens que entiende este SuperCollider web, con su firma, una descripción corta y un ejemplo para probar. Los argumentos con nombre (por ejemplo «freq: 440») se pueden usar como en el SuperCollider de escritorio.', classes: 'clases', search: 'Buscar', try: 'Probar', no_results: 'Sin resultados.',
  cat_osc: 'Osciladores', cat_noise: 'Ruido y caos', cat_filter: 'Filtros y resonadores', cat_delay: 'Delays, reverbs y realimentación', cat_env: 'Envolventes', cat_trig: 'Disparadores y azar en el servidor', cat_demand: 'Demand', cat_io: 'Entradas, salidas y panorama', cat_analysis: 'Análisis y dinámica', cat_grain: 'Granular', cat_lang: 'Lenguaje, patterns y JITLib',
  tips_title: 'Consejos', tips_intro: 'Lo que la gente que usa SuperCollider todos los días aprendió a fuerza de práctica: seguridad auditiva, depuración, rendimiento, estilo, mezcla y live coding.',
  tcat_safe: 'Seguridad', tcat_debug: 'Depuración', tcat_perf: 'Rendimiento', tcat_style: 'Estilo', tcat_mix: 'Mezcla', tcat_live: 'Live coding', tcat_time: 'Tiempo', tcat_synth: 'Síntesis',
  disclaimer: 'Aviso legal', how_used: 'Cómo usamos el libro', quotes_used: 'Citas usadas en el curso', chapter_map: 'Mapa de capítulos ↔ lecciones', chapter: 'Capítulo',
  settings: 'Ajustes', language: 'Idioma', theme: 'Tema', th_system: 'Sistema', th_light: 'Claro', th_dark: 'Oscuro', audio: 'Audio', volume: 'Volumen general', limiter: 'Protección auditiva: recortar la salida a 0 dBFS',
  safety_note: 'Empezá con el volumen bajo y subilo de a poco. Con auriculares, más todavía.', progress: 'Progreso', export: 'Exportar', import: 'Importar', reset_progress: 'Borrar progreso', progress_note: 'El progreso, el XP y tus archivos se guardan en este navegador. Exportalos para pasarlos a otro dispositivo.', imported: 'Progreso importado', bad_file: 'Ese archivo no es un progreso de SuperCollider Lab.', shortcuts: 'Atajos', close: 'Cerrar',
  post_hello: 'Escribí código y ejecutalo con Ctrl + Enter. El primer sonido enciende el servidor.',
  footer_1: '**SuperCollider Lab** es una herramienta educativa de **Buenos Aires Front · U-MA**. Corre en tu navegador: un intérprete de un subconjunto de sclang escrito en JavaScript y un motor de síntesis tipo scsynth sobre Web Audio. SuperCollider es software libre (GPL) creado por James McCartney y mantenido por su comunidad: [supercollider.github.io](https://supercollider.github.io).',
  footer_disc: 'Proyecto independiente, sin afiliación con MIT Press, con los autores de *The SuperCollider Book* ni con el proyecto SuperCollider. Las citas del libro son breves, con atribución y con fines educativos. [Ver aviso legal completo](#/book).',
  err_gui: 'Las clases de GUI de SuperCollider (Window, Slider…) no están disponibles en la versión web. Probá los Laboratorios: son superficies de control que escriben código.',
  err_buf: 'Los buffers y la carga de archivos de audio no están disponibles en esta versión web: todo se sintetiza en vivo, sin cargar nada.',
  err_osc: 'OSC (NetAddr, OSCdef) no está disponible en el navegador. Usá MIDIdef con un teclado MIDI o el teclado en pantalla.',
  midi_none: 'Este navegador no tiene Web MIDI (probá Chrome o Edge). El teclado en pantalla dispara igual tus MIDIdef.', midi_denied: 'Permiso MIDI denegado.',
},
levels: ['Oyente', 'Aprendiz de UGens', 'Patcher', 'Sintetista', 'Programador/a de sonido', 'Diseñador/a de SynthDefs', 'Compositor/a algorítmico/a', 'Live coder', 'Arquitecto/a del servidor', 'Maestro/a SuperCollider', 'Leyenda de scsynth'],
mod: {
  m1: { t: 'Primeros pasos', d: 'El intérprete, la post window, mensajes, variables, funciones y arrays. Cómo piensa el lenguaje.' },
  m2: { t: 'El sonido: UGens', d: 'Osciladores, ruido, control, filtros, envolventes y expansión multicanal.' },
  m3: { t: 'Técnicas de síntesis', d: 'Aditiva, FM, modelado físico, efectos, microsonido y síntesis no estándar.' },
  m4: { t: 'El servidor', d: 'SynthDef y Synth, buses y efectos, Demand UGens, MIDI, mouse y micrófono.' },
  m5: { t: 'Tiempo y patterns', d: 'Rutinas y relojes, Pbind, Pdef, Ppar, escalas y algoritmos estocásticos.' },
  m6: { t: 'Live coding', d: 'JITLib con Ndef y ProxySpace, y la tradición de los SCTweets.' },
  m7: { t: 'Aplicaciones', d: 'Afinaciones alternativas, sonificación, espacialización y escucha automática.' },
},
les: {
l01: { t: 'Hola, SuperCollider', s: 'Cliente y servidor, la post window y tu primer sonido.',
  cells: { c1: 'post window', c2: 'encender el servidor', c3: 'una onda senoidal', c4: 'parar todo' },
  body: R`SuperCollider son en realidad **dos programas que conversan**: el lenguaje (**sclang**), que interpreta lo que escribís, y el servidor de síntesis (**scsynth**), que fabrica el sonido. El lenguaje le manda mensajes al servidor y el servidor responde con audio. En esta app pasa lo mismo: un intérprete de sclang escrito en JavaScript le habla a un motor de síntesis que corre en tu navegador.

Empecemos por lo más simple. Ejecutá esta línea con **Shift + Enter** (o el botón ▶). El resultado aparece en la **post window**, abajo a la derecha.

[[c1]]

La flecha «->» indica el valor que devolvió la expresión. «postln» además lo imprime. En el SuperCollider de escritorio, antes de hacer sonido hay que encender el servidor:

[[c2]]

Acá el servidor se enciende solo la primera vez que suena algo, pero conviene conocer «s.boot»: «s» es una variable que siempre apunta al servidor local. Ahora sí, sonido:

[[c3]]

Lo que está entre llaves «{ }» es una **función**. Al mandarle el mensaje «play», SuperCollider la convierte en un sintetizador y lo arranca en el servidor. Mirá el osciloscopio, el grafo de UGens y el árbol de nodos: ahí está tu synth.

!! Seguridad primero: empezá con el volumen de tu equipo bajo y subilo de a poco. En SuperCollider es fácil escribir un número de más y generar un sonido muy fuerte. Esta app recorta la salida a 0 dBFS (podés cambiarlo en ⚙).

Para cortar el sonido, el atajo universal es **Ctrl + .** (Cmd + . en Mac). También podés usar el botón STOP o liberar todos los nodos del servidor:

[[c4]]

[[q:intro]]`,
  quiz: { q: '¿Cuál de los dos programas fabrica el sonido?', o: ['sclang, el intérprete', 'scsynth, el servidor de síntesis', 'La post window', 'El editor de código'], e: 'El lenguaje (sclang) describe y envía; el servidor (scsynth) calcula las muestras de audio. Por eso podés tener el servidor en otra máquina, o en este caso dentro del navegador.' },
  ch: { task: 'Hacé sonar una onda senoidal de **220 Hz** con amplitud **0.1**. Ejecutá tu código y, cuando termines, cortalo con Ctrl + .', checks: ['Usa «SinOsc»', 'La frecuencia es 220', 'Suena'], hint: 'Copiá el ejemplo 3 y cambiá 440 por 220.' } },

l02: { t: 'Mensajes, argumentos y anidamiento', s: 'Receptor.mensaje(argumentos) y cómo encadenar ideas.',
  cells: { c1: 'números al azar', c2: '10 veces con !', c3: 'mensajes con argumentos', c4: 'anidamiento', c5: 'semillas' },
  body: R`En SuperCollider todo es un **objeto** y las cosas pasan mandando **mensajes**. La forma general es «receptor.mensaje(argumentos)». Muchas veces podés escribirlo también como «mensaje(receptor, argumentos)»: «rrand(1, 100)» es lo mismo que «1.rrand(100)».

[[c1]]

«rand» da un número entre 0 y el receptor; «rrand» entre dos valores; «exprand» elige con distribución exponencial, ideal para frecuencias, porque reparte por igual las octavas. El signo «!» repite: con una función, la evalúa varias veces.

[[c2]]

Cada mensaje tiene sus argumentos. Probá cambiarlos para adivinar qué hace cada uno:

[[c3]]

Un mensaje puede ser argumento de otro. Esto se llama **anidamiento** y se lee de adentro hacia afuera: primero se generan 20 números, después se redondean y al final se ordenan.

[[c4]]

## Azar reproducible

Las computadoras no generan azar verdadero. Si fijás una **semilla**, obtenés siempre la misma secuencia: útil para repetir una versión de una pieza generativa.

[[c5]]

[[q:cottle_goal]]`,
  quiz: { q: 'En «round(exprand(1, 10), 0.1)», ¿quién recibe el mensaje «round»?', o: ['El número 0.1', 'El número 1', 'El resultado de «exprand(1, 10)»', 'El número 10'], e: 'El primer argumento de la forma funcional es el receptor: equivale a «exprand(1, 10).round(0.1)».' },
  ch: { task: 'Generá un array de **8 notas MIDI al azar entre 48 y 72**, ordenado de menor a mayor. La última expresión de tu código tiene que ser el array.', checks: ['Tiene 8 elementos', 'Todos entre 48 y 72', 'Está ordenado'], hint: 'Probá «{ rrand(48, 72) } ! 8» y mandale «sort».' } },

l03: { t: 'Variables, funciones y precedencia', s: 'Guardar valores, definir comportamientos y leer de izquierda a derecha.',
  cells: { c1: 'precedencia', c2: 'funciones con argumentos', c3: 'variables de entorno', c4: 'variables de intérprete' },
  body: R`Antes de seguir, una rareza importante: SuperCollider **no** tiene precedencia de operadores como la matemática escolar. Los operadores binarios se evalúan **de izquierda a derecha**. Usá paréntesis cuando quieras otro orden.

[[c1]]

Una **función** es código entre llaves que se ejecuta cuando le mandás «value» (o la forma corta «.()»). Los argumentos se declaran entre barras «| |» y pueden tener valores por defecto. Las variables locales se declaran con «var» al principio del bloque.

[[c2]]

Hay tres clases de variables que vas a usar todo el tiempo:

- **Locales** con «var»: viven dentro del bloque o la función.
- **De intérprete**: las letras de la «a» a la «z», siempre disponibles («s» ya es el servidor).
- **De entorno**: con «~», por ejemplo «~base». Se crean al asignarlas y sirven en cualquier lugar.

[[c3]]

[[c4]]

!! Si ves «Variable 'x' not defined», te falta declararla con «var» o usar «~x». Es el error más común de quien empieza.

[[q:cottle_panic]]`,
  quiz: { q: '¿Cuánto da «5 + 2 * 3» en SuperCollider?', o: ['11', '13', '30', '21'], e: 'Se evalúa de izquierda a derecha: (5 + 2) = 7, y 7 * 3 = 21. Para obtener 11 escribí «5 + (2 * 3)».' },
  ch: { task: 'Escribí «~mtof», una función que reciba una nota MIDI y devuelva su frecuencia en Hz. «~mtof.(69)» tiene que dar 440.', checks: ['«~mtof.(69)» da 440', '«~mtof.(81)» da 880'], hint: 'Los números entienden «midicps». Dentro de la función: «note.midicps».' } },

l04: { t: 'Arrays y colecciones', s: 'Listas de valores, transformaciones y una matriz dodecafónica.',
  cells: { c1: 'una escala', c2: 'collect', c3: 'do', c4: 'serie dodecafónica', c5: 'otros mensajes' },
  body: R`Un **array** es una lista entre corchetes. Lo interesante es que las operaciones matemáticas se aplican a cada elemento: sumarle 60 a una escala la lleva a la octava central, y «midicps» convierte todas las notas a frecuencias de una vez.

[[c1]]

«collect» transforma cada elemento y devuelve un array nuevo; «do» recorre los elementos para hacer algo con cada uno (por ejemplo imprimir). Ambos le pasan a la función el elemento y su índice. «(1..8)» es una forma corta de escribir una serie.

[[c2]]

[[c3]]

Con muy poco código se pueden construir estructuras musicales enteras. Esta es una serie dodecafónica al azar y sus doce transposiciones, como en la técnica de Schoenberg:

[[c4]]

[[c5]]

!! Los arrays son la puerta a la **expansión multicanal**, uno de los superpoderes de SuperCollider. Lo vemos en la lección 10.`,
  quiz: { q: '¿Qué devuelve «[1, 2, 3] + [10, 20]»?', o: ['[11, 22, 13]', '[11, 22]', '[11, 22, 3]', 'Un error'], e: 'Las operaciones entre arrays de distinto tamaño repiten circularmente el más corto: 1+10, 2+20, 3+10.' },
  ch: { task: 'Devolvé un array con los **5 primeros armónicos de 110 Hz**: [110, 220, 330, 440, 550].', checks: ['Tiene 5 elementos', 'Son 110, 220, 330, 440, 550'], hint: '«(1..5) * 110» o «(1..5).collect { |n| n * 110 }».' } },

l05: { t: 'Tu primer sonido: UGens y .play', s: 'Unit generators, argumentos, mul y add.',
  cells: { c1: 'SinOsc', c2: 'guardar el synth', c3: 'liberarlo', c4: 'argumentos con nombre', c5: 'plot', c6: 'mul y add' },
  body: R`Los **UGens** (unit generators) son los bloques con los que se construye el sonido: osciladores, filtros, envolventes, ruidos. Cada uno tiene un mensaje de tasa: «ar» (audio rate, una muestra por cada muestra de audio) o «kr» (control rate, más barato, para señales lentas).

«SinOsc.ar(freq, phase, mul, add)» genera una senoidal. **mul** multiplica la salida (es el volumen) y **add** le suma un valor (desplaza la señal).

[[c1]]

Si guardás el resultado de «play» en una variable, podés controlarlo después:

[[c2]]

[[c3]]

No hace falta recordar el orden de los argumentos: podés nombrarlos.

[[c4]]

«plot» dibuja la señal sin hacerla sonar. Mirá el panel de la derecha:

[[c5]]

[[c6]]

!! Una señal de audio va de -1 a 1. Si sumás varias o usás mul mayor que 1, va a saturar. Mantené las amplitudes bajas (0.1 a 0.3) y sumá con cuidado.

[[q:parmenter_ugen]]`,
  quiz: { q: '¿Qué hace el argumento «mul» de un UGen?', o: ['Cambia la frecuencia', 'Multiplica la salida (escala la amplitud)', 'Suma un valor constante', 'Repite el sonido'], e: 'mul escala la señal; add la desplaza. Juntos permiten usar un oscilador para controlar cualquier rango de valores.' },
  ch: { task: 'Hacé sonar una senoidal de **330 Hz** con amplitud **0.15**.', checks: ['Usa «SinOsc»', 'La frecuencia es 330', 'Suena'], hint: '«{ SinOsc.ar(330, 0, 0.15) }.play» o con argumentos con nombre.' } },

l06: { t: 'Osciladores y ruido', s: 'Formas de onda, armónicos y colores de ruido.',
  cells: { c1: 'diente de sierra', c2: 'pulso', c3: 'cuatro formas de onda', c4: 'Blip', c5: 'ruido blanco y rosa' },
  body: R`Cada forma de onda tiene un timbre propio porque contiene distintos **armónicos**. La senoidal es pura; la diente de sierra tiene todos los armónicos; el pulso (cuadrada) sólo los impares, y su ancho cambia el color.

[[c1]]

[[c2]]

Ver las formas de onda ayuda a entenderlas. Este «plot» muestra cuatro canales a la vez:

[[c3]]

«Blip» es un tren de pulsos con un número controlado de armónicos. Mové el mouse de izquierda a derecha y mirá el espectro (FFT):

[[c4]]

El ruido contiene todas las frecuencias. El **blanco** tiene la misma energía en cada frecuencia; el **rosa** la misma en cada octava, y suena más cálido.

[[c5]]

!! Los osciladores con prefijo «LF» (LFSaw, LFPulse, LFTri) no están limitados en banda: son perfectos para controlar otros parámetros, pero a frecuencias altas generan aliasing. Para audio usá Saw, Pulse y Blip.`,
  quiz: { q: '¿Qué oscilador contiene sólo armónicos impares?', o: ['Saw', 'SinOsc', 'Pulse con ancho 0.5', 'WhiteNoise'], e: 'La onda cuadrada (Pulse con ancho 0.5) tiene sólo armónicos impares, con amplitud 1/n.' },
  ch: { task: 'Hacé sonar un «Blip» con **12 armónicos** y amplitud 0.2.', checks: ['Usa «Blip»', 'Tiene 12 armónicos', 'Suena'], hint: '«Blip.ar(freq, numharm, mul)».' } },

l07: { t: 'Control: LFOs, offset y escala', s: 'Señales que mueven a otras señales.',
  cells: { c1: 'vibrato', c2: 'notas al azar', c3: 'mouse', c4: 'poll', c5: 'escalar rangos' },
  body: R`Un oscilador lento (**LFO**) puede controlar la frecuencia, la amplitud o cualquier argumento de otro UGen. Para eso hay que llevar su salida (-1 a 1) al rango que necesitás: eso hacen **mul** (escala) y **add** (offset). «SinOsc.kr(5, 0, 10, 440)» oscila entre 430 y 450: un vibrato.

[[c1]]

Escribir mul y add a mano es incómodo; «range(min, max)» lo calcula por vos:

[[c2]]

«MouseX» y «MouseY» convierten la posición del mouse en una señal. En el celular, tocá y arrastrá sobre el osciloscopio.

[[c3]]

«poll» imprime el valor de una señal en la post window. Es la herramienta básica para depurar lo que pasa dentro del servidor.

[[c4]]

[[c5]]

!! Usá «kr» para las señales de control: calcula una vez por bloque y ahorra CPU. Usá «exprange» para frecuencias y «range» para casi todo lo demás.`,
  quiz: { q: '¿Entre qué valores oscila «SinOsc.kr(1, 0, 300, 500)»?', o: ['Entre 200 y 800', 'Entre 300 y 500', 'Entre -300 y 300', 'Entre 0 y 800'], e: 'La salida (-1..1) se multiplica por 300 (-300..300) y se le suma 500: de 200 a 800.' },
  ch: { task: 'Hacé una **sirena**: un «LFTri» que mueva la frecuencia de un «SinOsc» entre 300 y 900 Hz.', checks: ['Usa «LFTri»', 'Usa «SinOsc»', 'Suena'], hint: '«SinOsc.ar(LFTri.kr(0.5).range(300, 900), 0, 0.2)».' } },

l08: { t: 'Síntesis sustractiva', s: 'VCO → VCF → VCA: el sintetizador analógico en código.',
  cells: { c1: 'filtro resonante', c2: 'corte modulado', c3: 'viento', c4: 'filtro tipo Moog' },
  body: R`La síntesis sustractiva parte de un sonido rico en armónicos y le **resta** frecuencias con un filtro. Es la arquitectura clásica de los sintetizadores analógicos: un oscilador (VCO), un filtro (VCF) y un amplificador (VCA).

«RLPF» es un filtro pasa bajos resonante: deja pasar las frecuencias por debajo del **corte** y realza la zona del corte según **rq** (el inverso de Q: cuanto más chico, más resonancia).

[[c1]]

Modular el corte con un LFO da movimiento. Fijate cómo «[100, 101]» genera dos voces apenas desafinadas, una por canal:

[[c2]]

Con ruido y un pasabanda estrecho se modelan sonidos naturales:

[[c3]]

«MoogFF» imita el filtro escalera de Moog; su tercer argumento es la realimentación (resonancia), de 0 a 4:

[[c4]]

!! Con rq muy chico y mucha energía en el corte, un filtro resonante puede volverse muy fuerte. Bajá mul antes de experimentar.`,
  quiz: { q: 'En «RLPF», ¿qué pasa al bajar rq?', o: ['El filtro deja pasar más agudos', 'Aumenta la resonancia en la frecuencia de corte', 'Baja la frecuencia de corte', 'El sonido se vuelve estéreo'], e: 'rq es el ancho de banda relativo (1/Q). Cuanto menor, más estrecho y resonante es el pico en el corte.' },
  ch: { task: 'Pasá un «Pulse» por un «RLPF» y mové la frecuencia de corte con un LFO.', checks: ['Usa «Pulse»', 'Usa «RLPF»', 'Usa un LFO (SinOsc, LFNoise, LFTri…)', 'Suena'], hint: '«RLPF.ar(Pulse.ar(80, 0.3, 0.2), SinOsc.kr(0.3).range(200, 3000), 0.2)».' } },

l09: { t: 'Envolventes', s: 'Env, EnvGen, doneAction y gate.',
  cells: { c1: 'envolventes clásicas', c2: 'una envolvente propia', c3: 'percusiva', c4: 'sostenida con gate', c5: 'soltar', c6: 'Line y XLine' },
  body: R`Una **envolvente** da forma a un parámetro en el tiempo: el volumen de una nota, el brillo de un filtro, la altura de un golpe. «Env» describe la forma (niveles, tiempos, curvas) y «EnvGen» la ejecuta en el servidor.

[[c1]]

Podés definir cualquier forma: un array de niveles, uno de tiempos (uno menos que los niveles) y las curvas (números negativos: rápido al principio; positivos: lento al principio).

[[c2]]

**doneAction: 2** le dice al servidor que libere el synth cuando la envolvente termina. Sin eso, el synth seguiría ocupando CPU en silencio.

[[c3]]

Las envolventes con **sostenido** (adsr, asr) se quedan en el nivel de sostenido mientras el argumento **gate** sea mayor que 0. Al ponerlo en 0 empieza la relajación:

[[c4]]

[[c5]]

«Line» y «XLine» son rampas simples (lineal y exponencial) que también aceptan doneAction:

[[c6]]

!! Las curvas exponenciales y los valores negativos de curva suenan más naturales para el volumen, porque nuestro oído percibe la intensidad de forma logarítmica.`,
  quiz: { q: '¿Qué hace «doneAction: 2»?', o: ['Repite la envolvente dos veces', 'Duplica la amplitud', 'Libera el synth cuando la envolvente termina', 'Espera dos segundos antes de empezar'], e: 'Es la forma estándar de que las notas se borren solas del servidor al terminar.' },
  ch: { task: 'Hacé una nota **percusiva** que se libere sola: «Env.perc» + «doneAction: 2».', checks: ['Usa «EnvGen»', 'Usa doneAction: 2', 'Suena'], hint: 'Mirá el ejemplo 3 y cambiá el oscilador o los tiempos.' } },

l10: { t: 'Expansión multicanal y estéreo', s: 'Un array como argumento duplica todo el patch.',
  cells: { c1: 'mono y estéreo', c2: 'expansión', c3: 'Pan2', c4: 'Splay', c5: 'Mix' },
  body: R`Si usás un **array** como argumento de un UGen, SuperCollider duplica el patch: una copia por cada elemento, cada una a un canal de salida. Es la **expansión multicanal**.

Ojo con una costumbre de SuperCollider: un sonido mono sale **sólo por el canal izquierdo** (el bus 0). Mirá el osciloscopio: cian es el izquierdo, magenta el derecho.

[[c1]]

[[c2]]

[[q:cottle_magic]]

«Pan2» ubica una señal mono en el campo estéreo (-1 izquierda, 1 derecha). «Splay» reparte muchas voces entre izquierda y derecha. «Mix» suma un array de canales en uno solo. Probá el modo **X/Y** del osciloscopio para ver la imagen estéreo.

[[c3]]

[[c4]]

[[c5]]

!! «sig ! 2» es la forma más corta de pasar una señal mono a estéreo (duplica la misma señal en los dos canales).`,
  quiz: { q: '¿Cuántos canales produce «{ SinOsc.ar([300, 400], 0, 0.1) }.play»?', o: ['1', '2', '4', 'Depende del servidor'], e: 'El array de dos frecuencias crea dos SinOsc: canal 0 a 300 Hz y canal 1 a 400 Hz.' },
  ch: { task: 'Tres «Saw» levemente desafinados repartidos en estéreo con «Splay».', checks: ['Usa «Saw»', 'Usa «Splay» (Pan2)', 'Es estéreo', 'Suena'], hint: '«Splay.ar(Saw.ar([110, 110.4, 109.7], 0.1))».' } },

l11: { t: 'Síntesis aditiva', s: 'Construir timbres sumando senoidales.',
  cells: { c1: 'serie armónica', c2: 'sólo impares', c3: 'parciales inarmónicos', c4: 'Klang' },
  body: R`Según Fourier, cualquier sonido periódico es una suma de senoidales. La síntesis **aditiva** hace eso literalmente: sumás parciales, cada uno con su frecuencia y amplitud. «Mix.fill(n, función)» crea n voces y las suma.

[[c1]]

Si usás sólo los armónicos impares obtenés algo parecido a una onda cuadrada (compará con la lección 6 en el espectro):

[[c2]]

Cuando los parciales no son múltiplos enteros de una fundamental, el resultado suena a campana o a metal. «ExpRand» y «Rand» eligen un valor al azar **una vez por synth**, dentro del servidor:

[[c3]]

«Klang» es un banco de osciladores senoidales eficiente. Fijate en la comilla invertida antes del array: lo congela para que no se expanda en varios canales.

[[c4]]

!! Mirá el modo SONO del monitor (sonograma): la síntesis aditiva se ve como líneas horizontales, una por parcial.`,
  quiz: { q: '¿Qué amplitud suele tener el armónico n en una diente de sierra?', o: ['n', '1', 'n²', '1/n'], e: 'La diente de sierra tiene todos los armónicos con amplitud 1/n; la cuadrada, sólo los impares con 1/n.' },
  ch: { task: 'Construí una onda **casi cuadrada** sumando armónicos impares con «Mix.fill».', checks: ['Usa «SinOsc»', 'Usa «Mix.fill» o «Klang»', 'Suena'], hint: 'Para i = 0, 1, 2…: n = i * 2 + 1, frecuencia f * n y amplitud 1/n.' } },

l12: { t: 'FM y modulación de fase', s: 'Portadora, moduladora, índice y bandas laterales.',
  cells: { c1: 'índice en el mouse', c2: 'FM a mano', c3: 'campana FM', c4: 'sample & hold' },
  body: R`En la **síntesis FM** una moduladora cambia muy rápido la frecuencia (o la fase) de una portadora. Aparecen **bandas laterales**: nuevas frecuencias a ambos lados de la portadora, separadas por la frecuencia de la moduladora. Pocos osciladores, timbres muy complejos.

«PMOsc.ar(portadora, moduladora, índice)» hace modulación de fase. Abrí el modo FFT del monitor y mové el mouse: el **índice** controla cuántas bandas laterales aparecen.

[[c1]]

Lo mismo, a mano: la moduladora se suma a la frecuencia de la portadora.

[[c2]]

Si la razón entre moduladora y portadora no es entera, el espectro es inarmónico: campanas. Y si el índice decae con la envolvente, el timbre se apaga como en un instrumento real:

[[c3]]

«Latch» toma una muestra de una señal cada vez que llega un disparo y la mantiene (sample & hold). Acá cambia la razón FM en cada nota:

[[c4]]`,
  quiz: { q: 'Con una razón moduladora/portadora entera (1, 2, 3…), el espectro es…', o: ['Armónico', 'Inarmónico', 'Ruido blanco', 'Silencio'], e: 'Las bandas laterales caen en múltiplos de la fundamental cuando la razón es entera: el resultado es armónico.' },
  ch: { task: 'Hacé una **campana FM**: «PMOsc» con una envolvente que controle el índice.', checks: ['Usa SinOsc (PMOsc)', 'Usa «PMOsc»', 'Usa «EnvGen»', 'Suena'], hint: 'Mirá el ejemplo 3: el tercer argumento de PMOsc multiplicado por EnvGen.' } },

l13: { t: 'Modelado físico y resonadores', s: 'Cuerdas pulsadas, campanas y lluvia.',
  cells: { c1: 'Karplus-Strong', c2: 'arpegio de cuerda', c3: 'campana con Klank', c4: 'lluvia sobre metal' },
  body: R`El **modelado físico** simula el comportamiento de un objeto que vibra. El algoritmo de **Karplus-Strong** excita una línea de retardo con un golpe de ruido y la realimenta filtrada: suena como una cuerda pulsada. En SuperCollider es «Pluck».

[[c1]]

[[c2]]

Los **resonadores** son filtros que suenan solos cuando reciben un impulso. «Klank» es un banco de resonadores: le das frecuencias, amplitudes y tiempos de decaimiento, y lo excitás con impulsos.

[[c3]]

«Ringz» es un solo resonador. Excitado con «Dust» (impulsos al azar) suena como gotas sobre algo metálico:

[[c4]]

!! Los resonadores de decaimiento largo acumulan energía: si los excitás con señales continuas, bajá mucho la amplitud de entrada.`,
  quiz: { q: '¿Qué simula el algoritmo de Karplus-Strong?', o: ['Una voz humana', 'Un filtro Moog', 'Una cuerda pulsada', 'Un órgano de tubos'], e: 'Una línea de retardo realimentada con un filtro pasabajos: el ruido inicial se convierte en un tono que decae como una cuerda.' },
  ch: { task: 'Un cuerpo resonante («Klank» o «Ringz») excitado con «Dust».', checks: ['Usa Klank o Ringz', 'Usa «Dust»', 'Suena'], hint: '«Klank.ar(`[[500, 1200, 2100], nil, [1, 1, 1]], Dust.ar(5, 0.1))».' } },

l14: { t: 'Efectos: delay, reverb y distorsión', s: 'Ecos, salas, saturación y realimentación.',
  cells: { c1: 'eco con CombN', c2: 'reverb', c3: 'distorsión', c4: 'realimentación' },
  body: R`Los efectos de tiempo se construyen con **líneas de retardo**. «CombN» es un retardo con realimentación: cada repetición es más débil, según el tiempo de decaimiento.

[[c1]]

«FreeVerb» simula una sala con una red de filtros comb y allpass. Sus argumentos son mezcla, tamaño de sala y amortiguación:

[[c2]]

La distorsión más simple: amplificar y pasar por una función que recorta suave, como «tanh».

[[c3]]

Con «LocalIn» y «LocalOut» podés armar tus propias realimentaciones dentro de un synth. Acá un eco estéreo cruzado (ping-pong) con filtro en el lazo:

[[c4]]

!! En un lazo de realimentación, la ganancia total tiene que ser menor que 1. Poné siempre un filtro o una saturación («tanh») dentro del lazo para que no se dispare.`,
  quiz: { q: 'En «CombN.ar(in, 0.5, 0.25, 3)», ¿qué significa 3?', o: ['Tres repeticiones exactas', 'El tiempo (en segundos) que tarda el eco en caer 60 dB', 'El retardo máximo', 'La cantidad de canales'], e: 'Los argumentos son: entrada, retardo máximo, retardo y tiempo de decaimiento (hasta -60 dB).' },
  ch: { task: 'Un sonido seco + un eco con «CombN» + reverb con «FreeVerb».', checks: ['Usa «CombN»', 'Usa «FreeVerb»', 'Suena'], hint: 'Sumá la señal y su eco, y pasá todo por FreeVerb.' } },

l15: { t: 'Microsonido y síntesis granular', s: 'Sonidos hechos de partículas.',
  cells: { c1: 'granos regulares', c2: 'nube granular', c3: 'un grano como SynthDef', c4: 'lluvia de granos' },
  body: R`[[q:micro]]

Un **grano** es un sonido muy breve (de 1 a 100 milisegundos) con una envolvente suave. Miles de granos por segundo forman texturas, nubes y transformaciones imposibles por otros medios. Cuando el grano es muy corto, deja de oírse su altura y se vuelve un clic de color.

[[c1]]

«GrainSin» genera granos senoidales cada vez que recibe un disparo. Con «Dust» (asincrónico) aparecen nubes; con «Impulse» (sincrónico), tonos con formantes. Mové el mouse: densidad en X, tamaño de grano en Y.

[[c2]]

También se puede hacer en el lenguaje, lanzando un synth por grano. Primero definimos el grano:

[[c3]]

[[c4]]

!! Usá «OffsetOut» en los SynthDef de granos: corrige el desfasaje dentro del bloque de audio y mejora la precisión temporal cuando hay muchos eventos por segundo.`,
  quiz: { q: '¿Qué pasa cuando los granos son extremadamente cortos?', o: ['Suenan más graves', 'Se vuelven más fuertes', 'Se convierten en ruido blanco', 'Perdés la altura y se oyen como clics de color'], e: 'Por debajo de unos pocos milisegundos no alcanza a percibirse el período: sólo queda un clic cuyo color depende del contenido.' },
  ch: { task: 'Una **nube granular**: «GrainSin» disparado por «Dust».', checks: ['Usa «GrainSin»', 'Usa «Dust»', 'Suena'], hint: 'Mirá el ejemplo 2 y cambiá los rangos.' } },

l16: { t: 'Síntesis no estándar y caos', s: 'Xenakis, mapas caóticos y algoritmos como fuente sonora.',
  cells: { c1: 'Gendy1', c2: 'Gendy1 en el mouse', c3: 'Crackle', c4: 'mapa logístico', c5: 'mapa de Hénon' },
  body: R`[[q:stoch]]

La síntesis **no estándar** no parte de la acústica sino de procedimientos: números, azar, caos. **Gendy1** implementa la síntesis estocástica dinámica de Iannis Xenakis: la forma de onda está hecha de puntos que se mueven por caminatas al azar.

[[c1]]

[[c2]]

Los **sistemas caóticos** son deterministas pero impredecibles. «Crackle» y «Logistic» exploran ecuaciones que pasan del orden al caos según un parámetro. Mové el mouse lentamente y escuchá las transiciones.

[[c3]]

[[c4]]

[[c5]]

!! Estas fuentes pueden tener componente continua (DC). Si después las filtrás o procesás, agregá «LeakDC.ar» para centrarlas en cero.`,
  quiz: { q: '¿Qué compositor ideó la síntesis estocástica dinámica (Gendy)?', o: ['John Cage', 'Iannis Xenakis', 'Karlheinz Stockhausen', 'Pauline Oliveros'], e: 'Xenakis la desarrolló en los años noventa (GENDYN). Gendy1 es su implementación en SuperCollider.' },
  ch: { task: 'Creá tu propia textura con «Gendy1».', checks: ['Usa «Gendy1»', 'Suena'], hint: 'Cambiá minfreq y maxfreq, o mové ampscale y durscale.' } },

l17: { t: 'SynthDef y Synth', s: 'Definir una vez, tocar muchas.',
  cells: { c1: 'definir', c2: 'tocar', c3: 'un pad con gate', c4: 'crear', c5: 'modificar', c6: 'soltar' },
  body: R`Cada vez que hacés «{ }.play», SuperCollider compila un instrumento nuevo. Para instrumentos que vas a usar muchas veces conviene definir un **SynthDef**: una receta con nombre que el servidor guarda. Después creás **Synths** (instancias) a partir de ella, cada uno con sus propios valores.

[[q:parmenter_synthdef]]

Los argumentos de la función se convierten en **controles** que podés fijar al crear el synth y cambiar mientras suena. Por convención se incluye «out» para elegir el bus de salida, y se escribe explícitamente con «Out.ar».

[[c1]]

[[c2]]

Un instrumento sostenido necesita un argumento «gate» y una envolvente con sostenido:

[[c3]]

[[c4]]

[[c5]]

[[c6]]

!! Dentro de un SynthDef usá «Rand», «ExpRand» o «TRand» para el azar. «rrand» o «rand» se evalúan una sola vez, cuando se compila la definición, y todos los synths saldrían iguales.`,
  quiz: { q: '¿Cuál es la ventaja principal de un SynthDef frente a «{ }.play»?', o: ['Suena más fuerte', 'Permite usar más UGens', 'Funciona sin servidor', 'Se compila una vez y crea muchos synths de forma eficiente'], e: 'La definición se manda una vez al servidor; cada Synth sólo transmite su nombre y sus argumentos.' },
  ch: { task: 'Definí un SynthDef «\\bell» con un argumento «freq» y tocalo **dos veces** con frecuencias distintas.', checks: ['Agrega un SynthDef', 'Crea al menos 2 synths', 'Suena'], hint: 'Seguí el modelo del ejemplo 1 y después «Synth(\\bell, [\\freq, 600]); Synth(\\bell, [\\freq, 900]);».' } },

l18: { t: 'Buses, orden y efectos', s: 'Rutear señales entre synths.',
  cells: { c1: 'reverb y fuente', c2: 'bus privado y efecto', c3: 'mandar al efecto', c4: 'bus de control' },
  body: R`Los synths se comunican por **buses**. Los primeros buses de audio son las salidas y entradas físicas; los demás son **privados** y sirven para conectar synths entre sí, como cables en un estudio. «Out.ar(bus, señal)» escribe; «In.ar(bus, canales)» lee.

El caso típico es un efecto compartido: varias fuentes escriben en un bus y un synth de reverb lo lee. El efecto tiene que estar **después** de las fuentes en el orden de ejecución: por eso se crea con «Synth.tail».

[[c1]]

[[c2]]

[[c3]]

Los **buses de control** funcionan igual para señales «kr»: un solo LFO puede controlar muchos synths.

[[c4]]

!! «Bus.audio(s, 2)» reserva buses libres para vos. Nunca escribas números de bus a mano en un proyecto grande: es la receta para conectar cosas por accidente.`,
  quiz: { q: '¿Por qué el synth de efecto se crea con «Synth.tail»?', o: ['Para que suene más fuerte', 'Porque tail significa estéreo', 'Para que se calcule después de las fuentes que escriben en su bus', 'Para que se libere solo'], e: 'El servidor procesa los nodos en orden. Un efecto tiene que leer el bus después de que las fuentes escribieron en él.' },
  ch: { task: 'Mandá un sonido a un **bus privado** y procesalo con un synth de efecto que lea ese bus.', checks: ['Lee un bus con «In»', 'Escribe en un bus privado', 'Suena'], hint: 'Seguí los ejemplos 1, 2 y 3 en orden.' } },

l19: { t: 'Demand UGens', s: 'Secuencias que corren dentro del servidor.',
  cells: { c1: 'Demand + Dseq', c2: 'Drand', c3: 'Duty', c4: 'TRand' },
  body: R`A veces conviene que una secuencia viva **dentro** del synth, sincronizada a la muestra. Los **Demand UGens** son patterns del lado del servidor: «Dseq», «Drand», «Dwhite»… producen un valor nuevo cada vez que «Demand» recibe un disparo.

[[c1]]

[[c2]]

«Duty» avanza por su cuenta: el primer argumento es la duración de cada valor (que también puede ser una secuencia).

[[c3]]

Para azar puro por disparo, «TRand» (o «TIRand», «TExpRand»):

[[c4]]

!! Demand es ideal para secuencias rápidas o que tienen que estar perfectamente sincronizadas con el audio. Para música con notas, voces y estructura, los patterns del lenguaje (módulo 5) son más flexibles.`,
  quiz: { q: '¿Cuándo produce un valor nuevo «Demand.kr(trig, 0, Dseq([...], inf))»?', o: ['Cada vez que recibe un disparo en trig', 'Una vez por segundo', 'Cada bloque de audio', 'Sólo al crear el synth'], e: 'Demand pide el siguiente valor a sus D-UGens con cada disparo.' },
  ch: { task: 'Una melodía secuenciada en el servidor con «Demand» y «Dseq».', checks: ['Usa «Demand»', 'Usa «Dseq»', 'Suena'], hint: 'Partí del ejemplo 1 y cambiá las notas.' } },

l20: { t: 'Entradas y salidas', s: 'MIDI, mouse, micrófono y grabación.',
  cells: { c1: 'un MIDIdef', c2: 'conectar MIDI', c3: 'botón del mouse', c4: 'micrófono', c5: 'grabar' },
  body: R`[[q:ins]]

Con **MIDIdef** registrás una función que responde a mensajes MIDI. Acá cada nota dispara un synth. Tocá el teclado en pantalla (o las teclas de tu computadora) después de ejecutar el ejemplo:

[[c1]]

Si tenés un teclado MIDI y usás Chrome o Edge, conectalo:

[[c2]]

El mouse también es un controlador: posición y botón.

[[c3]]

«SoundIn» lee el micrófono. El navegador te va a pedir permiso. **Usá auriculares** para evitar acoples.

[[c4]]

«s.record» graba todo lo que suena; «s.stopRecording» descarga un archivo WAV.

[[c5]]

!! En el SuperCollider de escritorio también podés usar OSC para hablar con otros programas (Processing, Pure Data, TouchDesigner). En el navegador eso no está disponible, pero MIDI sí.`,
  quiz: { q: '¿Qué argumentos recibe la función de «MIDIdef.noteOn»?', o: ['frecuencia y amplitud', 'velocidad y número de nota (y canal)', 'sólo el número de nota', 'tiempo y duración'], e: 'El orden es (val, num, chan, src): para noteOn, val es la velocidad y num la nota.' },
  ch: { task: 'Escribí un «MIDIdef» que haga sonar algo con cada tecla, y tocá el teclado en pantalla.', checks: ['Hay un MIDIdef activo', 'Suena'], hint: 'Partí del ejemplo 1. El teclado en pantalla aparece debajo de ese ejemplo.' } },

l21: { t: 'Rutinas y relojes', s: 'Tiempo musical: fork, wait y TempoClock.',
  cells: { c1: 'una rutina', c2: 'un loop infinito', c3: 'detenerlo', c4: 'tempo', c5: 'rutina como stream' },
  body: R`Hasta ahora todo sucedía al instante. Para organizar eventos en el tiempo, SuperCollider usa **rutinas**: funciones que pueden pausarse con «wait». «fork» crea una rutina y la arranca en el reloj por defecto.

Un evento como «(degree: 3).play» toca una nota con el instrumento por defecto. Lo vamos a usar mucho.

[[c1]]

[[c2]]

[[c3]]

Las esperas se miden en **pulsos** del reloj. Cambiando el tempo de «TempoClock.default» cambia la velocidad de todo lo que corre en él:

[[c4]]

Una rutina también es un **stream**: cada «next» la hace avanzar hasta el siguiente «yield».

[[c5]]

[[q:wilson_ways]]

!! Un «loop» sin «wait» bloquea el intérprete. Esta app lo detecta y corta con un error, pero en el SuperCollider de escritorio vas a tener que reiniciar.`,
  quiz: { q: 'Con «TempoClock.default.tempo = 2», ¿cuánto dura «1.wait» en segundos?', o: ['2 segundos', '1 segundo', '0.5 segundos', 'Depende del sample rate'], e: 'tempo = 2 significa 2 pulsos por segundo (120 BPM): un pulso dura 0.5 s.' },
  ch: { task: 'Una rutina que toque **al menos 8 notas**, con «wait» entre ellas.', checks: ['Usa «wait»', 'Suenan al menos 8 notas'], hint: '«fork { 8.do { |i| (degree: i).play; 0.25.wait } }».' } },

l22: { t: 'Patterns: Pbind', s: 'Escribir música como reglas.',
  cells: { c1: 'una escala', c2: 'ritmo y azar', c3: 'un stream', c4: 'acordes', c5: 'escala menor' },
  body: R`[[q:kuivila]]

Un **pattern** describe una secuencia de valores sin ejecutarla. «Pbind» une claves y patterns para generar **eventos** (notas). Las claves más usadas: «degree» (grado de la escala), «dur» (duración en pulsos), «legato», «amp», «octave», «scale» e «instrument».

[[c1]]

«Pseq» recorre una lista; «Prand» elige al azar; «Pwhite» genera números entre dos límites. Los patterns se pueden anidar y combinar libremente.

[[c2]]

Un pattern es una receta. «asStream» la convierte en un stream del que podés pedir valores:

[[c3]]

Si un valor es un array, el evento se expande en un **acorde**:

[[c4]]

[[c5]]

!! Mirá el panel **Eventos** del monitor: cada nota aparece como un rectángulo en un piano roll. Es la mejor manera de ver lo que hace un pattern.`,
  quiz: { q: 'En un Pbind, ¿qué indica la clave «dur»?', o: ['La duración del sonido en segundos', 'El tiempo hasta el próximo evento, en pulsos', 'El volumen', 'La cantidad de repeticiones'], e: 'dur es el delta entre eventos en pulsos del reloj. La duración real de la nota depende además de legato.' },
  ch: { task: 'Un «Pbind» que toque **8 notas** en una **escala menor**.', checks: ['Usa «Pbind»', 'Usa una escala (Scale.minor…)', 'Suenan 8 notas'], hint: 'Mirá el ejemplo 5.' } },

l23: { t: 'Pdef, Ppar e instrumentos propios', s: 'Cambiar la música mientras suena.',
  cells: { c1: 'un instrumento', c2: 'Pdef', c3: 'reemplazar en vivo', c4: 'detener', c5: 'Ppar' },
  body: R`Los patterns pueden usar tus propios SynthDefs con la clave «instrument». Este usa «Pluck» y se libera solo cuando el sonido se apaga gracias a «DetectSilence».

[[c1]]

«Pdef» le da nombre a un pattern y permite **reemplazarlo mientras suena**: el cambio entra en el próximo pulso, sin cortes. Es la base del live coding con patterns.

[[c2]]

[[c3]]

[[c4]]

«Ppar» toca varios patterns en paralelo: por ejemplo un bajo y una melodía.

[[c5]]

!! Si un instrumento no tiene «gate», tiene que liberarse solo (doneAction o DetectSilence). Si lo tiene, el pattern le manda gate 0 al final de cada nota.`,
  quiz: { q: '¿Qué pasa al evaluar otra vez «Pdef(\\mel, ...)» con un pattern nuevo mientras suena?', o: ['Se detiene todo', 'Suenan los dos patterns a la vez', 'Da un error', 'El nuevo pattern reemplaza al anterior sin cortar'], e: 'Pdef es un proxy: el player sigue corriendo y toma la nueva fuente en el siguiente evento.' },
  ch: { task: 'Tocá **dos partes simultáneas** con «Ppar».', checks: ['Usa «Ppar»', 'Suenan al menos 6 notas'], hint: 'Mirá el ejemplo 5.' } },

l24: { t: 'Algoritmos: azar, caminatas y cadenas', s: 'Composición estocástica.',
  cells: { c1: 'caminata al azar', c2: 'azar ponderado', c3: 'cadena de Markov', c4: 'semillas' },
  body: R`[[q:stoch]]

No todo el azar suena igual. Una **caminata aleatoria** («Pbrown») avanza a pasos pequeños: genera melodías con dirección. El azar **ponderado** («Pwrand») hace que unas opciones sean más probables que otras.

[[c1]]

[[c2]]

Una **cadena de Markov** elige el próximo estado según el actual. Acá cada nota sólo puede ir a ciertas notas: el resultado tiene un estilo reconocible.

[[c3]]

Y con una semilla, el azar se vuelve reproducible:

[[c4]]

!! Para piezas generativas largas, combiná niveles: azar para los detalles, estructura fija (Pseq, Pn) para la forma.`,
  quiz: { q: '¿Qué caracteriza a una melodía generada con «Pbrown»?', o: ['Cada nota está cerca de la anterior', 'Todas las notas tienen la misma probabilidad', 'Repite siempre la misma nota', 'Sólo usa notas graves'], e: 'Pbrown es un movimiento browniano: cada valor se aleja del anterior como mucho en «step».' },
  ch: { task: 'Una melodía que **deambule** con «Pbrown».', checks: ['Usa «Pbrown»', 'Suenan al menos 8 notas'], hint: '«Pbind(\\degree, Pbrown(0, 14, 2, 16), \\dur, 0.15).play».' } },

l25: { t: 'JITLib: Ndef y ProxySpace', s: 'Programar mientras suena.',
  cells: { c1: 'un Ndef', c2: 'redefinir con crossfade', c3: 'argumentos y set', c4: 'encadenar proxies', c5: 'ProxySpace', c6: 'limpiar' },
  body: R`[[q:jit]]

**JITLib** (Just In Time library) permite cambiar el programa mientras corre. Un «Ndef» es un **proxy**: un lugar con nombre donde ponés una fuente de sonido. Si lo redefinís, la fuente nueva reemplaza a la vieja con un **crossfade** de «fadeTime» segundos.

[[c1]]

[[c2]]

Los argumentos de la función se pueden cambiar con «set», y se conservan aunque redefinas la fuente:

[[c3]]

Un Ndef puede leer a otro con «Ndef.ar(\nombre)»: así se arma un patch modular que podés recablear en vivo.

[[c4]]

«ProxySpace» hace lo mismo con una sintaxis más corta: cada variable «~nombre» se vuelve un proxy.

[[c5]]

[[c6]]

!! En una actuación, poné «fadeTime» de 2 a 8 segundos: tus errores se vuelven transiciones.`,
  quiz: { q: '¿Qué pasa al redefinir un Ndef que está sonando?', o: ['Se corta y vuelve a empezar', 'Da un error porque ya existe', 'La nueva fuente reemplaza a la vieja con un crossfade', 'Suenan las dos para siempre'], e: 'El proxy mantiene su bus y su monitor; sólo cambia la fuente, con un fundido de fadeTime segundos.' },
  ch: { task: 'Tocá un «Ndef» y **redefinilo al menos dos veces** mientras suena.', checks: ['El Ndef tiene 3 o más versiones', 'Suena'], hint: 'Ejecutá «Ndef(\\x, { ... }).play» y después cambiá el contenido de la función y volvé a ejecutar.' } },

l26: { t: 'SCTweets: el arte del código compacto', s: '140 caracteres de sonido.',
  cells: { c1: 'acordes que respiran', c2: 'gotas en una sala', c3: 'secuencia triangular', c4: 'Xenakis de bolsillo' },
  body: R`[[q:tweets]]

En 2009 la comunidad de SuperCollider empezó a compartir piezas completas que entraban en un tweet: **140 caracteres**. Los **SCTweets** son un juego, pero también una escuela: obligan a conocer a fondo la expansión multicanal, los atajos de sintaxis y los UGens que hacen mucho con poco.

Algunos trucos: «play{ }» en lugar de «{ }.play», «!8» para multiplicar voces, «(1..8)» para series, variables de una letra y nada de espacios.

[[c1]]

[[c2]]

[[c3]]

[[c4]]

!! El contador del desafío cuenta caracteres sin espacios iniciales ni finales. Si te pasás, empezá por sacar espacios y ceros: «0.5» puede ser «0.5» pero «1/2» a veces es más corto en contexto.`,
  quiz: { q: '¿Qué equivale a «play{ SinOsc.ar }»?', o: ['«SinOsc.play»', '«play(SinOsc)»', '«SinOsc.ar.play(0)»', '«{ SinOsc.ar }.play»'], e: 'La sintaxis funcional con función final: «play{...}» manda el mensaje play a la función.' },
  ch: { task: 'Tu **SCTweet**: una pieza que suene, en **140 caracteres o menos**.', checks: ['140 caracteres o menos', 'Suena'], hint: 'Partí de un ejemplo y simplificalo. «play{Splay.ar(SinOsc.ar((1..5)*99,0,0.1))}» ocupa 41.' } },

l27: { t: 'Afinaciones alternativas', s: 'Temperamento igual, entonación justa y otras divisiones de la octava.',
  cells: { c1: 'acorde temperado', c2: 'acorde justo', c3: 'escala justa', c4: '19-EDO', c5: 'escalas japonesas' },
  body: R`[[q:tuning]]

El piano usa el **temperamento igual** de 12 notas (12-TET): cada semitono es la raíz doceava de 2. Es un compromiso: ningún intervalo, salvo la octava, es acústicamente puro. La **entonación justa** usa razones de números enteros (3/2, 5/4…). Escuchá la diferencia entre estos dos acordes mayores: el justo no tiene batidos.

[[c1]]

[[c2]]

«Scale» acepta afinaciones («Tuning»): «Scale.major(\just)» es una escala mayor justa.

[[c3]]

También podés dividir la octava en otro número de partes con «stepsPerOctave». 19-EDO tiene terceras menores casi puras:

[[c4]]

SuperCollider trae escalas de muchas tradiciones. El capítulo 22 del libro está dedicado a la escena de SuperCollider en Japón; acá dos escalas pentatónicas japonesas:

[[c5]]`,
  quiz: { q: '¿Qué razón de frecuencias corresponde a una quinta justa?', o: ['5/4', '3/2', '4/3', '2/1'], e: '3/2 es la quinta justa; 5/4 la tercera mayor; 4/3 la cuarta; 2/1 la octava.' },
  ch: { task: 'Tocá una melodía en una afinación que **no** sea 12-TET (justa, pitagórica o con otro «stepsPerOctave»).', checks: ['Usa otra afinación', 'Suenan al menos 5 notas'], hint: 'Mirá los ejemplos 3 y 4.' } },

l28: { t: 'Sonificación de datos', s: 'Escuchar números.',
  cells: { c1: 'datos a altura', c2: 'varias dimensiones', c3: 'sonificación continua' },
  body: R`[[q:sonif]]

**Sonificar** es convertir datos en sonido de forma sistemática para escucharlos: tendencias, anomalías, ritmos. La técnica básica es el **mapeo de parámetros**: cada dimensión de los datos controla una dimensión del sonido (altura, tiempo, volumen, panorama, timbre).

«linlin» y «linexp» traducen un rango a otro. Para alturas conviene «linexp», porque percibimos la frecuencia de forma logarítmica.

[[c1]]

[[c2]]

Los datos también pueden ser una envolvente continua:

[[c3]]

!! Elegí el mapeo con intención: lo que sube en los datos debería subir en el sonido. Y siempre ofrecé una referencia (un tono base, un pulso) para que se pueda comparar.`,
  quiz: { q: '¿Por qué conviene «linexp» para mapear datos a frecuencia?', o: ['Porque es más rápido de calcular', 'Porque evita números negativos', 'Porque percibimos la altura de forma logarítmica', 'Porque los datos siempre son exponenciales'], e: 'Distancias iguales en escala exponencial se oyen como intervalos iguales.' },
  ch: { task: 'Sonificá un array de **al menos 10 valores** usando «linlin» o «linexp».', checks: ['Usa linlin, linexp o explin', 'Suenan al menos 10 notas'], hint: 'Inventá tus datos o usá «~data» del ejemplo 1.' } },

l29: { t: 'Espacialización', s: 'Ubicar y mover sonidos.',
  cells: { c1: 'paneo en movimiento', c2: 'distancia', c3: 'efecto Doppler', c4: 'ancho estéreo' },
  body: R`[[q:space]]

En estéreo, la posición lateral se controla con la diferencia de nivel entre canales («Pan2»). Abrí el modo **X/Y** del osciloscopio: vas a ver moverse la imagen.

[[c1]]

La **distancia** se percibe por varios indicios a la vez: menos volumen, menos agudos y más reverberación en proporción al sonido directo. MouseY controla la distancia; MouseX, la dirección:

[[c2]]

Un objeto que pasa cerca cambia de altura por el **efecto Doppler**. Se modela con un retardo variable («DelayL»): el tiempo de retardo es la distancia dividida por la velocidad del sonido.

[[c3]]

«Splay» con un «spread» variable abre o cierra la imagen estéreo:

[[c4]]

!! Para multicanal (cuadrafonía, ambisonics) SuperCollider de escritorio tiene PanAz, BiPanB2 y librerías como ATK. La lógica es la misma que en estéreo.`,
  quiz: { q: '¿Qué indicio NO ayuda a percibir que un sonido está lejos?', o: ['Menor volumen', 'Menos agudos', 'Más reverberación relativa', 'Mayor frecuencia fundamental'], e: 'La altura no depende de la distancia (salvo el efecto Doppler cuando la fuente se mueve).' },
  ch: { task: 'Mové un sonido por el campo estéreo con «Pan2» y un LFO.', checks: ['Usa «Pan2»', 'Usa un LFO', 'Suena'], hint: '«Pan2.ar(fuente, SinOsc.kr(0.3))».' } },

l30: { t: 'Escucha automática', s: 'Que la computadora escuche.',
  cells: { c1: 'seguidor de envolvente', c2: 'seguimiento de altura', c3: 'con el micrófono' },
  body: R`[[q:ml]]

La **escucha automática** extrae información de una señal: cuánta energía tiene («Amplitude»), qué altura («Pitch»), cuándo empieza un golpe. Con eso un sistema puede reaccionar a quien toca: acompañar, imitar, responder.

[[c1]]

«Pitch» estima la frecuencia fundamental. Acá una senoidal sigue la melodía una quinta arriba:

[[c2]]

Lo mismo con tu voz o tu instrumento por el micrófono (con auriculares):

[[c3]]

!! El libro dedica capítulos enteros a la escucha automática y al aprendizaje automático en SuperCollider (capítulos 15 y 25). Este es sólo el primer paso.`,
  quiz: { q: '¿Qué mide «Amplitude.kr(señal)»?', o: ['La envolvente de amplitud de la señal', 'La frecuencia', 'El número de armónicos', 'La posición estéreo'], e: 'Es un seguidor de envolvente con tiempos de ataque y relajación ajustables.' },
  ch: { task: 'Usá «Amplitude» para que un sonido reaccione a otro.', checks: ['Usa «Amplitude»', 'Suena'], hint: 'Mirá el ejemplo 1: la amplitud de la batería mueve el filtro.' } },
},
quotes: {
  mccartney: 'SuperCollider es un lenguaje para describir procesos sonoros.',
  mccartney2: 'La idea principal de SuperCollider es componer objetos algorítmicamente para crear procesos que generan sonido.',
  intro: 'Podés aprender de a poco, de tal manera que casi no notás que estás programando hasta que es demasiado tarde… y ya te atrapó.',
  safety: 'Sugerimos empezar cada ejemplo con el volumen al mínimo y subirlo de a poco hasta un nivel cómodo.',
  cottle_goal: 'El objetivo es conseguir sonidos interesantes lo más rápido posible.',
  cottle_panic: 'Que no cunda el pánico. Este capítulo busca empujar los límites y prepararte para discusiones posteriores.',
  cottle_magic: 'Los arrays tienen muchas aplicaciones, pero la expansión multicanal roza la magia.',
  parmenter_ugen: 'Los UGens de SuperCollider ofrecen un sistema modular eficiente para crear redes de audio complejas.',
  parmenter_synthdef: 'Toda la síntesis se hace en el servidor, y siempre se crea un SynthDef.',
  wilson_ways: 'SC no le presenta a quien lo usa una única manera «preferida» de trabajar.',
  ins: 'A veces SuperCollider solo no alcanza, y querés recibir datos de dispositivos externos o de otros programas.',
  kuivila: 'Los patterns son análogos a la notación musical: representaciones abstractas de secuencias, independientes de cualquier interpretación concreta.',
  jit: 'En lugar de planificar de antemano y ofrecer una gran cantidad de parámetros, podemos modificar el propio programa mientras corre.',
  sonif: 'La sonificación hace audible lo inaudible.',
  space: 'La noción de sonido espacial es una tautología, porque el sonido es en sí mismo un fenómeno espacial.',
  ml: 'La escucha automática es la capacidad de las máquinas de simular habilidades auditivas y musicales humanas.',
  micro: 'La idea de componer música y sonido a partir de partículas diminutas ha sido un campo interesante tanto para la investigación científica como artística.',
  tuning: 'Un lenguaje de programación de audio transforma la composición, la interpretación y la apreciación de sistemas alternativos de altura.',
  stoch: 'Cualquier algoritmo puede ser material de partida para la síntesis sonora y la composición algorítmica.',
  tweets: 'Ahí podés encontrar drones, composiciones completas, piezas minimalistas, música de baile y una enorme variedad de ruidos y procesos aleatorios.',
},
tips: [
  { t: 'Bajá el volumen general', b: 'Antes de experimentar, poné el volumen maestro en -12 dB o menos. Lo podés cambiar con «s.volume» o desde ⚙.' },
  { t: 'Un limitador al final', b: 'Si vas a tocar en vivo o a experimentar con realimentación, poné un «Limiter» al final de la cadena. Tus oídos te lo van a agradecer.' },
  { t: 'Ctrl + . es tu amigo', b: 'Corta todos los sonidos, rutinas y patterns. Acostumbrate a usarlo sin pensar.' },
  { t: 'poll para ver adentro del servidor', b: 'Las señales viven en el servidor y no las podés imprimir con postln. «poll» las muestrea y las manda a la post window.' },
  { t: 'postln y debug', b: '«postln» imprime y devuelve el mismo valor: lo podés intercalar en medio de una expresión. «debug» agrega una etiqueta.' },
  { t: 'Mirá tu grafo', b: '«dumpUGens» lista los UGens de un SynthDef. En esta app, además, el panel Grafo de UGens dibuja cada synth que suena y muestra su actividad.' },
  { t: 'kr para lo lento', b: 'LFOs, envolventes y controles van a control rate («kr»): se calculan una vez por bloque de 64 o 128 muestras.' },
  { t: 'Compilá una vez', b: 'Definí tus instrumentos con SynthDef al principio y después creá Synths. «{ }.play» es cómodo para probar, pero compila cada vez.' },
  { t: '{ }.play para bocetar', b: 'Para ideas rápidas, «{ }.play» es perfecto. Cuando el sonido te guste, pasalo a un SynthDef con argumentos.' },
  { t: 'Un bloque, una idea', b: 'Agrupá el código entre paréntesis «( … )» y ejecutalo con Ctrl + Enter. Un bloque por idea hace que tus archivos sean fáciles de tocar en vivo.' },
  { t: 'Argumentos con nombre', b: 'Escribí «freq:» y «mul:» en vez de depender del orden. El código se lee mejor y es más difícil equivocarse.' },
  { t: 'Rand en el servidor, rrand en el lenguaje', b: '«rrand» se evalúa una vez al compilar un SynthDef. Para que cada synth sea distinto usá «Rand», «ExpRand» o «TRand».' },
  { t: 'Sacá la continua', b: 'Las fuentes caóticas, las distorsiones asimétricas y algunos osciladores tienen DC. «LeakDC.ar» la elimina sin cambiar el sonido.' },
  { t: 'Muchas voces, Splay', b: 'Para mezclar muchas voces, «Splay» las reparte en estéreo y compensa el nivel. Mucho mejor que sumar todo en mono.' },
  { t: 'Pensá en dB', b: 'Nuestro oído es logarítmico. «dbamp» y «ampdb» convierten entre decibeles y amplitud: -6 dB es la mitad.' },
  { t: 'fadeTime largo', b: 'En live coding con Ndef, un «fadeTime» de varios segundos convierte cada cambio en una transición musical.' },
  { t: 'Pdef para cambiar sin cortar', b: 'Con Pdef podés reescribir un pattern mientras suena: el cambio entra en el próximo pulso.' },
  { t: 'Pensá en BPM', b: 'El tempo de TempoClock está en pulsos por segundo: «128/60» es 128 BPM.' },
  { t: 'wait dentro de una rutina', b: '«wait» sólo funciona dentro de «fork» o «Routine». Si ves «yield was called outside of a Routine», envolvé tu código.' },
  { t: 'Semillas para el azar', b: 'Fijá «thisThread.randSeed» al principio de una pieza generativa para poder repetir una versión que te gustó.' },
  { t: 'gate y doneAction', b: 'Un instrumento sostenido necesita «gate» y una envolvente con sostenido; uno percusivo, «doneAction: 2». Si no, los synths se acumulan.' },
  { t: 'Controles con nombre', b: '«\\freq.kr(440, 0.1)» crea un control llamado freq con suavizado de 0.1 s, sin declarar argumentos.' },
  { t: 'Probá tus envolventes', b: '«Env.plot» las dibuja y «Env.test» las hace sonar con una senoidal. Ajustá curvas hasta que el ataque y la caída suenen naturales.' },
  { t: 'Chorus gratis', b: 'Dos osciladores apenas desafinados en canales distintos («[440, 441]») producen batidos lentos y una imagen estéreo amplia.' },
],
ref: {
  SinOsc: 'Oscilador senoidal con tabla de ondas. La base de casi todo.', FSinOsc: 'Senoidal muy eficiente (resonador), sin modulación de fase.', SinOscFB: 'Senoidal con realimentación de fase: de seno a algo parecido a una sierra.',
  Saw: 'Diente de sierra limitada en banda. Todos los armónicos, 1/n.', Pulse: 'Pulso limitado en banda con ancho variable.', LFSaw: 'Sierra no limitada en banda, ideal como LFO.', LFPulse: 'Pulso no limitado en banda, salida 0 a 1. Ritmos y compuertas.', LFTri: 'Triangular no limitada en banda.', LFPar: 'Onda parabólica (casi senoidal) barata.', LFCub: 'Onda cúbica (casi senoidal) barata.', VarSaw: 'Triangular/sierra de pendiente variable.', SyncSaw: 'Sierra con sincronía dura.', Blip: 'Tren de pulsos con número de armónicos controlado.', Formant: 'Oscilador de formantes (fundamental, formante y ancho).', PMOsc: 'Modulación de fase: portadora, moduladora e índice.', Klang: 'Banco de osciladores senoidales.', Impulse: 'Impulsos periódicos de una muestra. Disparador por excelencia.',
  WhiteNoise: 'Ruido blanco: misma energía por frecuencia.', PinkNoise: 'Ruido rosa: misma energía por octava.', BrownNoise: 'Ruido browniano: más grave.', GrayNoise: 'Ruido gris (por inversión de bits).', ClipNoise: 'Ruido de valores -1 o 1.', Dust: 'Impulsos aleatorios (0 a 1) con densidad media.', Dust2: 'Impulsos aleatorios bipolares.', LFNoise0: 'Valores al azar escalonados.', LFNoise1: 'Valores al azar con interpolación lineal.', LFNoise2: 'Valores al azar con interpolación suave.', LFClipNoise: 'Valores -1 o 1 al azar, escalonados.', Crackle: 'Ruido caótico crepitante.', Logistic: 'Mapa logístico: del orden al caos.', HenonN: 'Mapa de Hénon sin interpolación.', Gendy1: 'Síntesis estocástica dinámica de Xenakis.',
  RLPF: 'Pasa bajos resonante (corte y rq).', RHPF: 'Pasa altos resonante.', LPF: 'Pasa bajos de segundo orden.', HPF: 'Pasa altos de segundo orden.', BPF: 'Pasa banda.', BRF: 'Rechaza banda (notch).', Resonz: 'Resonador pasa banda de ganancia constante.', Ringz: 'Resonador que suena al recibir impulsos (decaimiento en segundos).', Formlet: 'Resonador con ataque y decaimiento.', MoogFF: 'Filtro escalera estilo Moog.', MidEQ: 'Ecualizador paramétrico de pico.', BLowShelf: 'Ecualizador de estante grave.', BHiShelf: 'Ecualizador de estante agudo.', OnePole: 'Filtro de un polo (suavizado).', LeakDC: 'Elimina la componente continua.', Lag: 'Suaviza cambios bruscos (portamento).', Decay: 'Decaimiento exponencial de impulsos.', Decay2: 'Decaimiento con ataque: envolvente para impulsos.', Slew: 'Limita la velocidad de cambio.', Klank: 'Banco de resonadores (frecuencias, amplitudes, decaimientos).',
  DelayN: 'Retardo sin interpolación.', DelayL: 'Retardo con interpolación lineal (para modular).', DelayC: 'Retardo con interpolación cúbica.', CombN: 'Eco con realimentación.', CombL: 'Eco con realimentación interpolado.', AllpassN: 'Allpass: difusión para reverbs.', AllpassC: 'Allpass interpolado.', FreeVerb: 'Reverb Freeverb (mezcla, sala, amortiguación).', FreeVerb2: 'Freeverb estéreo.', GVerb: 'Reverb de sala grande, estéreo.', PitchShift: 'Transposición granular en tiempo real.', Pluck: 'Cuerda pulsada Karplus-Strong.', LocalIn: 'Lee la realimentación interna del synth.', LocalOut: 'Escribe la realimentación interna del synth.',
  Env: 'Forma de envolvente: niveles, tiempos y curvas.', EnvGen: 'Ejecuta una Env; gate y doneAction.', Line: 'Rampa lineal.', XLine: 'Rampa exponencial.', Linen: 'Envolvente trapezoidal simple con gate.', DetectSilence: 'Detecta silencio y puede liberar el synth.',
  Latch: 'Sample & hold.', TRand: 'Valor al azar en cada disparo.', TIRand: 'Entero al azar en cada disparo.', TExpRand: 'Valor exponencial al azar por disparo.', Rand: 'Valor al azar al crear el synth.', ExpRand: 'Valor exponencial al azar al crear el synth.', IRand: 'Entero al azar al crear el synth.', Stepper: 'Contador por disparos con límites.', PulseCount: 'Cuenta disparos.', PulseDivider: 'Divide la cantidad de disparos.', ToggleFF: 'Alterna entre 0 y 1 con cada disparo.', Trig: 'Mantiene el valor del disparo durante un tiempo.', Trig1: 'Pulso de duración fija por disparo.', Sweep: 'Rampa que se reinicia con un disparo.', Phasor: 'Rampa cíclica entre dos valores.', CoinGate: 'Deja pasar disparos con cierta probabilidad.', Select: 'Elige una señal de un array según un índice.',
  Demand: 'Pide valores a D-UGens en cada disparo.', Duty: 'Avanza por una secuencia con duraciones.', TDuty: 'Como Duty, pero emite disparos.', Dseq: 'Secuencia en el servidor.', Drand: 'Elección al azar en el servidor.', Dxrand: 'Al azar sin repetir el anterior.', Dshuf: 'Lista barajada.', Dwhite: 'Valores al azar en un rango.', Dseries: 'Serie aritmética.',
  Out: 'Escribe en un bus (salida o privado).', In: 'Lee un bus.', ReplaceOut: 'Reemplaza el contenido de un bus.', OffsetOut: 'Out con precisión de muestra.', SoundIn: 'Entrada de micrófono.', Pan2: 'Paneo estéreo de potencia constante.', LinPan2: 'Paneo estéreo lineal.', Balance2: 'Balance de una señal estéreo.', Rotate2: 'Rota un campo sonoro de dos canales.', Splay: 'Reparte un array de voces en estéreo.', Mix: 'Suma un array de señales.', XFade2: 'Crossfade de potencia constante.', MouseX: 'Posición horizontal del mouse.', MouseY: 'Posición vertical del mouse.', MouseButton: 'Estado del botón del mouse.', Bus: 'Reserva buses de audio o de control.',
  Amplitude: 'Seguidor de envolvente.', Pitch: 'Estimación de la frecuencia fundamental.', ZeroCrossing: 'Frecuencia por cruces por cero.', Peak: 'Pico máximo hasta el reinicio.', RunningMax: 'Máximo móvil.', Limiter: 'Limitador de picos.', Compander: 'Compresor / expansor / gate.', Poll: 'Imprime el valor de una señal.',
  GrainSin: 'Granos senoidales por disparo.', GrainFM: 'Granos FM por disparo.',
  SynthDef: 'Define un instrumento con nombre.', Synth: 'Crea y controla un nodo de síntesis.', Routine: 'Función que puede pausarse con wait/yield.', Task: 'Rutina que se puede pausar y reanudar.', TempoClock: 'Reloj con tempo en pulsos por segundo.', Pbind: 'Une claves y patterns en eventos.', Pseq: 'Recorre una lista.', Prand: 'Elige al azar de una lista.', Pxrand: 'Al azar sin repetir.', Pwrand: 'Al azar con pesos.', Pshuf: 'Lista barajada.', Pwhite: 'Números al azar uniformes.', Pexprand: 'Números al azar exponenciales.', Pbrown: 'Caminata aleatoria.', Pseries: 'Serie aritmética.', Pgeom: 'Serie geométrica.', Pn: 'Repite un pattern.', Pdup: 'Repite cada valor n veces.', Pfunc: 'Valor calculado por una función.', Pkey: 'Lee otra clave del evento.', Ppar: 'Patterns en paralelo.', Pdef: 'Pattern con nombre, reemplazable en vivo.', Ndef: 'Proxy de sonido con nombre (JITLib).', ProxySpace: 'Entorno donde ~x son proxies.', Scale: 'Escalas de muchas tradiciones.', Tuning: 'Afinaciones (12-TET, justa, pitagórica, EDO).', MIDIdef: 'Responde a mensajes MIDI.', Array: 'Lista de valores con muchas operaciones.', Function: 'Código diferido entre llaves.', Event: 'Diccionario que sabe tocarse (nota).', Operators: 'Operadores matemáticos y de conversión.',
},
labs: {
  osc: { t: 'Osciladores', d: 'Formas de onda, armónicos y paneo. Mirá cómo cambian el osciloscopio y el espectro.', tip: 'Activá MouseX → freq y recorré la pantalla con el mouse. Con Blip, subí los armónicos y mirá el espectro.' },
  sub: { t: 'Sintetizador sustractivo', d: 'Oscilador, filtro resonante, envolvente ADSR y LFO, con teclado. El código es un SynthDef completo.', tip: 'Tocá con el teclado en pantalla o con tu computadora (fila A–K). Activá el arpegio y mové el corte mientras suena.' },
  fm: { t: 'Síntesis FM', d: 'Portadora, razón e índice. Las bandas laterales aparecen en el espectro.', tip: 'Razones enteras: timbres armónicos. 1.414 o 3.5: campanas. Activá la envolvente en el índice para sonidos percusivos.' },
  add: { t: 'Síntesis aditiva', d: 'Dieciséis armónicos que dibujás con el mouse, como los drawbars de un órgano.', tip: 'Probá los presets y después estirá la serie (stretch): con valores distintos de 1 los parciales se vuelven inarmónicos.' },
  env: { t: 'Editor de envolventes', d: 'Dibujá una Env arrastrando puntos. El código «Env(...)» se actualiza solo.', tip: 'Doble clic agrega un punto. La curva negativa da ataques rápidos y caídas naturales.' },
  seq: { t: 'Secuenciador de patterns', d: 'Dieciséis pasos y ocho grados de la escala. Se convierte en un Pbind dentro de un Pdef.', tip: 'Varias casillas en el mismo paso forman un acorde. Cambiá la escala sin parar: Pdef la toma en el próximo compás.' },
  gran: { t: 'Granular', d: 'Nubes de granos senoidales o FM. Densidad, tamaño, altura y dispersión.', tip: 'Mirá el sonograma (SONO). Granos de menos de 5 ms pierden la altura; con Impulse en lugar de Dust aparecen formantes.' },
  tune: { t: 'Afinación', d: 'Dividí la octava en N partes y comparalas con los intervalos justos.', tip: '12, 19, 31 y 53 EDO se acercan mucho a los intervalos justos. Compará los tres acordes.' },
  fx: { t: 'Cadena de efectos', d: 'Saturación, eco, filtro y reverb sobre distintas fuentes.', tip: 'El orden importa: saturar antes del eco no suena igual que después. Probá con el código.' },
  chaos: { t: 'Caos y síntesis no estándar', d: 'Gendy1, mapas caóticos y ruido escalonado.', tip: 'Subí el caos de a poco: hay zonas donde el sonido se ordena y otras donde estalla.' },
},
book: {
  about: 'Editado por Scott Wilson, David Cottle y Nick Collins, con prólogo de James McCartney (el creador de SuperCollider), *The SuperCollider Book* es la obra de referencia sobre el lenguaje: tutoriales para principiantes, capítulos avanzados sobre patterns, live coding, microsonido, espacialización, afinaciones, escucha automática, y una mirada al interior del lenguaje y del servidor. La segunda edición (MIT Press, 2025) actualiza todo el material para SuperCollider 3.13 y suma capítulos nuevos.',
  disclaimer: [
    'SuperCollider Lab es un proyecto educativo, independiente y sin fines de lucro de Buenos Aires Front · U-MA. **No está afiliado, patrocinado ni aprobado** por MIT Press, por los editores y autores de *The SuperCollider Book* ni por el proyecto SuperCollider.',
    'El libro se usó como **referencia** para organizar el temario. Las citas son **breves, textuales y con atribución** (autor, capítulo y edición), y se incluyen con fines de enseñanza, comentario y crítica, en el marco del derecho de cita y del uso legítimo (fair use). Las traducciones de las citas son libres y propias. Todos los derechos sobre el libro pertenecen a MIT Press y a sus autores.',
    'Las explicaciones, los ejemplos de código, los ejercicios y el motor de audio de esta aplicación son **originales**. No se reproducen capítulos, figuras ni listados del libro, y esta herramienta **no reemplaza** su lectura.',
    'Usar SuperCollider Lab **no implica** haber leído el libro, ni que sus autores revisen o respalden este contenido. Cualquier error es responsabilidad nuestra.',
    'Si este material te resulta útil, **comprá el libro**: es la mejor manera de apoyar a quienes lo escribieron y de profundizar todo lo que acá apenas se presenta. Encontrás los enlaces de compra arriba.',
    'Si sos titular de derechos y querés que modifiquemos o retiremos alguna cita, escribinos por Instagram (@buenos.aires.front) o abrí un issue en el repositorio de GitHub y lo resolvemos de inmediato.',
  ],
  how: [
    'El recorrido del curso sigue la ruta que el propio libro recomienda a quienes empiezan: el tutorial del capítulo 1, los UGens del capítulo 2, la composición del capítulo 3 y las entradas y salidas del capítulo 4. Después vienen los temas de las partes avanzadas y prácticas.',
    'Cada lección indica los capítulos relacionados, para que puedas seguir leyendo. En el mapa de abajo ves qué lecciones se apoyan en cada capítulo.',
    'El código oficial del libro (para SuperCollider de escritorio) está publicado por la comunidad en GitHub. Esta app implementa un subconjunto de SuperCollider en el navegador: algunos ejemplos del libro funcionan tal cual y otros necesitan la versión de escritorio (buffers, GUI, OSC, NRT, plugins).',
  ],
},
};
})();
