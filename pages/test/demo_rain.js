// Demo: Dog Rain (pixel mode)
// Pixel squares rain down across the full screen width.
// Shows pixel mode, x_spread for wide emitters, and emitter.draw_pixels().

import { boil_the_plate } from "../../src/prefabs.js"
import { emitter, game } from "../../src/system.js"

boil_the_plate()

const rain = new emitter()
rain.mode         = "pixel"
rain.x            = 160           // center; x_spread fans it out
rain.y            = -2            // just above the top of the screen
rain.x_spread     = 165           // particles spawn across the full 330px width
rain.rate         = 3             // pixels per frame — heavy rain
rain.angle_min    = 82 * Math.PI / 180    // mostly straight down with slight spread
rain.angle_max    = 98 * Math.PI / 180
rain.speed_min    = 2
rain.speed_max    = 4
rain.lifetime_min = 60
rain.lifetime_max = 100
rain.size_min     = 1
rain.size_max     = 3
rain.color        = "#88ccff"     // light blue rain drops
rain.gravity      = 0.03
rain.fade         = false         // rain doesn't fade, it just disappears at the bottom

rain.start()

game.update(function() {
    rain.update()
    emitter.draw_pixels()         // required for pixel mode — clears and redraws the canvas
})

game.run()
