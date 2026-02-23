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

const assets = [
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
    "../assets/world1/level1.webp"
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

Promise.all(assets.map(preload)).then(() => {
    window.location.href = "../start/start.html"
})