import { game, obj } from "../../src/system.js"

const IS_LOCAL = location.hostname === "localhost" || location.hostname === "127.0.0.1"

// Set before register_world() so check_version() inside it doesn't redirect us.
sessionStorage.setItem("loading_in_progress", "1")

// Must match CACHE in service-worker.js.
const CACHE = "jump-clone-cache"

// Single source of truth for every file the game needs.
// Dev: check_files() warns if this list drifts from what's on disk.
// Production: all entries are deleted from cache and re-downloaded on version change.
const ALL_ASSETS = [
    "/index.html",
    "/pages/loading/loading.css",
    "/pages/loading/loading.html",
    "/pages/loading/loading.js",
    "/pages/start/start.css",
    "/pages/start/start.html",
    "/pages/start/start.js",
    "/pages/world0/s1.html",
    "/pages/world0/s1.js",
    "/pages/world0/s2_EXT.html",
    "/pages/world0/s2_EXT.js",
    "/pages/world0/s2.html",
    "/pages/world0/s2.js",
    "/pages/world0/s3.html",
    "/pages/world0/s3.js",
    "/pages/world0/s4.html",
    "/pages/world0/s4.js",
    "/pages/world0/s5.html",
    "/pages/world0/s5.js",
    "/pages/world0/world0.css",
    "/pages/assets/world0/s1_midground.webp",
    "/pages/assets/world0/s1.webp",
    "/pages/assets/world0/s2_EXT.webp",
    "/pages/assets/world0/s2.webp",
    "/pages/assets/world0/s3.webp",
    "/pages/assets/world0/s4_midground.webp",
    "/pages/assets/world0/s4.webp",
    "/pages/assets/world0/s5_midground.webp",
    "/pages/assets/world0/s5.webp",
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
        img.onerror = resolve
        img.src = new URL(abs_path, location.origin).href
    })
}

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
        scan_dir(`${o}/pages/world0/`),
        scan_dir(`${o}/pages/assets/`),
        scan_dir(`${o}/src/`),
    ])

    if (scans.every(s => s === null)) return

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

// Wipes the old cache entirely then refills it with fresh network content.
// Deleting first guarantees no stale file from a previous version survives.
async function repopulate_cache() {
    await caches.delete(CACHE)
    const cache = await caches.open(CACHE)
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

    // Fast path: we have a cache and the version matches (or we can't reach the
    // server to know better — trust the existing cache).
    if (cached_version !== null && (server_version === null || server_version === cached_version)) {
        navigate_to_start()
        return
    }

    // Slow path: new version detected, or first install.
    // If we truly have no network and no prior cache, write a sentinel so
    // check_version() on game pages doesn't redirect us into a loop.
    if (server_version === null) {
        localStorage.setItem("jump_clone_version", "offline")
        navigate_to_start()
        return
    }

    // We have a real server version — delete the old cache and rebuild fresh.
    await Promise.all(IMAGES.map(preload))
    await repopulate_cache()
    localStorage.setItem("jump_clone_version", server_version)
    navigate_to_start()
}

boot()
