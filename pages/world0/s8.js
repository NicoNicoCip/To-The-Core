import { ActionZone, boil_the_plate, invisible_wall_tile, Player, send_to, spawn_tile } from "../../src/prefabs.js"
import { bobj, game, Scene } from "../../src/system.js"

boil_the_plate()

const player = new Player(60, 50, false)
const background = new bobj({ name: "background3" })
const midground = new bobj({ name: "midground_s8" })
const foreground = new bobj({ name: "scene_s8" })

const tp_right = new ActionZone({ name: "tp_right", height: 10, width: 2, on_hit: () => { send_to("./s7.html") } })
const tp_bottom = new ActionZone(
    { name: "tp_bottom", height: 2, width: 10, on_hit: () => { send_to("../world1/level1/s1.html") } })

const inviz = invisible_wall_tile()
const spawn = spawn_tile()

const scene = new Scene()

scene.layer(background, -5, 0)
scene.layer(midground, -3, 0)
scene.layer(foreground, 2, 0)

scene.tiles(10, 10, {
    'x': inviz,
    'S': spawn,
    'n': tp_right,
    'm': tp_bottom
}, [
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
    "    x                           ",
    "    x                          n",
    "    x                          n",
    "    x                          n",
    "    x                        S n",
    "    xxxxxxxxxx    xxxxxxxxxxxxxx",
    "    xxxxxxxxxxmmmmxxxxxxxxxxxxxx",
])

tp_right.shift(8, 0)
tp_bottom.shift(0,8)

scene.spawn(player, spawn, () => true, () => { player.facing = 1 })
scene.camera(player, { lerp: 0.1 })

function tick() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()
}

scene.update(tick)
scene.run()
