import { boil_the_plate, Player, send_to, Shaker } from "../../src/prefabs.js"
import { bobj, cobj, game, input, obj, Scene } from "../../src/system.js"

boil_the_plate()

const background1         = new bobj({ name: "background1" })
const background2         = new bobj({ name: "background2" })
const background2_transit = new bobj({ name: "background2_transit" })

const splash = new obj({ name: "splash", width: 150, height: 60 })
splash.graphic.innerHTML = `MADE BY:<br>MANEL<br>JOAN<br>NICO<br>
<br><br><br><br><br><br><br><br><br><br><br><br>
A Paper Wing Studio Production <br>
<br><br><br><br><br><br><br><br>
< DOG
`

const player = new Player(60, 50, true)
const shaker = new Shaker()

const background3 = new bobj({ name: "background3" })
const midground0  = new bobj({ name: "midground_s1" })
const foreground0 = new bobj({ name: "scene_s1" })

const wall  = new cobj({ name: "wall",       width: 10, height: 10, shows_debug_col: true })
const inviz = new cobj({ name: "inviz_wall", width: 10, height: 10, shows_debug_col: true })
const spawn = new cobj({ name: "spawn",      width: 10, height: 10, collides: false })

const scene = new Scene()

// Intro layers
scene.layer(background2,         -8, 0)
scene.layer(background1,         -7, 0)
// Intro transition
scene.layer(background2_transit, -2, 0)
// Gameplay layers
scene.layer(background3,         -5, 0)
scene.layer(midground0,          -2, 0)
scene.layer(foreground0,          2, 0)

scene.tiles(10, 10, {
    'x': inviz,
    'S': spawn,
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
    "xxxxxxxxxxxxxxxxxxxxx          x",
])

scene.spawn(player, spawn, () => true)
scene.camera(player, { lerp: 0.1 })

let intro_active = true
let timr = 0

function end_intro(skip = false) {
    intro_active = false
    if (splash.graphic.parentNode) game.world.removeChild(splash.graphic)
    scene.layer_visible(-8, false)
    scene.layer_visible(-7, false)
    scene.layer_visible( 5, false)
    scene.layer_visible(-5, true)
    scene.layer_visible(-2, true)
    scene.layer_visible( 2, true)
    if (skip) {
        player.move(spawn.x, spawn.y)
        player.landed_once = true
        player.shake = false
    } else {
        player.move(60, -17)
        player.y_speed = player.max_gravity
    }
    game.save_collectable("s1", "intro_ended")
    scene.cam_snap()
}

scene.update(function() {
    if (intro_active) {
        if (game.check_collectable("s1", "intro_ended")) {
            document.getElementById("fade").style.display = "none"
            end_intro(true)
            return
        }

        if (input.probe("escape", input.KEYDOWN)) {
            end_intro(true); return
        }

        if (timr === 0) {
            document.getElementById("fade").style.backgroundColor = "transparent"
            player.graphic.classList.add("falling")
        }

        if (timr > 0 && timr < 600) {
            splash.shift(0, -1)
            if (timr < 400) player.shift(0, -1)
        }

        if (timr === 550) scene.layer_visible(5, true)

        if (timr === 600) {
            scene.layer_visible(-8, false)
            scene.layer_visible(-7, false)
            if (splash.graphic.parentNode) game.world.removeChild(splash.graphic)
        }

        if (timr > 600 && timr < 780) player.shift(0, -0.4)

        if (timr === 780) end_intro()

        timr++
        return
    }

    player.update()
    scene.toggle_debug()
    if (player.just_landed && player.landing && player.landed_once) shaker.shake(1, 20)
    shaker.tick_shake()
    player.apply_force()
    scene.move_and_collide()

    if (player.y > 180) send_to("./s2.html")
})

scene.run()

if (intro_active) {
    // Hide gameplay layers and the transition during intro
    scene.layer_visible(-5, false)
    scene.layer_visible(-2, false)
    scene.layer_visible( 2, false)
    scene.layer_visible( 5, false)
    // Splash sits between intro backgrounds (CSS 93) and player (CSS 100)
    splash.graphic.style.zIndex = "96"
    player.move(60, 449)
    splash.move(180, 200)
    game.world.appendChild(splash.graphic)
}
