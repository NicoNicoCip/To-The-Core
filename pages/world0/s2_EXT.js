import { boil_the_plate, Player, send_to } from "../../src/prefabs.js"
import { bobj, cobj, game, input, level, obj } from "../../src/system.js"

boil_the_plate()

const background0 = new bobj({ name: "background3" })

const foreground0 = new bobj({ name: "foreground2" })

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
        },
        {
            char: "B", object: new cobj({
                name: "bone",
                width: 10,
                height: 10,
                dynamic: true,
                shows_debug_col: true,
                collides: false
            })
        }
    ],
    map: [
        "                                ",
        "                                ",
        "                                ",
        "               B                ",
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
    game.world.appendChild(background0.graphic)

    lvl.substitute("spawn", player)
    lvl.spawn()

    player.graphic.classList.add("falling")

    game.world.appendChild(foreground0.graphic)
    game.add(player_move)
}

const bone = lvl.find("bone")

function player_move() {
    player.update()

    lvl.toggle_debug(player)

    if (game.check_collectable("world0", "bone_s2_EXT")) {
        bone.move(0, -1000)
    }

    if (player.collide(bone, false)) {
        bone.move(0, 100)
        game.world.removeChild(bone.graphic)
        game.world.removeChild(bone.collider)
        game.save_collectable("world0", "bone_s2_EXT")
    }

    lvl.move_and_collide()

    if (player.x + player.width < 0) {
        send_to("./s2.html")
    }

    if (input.probe("s", input.KEYHELD)) {
        bone.shift(0, 1)
    }
}

start()
game.update()