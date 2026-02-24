const CACHE_VERSION = "0.2.10"
const CACHE_NAME = `jump-clone-v${CACHE_VERSION}`

// No pre-caching during install — loading.js handles the explicit bulk cache pass.
self.addEventListener("install", () => {
    self.skipWaiting()
})

// On activate, delete any stale jump-clone-v* caches from previous versions.
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((k) => k.startsWith("jump-clone-v") && k !== CACHE_NAME)
                    .map((k) => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    )
})

// Cache-First strategy for all requests except version.json (always network).
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url)

    // version.json must always come from the network so updates are detected.
    if (url.pathname === "/version.json") return

    event.respondWith(
        caches.open(CACHE_NAME).then((cache) =>
            cache.match(event.request).then((cached) => {
                if (cached) return cached
                return fetch(event.request).then((response) => {
                    if (response && response.status === 200 && response.type === "basic") {
                        cache.put(event.request, response.clone())
                    }
                    return response
                })
            })
        )
    )
})
