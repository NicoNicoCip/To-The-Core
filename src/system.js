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
    static deferred = [];
    static on_resize = [];
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
        game.check_version();
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
            game.methods.forEach(m => m());
            while (game.deferred.length > 0) {
                game.deferred.shift()();
            }
            game.accumulator -= game.fixed_delta;
        }
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
    static savetransport() {
        localStorage.setItem("last_level", window.location.pathname);
    }
    static loadtransport() {
        if (localStorage.getItem("last_level") === null) {
            window.location.href = "/pages/world1/level1s1.html";
        }
        else {
            window.location.href = localStorage.getItem("last_level");
        }
    }
    // Redirects to the loading page if no cached version is stored in localStorage.
    // loading.js is the sole owner of fetching the real version and writing it.
    // Clearing "jump_clone_version" from localStorage (e.g. on deploy detection)
    // is enough to trigger a full re-download on the next page load.
    // Called automatically by register_world() on production.
    static check_version() {
        const is_local = location.hostname === "localhost" || location.hostname === "127.0.0.1";
        if (is_local)
            return;
        if (sessionStorage.getItem("loading_in_progress") === "1")
            return;
        if (localStorage.getItem("jump_clone_version") === null) {
            window.location.href = "/pages/loading/loading.html";
        }
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
    width = 0;
    height = 0;
    dynamic = false;
    collides = true;
    shows_debug_col = false;
    collider = null;
    /**
     * An object with all the data and special funccionalaty in one place
     * @param {string} name The name of the obj
     * @param {number} x the x position of the obj
     * @param {number} y the y position of the obj
     * @param {number} width width of the graphic
     * @param {number} height height of the graphic
     */
    constructor({ name = null, x = null, y = null, width = null, height = null, dynamic = null, collides = null, shows_debug_col = null }) {
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
        if (collides !== null)
            this.collides = collides;
        if (shows_debug_col !== null)
            this.shows_debug_col = shows_debug_col;
        this._prev_x = this.x;
        this._prev_y = this.y;
        this.collider = document.createElement("div");
        this.collider.style.border = "solid 1px #FF0000";
        this.collider.style.width = this.width + "px";
        this.collider.style.height = this.height + "px";
        this.collider.style.zIndex = "2000";
        this.collider.style.position = "absolute";
        this.collider.style.visibility = "hidden";
        this.graphic = document.createElement("div");
        this.graphic.id = name;
        this.graphic.classList.add("obj");
        this.graphic.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.graphic.style.width = this.width + "px";
        this.graphic.style.height = this.height + "px";
    }
    copy() {
        return obj.copy(this);
    }
    static copy(other) {
        return new obj({
            name: other.name,
            x: other.x,
            y: other.y,
            width: other.width,
            height: other.height,
            dynamic: other.dynamic,
            collides: other.collides,
            shows_debug_col: other.shows_debug_col
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
        this._prev_x = this.x;
        this._prev_y = this.y;
        this.graphic.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.collider.style.transform = `translate(${this.x}px, ${this.y}px)`;
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
                    obj.collider.style.width = obj.width + "px";
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
                    obj.collider.style.height = obj.height + "px";
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
            if (obj.dynamic && obj.collides) {
                this.dynamic_objs.push(obj);
            }
            else if (obj.collides) {
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
                if (this.objects[yy][xx].shows_debug_col) {
                    game.world.appendChild(this.objects[yy][xx].collider);
                }
            }
        }
    }
    despawn() {
        for (let yy = 0; yy < this.height; yy++) {
            for (let xx = 0; xx < this.width; xx++) {
                if (this.objects[yy][xx] === null) {
                    continue;
                }
                game.world.removeChild(this.objects[yy][xx].graphic);
                if (this.objects[yy][xx].shows_debug_col) {
                    game.world.removeChild(this.objects[yy][xx].collider);
                }
            }
        }
    }
    find(name) {
        return this.flat.find(obj => obj !== null && obj.name == name);
    }
    find_all(name) {
        return this.flat.filter(obj => obj !== null && obj.name == name);
    }
    replace(name_or_obj, obj) {
        const other = typeof name_or_obj === "string" ? this.find(name_or_obj) : name_or_obj;
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
        const si = this.static_objs.indexOf(other);
        // Remove old from whichever list it was in
        if (di !== -1)
            this.dynamic_objs.splice(di, 1);
        if (si !== -1)
            this.static_objs.splice(si, 1);
        // Add new to the appropriate list based on its own properties
        if (obj.dynamic && obj.collides) {
            this.dynamic_objs.push(obj);
        }
        else if (obj.collides) {
            this.static_objs.push(obj);
        }
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
    substitute(from, to) {
        if (typeof (from) === "string") {
            const spawnpoint = this.find(from);
            this.replace(from, to);
            to.move(spawnpoint.x, spawnpoint.y);
        }
        else {
            this.replace(from, to);
            to.move(from.x, from.y);
        }
    }
}
export class particle {
    x = 0;
    y = 0;
    x_speed = 0;
    y_speed = 0;
}
