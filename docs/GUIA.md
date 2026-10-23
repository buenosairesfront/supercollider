# Guía de uso

## Primer sonido

1. Abrí la app y entrá a **Curso → 01 Hola, SuperCollider** (o usá el bloque "Probalo ahora" del inicio).
2. Hacé clic en **▶ Ejecutar** o poné el cursor en el código y apretá **Ctrl + Enter**. El primer sonido enciende el servidor (el navegador necesita un clic o una tecla antes de reproducir audio).
3. Para parar: **Ctrl + .** o el botón **STOP** de arriba.

Empezá con el volumen bajo. La salida está recortada a 0 dBFS (⚙ → protección auditiva).

## Las secciones

- **Inicio**: tu progreso (XP, nivel, lecciones, racha), el mapa del curso, el consejo del día, los recursos e insignias.
- **Curso**: 7 módulos y 30 lecciones. Cada lección tiene ejemplos ejecutables, consejo, quiz y desafío. Las estrellas indican: ejecutaste un ejemplo, respondiste el quiz, superaste el desafío.
- **Laboratorio**: 10 superficies de control. Mové los controles y mirá cómo cambia el código; ▶ Tocar ejecuta, ■ Parar detiene, ⧉ lleva el código a Código libre.
- **Código libre**: tus archivos (se guardan solos en el navegador), ejemplos listos, ejecutar bloque o todo, grabar a WAV y descargar `.scd`.
- **Referencia**: buscador de clases y UGens con firma, descripción, botón ▶ Probar y enlaces a las lecciones que los usan. **Ctrl + D** sobre una palabra en cualquier editor la abre acá. Clic en un nodo del grafo de UGens también.
- **Consejos**: 24 tarjetas por categoría.
- **Recursos**: enlaces al sitio oficial, la documentación, el tutorial de inicio, el foro, sccode.org y el código fuente de SuperCollider.

## El monitor (columna derecha; abajo en el celular)

- **SCOPE / FFT / X/Y / SONO**: osciloscopio (cian = izquierdo, magenta = derecho), espectro, imagen estéreo y sonograma. En el celular, tocar y arrastrar sobre el scope mueve `MouseX`/`MouseY`.
- **PEAK, CPU, SYNTHS, UGENS** y medidores L/R.
- **Plot**: aparece cuando usás `.plot`.
- **Grafo de UGens**: el último synth que sonó, con cada nodo iluminado según su señal.
- **Árbol de nodos**: los synths activos; × libera uno.
- **Eventos**: piano roll de las notas de patterns y rutinas.
- **Post window**: resultados (`->`), `postln`, `poll` y errores.

## Desafíos

Escribí tu código en el recuadro magenta y ejecutalo. Los criterios se marcan solos durante unos segundos (algunos esperan a que suenen notas). La pista muestra una ayuda.

## Progreso

Todo se guarda en este navegador. Desde ⚙ podés exportarlo a `.json`, importarlo en otro dispositivo o borrarlo.

## Teclado

| Atajo | Acción |
|---|---|
| Shift + Enter | Ejecutar línea o selección |
| Ctrl/Cmd + Enter | Ejecutar bloque `( … )` (en los ejemplos de lección, todo el bloque) |
| Ctrl/Cmd + . | Parar todo |
| Ctrl/Cmd + D | Referencia de la palabra bajo el cursor |
| Tab / Shift + Tab | Indentar / desindentar |
| A W S E D F T G Y H U J K | Teclado musical en el laboratorio sustractivo y la lección 20 |
