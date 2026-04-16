import { boil_the_plate, Player, send_to } from "../../src/prefabs.js"
import { bobj, cobj, Scene } from "../../src/system.js"

boil_the_plate()

const player     = new Player(10, 10, false)
const background = new bobj({ name: "background3" })
const foreground = new bobj({ name: "scene_s2_ext" })

const wall  = new cobj({ name: "wall",       width: 10, height: 10, shows_debug_col: true })
const inviz = new cobj({ name: "inviz_wall", width: 10, height: 10, shows_debug_col: true })
const spawn = new cobj({ name: "spawn",      width: 10, height: 10, collides: false })
const bone  = new cobj({ name: "bone",       width: 10, height: 10, dynamic: true, collides: false, shows_debug_col: true })

const scene = new Scene()

scene.layer(background, -5, 0.3)
scene.layer(foreground,  2, 1.0)

scene.tiles(10, 10, {
    '#': wall,
    'x': inviz,
    'S': spawn,
    'B': bone,
}, [
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
])

scene.spawn(player, spawn, () => true)
scene.collectable(bone, "world0/bone_s2_EXT")
scene.camera(player, { lerp: 0.1 })

scene.update(function() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()

    if (player.x + player.width < 0) send_to("./s2.html")
})

scene.run()
