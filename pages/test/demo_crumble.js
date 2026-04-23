import { boil_the_plate, CrumblePlatform, Player } from "../../src/prefabs.js"
import { cobj, Scene } from "../../src/system.js"

boil_the_plate()

const player = new Player(20, 100, false)

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
    "x  S                           x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
])

scene.spawn(player, spawn, () => true)
scene.camera(player, { lerp: 0.1 })

const platforms = [
    new CrumblePlatform({ width: 30, height: 4, stay_frames: 45, respawn_frames: 150 }),
    new CrumblePlatform({ width: 30, height: 4, stay_frames: 60, respawn_frames: 180 }),
    new CrumblePlatform({ width: 30, height: 4, stay_frames: 90, respawn_frames: 220 }),
    new CrumblePlatform({ width: 30, height: 4, stay_frames: 30, respawn_frames: 120 }),
]

for (const p of platforms) {
    scene.place(p)
}

platforms[0].move(60,  140)
platforms[1].move(120, 110)
platforms[2].move(180, 80)
platforms[3].move(240, 50)

function tick() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()
}

scene.update(tick)
scene.run()
