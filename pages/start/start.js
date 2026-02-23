import { game, input, obj } from "../../src/system.js"


// const player = document.getElementById("player")
const world = document.getElementById("world")
const debug = document.getElementById("debug")

game.register_world(world, 320, 180)
input.init()

const background1 = new obj({
    name: "background1",
    width: game.width,
    height: game.height
})

const ttc_sign = new obj({
    name: "to_the_core_sign",
    x: game.width / 2 - 112,
    y: 15,
    width: 224,
    height: 64
})

const play_sign = new obj({
    name: "play_sign",
    x: game.width / 2 - 36,
    y: 135,
    width: 72,
    height: 29
})

game.world.appendChild(background1.graphic)
game.world.appendChild(ttc_sign.graphic)
game.world.appendChild(play_sign.graphic)

game.on_resize.push(() => {
    background1._prev_x = -1
    background1._prev_y = -1
    background1.move()
})

const tcc_x = game.width / 2 - 112
const tcc_y = 15

const play_x = game.width / 2 - 36
const play_y = 135
let t = 0

function wooble() {
    t += 0.05

    ttc_sign.move(
        tcc_x + Math.cos(t) * 3,
        tcc_y + Math.sin(t * 0.7) * 2
    )

    play_sign.move(
        play_x + Math.cos(t) * 1,
        play_y + Math.sin(t * 0.7) * 2
    )
}

game.add_render(wooble)

let triggered = false
play_sign.graphic.addEventListener("mouseenter", () => {
    if (!triggered) {
        play_sign.graphic.classList.add("play_sign_hover")
    }
})

play_sign.graphic.addEventListener("mouseleave", () => {
    if (!triggered) {
        play_sign.graphic.classList.remove("play_sign_hover")
    }
})
let acc = 1
play_sign.graphic.addEventListener("mouseup", () => {
    let timr = 0

    function play_ani() {
        if (timr == 16 || timr == 32 || timr == 48) {
            play_sign.graphic.classList.remove("play_sign_hover")
        }

        if (timr == 8 || timr == 24 || timr == 40) {
            play_sign.graphic.classList.add("play_sign_hover")
        }

        if (timr > 48 && timr < 95) {
            acc *= 1.15
            ttc_sign.move(tcc_x, tcc_y - acc)
            ttc_sign.render(1)

            play_sign.move(play_x, play_y - acc)
            play_sign.render(1)
        }

        if (timr == 95) {
            game.world.removeChild(ttc_sign.graphic)
            game.world.removeChild(play_sign.graphic)
            document.getElementById("fade").style.backgroundColor = "black"
        }

        if (timr == 180) {
            window.location.href = "../world1/level1/level1.html"
        }
        timr++
    }

    if (!triggered) {
        triggered = true
        game.remove_render(wooble)
        game.add_render(play_ani)
    }
})

function to_next_screen() {

}

game.update()