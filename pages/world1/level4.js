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
    name: "",
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
                shows_debug_col: true
            })
        },
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
        "                                ",
        "     S                          ",
        "                                ",
        "    xxx                         ",
        "                                ",
        "                                ",
        " xxxx                           ",
        "                                ",
        "                                ",
        "xxxxxxxxxx         jjj          ",
        "xxxxxx                       S  ",
        "xx                        xxxxxx",
        "                          xxxxxx",
        "                          xxxxxx",
        "                            xxxx",
        "                                ",
        "                                ",
        "                                ",
    ]
})

game.world.appendChild(background0.graphic)
game.world.appendChild(player.graphic)

function start() {
    const spawns = lvl.find_all("spawn")

    if (localStorage.getItem("last_level").endsWith("level5.html")) {
        lvl.substitute(spawns[0], player)
    } else {
        lvl.substitute(spawns[1], player)
        player.facing = -1
    }

    game.savetransport()

    player.y_speed = player.max_gravity
    player.graphic.classList.add("falling")

    lvl.spawn()
    game.world.appendChild(foreground0.graphic)
}

const jumper = lvl.find("jumper")
jumper.move(null, jumper.y + 7)
const jumper_force = 4
let debug_col_visible = false

function player_move() {
    player.update()

    if (input.probe("p", input.KEYDOWN)) {
        debug_col_visible = !debug_col_visible
        const visibility = debug_col_visible ? "visible" : "hidden"
        player.collider.style.visibility = visibility
        lvl.flat.forEach(o => {
            if (o !== null && o.shows_debug_col) o.collider.style.visibility = visibility
        })
    }

    if (player.collide(jumper, false)) {

        if (input.probe("s", input.KEYHELD)) {
            player.y_speed = -jumper_force * 1.4
        } else {
            player.y_speed = -jumper_force
        }
    }

    lvl.move_and_collide()

    if (player.y + player.height < 0) {
        window.location.href = "./level5.html"
    }

    if (player.x > game.width) {
        window.location.href = "./level3.html"
    }
}

game.add(player_move)
start()
game.update()