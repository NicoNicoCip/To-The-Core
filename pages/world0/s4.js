import { boil_the_plate, come_from, invisible_wall_tile, Player, send_to } from "../../src/prefabs.js"
import { bobj, cobj, game, input, Scene } from "../../src/system.js"

boil_the_plate()

const player      = new Player(60, 50, false)
const background  = new bobj({ name: "background3" })
const midground   = new bobj({ name: "midground_s4" })
const foreground  = new bobj({ name: "scene_s4" })

const inviz       = invisible_wall_tile()
const moved_wall  = new cobj({ name: "moved_wall",  width: 10, height: 10, shows_debug_col: true })
const height_wall = new cobj({ name: "height_wall", width: 1,  height: 10, shows_debug_col: true })
const jumper      = new cobj({ name: "jumper",      width: 10, height: 3,  collides: false, shows_debug_col: true })
const spawn_l     = new cobj({ name: "spawn_l",     width: 10, height: 10, collides: false })
const spawn_r     = new cobj({ name: "spawn_r",     width: 10, height: 10, collides: false })

const scene = new Scene()

scene.layer(background, -5, 0)
scene.layer(midground,  -2, 0)
scene.layer(foreground,  2, 0)

scene.tiles(10, 10, {
    'x': inviz,
    'v': moved_wall,
    'h': height_wall,
    'j': jumper,
    'L': spawn_l,
    'R': spawn_r,
}, [
    "h                               ",
    "h    L                          ",
    "h                               ",
    "h  vvv                          ",
    "h                               ",
    "h                               ",
    "hvvvv                           ",
    "h                               ",
    "h                               ",
    "xxxxxxxxxx         jjj          ",
    "                             R  ",
    "                          xxxxxx",
    "                          xxxxxx",
    "                          xxxxxx",
    "                          xxxxxx",
    "                                ",
    "                                ",
    "                                ",
])

const moved = scene.find_all('v')
moved[0].shift(6, 0)
moved[1].shift(-5, 0)

jumper.shift(-5, 7)

scene.spawn(player, spawn_l, () => come_from("s5.html"))
scene.spawn(player, spawn_r, () => true, () => { player.facing = -1 })

scene.camera(player, { lerp: 0.1 })

const jumper_force = 4

scene.update(function() {
    player.update()
    scene.toggle_debug()

    if (player.overlaps(jumper)) {
        player.call_force({
            y: input.probe("s", input.KEYHELD) ? -jumper_force * 1.4 : -jumper_force,
            y_time: 1
        })
    }

    player.apply_force()
    scene.move_and_collide()

    if (player.y + player.height < 0) send_to("./s5.html")
    if (player.y > game.height)         send_to("./s4.html")
    if (player.x > game.width)         send_to("./s3.html")
})

scene.run()
