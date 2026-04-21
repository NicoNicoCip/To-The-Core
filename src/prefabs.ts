import { cobj, game, input, level, obj, pobj } from "./system.js"

export function wall_tile(): cobj {
    return new cobj({ name: "wall", width: 10, height: 10, shows_debug_col: true })
}

export function platform_tile(): cobj {
    return new cobj({ name: "platform", width: 10, height: 10, one_way: true, shows_debug_col: true })
}

export function spawn_tile(): cobj {
    return new cobj({ name: "spawn", width: 10, height: 10, collides: false })
}

export function invisible_wall_tile(): cobj {
    return new cobj({ name: "inviz_wall", width: 10, height: 10, shows_debug_col: true })
}

export function jump_pad_tile(): cobj {
    return new cobj({ name: "jump_pad", width: 10, height: 10, collides: false, shows_debug_col: true })
}

export function bone_tile(): cobj {
    return new cobj({ name: "bone", width: 10, height: 10, dynamic: true, collides: false, shows_debug_col: true })
}

export function make_player(x: number, y: number): Player {
    return new Player(x, y)
}

export function make_bone(x: number, y: number): cobj {
    const b = new cobj({ name: "bone", width: 10, height: 10, dynamic: true, collides: false, shows_debug_col: true })
    b.move(x, y)
    return b
}

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

    if (res === null) {
        return false
    }

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

type SeqStep =
    | { kind: 'wait', frames: number }
    | { kind: 'call', fn: () => void }
    | { kind: 'tween', obj: any, prop: string, to: number, frames: number }
    | { kind: 'wait_until', pred: () => boolean }

export class Sequencer {
    private _steps: SeqStep[] = []
    private _i = 0
    private _elapsed = 0
    private _tween_from = 0
    private _started = false

    wait(frames: number): Sequencer {
        this._steps.push({ kind: 'wait', frames })
        return this
    }

    call(fn: () => void): Sequencer {
        this._steps.push({ kind: 'call', fn })
        return this
    }

    tween(obj: any, prop: string, to: number, frames: number): Sequencer {
        this._steps.push({ kind: 'tween', obj, prop, to, frames })
        return this
    }

    wait_until(pred: () => boolean): Sequencer {
        this._steps.push({ kind: 'wait_until', pred })
        return this
    }

    get done(): boolean {
        return this._i >= this._steps.length
    }

    reset(): void {
        this._i = 0
        this._elapsed = 0
        this._started = false
    }

    tick(): void {
        while (this._i < this._steps.length) {
            const step = this._steps[this._i]

            if (!this._started) {
                this._started = true
                this._elapsed = 0
                if (step.kind === 'tween') {
                    this._tween_from = step.obj[step.prop]
                }
            }

            switch (step.kind) {
                case 'call':
                    step.fn()
                    this._advance()
                    continue
                case 'wait':
                    if (this._elapsed >= step.frames) {
                        this._advance()
                        continue
                    }
                    this._elapsed++
                    return
                case 'tween': {
                    if (this._elapsed >= step.frames) {
                        this._advance()
                        continue
                    }
                    this._elapsed++
                    const t = this._elapsed / step.frames
                    step.obj[step.prop] = this._tween_from + (step.to - this._tween_from) * t
                    return
                }
                case 'wait_until':
                    if (step.pred()) {
                        this._advance()
                        continue
                    }
                    return
            }
        }
    }

    private _advance(): void {
        this._i++
        this._started = false
    }
}

export class DeathZone extends cobj {
    on_hit: () => void

    constructor({ name = "death_zone", width = 10, height = 10, on_hit = null }: {
        name?: string, width?: number, height?: number, on_hit?: () => void
    } = {}) {
        super({ name, width, height, collides: false, shows_debug_col: true })
        this.on_hit = on_hit
    }

    check(player: cobj) {
        if (player.overlaps(this) && this.on_hit) {
            this.on_hit()
        }
    }
}

export class CrumblePlatform extends cobj {
    stay_frames:    number
    respawn_frames: number
    private _timer = 0
    private _gone  = false

    constructor({ name = "crumble_platform", width = 20, height = 4, stay_frames = 90, respawn_frames = 180 }: {
        name?: string, width?: number, height?: number, stay_frames?: number, respawn_frames?: number
    } = {}) {
        super({ name, width, height, one_way: true, shows_debug_col: true })
        this.stay_frames    = stay_frames
        this.respawn_frames = respawn_frames
    }

