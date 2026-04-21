import { boil_the_plate, Player } from "../../src/prefabs.js"
import { cobj, Scene } from "../../src/system.js"

boil_the_plate()

const player = new Player(20, 140, false)

const wall = new cobj({ name: "wall", width: 10, height: 10, shows_debug_col: true })
const marker = new cobj({ name: "marker", width: 10, height: 10, one_way: true, shows_debug_col: true })
const spawn = new cobj({ name: "spawn", width: 10, height: 10, collides: false })

const scene = new Scene()

scene.tiles(10, 10, {
    'x': wall,
    'm': marker,
    'S': spawn,
}, [
    "x                                                                              x",
    "x                                                                              x",
    "x                                                                              x",
    "x                                                                              x",
    "x                                                                              x",
    "x                                                                              x",
    "x                                                                              x",
    "x                                                                              x",
    "x                                                                              x",
    "x                   mmm             mmm            mmm            mmm          x",
    "x                                                                              x",
    "x       mmm                mmm             mmm            mmm                  x",
    "x  S                                                                           x",
    "x                                                                              x",
    "x              mmmm       mmmm       mmmm       mmmm       mmmm                x",
    "x                                                                              x",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
])

scene.spawn(player, spawn, () => true)
scene.camera(player, { lerp: 0.1 })

function tick() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()
}

scene.update(tick)
scene.run()
