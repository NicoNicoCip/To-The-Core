import { boil_the_plate, come_from, invisible_wall_tile, Player, spawn_tile, send_to  } from "../../../src/prefabs.js"
import { bobj, cobj, game, Scene } from "../../../src/system.js"

boil_the_plate()

const player = new Player(60, 50, false)

const inviz = invisible_wall_tile()
const spawn = spawn_tile()
const spawn_right = new cobj({ name: "spawn_right", width: 10, height: 10, collides: false })
const spawn_left = new cobj({ name: "spawn_left", width: 10, height: 10, collides: false })

const scene = new Scene()

scene.tiles(10, 10, {
    'x': inviz,
    'R': spawn_right,
    'L': spawn_left,
}, [
    "x       xxxxxxxxxxxxxxxxxxxxxxxx",
    "x                               ",
    "x                             R ",
    "x       xxxxxxxxxxxxxxxxxxxxxxxx",
    "x                            xxx",
    "xxx                            x",
    "x                              x",
    "x                              x",
    "x   xxx                        x",
    "x                    xxx       x",
    "x          xxx                 x",
    "x                              x",
    "x                            xxx",
    "                                ",
    "                       xxx      ",
    " L             xxx              ",
    "xxxxxxxxxx                      ",
    "xxxx                            ",
])




scene.spawn(player, spawn_right, () => come_from("s3.html"), () => { player.facing = -1 })
scene.spawn(player, spawn_left, () => true)
scene.camera(player, { lerp: 0.1 })

function tick() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()

    if (player.x + player.width < 0) {
        send_to("./s1.html")
    }
    if (player.x > game.width) {
        send_to("./s3.html")
    }
}

scene.update(tick)
scene.run()

