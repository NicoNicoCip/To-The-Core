import { ActionZone, boil_the_plate, come_from, invisible_wall_tile, Player, send_to } from "../../src/prefabs.js"
import { bobj, cobj, game, Scene } from "../../src/system.js"

boil_the_plate()

const player     = new Player(60, 50, false)
const background = new bobj({ name: "background3" })
const midground  = new bobj({ name: "midground_s7" })
const foreground = new bobj({ name: "scene_s7" })

const inviz   = invisible_wall_tile()
const spawn_l = new cobj({ name: "spawn_l",    width: 10, height: 10, collides: false })
const spawn_r = new cobj({ name: "spawn_r",    width: 10, height: 10, collides: false })

const tp_s6 = new ActionZone({ name: "tp_s6", height: 10, width: 2, on_hit: () => { send_to("./s6.html") } })
const tp_s8 = new ActionZone({ name: "tp_s8", height: 10, width: 2, on_hit: () => { send_to("./s8.html") } })

const scene = new Scene()

scene.layer(background, -5, 0)
scene.layer(midground,  -2, 0)
scene.layer(foreground,  2, 0)

scene.tiles(10, 10, {
    'x': inviz,
    'L': spawn_l,
    'R': spawn_r,
    'n': tp_s6,
    'm': tp_s8,
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
    "                                ",
    "m                              n",
    "m                              n",
    "m                              n",
    "m L                          R n",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
])

tp_s6.shift(8,0)

scene.spawn(player, spawn_l, () => come_from("s8.html"),  () => { player.facing =  1 })
scene.spawn(player, spawn_r, () => true,                   () => { player.facing = -1 })

scene.camera(player, { lerp: 0.1 })

function tick() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()
}

scene.update(tick)
scene.run()
