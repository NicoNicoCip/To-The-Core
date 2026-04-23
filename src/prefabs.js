import { cobj, game, input, obj, pobj } from "./system.js";
export const DEBUG_COLORS = {
    wall: "#888888",
    platform: "#FF8800",
    crumble: "#CC6622",
    crumble_gone: "#663311",
    jump_once: "#FF88AA",
    jump_once_gone: "#884455",
    invisible: "#FF0000",
    spawn: "#00FF00",
    jump_pad: "#FFFF00",
    collectable: "#FFD700",
    death: "#FF00FF",
    force: "#00FFFF",
    player: "#FFFFFF",
};
function _tint(c, color) {
    c.collider.style.border = `solid 1px ${color}`;
    return c;
}
export function wall_tile() {
    return _tint(new cobj({ name: "wall", width: 10, height: 10, shows_debug_col: true }), DEBUG_COLORS.wall);
}
export function platform_tile() {
    return _tint(new cobj({ name: "platform", width: 10, height: 10, one_way: true, shows_debug_col: true }), DEBUG_COLORS.platform);
}
export function spawn_tile() {
    return _tint(new cobj({ name: "spawn", width: 10, height: 10, collides: false, shows_debug_col: true }), DEBUG_COLORS.spawn);
}
export function invisible_wall_tile() {
    return _tint(new cobj({ name: "inviz_wall", width: 10, height: 10, shows_debug_col: true }), DEBUG_COLORS.invisible);
}
export function jump_pad_tile() {
    return _tint(new cobj({ name: "jump_pad", width: 10, height: 10, collides: false, shows_debug_col: true }), DEBUG_COLORS.jump_pad);
}
export function bone_tile() {
    return _tint(new cobj({ name: "bone", width: 10, height: 10, dynamic: true, collides: false, shows_debug_col: true }), DEBUG_COLORS.collectable);
}
export function make_player(x, y) {
    return new Player(x, y);
}
export function make_bone(x, y) {
    const b = _tint(new cobj({ name: "bone", width: 10, height: 10, dynamic: true, collides: false, shows_debug_col: true }), DEBUG_COLORS.collectable);
    b.move(x, y);
    return b;
}
export function boil_the_plate() {
    game.register_world(document.getElementById("world"), 320, 180);
    input.init();
}
export function send_to(url) {
    game.save_transport();
    window.location.href = url;
}
export function come_from(html) {
    const res = localStorage.getItem("last_level");
    if (res === null) {
        return false;
    }
    return res.endsWith(html);
}
export class Shaker {
    shake_intensity = 0;
    shake_timer = 0;
    tick_shake() {
        if (this.shake_timer > 0) {
            const ox = (Math.random() - 0.5) * 2 * this.shake_intensity;
            const oy = (Math.random() - 0.5) * 2 * this.shake_intensity;
            game.world.style.transform = `scale(${game.scale}) translate(${ox}px, ${oy}px)`;
            this.shake_timer--;
            return true;
        }
        else {
            game.world.style.transform = `scale(${game.scale})`;
            return false;
        }
    }
    shake(intensity, duration_frames) {
        this.shake_intensity = intensity;
        this.shake_timer = duration_frames;
    }
}
export class Sequencer {
    _steps = [];
    _i = 0;
    _elapsed = 0;
    _tween_from = 0;
    _started = false;
    wait(frames) {
        this._steps.push({ kind: 'wait', frames });
        return this;
    }
    call(fn) {
        this._steps.push({ kind: 'call', fn });
        return this;
    }
    tween(obj, prop, to, frames) {
        this._steps.push({ kind: 'tween', obj, prop, to, frames });
        return this;
    }
    wait_until(pred) {
        this._steps.push({ kind: 'wait_until', pred });
        return this;
    }
    get done() {
        return this._i >= this._steps.length;
    }
    reset() {
        this._i = 0;
        this._elapsed = 0;
        this._started = false;
    }
    tick() {
        while (this._i < this._steps.length) {
            const step = this._steps[this._i];
            if (!this._started) {
                this._started = true;
                this._elapsed = 0;
                if (step.kind === 'tween') {
                    this._tween_from = step.obj[step.prop];
                }
            }
            switch (step.kind) {
                case 'call':
                    step.fn();
                    this._advance();
                    continue;
                case 'wait':
                    if (this._elapsed >= step.frames) {
                        this._advance();
                        continue;
                    }
                    this._elapsed++;
                    return;
                case 'tween': {
                    if (this._elapsed >= step.frames) {
                        this._advance();
                        continue;
                    }
                    this._elapsed++;
                    const t = this._elapsed / step.frames;
                    step.obj[step.prop] = this._tween_from + (step.to - this._tween_from) * t;
                    return;
                }
                case 'wait_until':
                    if (step.pred()) {
                        this._advance();
                        continue;
                    }
                    return;
            }
        }
    }
    _advance() {
        this._i++;
        this._started = false;
    }
}
export class ActionZone extends cobj {
    on_hit;
    constructor({ name = "action_zone", width = 10, height = 10, on_hit = null } = {}) {
        super({ name, width, height, collides: false, shows_debug_col: true });
        this.on_hit = on_hit;
        _tint(this, DEBUG_COLORS.death);
    }
    copy() {
        const c = new ActionZone({
            name: this.name,
            width: this.width,
            height: this.height,
            on_hit: this.on_hit,
        });
        c.collider.style.border = this.collider.style.border;
        return c;
    }
    tick(player) {
        if (player.overlaps(this) && this.on_hit) {
            this.on_hit();
        }
    }
}
export class CrumblePlatform extends cobj {
    stay_frames;
    respawn_frames;
    _timer = 0;
    _gone = false;
    constructor({ name = "crumble_platform", width = 20, height = 4, stay_frames = 90, respawn_frames = 180, mergeable = false } = {}) {
        super({ name, width, height, one_way: true, shows_debug_col: true, mergeable });
        this.stay_frames = stay_frames;
        this.respawn_frames = respawn_frames;
        _tint(this, DEBUG_COLORS.crumble);
    }
    copy() {
        const c = new CrumblePlatform({
            name: this.name,
            width: this.width,
            height: this.height,
            stay_frames: this.stay_frames,
            respawn_frames: this.respawn_frames,
            mergeable: this.mergeable,
        });
        c.collider.style.border = this.collider.style.border;
        return c;
    }
    tick(player) {
        if (!this._gone) {
            const horiz = player.x + player.width > this.x && player.x < this.x + this.width;
            const on_top = horiz && player.y + player.height === this.y;
            if (on_top) {
                this._timer++;
                if (this._timer > this.stay_frames * 0.5) {
                    this.graphic.classList.add('crumbling');
                }
                if (this._timer >= this.stay_frames) {
                    this._gone = true;
                    this._timer = 0;
                    this.collides = false;
                    this.graphic.style.visibility = 'hidden';
                    this.graphic.classList.remove('crumbling');
                    this.collider.style.border = `dashed 1px ${DEBUG_COLORS.crumble_gone}`;
                }
            }
            else {
                this._timer = 0;
                this.graphic.classList.remove('crumbling');
            }
        }
        else {
            this._timer++;
            if (this._timer >= this.respawn_frames) {
                this._gone = false;
                this._timer = 0;
                this.collides = true;
                this.graphic.style.visibility = 'visible';
                this.collider.style.border = `solid 1px ${DEBUG_COLORS.crumble}`;
            }
        }
    }
}
export class JumpOncePlatform extends cobj {
    respawn_frames;
    _timer = 0;
    _gone = false;
    _was_on = false;
    constructor({ name = "jump_once_platform", width = 20, height = 4, respawn_frames = 120, mergeable = false } = {}) {
        super({ name, width, height, one_way: true, shows_debug_col: true, mergeable });
        this.respawn_frames = respawn_frames;
        _tint(this, DEBUG_COLORS.jump_once);
    }
    copy() {
        const c = new JumpOncePlatform({
            name: this.name,
            width: this.width,
            height: this.height,
            respawn_frames: this.respawn_frames,
            mergeable: this.mergeable,
        });
        c.collider.style.border = this.collider.style.border;
        return c;
    }
    tick(player) {
        if (!this._gone) {
            const horiz = player.x + player.width > this.x && player.x < this.x + this.width;
            const on_now = horiz && player.y + player.height === this.y;
            if (this._was_on && !on_now) {
                this._gone = true;
                this._timer = 0;
                this._was_on = false;
                this.collides = false;
                this.graphic.style.visibility = 'hidden';
                this.collider.style.border = `dashed 1px ${DEBUG_COLORS.jump_once_gone}`;
            }
            else {
                this._was_on = on_now;
            }
        }
        else {
            this._timer++;
            if (this._timer >= this.respawn_frames) {
                this._gone = false;
                this._timer = 0;
                this._was_on = false;
                this.collides = true;
                this.graphic.style.visibility = 'visible';
                this.collider.style.border = `solid 1px ${DEBUG_COLORS.jump_once}`;
            }
        }
    }
}
export class ForceZone extends cobj {
    force_x;
    force_y;
    constructor({ name = "force_zone", width = 10, height = 10, force_x = 0, force_y = 0 } = {}) {
        super({ name, width, height, collides: false, shows_debug_col: true });
        this.force_x = force_x;
        this.force_y = force_y;
        _tint(this, DEBUG_COLORS.force);
    }
    copy() {
        const c = new ForceZone({
            name: this.name,
            width: this.width,
            height: this.height,
            force_x: this.force_x,
            force_y: this.force_y,
        });
        c.collider.style.border = this.collider.style.border;
        return c;
    }
    pre_tick(player) {
        if (!player.overlaps(this)) {
            return;
        }
        player._ext_x += this.force_x;
        player._ext_y += this.force_y;
    }
}
export class Button extends obj {
    hover_class;
    on_click;
    disabled = false;
    hovered = false;
    constructor({ name, width, height, hover_class = null, on_click = null }) {
        super({ name, width, height });
        this.hover_class = hover_class;
        this.on_click = on_click;
        this.graphic.style.cursor = "pointer";
        this.graphic.addEventListener("mouseenter", () => this._set_hover(true));
        this.graphic.addEventListener("mouseleave", () => this._set_hover(false));
        this.graphic.addEventListener("mouseup", () => this._fire_click());
    }
    _set_hover(entering) {
        if (this.disabled) {
            return;
        }
        this.hovered = entering;
        if (!this.hover_class) {
            return;
        }
        if (entering) {
            this.graphic.classList.add(this.hover_class);
        }
        else {
            this.graphic.classList.remove(this.hover_class);
        }
    }
    _fire_click() {
        if (this.disabled || !this.on_click) {
            return;
        }
        this.on_click();
    }
    disable() {
        this.disabled = true;
    }
}
export class Collectable extends cobj {
    level = null;
    constructor({ name = null, width = null, height = null, level = null, }) {
        super({
            name: name,
            width: width,
            height: height,
            dynamic: true,
            shows_debug_col: true,
            mergeable: false,
        });
        _tint(this, DEBUG_COLORS.collectable);
        if (level !== null) {
            this.level = level;
            this.level.substitute(name, this);
            return;
        }
        game.world.appendChild(this.graphic);
        game.world.appendChild(this.collider);
    }
    copy() {
        const c = new Collectable({
            name: this.name,
            width: this.width,
            height: this.height,
        });
        c.collider.style.border = this.collider.style.border;
        return c;
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
        });
        this.graphic.style.transformOrigin = "center bottom";
        _tint(this, DEBUG_COLORS.player);
    }
    copy() {
        const c = new Player(this.x, this.y);
        c.collider.style.border = this.collider.style.border;
        return c;
    }
    update() {
        this.just_landed = this.grounded && !this.was_grounded;
        this.was_grounded = this.grounded;
        this.movedir = null;
        if (input.probe("d", input.KEYHELD)) {
            this.movedir = 1;
        }
        if (input.probe("a", input.KEYHELD)) {
            this.movedir = -1;
        }
        if (this.grounded) {
            this.coyote = this.coyote_time;
        }
        else if (this.coyote > 0) {
            this.coyote--;
        }
        if (input.probe(" ", input.KEYHELD) && this.coyote > 0) {
            this.y_speed = -this.jump_force;
            this.coyote = 0;
            this.squash(1.1, 0.85);
        }
        if (this.just_landed) {
            this.squash(0.85, 1.05);
        }
        if (this.grounded && input.probe("s", input.KEYDOWN)) {
            this.squash(1.2, 0.65);
        }
        super.update();
        if (this.grounded) {
            this.graphic.classList.remove("falling");
        }
        else {
            this.graphic.classList.add("falling");
        }
        if (this.y_speed < 0) {
            this.graphic.classList.add("rising");
        }
        else {
            this.graphic.classList.remove("rising");
        }
        if (this.movedir === null) {
            this.graphic.classList.remove("moving");
        }
        else {
            this.graphic.classList.add("moving");
        }
    }
}
