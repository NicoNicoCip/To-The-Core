export function sign(value) {
    if (value === 0)
        return 0;
    else if (value > 0)
        return 1;
    else if (value < 0)
        return -1;
    return 0;
}
export class jloop {
    static fps = 60;
    static fixed_delta = 1000 / jloop.fps;
    static accumulator = 0;
    static now = 0;
    static then = 0;
    static delta = 0;
    static methods = [];
    static deferred = [];
    static on_resize = [];
    static graphic = null;
    static world = null;
    static register_world(world) {
        if (world === null || world === undefined) {
            throw new Error("World in non optional.");
        }
        jloop.graphic = world;
        jloop.world = world.getBoundingClientRect();
        window.addEventListener("resize", () => {
            jloop.world = world.getBoundingClientRect();
            jloop.on_resize.forEach(func => func());
        });
    }
    static defer(func) {
        jloop.deferred.push(func);
    }
    static update() {
        requestAnimationFrame(jloop.update);
        jloop.now = performance.now();
        jloop.delta = jloop.now - jloop.then;
        jloop.then = jloop.now;
        if (jloop.delta > 200)
            jloop.delta = 200;
        jloop.accumulator += jloop.delta;
        while (jloop.accumulator >= jloop.fixed_delta) {
            while (jloop.deferred.length > 0) {
                jloop.deferred.shift()(); // call the shift function and run the function in the deferred stack
            }
            jloop.methods.forEach(m => m());
            jloop.accumulator -= jloop.fixed_delta;
        }
    }
    static add(func) {
        if (typeof (func) === "function") {
            jloop.methods.push(func);
            return true;
        }
        return false;
    }
    static remove(func_or_id) {
        if (typeof (func_or_id) === "function") {
            const index = jloop.methods.indexOf(func_or_id);
            if (index !== -1) {
                jloop.methods.splice(index, 1);
                return true;
            }
        }
        if (typeof (func_or_id) === "number") {
            if (func_or_id !== -1 && func_or_id >= 0 && func_or_id < jloop.methods.length) {
                jloop.methods.splice(func_or_id, 1);
                return true;
            }
        }
        return false;
    }
}
export class jobj {
    graphic = null;
    x_speed = 0;
    y_speed = 0;
    grounded = false;
    name = "";
    x = 0;
    y = 0;
    _prev_x = -1;
    _prev_y = -1;
    width = 0;
    height = 0;
    dynamic = false;
    /**
     * An object with all the data and special funccionalaty in one place
     * @param {string} name The name of the jobj
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
        this.graphic = document.createElement("div");
        this.graphic.id = name;
        this.graphic.classList.add("jobj");
        this.graphic.style.transform = `translate(${jloop.world.x + this.x}px, ${jloop.world.y + this.y}px)`;
        this.graphic.style.width = this.width + "px";
        this.graphic.style.height = this.height + "px";
    }
    copy() {
        return new jobj({
            name: this.name,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            dynamic: this.dynamic
        });
    }
    static copy(obj) {
        return new jobj({
            name: obj.name,
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height,
            dynamic: obj.dynamic
        });
    }
    /**
     * Set the position of the jobj with proper offset and string format
     * @param {number} x
     * @param {number} y
     */
    move(x = null, y = null) {
        if (x !== null)
            this.x = x;
        if (y !== null)
            this.y = y;
        if (this.x !== this._prev_x || this.y !== this._prev_y) {
            this.graphic.style.transform = `translate(${jloop.world.x + this.x}px, ${jloop.world.y + this.y}px)`;
            this._prev_x = this.x;
            this._prev_y = this.y;
        }
    }
    collide(other = null, resolve = true) {
        if (other === null)
            return;
        const x_col = this.x + this.width > other.x && this.x < other.x + other.width;
        const y_col = this.y + this.height > other.y && this.y < other.y + other.height;
        const col = x_col && y_col;
        const x_overlap = Math.min(this.x + this.width, other.x + other.width) - Math.max(this.x, other.x);
        const y_overlap = Math.min(this.y + this.height, other.y + other.height) - Math.max(this.y, other.y);
        this.grounded = false;
        if (col && resolve) {
            if (x_overlap < y_overlap) {
                this.x += x_overlap * -sign(this.x_speed);
                this.x_speed = 0;
            }
            else {
                const vert_sign = -sign(this.y_speed);
                this.y += y_overlap * vert_sign;
                this.y_speed = 0;
                if (vert_sign == -1) {
                    this.grounded = true;
                }
                else {
                    this.grounded = false;
                }
            }
        }
        return { x_col: x_col, y_col: y_col, col: col };
    }
    to_string() {
        return JSON.stringify(this);
    }
}
export class jinput {
    // we register one key event per input event to the window.
    // each time a new event is called we queue it in a battery of inputs. they all exist at the same time, in the same
    // place using key value pairs of key_press (string) -> state (just pressed, held, released + [extra] typed)
    // when running the function to look for a specific input and state, you return true if that specidic pair exists
    // and false if not.
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
        jinput.key_pairs.set(key, state);
    }
    static pull(key) {
        jinput.key_pairs.delete(key);
    }
    static probe(key, state) {
        if (key.toLowerCase() === "any") {
            return jinput.key_pairs.size > 0;
        }
        return jinput.key_pairs.get(key) === state;
    }
    static init() {
        window.addEventListener("keydown", (e) => {
            const key = e.key.toLowerCase();
            if (!jinput.key_pairs.has(key)) {
                jinput.push(key, jinput.KEYDOWN);
                jloop.defer(() => jinput.push(key, jinput.KEYHELD));
            }
        });
        window.addEventListener("keyup", (e) => {
            const key = e.key.toLowerCase();
            jinput.push(key, jinput.KEYUP);
            jloop.defer(() => jinput.pull(key));
        });
    }
}
export class jlevel {
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
            this.x = jloop.world.width / 2 - (width * tile_width) / 2;
        }
        if (y === "centered") {
            this.y = jloop.world.height / 2 - (height * tile_height) / 2;
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
                jloop.graphic.appendChild(this.objects[yy][xx].graphic);
            }
        }
        jloop.on_resize.push(() => {
            this.flat.forEach((obj) => {
                if (obj === null)
                    return;
                obj._prev_x = -1;
                obj._prev_y = -1;
                obj.move();
            });
        });
    }
    despawn() {
        for (let yy = 0; yy < this.height; yy++) {
            for (let xx = 0; xx < this.width; xx++) {
                if (this.objects[yy][xx] === null) {
                    continue;
                }
                jloop.graphic.removeChild(this.objects[yy][xx].graphic);
            }
        }
    }
    find(name) {
        return this.flat.find(obj => obj !== null && obj.name == name);
    }
    move_and_collide() {
        for (let i = 0; i < this.dynamic_objs.length; i++) {
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
