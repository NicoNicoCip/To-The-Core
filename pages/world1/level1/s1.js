import { boil_the_plate, invisible_wall_tile, Player, spawn_tile } from "../../../src/prefabs.js"
import { Scene } from "../../../src/system.js"

boil_the_plate()

const player = new Player(60, 50, false)

const inviz = invisible_wall_tile()
const spawn = spawn_tile()

const scene = new Scene()

scene.tiles(10, 10, {
    'x': inviz,
    'S': spawn,
}, [
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                               x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x              S               x",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
])

scene.spawn(player, spawn, () => true)
scene.camera(player, { lerp: 0.1 })

scene.update(function() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()
})

scene.run()

