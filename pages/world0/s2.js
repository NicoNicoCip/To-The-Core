import { ActionZone, boil_the_plate, come_from, invisible_wall_tile, Player, send_to } from "../../src/prefabs.js"
import { bobj, cobj, game, Scene } from "../../src/system.js"

boil_the_plate()

const player = new Player(10, 10, false)
const background = new bobj({ name: "background3" })
const foreground = new bobj({ name: "scene_s2" })
const midground = new bobj({ name: "midground_s2" })

const inviz = invisible_wall_tile()
const oneway = new cobj({ name: "oneways", width: 10, height: 10, shows_debug_col: true, one_way: true })
const spawn_top = new cobj({ name: "spawn_top", width: 10, height: 10, collides: false })
const spawn_left = new cobj({ name: "spawn_left", width: 10, height: 10, collides: false })
const spawn_right = new cobj({ name: "spawn_right", width: 10, height: 10, collides: false })

const tp_right = new ActionZone(
    { name: "tp_right", height: 10, width: 2, on_hit: () => { send_to("./s2_EXT.html") } })
const tp_left = new ActionZone(
    { name: "tp_left", height: 10, width: 2, on_hit: () => { send_to("./s3.html") } })

const scene = new Scene()

scene.layer(background, -5, 0)
scene.layer(midground, -3, 0)
scene.layer(foreground, 2, 0)

scene.tiles(10, 10, {
    'x': inviz,
    'v': oneway,
    'T': spawn_top,
    'L': spawn_left,
    'R': spawn_right,
    'n': tp_left,
    'm': tp_right,
}, [
    "                         T      ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "n                               ",
    "n                               ",
    "n                               ",
    "n L                             ",
    "xxxxxx                          ",
    "xx                              ",
    "xx                             m",
    "xx   vvvvvvvv                  m",
    "xxx                            m",
    "xxxx                         R m",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
])

tp_right.shift(8,0)

scene.spawn(player, spawn_top, () => come_from("s1.html"))
scene.spawn(player, spawn_left, () => come_from("s3.html"))
scene.spawn(player, spawn_right, () => true, () => { player.facing = -1 })

scene.camera(player, { lerp: 0.1 })

function tick() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()
}

scene.update(tick)
scene.run()
