# Cómo agregar contenido

## Una lección

1. En `content/course.js`, dentro del módulo, agregá:

```js
L('l31', { min: 12,
  cells: { c1: '{ SinOsc.ar(440) * 0.1 }.play;' },
  quiz: { answer: 2 },              // índice (0–3) de la opción correcta
  challenge: { starter: '// ...\n', checks: [{ ugen: 'SinOsc' }, { sound: true }] },
}),
```

2. En **cada** `content/<idioma>.js`, en `les`, agregá `l31` con `t`, `s`, `cells`, `body`, `quiz` (`q`, 4 opciones `o`, explicación `e`) y `ch` (`task`, `checks` con una etiqueta por criterio, `hint`).
3. Corré `node tests/run-tests.js` (el código tiene que correr sin errores y sonar) y `node tests/check-i18n.js`.

### Criterios de desafío disponibles

| Criterio | Pasa cuando |
|---|---|
| `{ ugen: 'X' }` | un synth del intento usa el UGen X |
| `{ anyUgen: [...] }` | usa alguno de la lista |
| `{ sound: true }` | se creó un synth, sonó una nota o hubo señal |
| `{ notes: n }` | sonaron al menos n notas de patterns/eventos |
| `{ value: v => … }` | el valor devuelto cumple la función |
| `{ fn: ctx => … }` | función libre (`ctx.I` es el intérprete) |
| `{ code: /regex/ }` | el código coincide |
| `{ maxChars: n }` | el código tiene n caracteres o menos |
| `{ defAdded: true }` | se agregó un SynthDef |
| `{ synths: n }` | se crearon al menos n synths |
| `{ channels: n }` | la salida tiene al menos n canales |
| `{ busOut: true }` | se escribió en un bus privado |
| `{ midi: true }` | hay un MIDIdef activo |
| `{ ndefVersions: n }` | un Ndef fue definido n veces |

## Un consejo

Agregá `{ cat, code }` a `tips` en `course.js` y `{ t, b }` en la misma posición en cada idioma. Categorías: `safe`, `debug`, `perf`, `style`, `mix`, `live`, `time`, `synth`.

## Un laboratorio

En `js/labs.js`, `def('id', 'NN', 'paper', (api, lab) => { … })`. Para casos simples, `ndefLab(api, lab, build, params, extra)` arma todo: `build(state)` devuelve el código de SuperCollider y `params` son los sliders (cada uno se actualiza con `Ndef(\lab).set`). Agregá `labs.id` (`t`, `d`, `tip`) en cada idioma.

## Un UGen nuevo

1. DSP en `js/dsp.js`: `U('Nombre', (u, ctx) => n => { … u.ins[i][k] … u.outs[0][k] = … })`.
2. Firma en `js/sclib.js`: `S('Nombre', 'in=0 freq=440', { nout, ma })`.
3. Si va en la referencia, sumalo a `ref` en `course.js` y su descripción en cada idioma.
