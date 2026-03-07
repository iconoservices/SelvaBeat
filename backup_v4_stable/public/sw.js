/**
 * 🛰️ SelvaBeat Service Worker - El Guardián de la Selva
 * Corregido: Remoción de intercepción de Blobs multimedia (Evitar Byte-Range Error).
 * Solo maneja caché de assets estáticos del shell para el Shell PWA.
 */

const CACHE_NAME = 'selvabeat-v1.2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/vite.svg',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
});

self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // 🛡️ BYPASS ESTRATÉGICO: InocoOS es zona de exclusión para el SW
    // Dejamos que el navegador maneje la red pura para evitar overhead y problemas de CORS/Opaque.
    if (url.hostname.includes('workers.dev') || url.pathname.includes('/stream/proxy')) {
        return;
    }

    if (event.request.mode === 'navigate') {
        event.respondWith(caches.match('/index.html'));
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            // 🚀 Fallback robusto: Si no hay cache, ve a red.
            // Si red falla, devolvemos una respuesta de error controlada (no null) para evitar TypeErrors.
            return response || fetch(event.request).catch(() =>
                new Response(JSON.stringify({ error: "Red inestable en la selva" }), {
                    status: 503,
                    headers: { "Content-Type": "application/json" }
                })
            );
        })
    );
});
