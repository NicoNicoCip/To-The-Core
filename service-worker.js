const CACHE = "jump-clone-cache"

// loading.html and loading.js must always come from the network so the boot
// logic is never stale — the loading page is responsible for managing the cache.
const BYPASS = ["/pages/loading/loading.html", "/pages/loading/loading.js", "/index.html", "/src/assets.js"]

self.addEventListener("install", () => self.skipWaiting())

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim())
})

// Pure serve-only Cache-First. The SW never writes to the cache on its own —
// only serves what loading.js has explicitly put there. This prevents stale
// opportunistic writes from shadowing a version update.
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url)

    // Let the browser handle cross-origin requests (GitHub API, etc.) natively.
    if (url.origin !== self.location.origin) return

    // Always fetch bypass paths from the network so boot logic is always current.
    if (BYPASS.some(p => url.pathname === p)) return

    // Only handle GET — ignore POST, etc.
    if (event.request.method !== "GET") return

    event.respondWith(
        caches.open(CACHE).then(cache =>
            cache.match(event.request).then(cached => {
                if (cached) return cached
                // Cache miss: fetch from network (don't store — loading.js owns writes).
                return fetch(event.request)
            })
        )
    )
})
