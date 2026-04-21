import { boil_the_plate } from "../../src/prefabs.js"
import { emitter, game } from "../../src/system.js"

boil_the_plate()

const rain = new emitter()
rain.mode         = "pixel"
rain.x            = 160
rain.y            = -2
rain.x_spread     = 165
rain.rate         = 3
rain.angle_min    = 82 * Math.PI / 180
rain.angle_max    = 98 * Math.PI / 180
rain.speed_min    = 2
rain.speed_max    = 4
rain.lifetime_min = 60
rain.lifetime_max = 100
rain.size_min     = 1
rain.size_max     = 3
rain.color        = "#88ccff"
rain.gravity      = 0.03
rain.fade         = false

rain.start()

function tick() {
    rain.update()
    emitter.draw_pixels()
}

game.update(tick)
game.run()
