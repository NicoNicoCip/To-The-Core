import { game, obj } from "../../src/system.js"

const IS_LOCAL = location.hostname === "localhost" || location.hostname === "127.0.0.1"

// Tell check_version() in system.js not to redirect while we are still loading.
// Must be set before game.register_world() is called below.
sessionStorage.setItem("loading_in_progress", "1")

// Must match CACHE_NAME in service-worker.js.
const SW_CACHE = "jump-clone-sw-v1"

// Single source of truth for everything to cache (absolute paths).
// On dev: check_files() scans disk and warns if this list is out of sync.
// Images are preloaded visually; all entries are cached on production.
const ALL_ASSETS = [
    "/index.html",
    "/pages/index.css",
    "/pages/loading/loading.css",
    "/pages/loading/loading.html",
    "/pages/loading/loading.js",
    "/pages/start/start.css",
    "/pages/start/start.html",
    "/pages/start/start.js",
    "/pages/world1/level1.html",
    "/pages/world1/level1.js",
    "/pages/world1/level2_EXT.html",
    "/pages/world1/level2_EXT.js",
    "/pages/world1/level2.html",
    "/pages/world1/level2.js",
    "/pages/world1/level3.html",
    "/pages/world1/level3.js",
    "/pages/world1/level4.html",
    "/pages/world1/level4.js",
    "/pages/world1/world1.css",
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

const IMAGES = ALL_ASSETS.filter(p => p.endsWith(".webp"))

// ── Setup ─────────────────────────────────────────────────────────────────────

const world = document.getElementById("world")
game.register_world(world, 320, 180)
const loading = new obj({ name: "loading", x: game.width / 2 - 96 / 2, y: game.height / 2 - 8, width: 96, height: 16 })
game.world.appendChild(loading.graphic)

// ── Helpers ───────────────────────────────────────────────────────────────────

function preload(abs_path) {
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = resolve
        img.onerror = resolve  // never reject — a missing image shouldn't block navigation
        img.src = new URL(abs_path, location.origin).href
    })
}

// Recursively fetches a Live Server directory listing and extracts file hrefs.
// Returns null on GitHub Pages (no directory listing available).
async function scan_dir(url) {
    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(500) })
        if (!res.ok) return null
        const text = await res.text()
        if (!text.includes("<a")) return null

        const origin = new URL(url).origin
        const dir_path = new URL(url).pathname
        const doc = new DOMParser().parseFromString(text, "text/html")
        const links = [...doc.querySelectorAll("a[href]")]
            .map(a => { let h = a.getAttribute("href"); return h.startsWith("//") ? h.slice(1) : h })
            .filter(p => p.startsWith(dir_path) && p !== dir_path)

        let files = []
        for (const pathname of links) {
            if (pathname.endsWith("/")) {
                const sub = await scan_dir(origin + pathname)
                if (sub) files = files.concat(sub)
            } else {
                const real = pathname.endsWith(".preview") ? pathname.slice(0, -".preview".length) : pathname
                files.push(real)
            }
        }
        return files
    } catch { return null }
}

// ── Dev-only check ─────────────────────────────────────────────────────────────

async function check_files() {
    const o = location.origin
    const scans = await Promise.all([
        scan_dir(`${o}/pages/loading/`),
        scan_dir(`${o}/pages/start/`),
        scan_dir(`${o}/pages/world1/`),
        scan_dir(`${o}/pages/assets/`),
        scan_dir(`${o}/src/`),
    ])

    if (scans.every(s => s === null)) return // not on a dev server

    const on_disk = [
        "/index.html",
        ...scans.flatMap(s => s ?? []).filter(f => /\.(html|js|css|webp)$/.test(f))
    ]

    const missing = on_disk.filter(f => !ALL_ASSETS.includes(f))
    const extra = ALL_ASSETS.filter(f => !on_disk.includes(f))

    if (!missing.length && !extra.length) return

    if (missing.length) console.error("[dev] files not in ALL_ASSETS:", missing)
    if (extra.length) console.error("[dev] ALL_ASSETS has entries not on disk:", extra)
    console.error(`[dev] replace ALL_ASSETS with:\nconst ALL_ASSETS = [\n${on_disk.map(f => `    "${f}"`).join(",\n")}\n]`)
    return true
}

// ── Version (production) ───────────────────────────────────────────────────────

// Parses version from the latest commit message (format: "R.M.mm / Description").
async function fetch_server_version() {
    try {
        const res = await fetch(
            "https://api.github.com/repos/NicoNicoCip/To-The-Core/commits?per_page=1",
            { cache: "no-store", signal: AbortSignal.timeout(5000) }
        )
        if (!res.ok) return null
        const [commit] = await res.json()
        const match = (commit?.commit?.message ?? "").match(/^(\d+\.\d+\.\d+)\s*\//)
        return match ? match[1] : null
    } catch { return null }
}

// Caches all assets into the SW cache so they are served instantly on next visit.
// Writes into the same cache name the SW uses, so Cache-First hits immediately.
async function populate_cache() {
    const cache = await caches.open(SW_CACHE)
    await Promise.all(ALL_ASSETS.map(async url => {
        try {
            const r = await fetch(url)
            if (r.ok) await cache.put(url, r)
        } catch { console.warn("[cache] failed:", url) }
    }))
}

function navigate_to_start() {
    sessionStorage.removeItem("loading_in_progress")
    window.location.href = "../start/start.html"
}

// ── Boot ───────────────────────────────────────────────────────────────────────

async function boot() {
    if (IS_LOCAL) {
        const mismatch = await check_files()
        if (mismatch) return
        await Promise.all(IMAGES.map(preload))
        navigate_to_start()
        return
    }

    const cached_version = localStorage.getItem("jump_clone_version")
    const server_version = await fetch_server_version()

    // Fast path: versions match, or network failed but we have a prior cache
    if ((server_version !== null && cached_version === server_version) ||
        (server_version === null && cached_version !== null)) {
        navigate_to_start()
        return
    }

    // Slow path: first install or new version — download and cache everything
    // If server_version is null (network down) AND no cached version exists,
    // skip caching and just navigate — the SW will cache opportunistically.
    if (server_version === null) {
        navigate_to_start()
        return
    }

    await Promise.all(IMAGES.map(preload))
    await populate_cache()
    localStorage.setItem("jump_clone_version", server_version)
    navigate_to_start()
}

boot()
