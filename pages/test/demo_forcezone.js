import { boil_the_plate, ForceZone, Player } from "../../src/prefabs.js"
import { cobj, game, Scene } from "../../src/system.js"

boil_the_plate()

const player = new Player(20, 140, false)

const wall = new cobj({ name: "wall", width: 10, height: 10, shows_debug_col: true })
const spawn = new cobj({ name: "spawn", width: 10, height: 10, collides: false })

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

const wind = new ForceZone({ name: "wind_zone", width: 80, height: 40, force_x: 0.4, force_y: 0 })
wind.move(100, 140)

const updraft = new ForceZone({ name: "updraft_zone", width: 40, height: 100, force_x: 0, force_y: -0.6 })
updraft.move(220, 80)

game.world.appendChild(wind.graphic)
game.world.appendChild(updraft.graphic)

function tick() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    wind.update(player)
    updraft.update(player)
    scene.move_and_collide()
}

scene.update(tick)
scene.run()
