import { boil_the_plate, come_from, invisible_wall_tile, Player, spawn_tile, send_to, ActionZone  } from "../../../src/prefabs.js"
import { bobj, cobj, game, Scene } from "../../../src/system.js"

boil_the_plate()

const player = new Player(60, 50, false)


const inviz = invisible_wall_tile()
const spawn = spawn_tile()
const death = new ActionZone({name: "death", height: 10, width: 10, on_hit: start_timer})
const spawn_right = new cobj({ name: "spawn_right", width: 10, height: 10, collides: false })
const spawn_left = new cobj({ name: "spawn_left", width: 10, height: 10, collides: false })
const tp_left = new ActionZone({ name: "tp_left", height: 10, width: 2, on_hit: () => { send_to("./s1.html") } })
const tp_right = new ActionZone({ name: "tp_right", height: 10, width: 2, on_hit: () => { send_to("./s3.html") } })

const scene = new Scene()

scene.tiles(10, 10, {
    'x': inviz,
    'R': spawn_right,
    'L': spawn_left,
    'D': death,
    'n': tp_left,
    'm': tp_right
}, [
    "x       xxxxxxxxxxxxxxxxxxxxxxxx",
    "x                              m",
    "x                            R m",
    "x       xxxxxxxxxxxxxxxxxxxxxxxx",
    "x                            xxx",
    "xxx                            x",
    "x                              x",
    "x                              x",
    "x   xxx                        x",
    "x                    xxx       x",
    "x          xxx                 x",
    "x                              x",
    "x                            xxx",
    "n                              D",
    "n                      xxx     D",
    "n L            xxx             D",
    "xxxxxxxxxx                     D",
    "xxxxDDDDDDDDDDDDDDDDDDDDDDDDDDDD",
])

tp_right.shift(8,0)

function respawn() {
    if (come_from("s3.html")) {
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

scene.spawn(player, spawn_right, () => come_from("s3.html"), () => { player.facing = -1 })
scene.spawn(player, spawn_left, () => true)
scene.camera(player, { lerp: 0.1 })

function tick() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    scene.move_and_collide()

    if(timer > 0) {
        timer--
    } else if (timer == 0){
        respawn()
        timer = -1;
    }
}

scene.update(tick)
scene.run()

