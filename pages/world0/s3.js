import { boil_the_plate, come_from, invisible_wall_tile, Player, send_to } from "../../src/prefabs.js"
import { bobj, cobj, game, input, Scene } from "../../src/system.js"

boil_the_plate()

const player     = new Player(60, 50, false)
const background = new bobj({ name: "background3" })
const midground = new bobj({ name: "midground_s3" })
const foreground = new bobj({ name: "scene_s3" })

const inviz   = invisible_wall_tile()
const spawn_l = new cobj({ name: "spawn_l",    width: 10, height: 10, collides: false })
const spawn_r = new cobj({ name: "spawn_r",    width: 10, height: 10, collides: false })
const jumper  = new cobj({ name: "jumper",     width: 10, height: 3,  collides: false, shows_debug_col: true })

const scene = new Scene()

scene.layer(background, -5, 0)
scene.layer(midground, -3, 0)
scene.layer(foreground, 2, 0)

scene.tiles(10, 10, {
    'x': inviz,
    'L': spawn_l,
    'R': spawn_r,
    'j': jumper,
}, [
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "                                ",
    "   L                            ",
    "xxxxx    jjj                    ",
    "xxxxx                        R  ",
    "xxxxx                     xxxxxx",
    "xxxxx         xxxx        xxxxxx",
    "xxxxx                     xxxxxx",
    "xxxxx                   xxxxxxxx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
])

jumper.shift(0, 7)

scene.spawn(player, spawn_l, () => come_from("s4.html"))
scene.spawn(player, spawn_r, () => true, () => { player.facing = -1 })

scene.camera(player, { lerp: 0.1 })

const jumper_force = 4

function tick() {
    player.update()
    scene.toggle_debug()

    if (player.overlaps(jumper)) {
        player.call_force({
            y: input.probe("s", input.KEYHELD) ? -jumper_force * 1.2 : -jumper_force,
            y_time: 1
        })
    }

    player.apply_force()
    scene.move_and_collide()

    if (player.x + player.width < 0) {
        send_to("./s4.html")
    }
    if (player.x > game.width) {
        send_to("./s2.html")
    }
}

scene.update(tick)
scene.run()
