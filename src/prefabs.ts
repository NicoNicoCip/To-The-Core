import { input, math, obj } from "./system.js"

export class Player extends obj {
    facing = 1
    was_grounded = false
    just_landed = false
    landed_once = false
    landing = false
    landing_timer = 0

    max_acc = 2
    max_gravity = 6
    acc_modifier = 0.4
    gravity = 0.2 // 0.6 good
    friction = 0.4
    jump_force = 4 // 7 good
    movedir = null
    shake = true

    _force_x = 0
    _force_y = 0
    _force_x_time = 0
    _force_y_time = 0

    coyote = 0
    coyote_time = 4

    constructor(x, y, shake = null) {
        super({ name: "player", x, y, width: 10, height: 10, dynamic: true, shows_debug_col: true })
        if (shake !== null) this.shake = shake
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
                this.graphic.style.backgroundImage = `url(../assets/dog_falling_in.webp?t=${performance.now()})`
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
            if (input.probe("d", input.KEYHELD)) {
                this.movedir = 1
            }

            if (input.probe("a", input.KEYHELD)) {
                this.movedir = -1
            }
        }

        if (this.movedir === 1) {
            this.x_speed += this.acc_modifier
            this.facing = 1
        }
        if (this.movedir === -1) {
            this.x_speed -= this.acc_modifier
            this.facing = -1
        }

        if (this.movedir !== null) {
            if (this.x_speed > this.max_acc) {
                this.x_speed = this.max_acc
            }

            if (this.x_speed < -this.max_acc) {
                this.x_speed = -this.max_acc
            }

        } else {
            this.x_speed += (this.acc_modifier * -math.sign(this.x_speed)) * this.friction

            if (this.x_speed < 0.2 && this.x_speed > -0.2) {
                this.x_speed = 0
            }
        }

        if (this.grounded) {
            this.graphic.classList.remove("falling")
        } else {
            this.graphic.classList.add("falling")
        }

        if (this.grounded) {
            this.coyote = this.coyote_time
        } else if (this.coyote > 0){
            this.coyote--
        }

        if (!this.landing && input.probe(" ", input.KEYHELD) && this.coyote > 0) {
            this.y_speed = -this.jump_force
            this.coyote = 0
        }

        if (this.y_speed > this.max_gravity) this.y_speed = this.max_gravity

        if (this.movedir === null) {
            this.graphic.classList.remove("moving")
        } else {
            this.graphic.classList.add("moving")
        }



        this.x += this.x_speed
        this.y_speed += this.gravity
        this.y += this.y_speed


    }

    move(x = null, y = null) {
        if (x !== null) this.x = x
        if (y !== null) this.y = y

        this._prev_x = this.x
        this._prev_y = this.y

        const fall_flip = this.graphic.classList.contains("falling")
            ? (math.sign(this.y_speed) || 1)
            : 1
        this.graphic.style.transform = `translate(${this.x}px, ${this.y}px) scaleX(${this.facing}) scaleY(${fall_flip})`
        this.collider.style.transform = `translate(${this.x}px, ${this.y}px)`
    }

    call_force({ x = null, y = null, x_time = null, y_time = null }) {
        if (x !== null && x_time !== null) {
            this._force_x = x
            this._force_x_time = x_time
        }

        if (y !== null && y_time !== null) {
            this._force_y = y
            this._force_y_time = y_time
        }
    }

    apply_force() {
        let res = {x_end: false, y_end: false}
        if (this._force_x_time > 0) {
            this.x_speed = this._force_x
            this._force_x_time--
        } else {
            this._force_x = 0
            res.x_end = true
        }

        if (this._force_y_time > 0) {
            this.y_speed = this._force_y
            this._force_y_time--
        } else {
            this._force_y = 0
            res.y_end = true
        }

        return res.x_end && res.y_end 
            ? true
            : res
    }
}
