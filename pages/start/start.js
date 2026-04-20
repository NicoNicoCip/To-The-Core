import { boil_the_plate } from "../../src/prefabs.js"
import { bobj, game, obj, Scene } from "../../src/system.js"

boil_the_plate()

const background = new bobj({ name: "background1" })
const ttc_sign = new obj({ name: "to_the_core_sign", width: 224, height: 64 })
const play_sign = new obj({ name: "play_sign", width: 72, height: 29 })

const scene = new Scene()
scene.layer(background, -5, 0)
scene.layer(ttc_sign, 10, 0)
scene.layer(play_sign, 11, 0)

const tcc_x = game.width / 2 - 112
const tcc_y = 15
const play_x = game.width / 2 - 36
const play_y = 135

ttc_sign.move(tcc_x, tcc_y)
play_sign.move(play_x, play_y)

let state = 'wobble'
let t = 0
let timr = 0
let acc = 1
let triggered = false

scene.update(function () {
    if (state === 'wobble') {
        t += 0.05
        ttc_sign.move(tcc_x + Math.cos(t) * 3, tcc_y + Math.sin(t * 0.7) * 2)
        play_sign.move(play_x + Math.cos(t) * 1, play_y + Math.sin(t * 0.7) * 2)
        return
    }

    // play animation
    if (timr === 8 || timr === 24 || timr === 40) {
        play_sign.graphic.classList.add("play_sign_hover")
    }

    if (timr === 16 || timr === 32 || timr === 48) {
        play_sign.graphic.classList.remove("play_sign_hover")
    }

    if (timr > 48 && timr < 95) {
        acc *= 1.15
        ttc_sign.move(tcc_x, tcc_y - acc)
        play_sign.move(play_x, play_y - acc)
    }

    if (timr === 95) {
        scene.layer_visible(10, false)
        scene.layer_visible(11, false)
        document.getElementById("fade").style.backgroundColor = "black"
    }

    if (timr === 180) game.load_transport()

    timr++
})

play_sign.graphic.addEventListener("mouseenter", () => {
    if (!triggered) play_sign.graphic.classList.add("play_sign_hover")
})

play_sign.graphic.addEventListener("mouseleave", () => {
    if (!triggered) play_sign.graphic.classList.remove("play_sign_hover")
})

play_sign.graphic.addEventListener("mouseup", () => {
    if (triggered) return
    triggered = true
    state = 'play'
})

scene.run({ save_transport: false })
