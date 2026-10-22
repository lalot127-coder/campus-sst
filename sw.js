// Service worker del Campus (18/10/2026): guarda en el dispositivo lo que ya se abrió para que el campus arranque aunque
// la señal sea débil (Meta Quest, celular, APK). Solo se registra en https (Cloudflare / GitHub Pages), nunca en la red local.
// - Páginas, scripts y acceso/control.json: primero internet (máx. 5 s) y, si no hay, la copia guardada → siempre lo más nuevo.
// - Modelos 3D, texturas, imágenes y three.js local: primero la copia guardada (se actualiza en segundo plano).
const VERSION = 'campus-2026-10-22d';   // 22/10/2026: p10 liberación en las tres celdas, EPP y señalización por riesgo
const BASICO = ['./', './index.html', './manifest.webmanifest', './recursos/logo_CERS.jpeg', './recursos/icono_192.png',
  './motor/vendor/three/build/three.module.js', './motor/vendor/three/examples/jsm/controls/OrbitControls.js',
  './motor/vendor/three/examples/jsm/loaders/FontLoader.js', './motor/vendor/three/examples/jsm/geometries/TextGeometry.js',
  './motor/vendor/three/examples/jsm/loaders/GLTFLoader.js', './motor/vendor/three/examples/jsm/utils/BufferGeometryUtils.js'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(VERSION).then(c => Promise.all(BASICO.map(u => c.add(u).catch(() => { }))))); });
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
  await self.clients.claim(); })()));
const PESADO = /\.(glb|gltf|bin|png|jpe?g|webp|ktx2|hdr|mp3|ogg|wav|woff2?|typeface\.json)$|\/vendor\//i;
async function primeroRed(req) {
  const c = await caches.open(VERSION), u = new URL(req.url), clave = u.pathname.endsWith('/control.json') ? u.origin + u.pathname : req;   // control.json lleva ?t= cada minuto
  try { const r = await Promise.race([fetch(req), new Promise((_, no) => setTimeout(() => no(new Error('lento')), 5000))]);
    if (r && r.ok && r.type === 'basic') c.put(clave, r.clone()); return r; }
  catch (e) { const g = await c.match(clave, { ignoreSearch: req.mode === 'navigate' || clave !== req }); if (g) return g; throw e; } }
async function primeroCopia(req) {
  const c = await caches.open(VERSION), g = await c.match(req);
  const red = fetch(req).then(r => { if (r && r.ok) c.put(req, r.clone()); return r; }).catch(() => null);
  return g || (await red) || Response.error(); }
self.addEventListener('fetch', e => { const req = e.request, u = new URL(req.url);
  if (req.method !== 'GET' || u.origin !== location.origin || u.pathname.includes('/api/')) return;   // multijugador y otros sitios: directo
  e.respondWith(PESADO.test(u.pathname) ? primeroCopia(req) : primeroRed(req)); });
