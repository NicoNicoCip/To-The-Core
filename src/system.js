export class math {
    static sign(value) {
        if (value === 0)
            return 0;
        else if (value > 0)
            return 1;
        else if (value < 0)
            return -1;
        return 0;
    }
}
export class game {
    static fps = 60;
    static fixed_delta = 1000 / game.fps;
    static accumulator = 0;
    static now = 0;
    static then = 0;
    static delta = 0;
    static methods = [];
    static pre_step_methods = [];
    static render_methods = [];
    static deferred = [];
    static on_resize = [];
    static alpha = 0;
    static world = null;
    static width = null;
    static height = null;
    static scale = null;
    static register_world(world, width, height) {
        if (world === null || world === undefined) {
            throw new Error("World in non optional.");
        }
        if (width === null || width === undefined) {
            throw new Error("Width in non optional.");
        }
        if (height === null || height === undefined) {
            throw new Error("Height in non optional.");
        }
        game.world = world;
        game.width = width;
        game.height = height;
        const scale = () => Math.min(window.innerWidth / width, window.innerHeight / height);
        game.scale = scale();
        game.world.style.transform = `scale(${game.scale})`;
        window.addEventListener("resize", () => {
            game.scale = scale();
            game.world.style.transform = `scale(${game.scale})`;
            game.on_resize.forEach(func => func());
        });
    }
    static defer(func) {
        game.deferred.push(func);
    }
    static update() {
        if (game.world === null || game.world === undefined) {
            throw new Error("World in non optional.");
        }
        if (game.width === null || game.width === undefined) {
            throw new Error("Width in non optional.");
        }
        if (game.height === null || game.height === undefined) {
            throw new Error("Height in non optional.");
        }
        requestAnimationFrame(game.update);
        game.now = performance.now();
        game.delta = game.now - game.then;
        game.then = game.now;
        if (game.delta > 200)
            game.delta = 200;
        game.accumulator += game.delta;
        while (game.accumulator >= game.fixed_delta) {
            game.pre_step_methods.forEach(m => m());
            game.methods.forEach(m => m());
            while (game.deferred.length > 0) {
                game.deferred.shift()();
            }
            game.accumulator -= game.fixed_delta;
        }
        game.alpha = game.accumulator / game.fixed_delta;
        game.render_methods.forEach(r => r(game.alpha));
    }
    static add(func) {
        if (typeof (func) === "function") {
            game.methods.push(func);
            return true;
        }
        return false;
    }
    static remove(func_or_id) {
        if (typeof (func_or_id) === "function") {
            const index = game.methods.indexOf(func_or_id);
            if (index !== -1) {
                game.methods.splice(index, 1);
                return true;
            }
        }
        if (typeof (func_or_id) === "number") {
            if (func_or_id !== -1 && func_or_id >= 0 && func_or_id < game.methods.length) {
                game.methods.splice(func_or_id, 1);
                return true;
            }
        }
        return false;
    }
    static add_render(func) {
        if (typeof (func) === "function") {
            game.render_methods.push(func);
            return true;
        }
        return false;
    }
    static remove_render(func) {
        const index = game.render_methods.indexOf(func);
        if (index !== -1) {
            game.render_methods.splice(index, 1);
            return true;
        }
        return false;
    }
}
export class obj {
    graphic = null;
    x_speed = 0;
    y_speed = 0;
    grounded = false;
    name = "";
    x = 0;
    y = 0;
    _prev_x = -1;
    _prev_y = -1;
    render_x = 0;
    render_y = 0;
    width = 0;
    height = 0;
    dynamic = false;
    /**
     * An object with all the data and special funccionalaty in one place
     * @param {string} name The name of the obj
     * @param {number} x the x position of the obj
     * @param {number} y the y position of the obj
     * @param {number} width width of the graphic
     * @param {number} height height of the graphic
     */
    constructor({ name = null, x = null, y = null, width = null, height = null, dynamic = null }) {
        if (name !== null)
            this.name = name;
        if (x !== null)
            this.x = x;
        if (y !== null)
            this.y = y;
        if (width !== null)
            this.width = width;
        if (height !== null)
            this.height = height;
        if (dynamic !== null)
            this.dynamic = dynamic;
        this._prev_x = this.x;
        this._prev_y = this.y;
        this.graphic = document.createElement("div");
        this.graphic.id = name;
        this.graphic.classList.add("obj");
        this.graphic.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.graphic.style.width = this.width + "px";
        this.graphic.style.height = this.height + "px";
    }
    copy() {
        return new obj({
            name: this.name,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            dynamic: this.dynamic
        });
    }
    static copy(obj) {
        return new obj({
            name: obj.name,
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
            dynamic: obj.dynamic
        });
    }
    /**
     * Set the position of the obj with proper offset and string format
     * @param {number} x
     * @param {number} y
     */
    move(x = null, y = null) {
        if (x !== null)
            this.x = x;
        if (y !== null)
            this.y = y;
        this.render_x = this.x;
        this.render_y = this.y;
        this._prev_x = this.x;
        this._prev_y = this.y;
    }
    render(alpha) {
        const rx = this.render_x + (this.x - this.render_x) * alpha;
        const ry = this.render_y + (this.y - this.render_y) * alpha;
        this.graphic.style.transform = `translate(${rx}px, ${ry}px)`;
    }
    collide(other = null, resolve = true) {
        if (other === null)
            return;
        const dx = this.x - this._prev_x;
        const dy = this.y - this._prev_y;
        let x_entry_t = Number.NEGATIVE_INFINITY;
        let x_exit_t = Infinity;
        if (dx > 0) {
            x_entry_t = (other.x - (this._prev_x + this.width)) / dx;
            x_exit_t = (other.x + other.width - this._prev_x) / dx;
        }
        else if (dx < 0) {
            x_entry_t = (other.x + other.width - this._prev_x) / dx;
            x_exit_t = (other.x - (this._prev_x + this.width)) / dx;
        }
        else {
            const x_overlap = this._prev_x + this.width > other.x && this._prev_x < other.x + other.width;
            if (!x_overlap)
                x_entry_t = Infinity;
        }
        let y_entry_t = Number.NEGATIVE_INFINITY;
        let y_exit_t = Infinity;
        if (dy > 0) {
            y_entry_t = (other.y - (this._prev_y + this.height)) / dy;
            y_exit_t = (other.y + other.height - this._prev_y) / dy;
        }
        else if (dy < 0) {
            y_entry_t = (other.y + other.height - this._prev_y) / dy;
            y_exit_t = (other.y - (this._prev_y + this.height)) / dy;
        }
        else {
            const y_overlap = this._prev_y + this.height > other.y && this._prev_y < other.y + other.height;
            if (!y_overlap)
                y_entry_t = Infinity;
        }
        const entry_t = Math.max(x_entry_t, y_entry_t);
        const exit_t = Math.min(x_exit_t, y_exit_t);
        const col = entry_t < exit_t && entry_t >= 0 && entry_t < 1;
        if (col && resolve) {
            if (x_entry_t > y_entry_t) {
                this.x = this._prev_x + dx * entry_t;
                this.x_speed = 0;
            }
            else {
                this.y = this._prev_y + dy * entry_t;
                this.y_speed = 0;
                if (dy > 0) {
                    this.grounded = true;
                }
            }
        }
        // const x_col = this.x + this.width > other.x && this.x < other.x + other.width
        // const y_col = this.y + this.height > other.y && this.y < other.y + other.height
        // const x_overlap = Math.min(this.x + this.width, other.x + other.width) - Math.max(this.x, other.x)
        // const y_overlap = Math.min(this.y + this.height, other.y + other.height) - Math.max(this.y, other.y)
        // const came_from_left = this._prev_x + this.width <= other.x
        // const came_from_right = this._prev_x >= other.x + other.width
        // const came_from_above = this._prev_y + this.height <= other.y
        // const came_from_below = this._prev_y >= other.y + other.height
        // if (x_col && y_col && resolve) {
        //     if (came_from_left || came_from_right) {
        //         this.x += x_overlap * -math.sign(this.x_speed)
        //         this.x_speed = 0
        //     } else if (came_from_above || came_from_below) {
        //         const vert_sign = -math.sign(this.y_speed)
        //         this.y += y_overlap * vert_sign
        //         this.y_speed = 0
        //         if (vert_sign == -1) this.grounded = true
        //     }
        // }
        return col;
    }
    to_string() {
        return JSON.stringify(this);
    }
}
export class input {
    static key_pairs = new Map();
    static KEYDOWN = "key_down";
    static KEYHELD = "key_held";
    static KEYUP = "key_up";
    static push(key, state) {
        if (typeof (key) !== "string") {
            throw new Error("Key must be string");
        }
        if (typeof (state) !== "string") {
            throw new Error("State must be string");
        }
        input.key_pairs.set(key, state);
    }
    static pull(key) {
        input.key_pairs.delete(key);
    }
    static probe(key, state) {
        if (key.toLowerCase() === "any") {
            return input.key_pairs.size > 0;
        }
        return input.key_pairs.get(key) === state;
    }
    static init() {
        window.addEventListener("keydown", (e) => {
            const key = e.key.toLowerCase();
            if (!input.key_pairs.has(key)) {
                input.push(key, input.KEYDOWN);
                game.defer(() => input.push(key, input.KEYHELD));
            }
        });
        window.addEventListener("keyup", (e) => {
            const key = e.key.toLowerCase();
            input.push(key, input.KEYUP);
            game.defer(() => input.pull(key));
        });
    }
}
export class level {
    objects = [];
    flat = null;
    dynamic_objs = [];
    static_objs = [];
    keys = null;
    map = [];
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    tile_width = 0;
    tile_height = 0;
    constructor({ x = null, y = null, width = null, height = null, tile_width = null, tile_height = null, keys = null, map = null }) {
        if (x !== null)
            this.x = x;
        if (y !== null)
            this.y = y;
        if (width !== null)
            this.width = width;
        if (height !== null)
            this.height = height;
        if (tile_width !== null)
            this.tile_width = tile_width;
        if (tile_height !== null)
            this.tile_height = tile_height;
        if (keys !== null)
            this.keys = keys;
        if (map !== null)
            this.map = map;
        if (this.map[0].length != width) {
            throw new Error("The width of the map does not match the level width");
        }
        if (this.map.length != height) {
            throw new Error("The height of the map does not match the level height");
        }
        if (x === "centered") {
            this.x = game.width / 2 - (width * tile_width) / 2;
        }
        if (y === "centered") {
            this.y = game.height / 2 - (height * tile_height) / 2;
        }
        for (let yy = 0; yy < this.height; yy++) {
            this.objects[yy] = [];
            for (let xx = 0; xx < this.width; xx++) {
                // take the char from the map
                const char = map[yy].charAt(xx);
                if (char === " " || char === ".") {
                    this.objects[yy].push(null);
                    continue;
                }
                // find its mapping
                let mapping = null;
                for (let k of keys) {
                    if (k.char === char) {
                        mapping = k.object.copy();
                    }
                }
                if (mapping === null) {
                    throw new Error(`The key ${char} does not exist in the keys map.`);
                }
                // put an instance copy of the mapping in the array
                mapping.move(xx * tile_width + this.x, yy * tile_height + this.y);
                this.objects[yy].push(mapping);
            }
        }
        // Horizontal pass
        for (let yy = 0; yy < this.height; yy++) {
            let obj = null;
            let start = { x: 0, y: yy };
            for (let xx = 0; xx < this.width; xx++) {
                const tile = this.objects[yy][xx];
                if (tile !== null && obj !== null && tile.name === obj.name) {
                    obj.width += tile.width;
                    obj.graphic.style.width = obj.width + "px";
                    this.objects[yy][xx] = null;
                }
                else {
                    if (obj !== null) {
                        this.objects[start.y][start.x] = obj;
                    }
                    obj = tile;
                    start = { x: xx, y: yy };
                }
            }
            if (obj !== null) {
                this.objects[start.y][start.x] = obj;
            }
        }
        // Vertical pass
        for (let xx = 0; xx < this.width; xx++) {
            let obj = null;
            let start = { x: xx, y: 0 };
            for (let yy = 0; yy < this.height; yy++) {
                const tile = this.objects[yy][xx];
                if (tile !== null && obj !== null && tile.name === obj.name && tile.width === obj.width) {
                    obj.height += tile.height;
                    obj.graphic.style.height = obj.height + "px";
                    this.objects[yy][xx] = null;
                }
                else {
                    if (obj !== null) {
                        this.objects[start.y][start.x] = obj;
                    }
                    obj = tile;
                    start = { x: xx, y: yy };
                }
            }
            if (obj !== null) {
                this.objects[start.y][start.x] = obj;
            }
        }
        this.flat = this.objects.flat();
        this.flat.forEach((obj) => {
            if (obj === null) {
                return;
            }
            if (obj.dynamic) {
                this.dynamic_objs.push(obj);
            }
            else {
                this.static_objs.push(obj);
            }
        });
    }
    spawn() {
        for (let yy = 0; yy < this.height; yy++) {
            for (let xx = 0; xx < this.width; xx++) {
                if (this.objects[yy][xx] === null) {
                    continue;
                }
                game.world.appendChild(this.objects[yy][xx].graphic);
            }
        }
        const pre_step = () => {
            this.dynamic_objs.forEach((obj) => {
                obj.render_x = obj.x;
                obj.render_y = obj.y;
            });
        };
        const render = (alpha) => {
            this.flat.forEach((obj) => {
                if (obj === null)
                    return;
                obj.render(alpha);
            });
        };
        game.pre_step_methods.push(pre_step);
        game.add_render(render);
        game.on_resize.push(() => {
            this.flat.forEach((obj) => {
                if (obj === null)
                    return;
                obj.render(1);
            });
        });
    }
    despawn() {
        for (let yy = 0; yy < this.height; yy++) {
            for (let xx = 0; xx < this.width; xx++) {
                if (this.objects[yy][xx] === null) {
                    continue;
                }
                game.world.removeChild(this.objects[yy][xx].graphic);
            }
        }
    }
    find(name) {
        return this.flat.find(obj => obj !== null && obj.name == name);
    }
    replace(name, obj) {
        const other = this.find(name);
        if (other)
            this.flat[this.flat.indexOf(other)] = obj;
        for (let yy = 0; yy < this.height; yy++) {
            for (let xx = 0; xx < this.width; xx++) {
                if (this.objects[yy][xx] === other) {
                    this.objects[yy][xx] = obj;
                }
            }
        }
        const di = this.dynamic_objs.indexOf(other);
        if (di !== -1)
            this.dynamic_objs[di] = obj;
        const si = this.static_objs.indexOf(other);
        if (si !== -1)
            this.static_objs[si] = obj;
    }
    move_and_collide() {
        for (let i = 0; i < this.dynamic_objs.length; i++) {
            this.dynamic_objs[i].grounded = false;
            for (let j = 0; j < this.static_objs.length; j++) {
                this.dynamic_objs[i].collide(this.static_objs[j]);
            }
            for (let j = i + 1; j < this.dynamic_objs.length; j++) {
                this.dynamic_objs[i].collide(this.dynamic_objs[j]);
            }
            this.dynamic_objs[i].move();
        }
    }
}
