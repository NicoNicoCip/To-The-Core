import { boil_the_plate, Sequencer, send_to } from "../../src/prefabs.js"
import { bobj, game, input, obj, Scene } from "../../src/system.js"

if (game.check_collectable("s1", "intro_ended")) {
    window.location.replace("./s1.html")
}

boil_the_plate()

const background2         = new bobj({ name: "background2" })
const background1         = new bobj({ name: "background1" })
const background2_transit = new bobj({ name: "background2_transit" })

const splash = new obj({ name: "splash", width: 150, height: 60 })
splash.graphic.innerHTML =
    `MADE BY:<br>MANEL<br>JOAN<br>NICO<br>
<br><br><br><br><br><br><br><br>
A Paper Wing Studio Production <br>
<br><br><br><br>
< DOG
`

const dog = new obj({ name: "player", width: 10, height: 10 })
dog.graphic.style.transformOrigin = "center bottom"
dog.graphic.classList.add("falling")

const scene = new Scene()
scene.layer(background2,          -8, 0)
scene.layer(background1,          -7, 0)
scene.layer(splash,               -4, 0)
scene.layer(background2_transit,  -3, 0)
scene.layer(dog,                  -1, 0)

const SCROLL_SPEED     = 0.5
const DOG_TEXT_OFFSET  = 170

const DOG_X            = 60
const SPLASH_X         = game.width - 150

const SPLASH_START_Y   = game.height
const DOG_START_Y      = SPLASH_START_Y + DOG_TEXT_OFFSET

const WAIT_FRAMES      = 0

const DOG_PAUSE_Y      = 80
const FRAMES_TO_PAUSE  = Math.ceil((DOG_START_Y - DOG_PAUSE_Y) / SCROLL_SPEED)
const PAUSE_FRAME      = WAIT_FRAMES + FRAMES_TO_PAUSE
const PAUSE_DURATION   = 180
const RESUME_FRAME     = PAUSE_FRAME + PAUSE_DURATION
const TRANSIT_FRAME    = RESUME_FRAME - 60

dog.move(DOG_X, DOG_START_Y)
splash.move(SPLASH_X, SPLASH_START_Y)

let dog_scrolling = true
let phase_3       = false

const seq = new Sequencer()
seq.call(() => {
    document.getElementById("fade").style.backgroundColor = "transparent"
})
seq.wait(WAIT_FRAMES)
seq.wait(FRAMES_TO_PAUSE)
seq.call(() => { dog_scrolling = false })
seq.wait(PAUSE_DURATION - 60)
seq.call(() => scene.layer_visible(-3, true))
seq.wait(60)
seq.call(() => { dog_scrolling = true; phase_3 = true })

function tick() {
    if (input.probe("escape", input.KEYDOWN)) {
        end_intro()
        return
    }

    seq.tick()

    splash.shift(0, -SCROLL_SPEED)

    if (dog_scrolling) {
        dog.shift(0, -SCROLL_SPEED)
    }

    if (phase_3 && dog.y + dog.height < 0) {
        end_intro()
    }
}

function end_intro() {
    game.save_collectable("s1", "intro_ended")
    sessionStorage.setItem("s1_fall_in", "1")
    send_to("./s1.html")
}

scene.update(tick)

scene.run({ save_transport: false })

scene.layer_visible(-3, false)
