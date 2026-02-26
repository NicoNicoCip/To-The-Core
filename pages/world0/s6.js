import { boil_the_plate, come_from, Player, send_to } from "../../src/prefabs.js"
import { bobj, cobj, game, level } from "../../src/system.js"

boil_the_plate()

const background0 = new bobj({name: "background3"})

const foreground0 = new bobj({name: "foreground6"})

const midground0 = new bobj({name: "midground3"})


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
        },
        {
            char: "v", object: new cobj({
                name: "half_wall",
                width: 10,
                height: 1,
                shows_debug_col: true,
                one_way: true
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
        "  S                          S  ",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    ]
})

function start() {
    game.world.appendChild(background0.graphic)
    game.world.appendChild(midground0.graphic)
    game.world.appendChild(player.graphic)

    const spawns = lvl.find_all("spawn")

    if (come_from("s7.html")) {
        lvl.substitute(spawns[0], player)
        player.facing = 1
    } else {
        lvl.substitute(spawns[1], player)
        player.facing = -1
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

    player.apply_force()

    lvl.move_and_collide()

    if (player.x > game.width) {
        send_to("./s5.html")
    }

    if (player.x + player.width < 0) {
        send_to("./s7.html")
    }
}


start()
game.update()