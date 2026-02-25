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

const midground0 = new obj({
    name: "midground1",
    width: game.width,
    height: game.height
})

const foreground0 = new obj({
    name: "foreground4",
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
            char: "S", object: new obj({
                name: "spawn",
                width: 10,
                height: 10,
                dynamic: true,
                collides: false,
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
            char: "v", object: new obj({
                name: "moved_wall",
                width: 10,
                height: 10,
                shows_debug_col: true
            })
        },
        {
            char: "h", object: new obj({
                name: "height_wall",
                width: 1,
                height: 10,
                shows_debug_col: true
            })
        },
        {
            char: "j", object: new obj({
                name: "jumper",
                width: 10,
                height: 3,
                collides: false,
                shows_debug_col: true
            })
        }
    ],
    map: [
        "h                               ",
        "h    S                          ",
        "h                               ",
        "h  vvv                          ",
        "h                               ",
        "h                               ",
        "hvvvv                           ",
        "h                               ",
        "h                               ",
        "xxxxxxxxxx         jjj          ",
        "                             S  ",
        "                          xxxxxx",
        "                          xxxxxx",
        "           x              xxxxxx",
        "                          xxxxxx",
        "                                ",
        "                                ",
        "                                ",
    ]
})

game.world.appendChild(background0.graphic)
game.world.appendChild(midground0.graphic)
game.world.appendChild(player.graphic)

const jumper = lvl.find("jumper")
jumper.shift(-5, 7)
const jumper_force = 4

const spawns = lvl.find_all("spawn")

const moved = lvl.find_all("moved_wall")
moved[0].shift(6, 0)
moved[1].shift(-5, 0)

function start() {


    if (localStorage.getItem("last_level").endsWith("s5.html")) {
        lvl.substitute(spawns[0], player)
    } else {
        lvl.substitute(spawns[1], player)
        player.facing = -1
    }

    player.y_speed = player.max_gravity
    player.graphic.classList.add("falling")

    lvl.spawn()
    game.world.appendChild(foreground0.graphic)
}


function player_move() {
    player.update()

    lvl.toggle_debug(player)

    if (player.collide(jumper, false)) {

        if (input.probe("s", input.KEYHELD)) {
            player.call_force({ y: -jumper_force * 1.4, y_time: 1 })
        } else {
            player.call_force({ y: -jumper_force, y_time: 1 })
        }
    }

    player.apply_force()

    lvl.move_and_collide()

    if (player.y + player.height < 0) {
        game.savetransport()
        window.location.href = "./s5.html"
    }

    if (player.y > game.height) {
        window.location.href = "./s4.html"
    }

    if (player.x > game.width) {
        game.savetransport()
        window.location.href = "./s3.html"
    }
}

game.add(player_move)
start()
game.update()