import { game, obj } from "../../src/system.js"

const CACHE_NAME = "jump-clone-v0.2.10" // keep in sync with service-worker.js
const IS_LOCAL = location.hostname === "localhost" || location.hostname === "127.0.0.1"

const world = document.getElementById("world")
const debug = document.getElementById("debug")

game.register_world(world, 320, 180)

const loading = new obj({
    name: "loading",
    x: game.width / 2 - 96 / 2,
    y: game.height / 2 - 8,
    width: 96,
    height: 16
})

// Fallback list used on GitHub Pages (no server-side API available)
const assets_fallback = [
    "../assets/world1/level1_midground.webp",
    "../assets/world1/level1.webp",
    "../assets/world1/level2_EXT.webp",
    "../assets/world1/level2.webp",
    "../assets/world1/level3.webp",
    "../assets/world1/level4.webp",
    "../assets/background0.webp",
    "../assets/background1.webp",
    "../assets/background2.webp",
    "../assets/background3.webp",
    "../assets/dog_falling_in.webp",
    "../assets/dog_falling.webp",
    "../assets/dog_walking.webp",
    "../assets/dog.webp",
    "../assets/ground.webp",
    "../assets/loading.webp",
    "../assets/play_sign_active.webp",
    "../assets/play_sign.webp",
    "../assets/to_the_core_sign.webp",
    "../assets/undefined.webp"
]

// Absolute paths for the full production cache — includes all HTML, CSS, JS, and assets.
const ALL_ASSETS = [
    "/index.html",
    "/pages/loading/loading.html",
    "/pages/loading/loading.css",
    "/pages/loading/loading.js",
    "/pages/start/start.html",
    "/pages/start/start.css",
    "/pages/start/start.js",
    "/pages/world1/level1.html",
    "/pages/world1/level1.js",
    "/pages/world1/level2.html",
    "/pages/world1/level2.js",
    "/pages/world1/level2_EXT.html",
    "/pages/world1/level2_EXT.js",
    "/pages/world1/level3.html",
    "/pages/world1/level3.js",
    "/pages/world1/level4.html",
    "/pages/world1/level4.js",
    "/pages/world1/world1.css",
    "/pages/index.css",
    "/src/system.js",
    "/src/prefabs.js",
    "/pages/assets/world1/level1_midground.webp",
    "/pages/assets/world1/level1.webp",
    "/pages/assets/world1/level2_EXT.webp",
    "/pages/assets/world1/level2.webp",
    "/pages/assets/world1/level3.webp",
    "/pages/assets/world1/level4.webp",
    "/pages/assets/background0.webp",
    "/pages/assets/background1.webp",
    "/pages/assets/background2.webp",
    "/pages/assets/background3.webp",
    "/pages/assets/dog_falling_in.webp",
    "/pages/assets/dog_falling.webp",
    "/pages/assets/dog_walking.webp",
    "/pages/assets/dog.webp",
    "/pages/assets/ground.webp",
    "/pages/assets/loading.webp",
    "/pages/assets/play_sign_active.webp",
    "/pages/assets/play_sign.webp",
    "/pages/assets/to_the_core_sign.webp",
    "/pages/assets/undefined.webp"
]

game.world.appendChild(loading.graphic)

function preload(src) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = resolve
        img.onerror = reject
        img.src = src
    })
}

// Recursively fetches a Live Server directory listing and extracts file hrefs.
// Live Server renders directory indexes as HTML with <a> tags for each entry.
// Returns null if the response isn't a directory listing (e.g. GitHub Pages returns 404).
async function scan_dir(url) {
    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(500) })
        if (!res.ok) return null
        const text = await res.text()
        if (!text.includes("<a")) return null

        const origin = new URL(url).origin
        const doc = new DOMParser().parseFromString(text, "text/html")

        // Five Server uses protocol-relative hrefs like //pages/assets/file.webp.preview
        // Strip the leading // to get a plain pathname, then filter to entries inside this dir
        const dir_path = new URL(url).pathname
        const links = [...doc.querySelectorAll("a[href]")]
            .map(a => {
                let href = a.getAttribute("href")
                if (href.startsWith("//")) href = href.slice(1)
                return href
            })
            .filter(p => p.startsWith(dir_path) && p !== dir_path)

        let files = []
        for (const pathname of links) {
            if (pathname.endsWith("/")) {
                const sub = await scan_dir(origin + pathname)
                if (sub) files = files.concat(sub)
            } else {
                // Five Server only lists .preview files; strip that suffix to get the real filename
                const real = pathname.endsWith(".preview") ? pathname.slice(0, -".preview".length) : pathname
                files.push(origin + real)
            }
        }
        return files
    } catch {
        return null
    }
}

async function check_assets() {
    const assets_url = new URL("../assets/", window.location.href).href
    const found = await scan_dir(assets_url)
    if (!found) return

    const base = new URL("../", window.location.href).href
    const on_disk = found.map(f => f.replace(base, "../"))

    const missing = on_disk.filter(f => !assets_fallback.includes(f))
    const extra = assets_fallback.filter(f => !on_disk.includes(f))

    if (missing.length === 0 && extra.length === 0) return

    const updated = `const assets_fallback = [\n${on_disk.map(f => `    "${f}"`).join(",\n")}\n]`

    if (missing.length) console.error("[dev] assets not in list:", missing)
    if (extra.length) console.error("[dev] list has files not on disk:", extra)
    console.error(`[dev] update assets_fallback in loading.js to:\n\n${updated}`)
    return true // mismatch found
}

// Fetches /version.json directly from the network, bypassing all caches.
async function fetch_server_version() {
    try {
        const res = await fetch("/version.json", {
            cache: "no-store",
            signal: AbortSignal.timeout(5000)
        })
        if (!res.ok) return null
        const data = await res.json()
        return data.version ?? null
    } catch {
        return null
    }
}

// Stores all HTML, CSS, JS, and asset files into the named cache.
async function populate_cache() {
    const cache = await caches.open(CACHE_NAME)
    await Promise.all(
        ALL_ASSETS.map(async (url) => {
            try {
                const response = await fetch(url)
                if (response.ok) await cache.put(url, response)
            } catch {
                console.warn("[cache] Failed to pre-cache:", url)
            }
        })
    )
}

// Deletes any stale jump-clone-v* caches from previous versions.
async function clear_old_caches() {
    const keys = await caches.keys()
    await Promise.all(
        keys
            .filter((k) => k.startsWith("jump-clone-v") && k !== CACHE_NAME)
            .map((k) => caches.delete(k))
    )
}

async function boot() {
    if (IS_LOCAL) {
        // Development: use existing behavior unchanged
        const mismatch = await check_assets()
        if (mismatch) return
        await Promise.all(assets_fallback.map(preload))
        window.location.href = "../start/start.html"
        return
    }

    // Production: check version against server
    const cached_version = localStorage.getItem("jump_clone_version")
    const server_version = await fetch_server_version()

    // Fast path: versions match, or network failed but we have a prior cache
    if (
        (server_version !== null && cached_version === server_version) ||
        (server_version === null && cached_version !== null)
    ) {
        window.location.href = "../start/start.html"
        return
    }

    // Slow path: first install or version mismatch — download and cache everything
    await clear_old_caches()
    await Promise.all(assets_fallback.map(preload)) // visual progress during download
    await populate_cache()

    if (server_version !== null) {
        localStorage.setItem("jump_clone_version", server_version)
    }

    window.location.href = "../start/start.html"
}

boot()
