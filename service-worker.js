// No pre-caching during install — loading.js handles the explicit bulk cache pass.
self.addEventListener("install", () => self.skipWaiting())

// On activate, claim all clients immediately.
self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim())
})

// Cache-First: serve from whichever jump-clone-v* cache loading.js populated.
// GitHub API calls bypass the SW so version checks always hit the network.
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url)
    if (url.hostname === "api.github.com") return

    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached
            return fetch(event.request).then((response) => {
                if (response?.status === 200 && response.type === "basic") {
                    caches.open("jump-clone-v_sw").then(c => c.put(event.request, response.clone()))
                }
                return response
            })
        })
    )
})
