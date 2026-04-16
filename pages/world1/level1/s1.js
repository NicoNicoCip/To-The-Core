import { boil_the_plate, Player, Shaker } from "../../../src/prefabs.js"
import { bobj, cobj, Scene } from "../../../src/system.js"

boil_the_plate()

const player     = new Player(60, 50, true)
const background = new bobj({ name: "background3" })
const midground  = new bobj({ name: "midground_s1" })
const foreground = new bobj({ name: "scene_s1" })

const wall  = new cobj({ name: "wall",       width: 10, height: 10, shows_debug_col: true })
const inviz = new cobj({ name: "inviz_wall", width: 10, height: 10, shows_debug_col: true })
const spawn = new cobj({ name: "spawn",      width: 10, height: 10, collides: false })

const scene = new Scene()

scene.layer(background, -5, 0.3)
scene.layer(midground,  -2, 0.6)
scene.layer(foreground,  2, 1.0)

scene.tiles(10, 10, {
    '#': wall,
    'x': inviz,
    'S': spawn,
}, [
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x     S                        x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "xxxxxxxxxxxxxxxxxxxxx          x",
    "xxxxxxxxxxxxxxxxxxxxx          x",
    "xxxxxxxxxxxxxxxxxxxxx          x",
    "xxxxxxxxxxxxxxxxxxxxx          x",
    "xxxxxxxxxxxxxxxxxxxxx          x",
    "xxxxxxxxxxxxxxxxxxxxx          x",
])

scene.spawn(player, spawn, () => true)
scene.camera(player, { lerp: 0.1 })

const shaker = new Shaker()

scene.update(function() {
    player.update()
    scene.toggle_debug()

    if (player.just_landed && player.landing && player.landed_once) {
        shaker.shake(1, 20)
    }

    shaker.tick_shake()
    scene.move_and_collide()
})

scene.run()
