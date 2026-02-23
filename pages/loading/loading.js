import { game, obj } from "../../src/system.js"


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
    "../assets/background0.webp",
    "../assets/background1.webp",
    "../assets/background2.webp",
    "../assets/background3.webp",
    "../assets/dog.webp",
    "../assets/dog_falling.webp",
    "../assets/dog_falling_in.webp",
    "../assets/dog_walking.webp",
    "../assets/ground.webp",
    "../assets/play_sign.webp",
    "../assets/play_sign_active.webp",
    "../assets/to_the_core_sign.webp",
    "../assets/world1/level1.webp",
    "../assets/loading.webp"
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
    const extra   = assets_fallback.filter(f => !on_disk.includes(f))

    if (missing.length === 0 && extra.length === 0) return

    const updated = `const assets_fallback = [\n${on_disk.map(f => `    "${f}"`).join(",\n")}\n]`

    if (missing.length) console.error("[dev] assets not in list:", missing)
    if (extra.length)   console.error("[dev] list has files not on disk:", extra)
    console.error(`[dev] update assets_fallback in loading.js to:\n\n${updated}`)
    return true // mismatch found
}

check_assets().then(mismatch => {
    if (mismatch) return // hang on loading screen
    Promise.all(assets_fallback.map(preload)).then(() => {
        window.location.href = "../start/start.html"
    })
})