    update(player: cobj) {
        if (!this._gone) {
            player.collide(this)
            const horiz = player.x + player.width > this.x && player.x < this.x + this.width
            const on_top = horiz && player.y + player.height === this.y
            if (on_top) {
                this._timer++
                if (this._timer > this.stay_frames * 0.5) {
                    this.graphic.classList.add('crumbling')
                }
                if (this._timer >= this.stay_frames) {
                    this._gone = true
                    this._timer = 0
                    this.graphic.style.visibility = 'hidden'
                    this.graphic.classList.remove('crumbling')
                }
            } else {
                this._timer = 0
                this.graphic.classList.remove('crumbling')
            }
        } else {
            this._timer++
            if (this._timer >= this.respawn_frames) {
                this._gone  = false
                this._timer = 0
                this.graphic.style.visibility = 'visible'
            }
        }
    }
}

export class JumpOncePlatform extends cobj {
    respawn_frames: number
    private _timer   = 0
    private _gone    = false
    private _was_on  = false

    constructor({ name = "jump_once_platform", width = 20, height = 4, respawn_frames = 120 }: {
        name?: string, width?: number, height?: number, respawn_frames?: number
    } = {}) {
        super({ name, width, height, one_way: true, shows_debug_col: true })
        this.respawn_frames = respawn_frames
    }

    update(player: cobj) {
        if (!this._gone) {
            player.collide(this)
            const horiz = player.x + player.width > this.x && player.x < this.x + this.width
            const on_now = horiz && player.y + player.height === this.y
            if (this._was_on && !on_now) {
                this._gone   = true
                this._timer  = 0
                this._was_on = false
                this.graphic.style.visibility = 'hidden'
            } else {
                this._was_on = on_now
            }
        } else {
            this._timer++
            if (this._timer >= this.respawn_frames) {
                this._gone   = false
                this._timer  = 0
                this._was_on = false
                this.graphic.style.visibility = 'visible'
            }
        }
    }
}

export class ForceZone extends cobj {
    force_x: number
    force_y: number

    constructor({ name = "force_zone", width = 10, height = 10, force_x = 0, force_y = 0 }: {
        name?: string, width?: number, height?: number, force_x?: number, force_y?: number
    } = {}) {
        super({ name, width, height, collides: false, shows_debug_col: true })
        this.force_x = force_x
        this.force_y = force_y
    }

    update(player: cobj) {
        if (!player.overlaps(this)) {
            return
        }
        player.x_speed += this.force_x
        player.y_speed += this.force_y
    }
}

export class Button extends obj {
    hover_class: string | null
    on_click:    (() => void) | null
    disabled = false
    hovered  = false

    constructor({ name, width, height, hover_class = null, on_click = null }: {
        name: string, width: number, height: number,
        hover_class?: string | null, on_click?: (() => void) | null,
    }) {
        super({ name, width, height })
        this.hover_class = hover_class
        this.on_click    = on_click

        this.graphic.style.cursor = "pointer"
        this.graphic.addEventListener("mouseenter", () => this._set_hover(true))
        this.graphic.addEventListener("mouseleave", () => this._set_hover(false))
        this.graphic.addEventListener("mouseup",    () => this._fire_click())
    }

    private _set_hover(entering: boolean): void {
        if (this.disabled) {
            return
        }
        this.hovered = entering
        if (!this.hover_class) {
            return
        }
        if (entering) {
            this.graphic.classList.add(this.hover_class)
        } else {
            this.graphic.classList.remove(this.hover_class)
        }
    }

    private _fire_click(): void {
        if (this.disabled || !this.on_click) {
            return
        }
        this.on_click()
    }

    disable(): void {
        this.disabled = true
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

        if (level !== null) {
            this.level = level
            this.level.substitute(name, this)
            return
        }

        game.world.appendChild(this.graphic)
        game.world.appendChild(this.collider)
    }
}

export class Player extends pobj {
    constructor(x, y) {
        super({
            name: "player", x, y,
            width: 10,
            height: 10,
            dynamic: true,
            shows_debug_col: true
        })

        this.graphic.style.transformOrigin = "center bottom"
    }

    update() {
        this.just_landed = this.grounded && !this.was_grounded
        this.was_grounded = this.grounded

        this.movedir = null
        if (input.probe("d", input.KEYHELD)) {
            this.movedir = 1
        }
        if (input.probe("a", input.KEYHELD)) {
            this.movedir = -1
        }

        if (this.grounded) {
            this.coyote = this.coyote_time
        } else if (this.coyote > 0) {
            this.coyote--
        }

        if (input.probe(" ", input.KEYHELD) && this.coyote > 0) {
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
