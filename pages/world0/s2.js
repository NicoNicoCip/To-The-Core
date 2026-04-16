import { boil_the_plate, come_from, Player, send_to } from "../../src/prefabs.js"
import { bobj, cobj, game, Scene } from "../../src/system.js"

boil_the_plate()

const player     = new Player(10, 10, false)
const background = new bobj({ name: "background3" })
const foreground = new bobj({ name: "scene_s2" })

const wall        = new cobj({ name: "wall",        width: 10, height: 10, shows_debug_col: true })
const inviz       = new cobj({ name: "inviz_wall",  width: 10, height: 10, shows_debug_col: true })
const spawn_top   = new cobj({ name: "spawn_top",   width: 10, height: 10, collides: false })
const spawn_left  = new cobj({ name: "spawn_left",  width: 10, height: 10, collides: false })
const spawn_right = new cobj({ name: "spawn_right", width: 10, height: 10, collides: false })

const scene = new Scene()

scene.layer(background, -5, 0.3)
scene.layer(foreground,  2, 1.0)

scene.tiles(10, 10, {
    '#': wall,
    'x': inviz,
    'T': spawn_top,
    'L': spawn_left,
    'R': spawn_right,
}, [
    "                         T      ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "  L                             ",
    "xxxxxx                          ",
    "xxxxxx                          ",
    "xxxxxx                          ",
    "xxxxxxxxxxxxx                   ",
    "xxxxxxxxxxxxx                   ",
    "xxxxxxxxxxxxx                R  ",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
])

scene.spawn(player, spawn_top,   () => come_from("s1.html"))
scene.spawn(player, spawn_left,  () => come_from("s3.html"))
scene.spawn(player, spawn_right, () => true, () => { player.facing = -1 })

scene.camera(player, { lerp: 0.1 })

scene.update(function() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()

    if (player.x + player.width < 0) send_to("./s3.html")
    if (player.x > game.width)        send_to("./s2_EXT.html")
})

scene.run()
