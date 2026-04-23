import { ActionZone, boil_the_plate, bone_tile, come_from, invisible_wall_tile, Player, send_to } from "../../src/prefabs.js"
import { bobj, cobj, game, Scene } from "../../src/system.js"

boil_the_plate()

const player     = new Player(60, 50, false)
const background = new bobj({ name: "background3" })
const midground  = new bobj({ name: "midground_s5" })
const foreground = new bobj({ name: "scene_s5" })

const inviz   = invisible_wall_tile()
const thin    = new cobj({ name: "thin_wall",  width: 4,  height: 10, shows_debug_col: true })
const half    = new cobj({ name: "half_wall",  width: 10, height: 1,  one_way: true, shows_debug_col: true })
const bone    = bone_tile()
const spawn_s = new cobj({ name: "spawn_s",    width: 10, height: 10, collides: false })
const spawn_t = new cobj({ name: "spawn_t",    width: 10, height: 10, collides: false })

const tp_s6 = new ActionZone({ name: "tp_s6", height: 10, width: 2, on_hit: () => { send_to("./s6.html") } })

const scene = new Scene()

scene.layer(background, -5, 0)
scene.layer(midground,  -2, 0)
scene.layer(foreground,  2, 0)

scene.tiles(10, 10, {
    'x': inviz,
    'y': thin,
    'v': half,
    'B': bone,
    'S': spawn_s,
    'T': spawn_t,
    'n': tp_s6,
}, [
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
    "n                              x",
    "n           vvv     vvvv       x",
    "n                              x",
    "nS y                           x",
    "xxxx   xxxxxxxxxxxxxxxxxxxxxxxxx",
    "xxxx T xxxxxxxxxxxxxxxxxxxxxxxxx",
])

const halfs = scene.find_all('v')
halfs[0].shift(0, 1)
halfs[1].shift(0, 6)
halfs[2].shift(3, 5)
thin.shift(5, 0)

scene.spawn(player, spawn_s, () => come_from("s6.html"))
scene.spawn(player, spawn_t, () => true, () => { boll = true })

scene.collectable(bone, "world0/bone_s5")
scene.camera(player, { lerp: 0.1 })

let boll = false

function tick() {
    player.update()
    scene.toggle_debug()

    if (boll) {
        player.call_force({ x: 1, y: -5, x_time: 30, y_time: 1 })
        boll = false
    }

    player.apply_force()
    scene.move_and_collide()
}

scene.update(tick)
scene.run()
