// Demo: Dog Fountain
// Dogs shoot up from the ground center in an arc and fall back down.
// Shows the emitter in sprite mode with gravity, spin, and fade.

import { boil_the_plate } from "../../src/prefabs.js"
import { emitter, game } from "../../src/system.js"

boil_the_plate()

const fountain = new emitter()
fountain.mode         = "sprite"
fountain.x            = 160           // center of the 320px world
fountain.y            = 175           // just above the visual ground line
fountain.rate         = 0.5           // dogs per frame
fountain.angle_min    = 210 * Math.PI / 180   // 210° — upward cone left edge
fountain.angle_max    = 330 * Math.PI / 180   // 330° — upward cone right edge
fountain.speed_min    = 2
fountain.speed_max    = 5
fountain.lifetime_min = 80
fountain.lifetime_max = 160
fountain.sprite_url   = "/pages/assets/dog.webp"
fountain.sprite_w     = 10
fountain.sprite_h     = 10
fountain.gravity      = 0.12          // pulls dogs back down
fountain.fade         = true
fountain.spin         = true
fountain.spin_speed   = 8

fountain.start()

game.update(function() {
    fountain.update()
})

game.run()
