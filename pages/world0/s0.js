import { boil_the_plate, send_to } from "../../src/prefabs.js"
import { bobj, game, input, obj, Scene } from "../../src/system.js"

if (game.check_collectable("s1", "intro_ended")) {
    window.location.replace("./s1.html")
}

boil_the_plate()

// ── Visuals ────────────────────────────────────────────────────────────────
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

// ── Scene layers ───────────────────────────────────────────────────────────
const scene = new Scene()
scene.layer(background2,          -8, 0)
scene.layer(background1,          -7, 0)
scene.layer(splash,               -4, 0)
scene.layer(background2_transit,  -3, 0)
scene.layer(dog,                  -1, 0)

// ── Layout & timing ────────────────────────────────────────────────────────
//
// The splash text is ~26 lines at 8px press_start font.
// Each line is roughly 11px (8px font + ~3px line gap).
// "< DOG" is the last line, so it sits about 25 * 11 = 275px below
// the top of the splash div.
//
// The idea: "< DOG" in the splash text points the player's eyes across
// the screen to the dog sprite. For that to work, "< DOG" and the dog
// must be at the same Y when visible. Both scroll at the same speed and
// pause together, so we just need to set their start Y so that:
//   splash.y + DOG_TEXT_OFFSET == dog.y   (at all times)
//
// The splash enters the screen first (its top lines are above "< DOG"),
// then "< DOG" and the dog enter together.

const SCROLL_SPEED     = 0.5
const DOG_TEXT_OFFSET  = 170  // px from splash top to "< DOG" line

const DOG_X            = 60
const SPLASH_X         = game.width - 150

// Splash starts just below the screen so it scrolls in from the bottom.
// Dog starts further down so that "< DOG" (275px into the splash) and the
// dog sprite are always at the same Y — they enter the screen together.
const SPLASH_START_Y   = game.height
const DOG_START_Y      = SPLASH_START_Y + DOG_TEXT_OFFSET  // 260 + 275 = 535

// ── Phases ─────────────────────────────────────────────────────────────────
// Phase 0: 5 seconds of just backgrounds + fade-in (nothing else visible)
const WAIT_FRAMES      = 0    // 1 second at 60fps

// Phase 1: scroll begins. Splash top enters the screen first and the credits
//          scroll past. Eventually "< DOG" and the dog enter together — the
//          arrow points the player's eyes to the dog on the other side.
//          Dog pauses at mid-screen for 3 seconds.
const DOG_PAUSE_Y      = 80
const FRAMES_TO_PAUSE  = Math.ceil((DOG_START_Y - DOG_PAUSE_Y) / SCROLL_SPEED)
const PAUSE_FRAME      = WAIT_FRAMES + FRAMES_TO_PAUSE
const PAUSE_DURATION   = 180   // 3 seconds
const RESUME_FRAME     = PAUSE_FRAME + PAUSE_DURATION
const TRANSIT_FRAME    = RESUME_FRAME - 60   // bg2_transit appears 1s before dog resumes

// Phase 2: dog resumes rising, bg2_transit appears.
//          Both scroll off the top of the screen → navigate to s1.

// ── Initial positions ──────────────────────────────────────────────────────
dog.move(DOG_X, DOG_START_Y)
splash.move(SPLASH_X, SPLASH_START_Y)

// ── Sequence ───────────────────────────────────────────────────────────────
let timr = 0

scene.update(function () {
    if (input.probe("escape", input.KEYDOWN)) {
        end_intro()
        return
    }

    // Frame 0: start the CSS fade (yellowish-white → transparent)
    if (timr === 0) {
        document.getElementById("fade").style.backgroundColor = "transparent"
    }

    // Phase 0: wait — backgrounds scroll via CSS, nothing else moves
    if (timr < WAIT_FRAMES) {
        timr++
        return
    }

    // Splash keeps scrolling the whole time
    splash.shift(0, -SCROLL_SPEED)

    // Dog pauses mid-screen, then resumes
    if (timr < PAUSE_FRAME || timr >= RESUME_FRAME) {
        dog.shift(0, -SCROLL_SPEED)
    }

    // Show background2_transit a bit before the dog resumes
    if (timr === TRANSIT_FRAME) {
        scene.layer_visible(-3, true)
    }

    // Navigate once the dog has scrolled fully off the top
    if (timr > RESUME_FRAME && dog.y + dog.height < 0) {
        end_intro()
    }

    timr++
})

function end_intro() {
    game.save_collectable("s1", "intro_ended")
    sessionStorage.setItem("s1_fall_in", "1")
    send_to("./s1.html")
}

scene.run({ save_transport: false })

scene.layer_visible(-3, false)
