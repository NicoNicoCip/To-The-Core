import { boil_the_plate, Player, send_to } from "../../src/prefabs.js"
import { bobj, cobj, game, Scene } from "../../src/system.js"

boil_the_plate()

const player     = new Player(60, 50, false)
const background = new bobj({ name: "background3" })
const foreground = new bobj({ name: "scene_s8" })

const inviz = new cobj({ name: "inviz_wall", width: 10, height: 10, shows_debug_col: true })
const spawn = new cobj({ name: "spawn",      width: 10, height: 10, collides: false })

const scene = new Scene()

scene.layer(background, -5, 0.3)
scene.layer(foreground,  2, 1.0)

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
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "x                               ",
    "x                               ",
    "x                               ",
    "x                               ",
    "x                            S  ",
    "xxxxxxxxxxxxxx    xxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxx    xxxxxxxxxxxxxx",
])

scene.spawn(player, spawn, () => true, () => { player.facing = 1 })
scene.camera(player, { lerp: 0.1 })

scene.update(function() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()

    if (player.x > game.width) send_to("./s7.html")
    if (player.y > game.height) send_to("../world1/level1/s1.html")
})

scene.run()
