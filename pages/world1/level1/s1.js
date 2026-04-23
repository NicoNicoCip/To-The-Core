import { boil_the_plate, come_from, invisible_wall_tile, Player, spawn_tile, send_to, ActionZone  } from "../../../src/prefabs.js"
import { bobj, cobj, game, Scene } from "../../../src/system.js"

boil_the_plate()

const player = new Player(60, 50, false)

const inviz = invisible_wall_tile()
const spawn = spawn_tile()
const spawn_top = new cobj({ name: "spawn_top", width: 10, height: 10, collides: false })
const spawn_right = new cobj({ name: "spawn_right", width: 10, height: 10, collides: false })
const spawn_left = new cobj({ name: "spawn_left", width: 10, height: 10, collides: false })

const tp_s1_EXT = new ActionZone(
    { name: "tp_s1_EXT", height: 10, width: 2, on_hit: () => { send_to("./s1_EXT.html") } })
const tp_s2 = new ActionZone(
    { name: "tp_s2", height: 10, width: 2, on_hit: () => { send_to("./s2.html") } })

const scene = new Scene()

scene.tiles(10, 10, {
    'x': inviz,
    'T': spawn_top,
    'R': spawn_right,
    'L': spawn_left,
    'n':tp_s1_EXT,
    'm':tp_s2
}, [
    "x                               ",
    "n                               ",
    "n                               ",
    "n                               ",
    "n                               ",
    "n                               ",
    "nL                              ",
    "xx                              ",
    "x                              x",
    "x                              x",
    "xx                             x",
    "xx                             x",
    "xx                             x",
    "xxx                            m",
    "xxx                            m",
    "xxx            T             R m",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
])

tp_s2.shift(8,0)

scene.spawn(player, spawn_left, () => come_from("s1_EXT.html"))
scene.spawn(player, spawn_right, () => come_from("s2.html"), () => { player.facing = -1 })
scene.spawn(player, spawn_top, () => true)
scene.camera(player, { lerp: 0.1 })

function tick() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()
}

scene.update(tick)
scene.run()

