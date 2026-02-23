import { Player } from "../../../src/prefabs.js"
import { game, input, level, math, obj } from "../../../src/system.js"


const world = document.getElementById("world")
const debug = document.getElementById("debug")

game.register_world(world, 320, 180)
input.init()

const background0 = new obj({
    name: "background0",
    width: game.width,
    height: game.height
})

const foreground0 = new obj({
    name: "foreground0",
    width: game.width,
    height: game.height
})

let player = new Player(60, 50, false)

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

game.add_render(intro_render)
game.add(intro)

function player_move() {
    player.update()

    lvl.move_and_collide()

    if(player.y > 180) {
        window.location.href = "../level2/level2.html"
    }
}


game.update()