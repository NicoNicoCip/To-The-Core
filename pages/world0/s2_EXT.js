import { Player } from "../../src/prefabs.js"
import { game, input, level, obj } from "../../src/system.js"


const world = document.getElementById("world")
const debug = document.getElementById("debug")


game.register_world(world, 320, 180)
input.init()

const background0 = new obj({
    name: "background3",
    width: game.width,
    height: game.height
})

const foreground0 = new obj({
    name: "foreground2",
    width: game.width,
    height: game.height
})

const lvl = new level({
    x: 0,
    y: 0,
    width: 32,
    height: 18,
    tile_width: 10,
    tile_height: 10,
    keys: [
        {
            char: "S", object: new obj({
                name: "spawn",
                width: 10,
                height: 10,
                dynamic: true,
                shows_debug_col: true
            })
        },
        {
            char: "#", object: new obj({
                name: "wall",
                width: 10,
                height: 10,
                shows_debug_col: true
            })
        },
        {
            char: "x", object: new obj({
                name: "inviz_wall",
                width: 10,
                height: 10,
                shows_debug_col: true
            })
        },
        {
            char: "B", object: new obj({
                name: "bone",
                width: 10,
                height: 10,
                shows_debug_col: true,
                collides: false
            })
        }
    ],
    map: [
        "                                ",
        "                                ",
        "                                ",
        "              B                 ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                        x       ",
        "                        x       ",
        "                        x       ",
        "                        x       ",
        "  S                     x       ",
        "xxxxxxxxxxxxxxxxxxxxxxxxxx      ",
    ]
})
const player = new Player(10, 10, false)

function start() {
    lvl.substitute("spawn", player)

    game.world.appendChild(background0.graphic)
    lvl.spawn()

    game.savetransport()

    player.graphic.classList.add("falling")


    game.world.appendChild(foreground0.graphic)
}

function player_move() {
    player.update()

    lvl.toggle_debug(player)

    lvl.move_and_collide()

    if (player.x + player.width < 0) {
        window.location.href = "./s2.html"
    }
}

game.add(player_move)
start()
game.update()