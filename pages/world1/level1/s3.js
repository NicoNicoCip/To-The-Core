import { boil_the_plate, come_from, CrumblePlatform, invisible_wall_tile, Player, send_to, spawn_tile } from "../../../src/prefabs.js"
import { cobj, game, Scene } from "../../../src/system.js"

boil_the_plate()

const player = new Player(60, 50, false)

const inviz = invisible_wall_tile()
const spawn = spawn_tile()
const spawn_right = new cobj({ name: "spawn_right", width: 10, height: 10, collides: false })
const spawn_left = new cobj({ name: "spawn_left", width: 10, height: 10, collides: false })

const crumble_a = new CrumblePlatform({ width: 30, height: 4, stay_frames: 45, respawn_frames: 150 })
const crumble_b = new CrumblePlatform({ width: 30, height: 4, stay_frames: 60, respawn_frames: 180 })
const crumble_c = new CrumblePlatform({ width: 30, height: 4, stay_frames: 90, respawn_frames: 220 })
const crumble_d = new CrumblePlatform({ width: 30, height: 4, stay_frames: 30, respawn_frames: 120 })

const scene = new Scene()

scene.tiles(10, 10, {
    'x': inviz,
    'R': spawn_right,
    'L': spawn_left,
    '1': crumble_a,
    '2': crumble_b,
    '3': crumble_c,
    '4': crumble_d,
}, [
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "           xx                   ",
    " L        xx                  R ",
    "xxxxx   xxxxxxxxxxxxxx      xxxx",
    "x                               ",
    "x         1             4       ",
    "x                               ",
    "x                               ",
    "x                 3             ",
    "x                               ",
    "x                               ",
    "x                               ",
    "x                               ",
    "x           2                   ",
    "x                               ",
    "x                               ",
    "xxxxxxxxxx                      ",
    "xxxx                            ",
])

scene.spawn(player, spawn_right, () => come_from("s4.html"), () => { player.facing = -1 })
scene.spawn(player, spawn_left, () => true)
scene.camera(player, { lerp: 0.1 })

function tick() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()

    if (player.x + player.width < 0) {
        send_to("./s2.html")
    }
    if (player.x > game.width) {
        send_to("./s4.html")
    }
}

scene.update(tick)
scene.run()

