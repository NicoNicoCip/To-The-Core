import { come_from, Player, send_to } from "../../src/prefabs.js"
import { cobj, game, input, level, obj } from "../../src/system.js"


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
    name: "foreground5",
    width: game.width,
    height: game.height
})

const midground0 = new obj({
    name: "midground2",
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
            char: "#", object: new cobj({
                name: "wall",
                width: 10,
                height: 10,
                shows_debug_col: true
            })
        },
        {
            char: "S", object: new cobj({
                name: "spawn",
                width: 10,
                height: 10,
                dynamic: true,
                collides: false,
                shows_debug_col: true
            })
        },
        {
            char: "x", object: new cobj({
                name: "inviz_wall",
                width: 10,
                height: 10,
                shows_debug_col: true
            })
        },
        {
            char: "v", object: new cobj({
                name: "half_wall",
                width: 10,
                height: 1,
                shows_debug_col: true,
                one_way: true
            })
        },
        {
            char: "B", object: new cobj({
                name: "bone",
                width: 10,
                height: 10,
                shows_debug_col: true,
                dynamic: true,
                collides: false
            })
        }
    ],
    map: [
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                               x",
        "                               x",
        "              B                x",
        "                               x",
        "                               x",
        "                 vvvvvvvv      x",
        "                               x",
        "            vvv     vvvv       x",
        "                               x",
        " S                             x",
        "xxxx   xxxxxxxxxxxxxxxxxxxxxxxxx",
        "xxxx S xxxxxxxxxxxxxxxxxxxxxxxxx",
    ]
})

let boll = false
const bone = lvl.find("bone")

function start() {
    game.world.appendChild(background0.graphic)
    game.world.appendChild(midground0.graphic)
    game.world.appendChild(player.graphic)

    const halfs = lvl.find_all("half_wall")
    halfs[0].move(null, halfs[0].y + 1)
    halfs[1].move(null, halfs[1].y + 6)
    halfs[2].move(halfs[2].x + 3, halfs[2].y + 5)

    const spawns = lvl.find_all("spawn")

    if (come_from("s6.html")) {
        lvl.substitute(spawns[0], player)
        player.facing = 1
    } else {
        lvl.substitute(spawns[1], player)
        player.facing = 1
        boll = true
    }

    game.save_transport()

    player.y_speed = player.max_gravity
    player.graphic.classList.add("falling")

    lvl.spawn()
    game.world.appendChild(foreground0.graphic)

    game.add(player_move)
}

function player_move() {
    player.update()

    lvl.toggle_debug(player)

    if (boll == true) {
        player.call_force({
            x: 1,
            y: -5,
            x_time: 30,
            y_time: 1
        })
        boll = false
    }

    player.apply_force()

    if (player.collide(bone, false)) {
        bone.move(0, 100)
        game.world.removeChild(bone.graphic)
        game.world.removeChild(bone.collider)
        game.save_collectable("world0", "bone_s5")
    }

    lvl.move_and_collide()

    if (player.y > game.height) {
        send_to("./s4.html")
    }

    if (player.x + player.width < 0) {
        send_to("./s6.html")
    }
}


start()
game.update()