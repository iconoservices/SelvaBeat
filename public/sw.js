const CACHE_NAME = 'selvaflix-shell-v1';
const DYNAMIC_CACHE = 'selvaflix-dynamic-v1';

// Recursos estáticos que forman el "caparazón" de la app
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
];

// Instalación: Cachear el shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('🌴 Service Worker: Cacheando Shell');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activación: Limpieza de cachés viejos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME && key !== DYNAMIC_CACHE)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Estrategia de Carga: Network First para Datos, Stale-While-Revalidate para Shell
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // 1. Estrategia para Datos (Firebase / TMDB / APIs) -> NETWORK FIRST
    // Queremos que la selva siempre esté fresca
    if (url.origin.includes('firebase') || url.origin.includes('tmdb') || url.origin.includes('googleapis')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const clonedResponse = response.clone();
                    caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clonedResponse));
                    return response;
                })
                .catch(() => caches.match(request)) // Si hay error o no hay red, usa lo que tengas
        );
        return;
    }

    // 2. Estrategia para Assets (Imágenes de posters, fuentes, etc.) -> STALE-WHILE-REVALIDATE
    // Carga rápido, actualiza después
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            const fetchPromise = fetch(request).then((networkResponse) => {
                caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, networkResponse.clone()));
                return networkResponse;
            });
            return cachedResponse || fetchPromise;
        })
    );
});
