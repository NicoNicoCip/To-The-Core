import { boil_the_plate, Player, send_to } from "../../src/prefabs.js"
import { bobj, cobj, game, level } from "../../src/system.js"

boil_the_plate()

const background0 = new bobj({ name: "background3", })

const foreground0 = new bobj({ name: "" })

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
        }
    ],
    map: [
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                                ",
        "                             S  ",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    ]
})

function start() {
    game.world.appendChild(background0.graphic)
    game.world.appendChild(player.graphic)

    const spawn = lvl.find("spawn")

    lvl.substitute(spawn, player)
    player.facing = -1

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

    player.apply_force()

    lvl.move_and_collide()

    if (player.x > game.width) {
        send_to("./s6.html")
    }

    if (player.x + player.width < 0) {
        send_to("/pages/world1/level1/s1.html")
    }
}

start()
game.update()