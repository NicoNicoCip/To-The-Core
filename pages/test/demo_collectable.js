import { bone_tile, boil_the_plate, invisible_wall_tile, Player } from "../../src/prefabs.js"
import { cobj, Scene } from "../../src/system.js"

boil_the_plate()

localStorage.removeItem("collectables")

const player = new Player(20, 140, false)

const wall = invisible_wall_tile()
const spawn = new cobj({ name: "spawn", width: 10, height: 10, collides: false })
const bone_a = bone_tile()
const bone_b = bone_tile()
const bone_c = bone_tile()

const scene = new Scene()

scene.tiles(10, 10, {
    'x': wall,
    'S': spawn,
    'A': bone_a,
    'B': bone_b,
    'C': bone_c,
}, [
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x  S                           x",
    "x        A         B        C  x",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
])

scene.spawn(player, spawn, () => true)
scene.camera(player, { lerp: 0.1 })

scene.collectable(bone_a, "demo/bone_a")
scene.collectable(bone_b, "demo/bone_b")
scene.collectable(bone_c, "demo/bone_c")

function tick() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()
}

scene.update(tick)
scene.run()
