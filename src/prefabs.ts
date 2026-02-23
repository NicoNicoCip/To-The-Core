import { input, math, obj } from "./system.js"

export class Player extends obj {
    facing = 1
    was_grounded = false
    just_landed = false
    landed_once = false
    landing = false
    landing_timer = 0

    max_acc = 2
    max_gravity = 12
    acc_modifier = 0.4
    gravity = 0.2 // 0.6 good
    friction = 0.4
    jump_force = 4 // 7 good
    movedir = null
    shake = true

    constructor(x, y, shake) {
        super({ name: "player", x, y, width: 10, height: 10, dynamic: true })
        this.shake = shake
    }

    update() {
        this.just_landed = this.grounded && !this.was_grounded
        this.was_grounded = this.grounded

        if (this.just_landed && !this.landed_once) {
            this.landed_once = true
            this.landing = true
            this.landing_timer = 192

            if (this.shake)
            this.graphic.classList.add("falling_in")
            this.graphic.style.backgroundImage = `url(../../assets/dog_falling_in.webp?t=${performance.now()})`
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

        if (this.movedir === 1) {
            this.x_speed += this.acc_modifier
            this.facing = 1
        }
        if (this.movedir === -1) {
            this.x_speed -= this.acc_modifier
            this.facing = -1
        }

        if (this.movedir !== null) {
            if (this.x_speed > this.max_acc) this.x_speed = this.max_acc
            if (this.x_speed < -this.max_acc) this.x_speed = -this.max_acc
        } else {
            this.x_speed += (this.acc_modifier * -math.sign(this.x_speed)) * this.friction
            if (this.x_speed < 0.2 && this.x_speed > -0.2) this.x_speed = 0
        }

        if (this.grounded && this.graphic.classList.contains("falling")) {
            this.graphic.classList.remove("falling")
        }

        if (!this.landing && input.probe(" ", input.KEYHELD) && this.grounded) {
            this.y_speed = -this.jump_force
            this.graphic.classList.add("falling")
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

        this.render_x = this.x
        this.render_y = this.y
        this._prev_x = this.x
        this._prev_y = this.y
    }

    render(alpha: number) {
        const rx = this.render_x + (this.x - this.render_x) * alpha
        const ry = this.render_y + (this.y - this.render_y) * alpha
        this.graphic.style.transform = `translate(${rx}px, ${ry}px) scaleX(${this.facing})`
    }
}
