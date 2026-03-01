import { boil_the_plate, come_from, Player, send_to } from "../../src/prefabs.js"
import { bobj, cobj, game, input, level } from "../../src/system.js"

boil_the_plate()

const background0 = new bobj({ name: "background3" })

const midground0 = new bobj({ name: "midground_s4" })

const foreground0 = new bobj({ name: "scene_s4" })

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
                name: "moved_wall",
                width: 10,
                height: 10,
                shows_debug_col: true
            })
        },
        {
            char: "h", object: new cobj({
                name: "height_wall",
                width: 1,
                height: 10,
                shows_debug_col: true
            })
        },
        {
            char: "j", object: new cobj({
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
        "                          xxxxxx",
        "                          xxxxxx",
        "                                ",
        "                                ",
        "                                ",
    ]
})

function start() {
    game.world.appendChild(background0.graphic)
    game.world.appendChild(midground0.graphic)
    game.world.appendChild(player.graphic)

    const moved = lvl.find_all("moved_wall")
    moved[0].shift(6, 0)
    moved[1].shift(-5, 0)

    const spawns = lvl.find_all("spawn")
    if (come_from("s5.html")) {
        lvl.substitute(spawns[0], player)
    } else {
        lvl.substitute(spawns[1], player)
        player.facing = -1
    }

    player.y_speed = player.max_gravity
    player.graphic.classList.add("falling")

    lvl.spawn()
    game.world.appendChild(foreground0.graphic)
    game.method(player_move)
}

const jumper_force = 4
const jumper = lvl.find("jumper")
jumper.shift(-5, 7)

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
        send_to("./s5.html")
    }

    if (player.y > game.height) {
        window.location.href = "./s4.html"
    }

    if (player.x > game.width) {
        send_to("./s3.html")
    }
}

start()
game.update()