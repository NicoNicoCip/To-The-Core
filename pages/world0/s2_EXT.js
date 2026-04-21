import { boil_the_plate, bone_tile, invisible_wall_tile, Player, send_to, spawn_tile } from "../../src/prefabs.js"
import { bobj, Scene } from "../../src/system.js"

boil_the_plate()

const player     = new Player(10, 10, false)
const background = new bobj({ name: "background3" })
const foreground = new bobj({ name: "scene_s2_ext" })

const inviz = invisible_wall_tile()
const spawn = spawn_tile()
const bone  = bone_tile()

const scene = new Scene()

scene.layer(background, -5, 0)
scene.layer(foreground,  2, 0)

scene.tiles(10, 10, {
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

function tick() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()

    if (player.x + player.width < 0) {
        send_to("./s2.html")
    }
}

scene.update(tick)
scene.run()
