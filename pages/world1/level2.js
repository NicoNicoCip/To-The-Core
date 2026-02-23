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
    name: "foreground1",
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
                collides: false
            })
        },
        {
            char: "#", object: new obj({
                name: "wall",
                width: 10,
                height: 10,
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
        "                         S      ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "  S                             ",
        "xxxxxx                          ",
        "xxxxxx                          ",
        "xxxxxx                          ",
        "xxxxxxxxxxxxx                   ",
        "xxxxxxxxxxxxx                   ",
        "xxxxxxxxxxxxx                S  ",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    ]
})
const player = new Player(10, 10, false)

function start() {
    const all_p_spawns = lvl.find_all("spawn")
    const last_level = localStorage.getItem("last_level")

    if (last_level && last_level.endsWith("level1.html")) {
        lvl.substitute(all_p_spawns[0], player)
    } else if (last_level && last_level.endsWith("level3.html")) {
        lvl.substitute(all_p_spawns[1], player)
    } else {
        lvl.substitute(all_p_spawns[2], player)
        player.facing = -1
    }

    game.world.appendChild(background0.graphic)
    lvl.spawn()

    player.graphic.classList.add("falling")


    game.world.appendChild(foreground0.graphic)
    game.savetransport()
}

function player_move() {
    player.update()

    lvl.move_and_collide()

    if (player.x + player.width < 0) {
        window.location.href = "./level3.html"
    }

    if (player.x > game.width) {
        window.location.href = "./level2_EXT.html"
    }
}

game.add(player_move)
start()
game.update()