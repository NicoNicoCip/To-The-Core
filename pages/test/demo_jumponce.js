import { boil_the_plate, JumpOncePlatform, Player } from "../../src/prefabs.js"
import { cobj, emitter, game, Scene } from "../../src/system.js"

boil_the_plate()

const player = new Player(20, 140, false)

const wall = new cobj({ name: "wall", width: 10, height: 10, shows_debug_col: true })
const spawn = new cobj({ name: "spawn", width: 10, height: 10, collides: false })

const scene = new Scene()

scene.tiles(10, 10, {
    'x': wall,
    'S': spawn,
}, [
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x                              x",
    "x  S                           x",
    "x                              x",
    "xxxxx                     xxxxxx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
])

scene.spawn(player, spawn, () => true)
scene.camera(player, { lerp: 0.1 })

const platforms = [
    new JumpOncePlatform({ width: 30, height: 4, respawn_frames: 120 }),
    new JumpOncePlatform({ width: 30, height: 4, respawn_frames: 120 }),
    new JumpOncePlatform({ width: 30, height: 4, respawn_frames: 120 }),
    new JumpOncePlatform({ width: 30, height: 4, respawn_frames: 120 }),
]

platforms[0].move(70,  140)
platforms[1].move(130, 110)
platforms[2].move(190, 80)
platforms[3].move(250, 50)

for (const p of platforms) {
    game.world.appendChild(p.graphic)
}

const shard_classes = ["shard-0", "shard-1", "shard-2", "shard-3"]
const shard_angles  = [Math.PI * 1.15, Math.PI * 1.35, Math.PI * 1.65, Math.PI * 1.85]

function make_shard_emitter(cls, angle) {
    const e = new emitter()
    e.mode         = "sprite"
    e.sprite_class = cls
    e.rate         = 0
    e.angle_min    = angle - 0.1
    e.angle_max    = angle + 0.1
    e.speed_min    = 1.2
    e.speed_max    = 2.2
    e.lifetime_min = 40
    e.lifetime_max = 60
    e.gravity      = 0.15
    e.fade         = true
    e.spin         = true
    e.spin_speed   = 6
    return e
}

const shard_emitters = shard_classes.map((c, i) => make_shard_emitter(c, shard_angles[i]))

function spawn_shards(p) {
    for (let i = 0; i < shard_emitters.length; i++) {
        const e = shard_emitters[i]
        e.x = p.x
        e.y = p.y
        e.sprite_w = p.width
        e.sprite_h = p.height
        e.burst(1)
    }
}

const was_gone = platforms.map(() => false)

function tick() {
    player.update()
    scene.toggle_debug()
    player.apply_force()
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
    for (let i = 0; i < platforms.length; i++) {
        const gone = platforms[i].graphic.style.visibility === "hidden"
        if (gone && !was_gone[i]) {
            spawn_shards(platforms[i])
        }
        was_gone[i] = gone
    }
    for (const e of shard_emitters) {
        e.update()
    }
}

scene.update(tick)
scene.run()
