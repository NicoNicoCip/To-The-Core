import { ActionZone, boil_the_plate, come_from, CrumblePlatform, invisible_wall_tile, Player, send_to, spawn_tile } from "../../../src/prefabs.js"
import { cobj, game, Scene } from "../../../src/system.js"

boil_the_plate()

const player = new Player(60, 50, false)

const inviz = invisible_wall_tile()
const spawn = spawn_tile()
const spawn_right = new cobj({ name: "spawn_right", width: 10, height: 10, collides: false })
const spawn_left = new cobj({ name: "spawn_left", width: 10, height: 10, collides: false })

const crumble_a = new CrumblePlatform({ width: 30, height: 4, stay_frames: 30, respawn_frames: 200 })
const crumble_b = new CrumblePlatform({ width: 30, height: 4, stay_frames: 30, respawn_frames: 200 })
const crumble_c = new CrumblePlatform({ width: 30, height: 4, stay_frames: 30, respawn_frames: 200 })
const crumble_d = new CrumblePlatform({ width: 30, height: 4, stay_frames: 30, respawn_frames: 200 })

const death = new ActionZone({ name: "death", height: 10, width: 10, on_hit: start_timer })
const death_2 = new ActionZone({ name: "death", height: 10, width: 2, on_hit: respawn })
const tp_left = new ActionZone({ name: "tp_left", height: 10, width: 2, on_hit: () => { send_to("./s2.html") } })
const tp_right = new ActionZone({ name: "tp_right", height: 10, width: 2, on_hit: () => { send_to("./s4.html") } })

const scene = new Scene()

scene.tiles(10, 10, {
    'x': inviz,
    'R': spawn_right,
    'L': spawn_left,
    '1': crumble_a,
    '2': crumble_b,
    '3': crumble_c,
    '4': crumble_d,
    'D': death,
    'd': death_2,
    'n': tp_left,
    'm': tp_right
}, [
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "n          xx                  m",
    "n L       xx                 R m",
    "xxxxx1  xxxxxxxxxxxxxx      xxxx",
    "x                              d",
    "x                     4        d",
    "x                              d",
    "x                              d",
    "x                         xxx  d",
    "x                              d",
    "x                              d",
    "x                   3          d",
    "x                              d",
    "x           2                  d",
    "x                              d",
    "x                              d",
    "xxxxxxxxxx                     d",
    "xxxxDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
])

death_2.shift(8, 0)
tp_right.shift(8,0)

scene.spawn(player, spawn_right, () => come_from("s4.html"), () => { player.facing = -1 })
scene.spawn(player, spawn_left, () => true)
scene.camera(player, { lerp: 0.1 })

function respawn() {
    if (come_from("s4.html")) {
        player.move(spawn_right.x, spawn_right.y);
    } else {
        player.move(spawn_left.x, spawn_left.y);
    }
    player.x_speed = 0;
    player.y_speed = 0;
}

let timer = -1
function start_timer() {
    timer = 30
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

