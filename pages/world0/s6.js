import { boil_the_plate, come_from, invisible_wall_tile, Player, send_to } from "../../src/prefabs.js"
import { bobj, cobj, game, Scene } from "../../src/system.js"

boil_the_plate()

const player     = new Player(60, 50, false)
const background = new bobj({ name: "background3" })
const midground  = new bobj({ name: "midground_s6" })
const foreground = new bobj({ name: "scene_s6" })

const inviz   = invisible_wall_tile()
const half    = new cobj({ name: "half_wall",  width: 10, height: 1,  one_way: true, shows_debug_col: true })
const spawn_l = new cobj({ name: "spawn_l",    width: 10, height: 10, collides: false })
const spawn_r = new cobj({ name: "spawn_r",    width: 10, height: 10, collides: false })

const scene = new Scene()

scene.layer(background, -5, 0)
scene.layer(midground,  -2, 0)
scene.layer(foreground,  2, 0)

scene.tiles(10, 10, {
    'x': inviz,
    'v': half,
    'L': spawn_l,
    'R': spawn_r,
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
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "  L                          R  ",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
])

scene.spawn(player, spawn_l, () => come_from("s7.html"),  () => { player.facing =  1 })
scene.spawn(player, spawn_r, () => true,                   () => { player.facing = -1 })

scene.camera(player, { lerp: 0.1 })

scene.update(function() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()

    if (player.x > game.width)       send_to("./s5.html")
    if (player.x + player.width < 0) send_to("./s7.html")
})

scene.run()
