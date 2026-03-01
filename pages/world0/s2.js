import { boil_the_plate, come_from, Player, send_to } from "../../src/prefabs.js"
import { bobj, cobj, game, level } from "../../src/system.js"

boil_the_plate()

const background0 = new bobj({ name: "background3" })

const foreground0 = new bobj({ name: "scene_s2" })

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
            char: "#", object: new cobj({
                name: "wall",
                width: 10,
                height: 10,
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
    game.world.appendChild(background0.graphic)

    const all_p_spawns = lvl.find_all("spawn")

    if (come_from("s1.html")) {
        lvl.substitute(all_p_spawns[0], player)
    } else if (come_from("s3.html")) {
        lvl.substitute(all_p_spawns[1], player)
    } else {
        lvl.substitute(all_p_spawns[2], player)
        player.facing = -1
    }

    lvl.spawn()

    player.graphic.classList.add("falling")

    game.world.appendChild(foreground0.graphic)
    game.save_transport()

    game.method(player_move)
}

function player_move() {
    player.update()

    lvl.toggle_debug(player)

    lvl.move_and_collide()

    if (player.x + player.width < 0) {
        send_to("./s3.html")
    }

    if (player.x > game.width) {
        send_to("./s2_EXT.html")
    }
}

start()
game.update()