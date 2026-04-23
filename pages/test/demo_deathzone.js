import { boil_the_plate, DeathZone, Player } from "../../src/prefabs.js"
import { cobj, Scene } from "../../src/system.js"

boil_the_plate()

const SPAWN_X = 30
const SPAWN_Y = 40

const player = new Player(SPAWN_X, SPAWN_Y, false)

const wall = new cobj({ name: "wall", width: 10, height: 10, shows_debug_col: true })
const spawn = new cobj({ name: "spawn", width: 10, height: 10, collides: false })

const scene = new Scene()

scene.tiles(10, 10, {
    'x': wall,
    'S': spawn,
}, [
    "x                              x",
    "x                              x",
    "x  S                           x",
    "x                              x",
    "x                              x",
    "xxxxx                          x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x           xxxxx              x",
    "x                              x",
    "x                              x",
    "x                   xxxxx      x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
])

scene.spawn(player, spawn, () => true)
scene.camera(player, { lerp: 0.1 })

function respawn() {
    player.move(SPAWN_X, SPAWN_Y)
    player.x_speed = 0
    player.y_speed = 0
}

const pit = new DeathZone({ width: 320, height: 10, on_hit: respawn })
scene.place(pit)
pit.move(0, 170)

function tick() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()
}

scene.update(tick)
scene.run()
