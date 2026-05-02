import { ActionZone, boil_the_plate, come_from, CrumblePlatform, invisible_wall_tile, Player, send_to } from "../../../src/prefabs.js"
import { cobj, Scene } from "../../../src/system.js"

boil_the_plate()

const player = new Player(60, 50, false)

const inviz = invisible_wall_tile()
const spawn_right = new cobj({ name: "spawn_right", width: 10, height: 10, collides: false })
const spawn_left  = new cobj({ name: "spawn_left",  width: 10, height: 10, collides: false })
const spawn_down  = new cobj({ name: "spawn_down",  width: 10, height: 10, collides: false })

const crumble_a = new CrumblePlatform({ width: 30, height: 4, stay_frames: 15, respawn_frames: 100 })

const death   = new ActionZone({ name: "death",   height: 10, width: 10, on_hit: start_timer })
const tp_top  = new ActionZone({ name: "tp_top",  height: 2,  width: 10, on_hit: () => { send_to("./s4.html") } })
const tp_left = new ActionZone({ name: "tp_left", height: 10, width: 2,  on_hit: () => { send_to("./s5_EXT.html") } })
const tp_right = new ActionZone({ name: "tp_right", height: 10, width: 2,  on_hit: () => { send_to("./s6.html") } })

const scene = new Scene()

scene.tiles(10, 10, {
    'x': inviz,
    'R': spawn_right,
    'L': spawn_left,
    'd': spawn_down,
    'D': death,
    '1': crumble_a,
    't': tp_top,
    'n': tp_left,
    'm': tp_right
}, [
    "xxttxxx       xxx   xxx        x",
    "x L            x     x         x",
    "x              x     x         x",
    "x1             x     x         x",
    "x              x               x",
    "x              x               x",
    "xxxxxx         x               x",
    "xx             x               x",
    "n                    D         x",
    "n                    x         x",
    "n                1   x  1      x",
    "nd                   x         x",
    "xxxxx          D     x         m",
    "xx             x 1   x  1      m",
    "x        1     x     x         m",
    "x              x     x       R m",
    "x             DxD   DxD   xxxxxx",
    "DDDDDDDDDDDDDDxxxDDDxxxDDDDDDDDD",
])

tp_right.shift(8,0)

scene.spawn(player, spawn_right, () => come_from("s6.html"), () => true)
scene.spawn(player, spawn_down,  () => come_from("s5_EXT.html"), () => true)
scene.spawn(player, spawn_left,  () => true)
scene.camera(player, { lerp: 0.1 })

function respawn() {
    if (come_from("s6.html")) {
        player.move(spawn_right.x, spawn_right.y);
    } else if (come_from("s5_EXT.html")) {
        player.move(spawn_down.x, spawn_down.y);
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
