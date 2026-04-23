import { boil_the_plate, ForceZone, Player, spawn_tile, wall_tile } from "../../src/prefabs.js"
import { Scene } from "../../src/system.js"

boil_the_plate()

const player = new Player(20, 140, false)

const wall = wall_tile()
const spawn = spawn_tile()

const scene = new Scene()

scene.tiles(10, 10, {
    'x': wall,
    'S': spawn,
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
    "x                              x",
    "x                              x",
    "x  S                           x",
    "x                              x",
    "x                              x",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
])

scene.spawn(player, spawn, () => true)
scene.camera(player, { lerp: 0.1 })

const wind = new ForceZone({ name: "wind_zone", width: 80, height: 40, force_x: 1.2, force_y: 0 })
scene.place(wind)
wind.move(100, 140)

const updraft = new ForceZone({ name: "updraft_zone", width: 40, height: 100, force_x: 0, force_y: -0.27 })
scene.place(updraft)
updraft.move(220, 80)

function tick() {
    wind.update(player)
    updraft.update(player)
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()
}

scene.update(tick)
scene.run()
