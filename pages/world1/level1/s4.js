import { ActionZone, boil_the_plate, come_from, CrumblePlatform, invisible_wall_tile, Player, send_to } from "../../../src/prefabs.js"
import { cobj, Scene } from "../../../src/system.js"

boil_the_plate()

const player = new Player(60, 50, false)

const inviz = invisible_wall_tile()
const spawn_right = new cobj({ name: "spawn_right", width: 10, height: 10, collides: false })
const spawn_left = new cobj({ name: "spawn_left", width: 10, height: 10, collides: false })

const crumble_a = new CrumblePlatform({ width: 30, height: 4, stay_frames: 30, respawn_frames: 200 })

const death     = new ActionZone({ name: "death",     height: 10, width: 10, on_hit: start_timer })
const tp_left   = new ActionZone({ name: "tp_left",   height: 10, width: 2,  on_hit: () => { send_to("./s3.html") } })
const tp_bottom = new ActionZone({ name: "tp_bottom", height: 2,  width: 10, on_hit: () => { send_to("./s5.html") } })

const scene = new Scene()

scene.tiles(10, 10, {
    'x': inviz,
    'R': spawn_right,
    'L': spawn_left,
    'D': death,
    '1': crumble_a,
    'n': tp_left,
    'b': tp_bottom,
}, [
    "xxxxxxx                         ",
    "n                               ",
    "nL                              ",
    "xxxxx1       xxxxx              ",
    "x             xx                ",
    "x                               ",
    "x                      1        ",
    "xDDDDDDDDDDDDDDDD               ",
    "xxxxxxxxxxxxxxxxx               ",
    "xxxxxxxxxx                      ",
    "xxxxx                           ",
    "x                    1          ",
    "x                               ",
    "x                               ",
    "x              1                ",
    "x     R                         ",
    "xx   xxxxx                      ",
    "xxbbbxxDDDDDDDDDDDDDDDDDDDDDDDDD",
])

scene.spawn(player, spawn_right, () => come_from("s5.html"), () => true)
scene.spawn(player, spawn_left, () => true)
scene.camera(player, { lerp: 0.1 })

function respawn() {
    if (come_from("s5.html")) {
        player.move(spawn_right.x, spawn_right.y);
    } else {
        player.move(spawn_left.x, spawn_left.y);
    }
    player.x_speed = 0;
    player.y_speed = 0;
}

let timer = -1
function start_timer() {
    if (timer == -1) {
        timer = 30
    }
}

function tick() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()

    if (timer > 0) {
        timer--
    } else if (timer == 0) {
        respawn()
        timer = -1;
    }
}

scene.update(tick)
scene.run()
