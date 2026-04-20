import { boil_the_plate, invisible_wall_tile, Player, send_to, spawn_tile } from "../../src/prefabs.js"
import { bobj, game, Scene } from "../../src/system.js"

boil_the_plate()

const player     = new Player(60, 50, false)
const background = new bobj({ name: "background3" })
const midground  = new bobj({ name: "midground_s8" })
const foreground = new bobj({ name: "scene_s8" })

const inviz = invisible_wall_tile()
const spawn = spawn_tile()

const scene = new Scene()

scene.layer(background, -5, 0)
scene.layer(midground, -3, 0)
scene.layer(foreground,  2, 0)

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
    "    x                           ",
    "    x                           ",
    "    x                           ",
    "    x                           ",
    "    x                        S  ",
    "    xxxxxxxxxx    xxxxxxxxxxxxxx",
    "    xxxxxxxxxx    xxxxxxxxxxxxxx",
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
