/* Service worker de Bitácora.
   Guarda la app en el teléfono para que abra sin internet.
   Sube el número de CACHE cada vez que cambies index.html. */
const CACHE = "bitacora-v27";
const FILES = [
  ".",
  "index.html",
  "manifest.webmanifest",
  "assets/icon-180.png",
  "assets/icon-192.png",
  "assets/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(FILES))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Red primero, caché como red de seguridad: así ves los cambios al
   recargar con internet, y sigue abriendo cuando no hay cobertura. */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  /* El sello de version se pregunta siempre a la red: es justo lo que sirve
     para detectar que hay algo nuevo, cachearlo lo haria inutil. */
  if (e.request.url.indexOf("version.json") !== -1) return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match("index.html")))
  );
});

/* ───────── aviso con la app cerrada ─────────
   Cuando el servidor empuja el fin del descanso, el sistema despierta a este
   service worker aunque la app no esté abierta, y él muestra la notificación. */
self.addEventListener("push", event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) {}

  event.waitUntil(
    self.registration.showNotification(data.title || "Descanso terminado", {
      body: data.body || "A por la siguiente serie.",
      icon: "assets/icon-192.png",
      badge: "assets/icon-192.png",
      tag: "bitacora-rest",
      renotify: true,
      requireInteraction: true,
      vibrate: [300, 100, 300, 100, 300]
    })
  );
});

/* Al tocar la notificación: si la app ya está abierta la traemos al frente,
   y si no, la abrimos. */
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if ("focus" in c) return c.focus();
      }
      return self.clients.openWindow(".");
    })
  );
});
