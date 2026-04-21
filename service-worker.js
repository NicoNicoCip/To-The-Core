const CACHE = "jump-clone-cache"

const BYPASS = ["/pages/loading/loading.html", "/pages/loading/loading.js", "/index.html", "/src/assets.js"]

self.addEventListener("install", () => self.skipWaiting())

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url)

    if (url.origin !== self.location.origin) {
        return
    }

    if (BYPASS.some(p => url.pathname === p)) {
        return
    }

    if (event.request.method !== "GET") {
        return
    }

    event.respondWith(
        caches.open(CACHE).then(cache =>
            cache.match(event.request).then(cached => {
                if (cached) {
                    return cached
                }
                return fetch(event.request)
            })
        )
    )
})
