import { ActionZone, boil_the_plate, invisible_wall_tile, Player, send_to, Sequencer, Shaker, spawn_tile } from "../../src/prefabs.js"
import { bobj, game, Scene } from "../../src/system.js"

boil_the_plate()

const intro_played = sessionStorage.getItem("s1_fall_in") === "1"
sessionStorage.removeItem("s1_fall_in")
const player       = new Player(60, 50)
const background   = new bobj({ name: "background3" })
const midground    = new bobj({ name: "midground_s1" })
const foreground   = new bobj({ name: "scene_s1" })

const tp_bottom = new ActionZone({ name: "tp_bottom", height: 2, width: 10, on_hit: () => { send_to("./s2.html") } })

let landing = false

const inviz = invisible_wall_tile()
const spawn = spawn_tile()

const scene = new Scene()

scene.layer(background, -5, 0)
scene.layer(midground,  -2, 0)
scene.layer(foreground,  2, 0)

scene.tiles(10, 10, {
    'x': inviz,
    'S': spawn,
    'n': tp_bottom
}, [
    "                               x",
    "                               x",
    "                               x",
    "                               x",
    "                               x",
    "                               x",
    "                               x",
    "   x                           x",
    "   x                           x",
    "   x                           x",
    "   x                           x",
    "   x  S                        x",
    "xxxxxxxxxxxxxxxxxxxxx          x",
    "xxxxxxxxxxxxxxxxxxxxx          x",
    "xxxxxxxxxxxxxxxxxxxxx          x",
    "xxxxxxxxxxxxxxxxxxxxx          x",
    "xxxxxxxxxxxxxxxxxxxxx          x",
    "xxxxxxxxxxxxxxxxxxxxxnnnnnnnnnnx",
])

tp_bottom.shift(0,8)

scene.spawn(player, spawn, () => true, () => {
    if (intro_played) {
        player.move(player.x, player.y - game.height - player.height)
        player.y_speed = player.max_gravity
    }
})
scene.camera(player, { lerp: 0.1 })

const shaker = new Shaker()
const intro  = new Sequencer()

if (intro_played) {
    intro.wait_until(() => player.just_landed)
    intro.call(() => {
        landing = true
        player.graphic.classList.add("falling_in")
        player.graphic.style.backgroundImage = `url(/pages/assets/dog_falling_in.webp?t=${performance.now()})`
        shaker.shake(1, 20)
    })
    intro.wait(192)
    intro.call(() => {
        landing = false
        player.graphic.classList.remove("falling_in")
        player.graphic.style.backgroundImage = ""
    })
}

function tick() {
    player.update()
    scene.toggle_debug()

    intro.tick()
    if (landing) {
        player.movedir = null
        player.y_speed = 0
    }

    shaker.tick_shake()
    player.apply_force()
    scene.move_and_collide()
}

scene.update(tick)
scene.run()
