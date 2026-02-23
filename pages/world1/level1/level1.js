import { Player } from "../../../src/prefabs.js"
import { game, input, level, math, obj } from "../../../src/system.js"


const world = document.getElementById("world")
const debug = document.getElementById("debug")

game.register_world(world, 320, 180)
input.init()

const background1 = new obj({
    name: "background1",
    width: game.width,
    height: game.height
})


const background2 = new obj({
    name: "background2",
    width: game.width,
    height: game.height
})

const background2_transit = new obj({
    name: "background2_transit",
    width: game.width,
    height: game.height
})

const background3 = new obj({
    name: "background3",
    width: game.width,
    height: game.height
})

const foreground0 = new obj({
    name: "foreground0",
    width: game.width,
    height: game.height
})


const splash = new obj({
    name: "splash",
    width: 180,
    height: 60
})

splash.graphic.innerHTML = `
    MADE BY: <br>
    MANEL <br>
    JOAN <br>
    NICO <br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
    A Paper Windo Studio Production <br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
< DOG
`

let player = new Player(60, 50)

const lvl = new level({
    x: 0,
    y: 0,
    width: 32,
    height: 18,
    tile_width: 10,
    tile_height: 10,
    keys: [
        {
            char: "#", object: new obj({
                name: "wall",
                width: 10,
                height: 10,
            })
        },
        {
            char: "P", object: new obj({
                name: "player",
                width: 10,
                height: 10,
                dynamic: true
            })
        },
        {
            char: "x", object: new obj({
                name: "inviz_wall",
                width: 10,
                height: 10,
            })
        }
    ],
    map: [
        "x                              x",
        "x                              x",
        "x                              x",
        "x                              x",
        "x                              x",
        "x     P                        x",
        "x                              x",
        "x                              x",
        "x                              x",
        "x                              x",
        "x                              x",
        "x                              x",
        "xxxxxxxxxxxxxxxxxxxxx          x",
        "xxxxxxxxxxxxxxxxxxxxx          x",
        "xxxxxxxxxxxxxxxxxxxxx          x",
        "xxxxxxxxxxxxxxxxxxxxx          x",
        "xxxxxxxxxxxxxxxxxxxxx          x",
        "xxxxxxxxxxxxxxxxxxxxx          x",
    ]
})

game.world.appendChild(background2.graphic)
game.world.appendChild(background1.graphic)
game.world.appendChild(splash.graphic)
game.world.appendChild(player.graphic)


let shake_intensity = 0
let shake_timer = 0

// called each frame, e.g. at the end of player_move
function tick_shake() {
    if (shake_timer > 0) {
        const ox = (Math.random() - 0.5) * 2 * shake_intensity
        const oy = (Math.random() - 0.5) * 2 * shake_intensity
        game.world.style.transform = `scale(${game.scale}) translate(${ox}px, ${oy}px)`
        shake_timer--
        return true
    } else {
        game.world.style.transform = `scale(${game.scale})`
        return false
    }
}

function shake(intensity, duration_frames) {
    shake_intensity = intensity
    shake_timer = duration_frames
}

let timr = 0
let acc = 0

function intro() {

    if (input.probe("escape", input.KEYDOWN)) {
        if (background1.graphic.parentNode) {
            game.world.removeChild(background1.graphic)
        }

        if (background2.graphic.parentNode) {
            game.world.removeChild(background2.graphic)
        }

        if (splash.graphic.parentNode) {
            game.world.removeChild(splash.graphic)
        }

        if (background2_transit.graphic.parentNode) {
            game.world.removeChild(background2_transit.graphic)
        }
        game.world.appendChild(background3.graphic)
        lvl.replace("player", player)
        player.name = "player"

        lvl.spawn()

        game.world.appendChild(foreground0.graphic)
        player.y_speed = player.max_gravity

        game.remove(intro)
        game.remove_render(intro_render)
        game.add(player_move)
        timr = -1
        acc = 0

        player.move(
            60,
            -17
        )
    }

    if (timr == 0) {
        document.getElementById("fade").style.backgroundColor = "transparent"
        player.graphic.classList.add("falling")
    }

    if (timr > 0 && timr < 600) {
        acc += 1

        if (timr < 600) {

            splash.move(
                180,
                200 - acc
            )
        }

        if (timr < 400) {
            player.move(
                60,
                449 - acc
            )
        }
    }

    if (timr == 550) {
        game.world.appendChild(background2_transit.graphic)
    }

    if (timr == 600) {
        game.world.removeChild(background1.graphic)
        game.world.removeChild(background2.graphic)
        game.world.removeChild(splash.graphic)
    }

    if (timr > 600 && timr < 778) {
        acc += 0.4
        player.move(
            60,
            650 - acc
        )
    }

    if (timr == 778) {
        game.world.appendChild(background3.graphic)
        lvl.replace("player", player)
        player.name = "player"

        lvl.spawn()
        game.world.appendChild(foreground0.graphic)
        player.y_speed = player.max_gravity
    }

    if (timr == 780) {
        game.world.removeChild(background2_transit.graphic)
        game.remove(intro)
        game.remove_render(intro_render)
        game.add(player_move)
        timr = -1
        acc = 0
    }
    timr++
}

function intro_render(alpha) {
    player.render(alpha)
    splash.render(alpha)
}

game.add_render(intro_render)
game.add(intro)

function player_move() {
    player.update()

    if (player.just_landed && player.landing && player.landed_once) {
        shake(1, 20)
    }

    tick_shake()
    lvl.move_and_collide()

    if(player.y > 180) {
        window.location.href = "../level2/level2.html"
    }
}


game.update()