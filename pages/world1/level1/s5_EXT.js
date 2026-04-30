import { ActionZone, boil_the_plate, bone_tile, CrumblePlatform, invisible_wall_tile, Player, send_to } from "../../../src/prefabs.js"
import { cobj, Scene } from "../../../src/system.js"

boil_the_plate()

const player = new Player(60, 50, false)

const inviz = invisible_wall_tile()
const bone  = bone_tile()
const spawn_right = new cobj({ name: "spawn_right", width: 10, height: 10, collides: false })

const crumble_a = new CrumblePlatform({ width: 30, height: 4, stay_frames: 20, respawn_frames: 100 })

const death    = new ActionZone({ name: "death",    height: 10, width: 10, on_hit: start_timer })
const tp_right = new ActionZone({ name: "tp_right", height: 10, width: 2,  on_hit: () => { send_to("./s5.html") } })

const scene = new Scene()

scene.tiles(10, 10, {
    'x': inviz,
    'R': spawn_right,
    'D': death,
    '1': crumble_a,
    'B': bone,
    'm': tp_right,
}, [
    "                               m",
    "                               m",
    "                               m",
    "            1                  m",
    "                   1           m",
    "                               m",
    "     1      DDDDDD             m",
    "            xxxxxxD     1      m",
    "                 xx            m",
    "              B  xx            m",
    "                 xx  1         m",
    "            xxxxxx           R m",
    "     1                     xxxxx",
    "                       1       m",
    "                               m",
    "                  1            m",
    "           1                   m",
    "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
])

scene.spawn(player, spawn_right, () => true)
scene.camera(player, { lerp: 0.1 })

scene.collectable(bone, "world1/level1/bone_s5_EXT")

function respawn() {
    player.move(spawn_right.x, spawn_right.y);
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
