// SW version — bump this when deploying breaking changes to the SW itself.
const SW_VERSION = "1"
const CACHE_NAME = `jump-clone-sw-v${SW_VERSION}`

// These files must always be fetched fresh — serving them from cache would
// mean stale boot logic runs on new deploys before the cache is cleared.
const BYPASS_CACHE = ["/pages/loading/loading.js", "/pages/loading/loading.html"]

self.addEventListener("install", () => self.skipWaiting())

// On activate, delete ALL old caches (from any previous SW version or naming scheme).
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    )
})

// Cache-First for all requests except GitHub API and the loading entry-points.
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url)

    if (url.hostname === "api.github.com") return
    if (BYPASS_CACHE.some(p => url.pathname === p)) return

    event.respondWith(
        caches.open(CACHE_NAME).then(cache =>
            cache.match(event.request).then(cached => {
                if (cached) return cached
                return fetch(event.request).then(response => {
                    if (response?.status === 200 && response.type === "basic") {
                        cache.put(event.request, response.clone())
                    }
                    return response
                })
            })
        )
    )
})
