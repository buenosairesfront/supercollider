# Idiomas

| Código | Idioma | `lang` del documento | Archivo |
|---|---|---|---|
| `es` | Español (idioma base) | `es` | `content/es.js` |
| `en` | English | `en` | `content/en.js` |
| `de` | Deutsch | `de` | `content/de.js` |
| `zh` | 中文 (simplificado) | `zh-Hans` | `content/zh.js` |
| `ja` | 日本語 | `ja` | `content/ja.js` |
| `hi` | हिन्दी | `hi` | `content/hi.js` |

## Cómo se elige

1. Parámetro de URL `?lang=xx` (también queda guardado).
2. Lo último elegido en ⚙ → Idioma (`localStorage`, clave `sclab.v1`).
3. Idioma del navegador, si es uno de los seis.
4. Español.

Sólo se descarga el archivo del idioma activo (más español e inglés como respaldo).

## Qué se traduce

Toda la interfaz, los 7 módulos, las 30 lecciones (texto, títulos de los ejemplos, quiz, desafío, criterios y pista), los 24 consejos, las ~155 descripciones de la referencia, los 10 laboratorios y la página de recursos.

No se traducen, a propósito: el código de SuperCollider (clases, mensajes, comentarios en inglés como en la documentación oficial) ni los nombres técnicos de UGens.

## Formato de los textos

En `les.lXX.body` (con `String.raw`):

- Párrafos separados por una línea en blanco.
- `## Título` → subtítulo.
- `- ítem` → lista.
- `[[c1]]` → bloque de código `c1` de `content/course.js`.
- `!! texto` → recuadro de consejo pro.
- Inline: `«código»`, `**negrita**`, `*cursiva*`, `[texto](url)`.

## Agregar un idioma

1. Copiá `content/en.js` a `content/xx.js` y cambiá `.en =` por `.xx =`.
2. Traducí los valores (no las claves). Mantené los marcadores `[[c1]]` y el mismo número de opciones (4) y de criterios en cada desafío.
3. En `js/app.js`, sumá el código en `LANGS`, el nombre en `LANG_NAMES` y el `lang` en `DOC_LANG`.
4. En `sw.js`, sumá el archivo a `FILES`.
5. Si el alfabeto no es latino, sumá una fuente de respaldo en `--disp` y `--mono` (`css/app.css`).
6. Corré `node tests/check-i18n.js`: lista todo lo que falte.
