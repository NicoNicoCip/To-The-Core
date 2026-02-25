import { Player } from "../../src/prefabs.js"
import { game, input, level, obj , savecollectables} from "../../src/system.js"


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
            char: "v", object: new obj({
                name: "half_wall",
                width: 10,
                height: 1,
                shows_debug_col: true,
                one_way:true
            })
        },
        {
            char: "B", object: new obj({
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

game.world.appendChild(background0.graphic)
game.world.appendChild(midground0.graphic)
game.world.appendChild(player.graphic)

let boll = false
const bone = lvl.find("bone")


const halfs = lvl.find_all("half_wall")
halfs[0].move(null, halfs[0].y + 1)
halfs[1].move(null, halfs[1].y + 6)
halfs[2].move(halfs[2].x + 3, halfs[2].y + 5)
function start() {
    const spawns = lvl.find_all("spawn")

    if (localStorage.getItem("last_level").endsWith("level6.html")) {
        lvl.substitute(spawns[0], player)
        player.facing = 1
    } else {
        lvl.substitute(spawns[1], player)
        player.facing = 1
        boll = true
    }

    game.savetransport()

    player.y_speed = player.max_gravity
    player.graphic.classList.add("falling")

    lvl.spawn()
    game.world.appendChild(foreground0.graphic)
}

let timr = 0

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

    // TODO: Make this work
    // if(player.collide(halfs[2])) {
    //     timr = 10
    //     player.grounded = true
    // }

    // if(timr > 0) {
    //     timr--
    //     player.collide(halfs[0], false)
    // }

    /*if (player.collide(jumper, false)) {

        if (input.probe("s", input.KEYHELD)) {
            player.y_speed = -jumper_force * 1.4
        } else {
            player.y_speed = -jumper_force
        }
    }*/
    if (player.collide(bone, false)) {
        bone.move(0,100)
        game.world.removeChild(bone.graphic)
        game.world.removeChild(bone.collider)
        savecollectables(0,0,1)
    }
    lvl.move_and_collide()

    if (player.y > game.height) {
        window.location.href = "./s4.html"
    }

    if (player.x + player.width < 0) {
        window.location.href = "./s6.html"
    }
}

game.add(player_move)
start()
game.update()