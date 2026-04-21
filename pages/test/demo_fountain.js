import { boil_the_plate } from "../../src/prefabs.js"
import { emitter, game } from "../../src/system.js"

boil_the_plate()

const fountain = new emitter()
fountain.mode         = "sprite"
fountain.x            = 160
fountain.y            = 175
fountain.rate         = 0.5
fountain.angle_min    = 210 * Math.PI / 180
fountain.angle_max    = 330 * Math.PI / 180
fountain.speed_min    = 2
fountain.speed_max    = 5
fountain.lifetime_min = 80
fountain.lifetime_max = 160
fountain.sprite_url   = "/pages/assets/dog.webp"
fountain.sprite_w     = 10
fountain.sprite_h     = 10
fountain.gravity      = 0.12
fountain.fade         = true
fountain.spin         = true
fountain.spin_speed   = 8

fountain.start()

function tick() {
    fountain.update()
}

game.update(tick)
game.run()
