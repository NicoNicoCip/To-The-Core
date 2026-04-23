import { ActionZone, boil_the_plate, come_from, invisible_wall_tile, Player, send_to } from "../../src/prefabs.js"
import { bobj, cobj, game, input, Scene } from "../../src/system.js"

boil_the_plate()

const player = new Player(60, 50, false)
const background = new bobj({ name: "background3" })
const midground = new bobj({ name: "midground_s4" })
const foreground = new bobj({ name: "scene_s4" })

const inviz = invisible_wall_tile()
const moved_wall = new cobj({ name: "moved_wall", width: 10, height: 10, shows_debug_col: true })
const height_wall = new cobj({ name: "height_wall", width: 2, height: 10, shows_debug_col: true })
const jumper = new cobj({ name: "jumper", width: 10, height: 3, collides: false, shows_debug_col: true })
const spawn_left = new cobj({ name: "spawn_left", width: 10, height: 10, collides: false })
const spawn_right = new cobj({ name: "spawn_right", width: 10, height: 10, collides: false })

const death = new ActionZone({ name: "death", height: 10, width: 10, on_hit: start_timer })
const tp_s3 = new ActionZone({ name: "tp_s3", height: 10, width: 2, on_hit: () => { send_to("./s3.html") } })
const tp_s5 = new ActionZone({ name: "tp_s5", height: 2, width: 10, on_hit: () => { send_to("./s5.html") } })

const scene = new Scene()

scene.layer(background, -5, 0)
scene.layer(midground, -2, 0)
scene.layer(foreground, 2, 0)

scene.tiles(10, 10, {
    'x': inviz,
    'v': moved_wall,
    'h': height_wall,
    'j': jumper,
    'L': spawn_left,
    'R': spawn_right,
    'n': tp_s5,
    'm': tp_s3,
    'D': death
}, [
    "hnnnnnnnnnnn                    ",
    "h    L                          ",
    "h                               ",
    "h  vvv                         m",
    "h                              m",
    "h                              m",
    "hvvvv                          m",
    "h                              m",
    "h                              m",
    "xxxxxxxxxx         jjj         m",
    "D                            R m",
    "D                         xxxxxx",
    "D                         xxxxxx",
    "D                         xxxxxx",
    "D                         xxxxxx",
    "D                              D",
    "D                              D",
    "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
])

const moved = scene.find_all('v')
moved[0].shift(6, 0)
moved[1].shift(-5, 0)
tp_s5.shift(-8,0)
tp_s3.shift(8,0)

jumper.shift(-5, 7)

scene.spawn(player, spawn_left, () => come_from("s5.html"))
scene.spawn(player, spawn_right, () => true, () => { player.facing = -1 })

scene.camera(player, { lerp: 0.1 })

const jumper_force = 4

function respawn() {
    if (come_from("s5.html")) {
        player.move(spawn_left.x, spawn_left.y);
    } else {
        player.move(spawn_right.x, spawn_right.y);
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

    if (player.overlaps(jumper)) {
        player.call_force({
            y: input.probe("s", input.KEYHELD) ? -jumper_force * 1.4 : -jumper_force,
            y_time: 1
        })
    }

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
