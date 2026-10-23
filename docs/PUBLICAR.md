# Publicar y enlazar

## GitHub Pages

La app se sirve con GitHub Pages desde la rama `main`, carpeta raíz:

**https://buenosairesfront.github.io/supercollider/**

Si hay que activarlo de nuevo: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**. El archivo `.nojekyll` evita que GitHub procese el sitio con Jekyll. Cada push a `main` actualiza la página en uno o dos minutos.

Al cambiar archivos, subí la versión en `sw.js` (`CACHE = 'sclab-1.x'`) y en los `?v=` de `index.html`, así los navegadores que ya la tienen instalada toman la versión nueva.

## Landing de Buenos Aires Front

Para sumar la app a la sección "Apps web" de la landing, agregá una fila **SuperCollider Lab** con estas dos claves del objeto `LINKS` (igual que el resto de las apps):

```js
repos: { supercollider: "https://github.com/buenosairesfront/supercollider", ... },
demos: { supercollider: "https://buenosairesfront.github.io/supercollider/", ... },
```

Texto sugerido para la tarjeta:

- **Título:** SuperCollider Lab
- **Bajada:** Aprendé SuperCollider en el navegador: 30 lecciones, 10 laboratorios y live coding, con un motor de síntesis en tiempo real. ES · EN · DE · 中文 · 日本語 · हिन्दी
- **Imagen:** `https://buenosairesfront.github.io/supercollider/og.png` (1200 × 630)
- **Ícono:** `https://buenosairesfront.github.io/supercollider/icons/icon-512.png`

**Probar ↗** abre la app (sin `?lang=` usa el idioma del navegador del visitante). **Código** abre este repositorio. Para enlazar un idioma concreto:

```
https://buenosairesfront.github.io/supercollider/?lang=es
https://buenosairesfront.github.io/supercollider/?lang=en
https://buenosairesfront.github.io/supercollider/?lang=de
https://buenosairesfront.github.io/supercollider/?lang=zh
https://buenosairesfront.github.io/supercollider/?lang=ja
https://buenosairesfront.github.io/supercollider/?lang=hi
```

También se puede enlazar directo a una sección: `#/course`, `#/labs`, `#/free`, `#/ref`, `#/tips`, `#/res`, una lección (`#/l/l08`) o un laboratorio (`#/lab/fm`).

## Instagram

Para el posteo: `og.png` sirve como imagen de enlace. El link en bio puede ir a la landing o directo a `https://buenosairesfront.github.io/supercollider/`.
