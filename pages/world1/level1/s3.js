import { boil_the_plate, come_from, invisible_wall_tile, Player, spawn_tile, send_to, CrumblePlatform  } from "../../../src/prefabs.js"
import { bobj, cobj, game, Scene } from "../../../src/system.js"

boil_the_plate()

const player = new Player(60, 50, false)

const inviz = invisible_wall_tile()
const spawn = spawn_tile()
const spawn_right = new cobj({ name: "spawn_right", width: 10, height: 10, collides: false })
const spawn_left = new cobj({ name: "spawn_left", width: 10, height: 10, collides: false })

const scene = new Scene()

scene.tiles(10, 10, {
    'x': inviz,
    'R': spawn_right,
    'L': spawn_left,
}, [
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "           xx                   ",
    " L        xx                  R ",
    "xxxxx   xxxxxxxxxxxxxx      xxxx",
    "x                               ",
    "x                               ",
    "x                               ",
    "x                               ",
    "x                               ",
    "x                               ",
    "x                               ",
    "x                               ",
    "x                               ",
    "x                               ",
    "x                               ",
    "x                               ",
    "xxxxxxxxxx                      ",
    "xxxx                            ",
])



const platforms = [
    new CrumblePlatform({ width: 30, height: 4, stay_frames: 45, respawn_frames: 150 }),
    new CrumblePlatform({ width: 30, height: 4, stay_frames: 60, respawn_frames: 180 }),
    new CrumblePlatform({ width: 30, height: 4, stay_frames: 90, respawn_frames: 220 }),
    new CrumblePlatform({ width: 30, height: 4, stay_frames: 30, respawn_frames: 120 }),
]

platforms[0].move(100,  50)
platforms[1].move(120, 110)
platforms[2].move(180, 80)
platforms[3].move(240, 50)

for (const p of platforms) {
    game.world.appendChild(p.graphic)
}

scene.spawn(player, spawn_right, () => come_from("s4.html"), () => { player.facing = -1 })
scene.spawn(player, spawn_left, () => true)
scene.camera(player, { lerp: 0.1 })

function tick() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
    //scene.move_and_collide()

    for (const p of platforms) {
        p.update(player)
    }
    scene.move_and_collide()
    for (const p of platforms) {
        const horiz = player.x + player.width > p.x && player.x < p.x + p.width
        if (horiz && player.y + player.height === p.y) {
            player.grounded = true
        }
    }

    if (player.x + player.width < 0) {
        send_to("./s1.html")
    }
    if (player.x > game.width) {
        send_to("./s3.html")
    }
}

scene.update(tick)
scene.run()

