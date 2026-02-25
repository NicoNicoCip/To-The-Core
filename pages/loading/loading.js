import { ASSETS } from "../../src/assets.js"
import { game, obj } from "../../src/system.js"

sessionStorage.setItem("loading_in_progress", "1")

const world = document.getElementById("world")
game.register_world(world, 320, 180)
const loading = new obj({ name: "loading", x: game.width / 2 - 96 / 2, y: game.height / 2 - 8, width: 96, height: 16 })
game.world.appendChild(loading.graphic)

const CACHE_NAME = "jump-clone-cache"
const VERSION_KEY = "jump_clone_version"
const API_URL = "https://api.github.com/repos/NicoNicoCip/To-The-Core/commits/main"
const CONCURRENCY = 6

async function fetchVersion() {
    try {
        const res = await fetch(API_URL)
        if (!res.ok) return null
        const data = await res.json()
        return data.sha
    } catch {
        return null
    }
}

function navigateToGame() {
    sessionStorage.removeItem("loading_in_progress")
    sessionStorage.removeItem("update_pending")

    const lastLevel = localStorage.getItem("last_level")
    if (lastLevel) {
        window.location.href = lastLevel
    } else {
        window.location.href = "/pages/start/start.html"
    }
}

async function cacheAssets() {
    await caches.delete(CACHE_NAME)
    const cache = await caches.open(CACHE_NAME)

    const queue = [...ASSETS]

    async function worker() {
        while (queue.length > 0) {
            const url = queue.shift()
            try {
                const response = await fetch(url, { cache: "no-store" })
                if (response.ok) {
                    await cache.put(url, response)
                }
            } catch { /* skip failed assets */ }
        }
    }

    const workers = []
    for (let i = 0; i < CONCURRENCY; i++) workers.push(worker())
    await Promise.all(workers)
}

async function main() {
    const remoteVersion = await fetchVersion()

    if (remoteVersion === null) {
        navigateToGame()
        return
    }

    const localVersion = localStorage.getItem(VERSION_KEY)

    if (localVersion === remoteVersion) {
        navigateToGame()
        return
    }

    if ("serviceWorker" in navigator) {
        if (!navigator.serviceWorker.controller) {
            await navigator.serviceWorker.register("/service-worker.js")
        }
        await navigator.serviceWorker.ready
    }

    await cacheAssets()

    localStorage.setItem(VERSION_KEY, remoteVersion)
    navigateToGame()
}

main()
