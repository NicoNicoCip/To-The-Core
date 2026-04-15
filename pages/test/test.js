import { boil_the_plate, Player } from "../../src/prefabs.js"
import { cobj, game, level } from "../../src/system.js"

boil_the_plate()

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
        "                               x",
        "x                              x",
        "x                              x",
        "x                              x",
        "x                              x",
        "x                              x",
        "x                              x",
        "x                              x",
        "x              S               x",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    ]
})

function start() {
    game.world.appendChild(player.graphic)

    const spawn = lvl.find("spawn")
    lvl.substitute(spawn, player)
    player.facing = 1

    game.save_transport()

    player.y_speed = player.max_gravity
    player.graphic.classList.add("falling")

    lvl.spawn()
}

function player_move() {
    player.update()

    lvl.toggle_debug(player)

    player.apply_force()

    lvl.move_and_collide()
}

game.start(start)
game.update(player_move)
game.run()