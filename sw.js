/* SuperCollider Lab · U-MA — service worker: works offline after the first visit */
const CACHE = 'sclab-1.1';
const FILES = [
  './', 'index.html', 'css/app.css', 'icon.svg', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png',
  'js/dsp.js', 'js/worklet.js', 'js/lang.js', 'js/sclib.js', 'js/patterns.js', 'js/engine.js', 'js/editor.js', 'js/viz.js', 'js/labs.js', 'js/app.js',
  'content/course.js', 'content/es.js', 'content/en.js', 'content/de.js', 'content/zh.js', 'content/ja.js', 'content/hi.js',
];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // stale-while-revalidate for our files and Google Fonts
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(req, { ignoreSearch: url.origin === location.origin });
    const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
