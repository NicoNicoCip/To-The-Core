import { cobj, game, input, level, pobj } from "./system.js"

export function boil_the_plate() {
    game.register_world(document.getElementById("world"), 320, 180)
    input.init()
}

export function send_to(url) {
    game.save_transport()
    window.location.href = url
}

export function come_from(html) {
    const res = localStorage.getItem("last_level")

    if(res === null) return false

    return res.endsWith(html)
}

export class Shaker {
    shake_intensity = 0
    shake_timer = 0

    tick_shake() {
        if (this.shake_timer > 0) {
            const ox = (Math.random() - 0.5) * 2 * this.shake_intensity
            const oy = (Math.random() - 0.5) * 2 * this.shake_intensity
            game.world.style.transform = `scale(${game.scale}) translate(${ox}px, ${oy}px)`
            this.shake_timer--
            return true
        } else {
            game.world.style.transform = `scale(${game.scale})`
            return false
        }
    }

    shake(intensity, duration_frames) {
        this.shake_intensity = intensity
        this.shake_timer = duration_frames
    }
}

export class Collectable extends cobj {
    level: level = null

    constructor({
        name = null,
        width = null,
        height = null,
        level = null,
    }) {
        super({
            name: name,
            width: width,
            height: height,
            dynamic: true,
            shows_debug_col: true,
        })

        if (this.level !== null) {
            this.level.substitute(name, this)
            return
        }

        game.world.appendChild(this.graphic)
        game.world.appendChild(this.collider)
    }
}

export class Player extends pobj {
    constructor(x, y, shake = null) {
        super({
            name: "player", x, y,
            width: 10,
            height: 10,
            dynamic: true,
            shows_debug_col: true
        })

        if (shake !== null) this.shake = shake
        this.graphic.style.transformOrigin = "center bottom"
    }

    update() {
        this.just_landed = this.grounded && !this.was_grounded
        this.was_grounded = this.grounded

        if (this.just_landed && !this.landed_once) {
            this.landed_once = true

            if (this.shake) {
                this.landing = true
                this.landing_timer = 192
                this.graphic.classList.add("falling_in")
                this.graphic.style.backgroundImage = `url(/pages/assets/dog_falling_in.webp?t=${performance.now()})`
            }
        }

        if (this.landing) {
            this.landing_timer--
            if (this.landing_timer <= 0) {
                this.landing = false
                this.graphic.classList.remove("falling_in")
                this.graphic.style.backgroundImage = ""
            }
        }

        this.movedir = null
        if (!this.landing) {
            if (input.probe("d", input.KEYHELD)) this.movedir = 1
            if (input.probe("a", input.KEYHELD)) this.movedir = -1
        }

        if (this.grounded) {
            this.coyote = this.coyote_time
        } else if (this.coyote > 0) {
            this.coyote--
        }

        if (!this.landing && input.probe(" ", input.KEYHELD) && this.coyote > 0) {
            this.y_speed = -this.jump_force
            this.coyote = 0
            this.squash(1.1, 0.85)
        }

        if (this.just_landed) {
            this.squash(0.85, 1.05)
        }

        if (this.grounded && input.probe("s", input.KEYDOWN)) {
            this.squash(1.2, 0.65)
        }

        super.update()

        if (this.grounded) {
            this.graphic.classList.remove("falling")
        } else {
            this.graphic.classList.add("falling")
        }

        if (this.y_speed < 0) {
            this.graphic.classList.add("rising")
        } else {
            this.graphic.classList.remove("rising")
        }

        if (this.movedir === null) {
            this.graphic.classList.remove("moving")
        } else {
            this.graphic.classList.add("moving")
        }
    }

}
