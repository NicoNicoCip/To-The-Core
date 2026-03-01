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
    static initializers = [];
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
        game.initializers.forEach(i => i());
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
    static init(func) {
        if (typeof (func) === "function") {
            game.methods.push(func);
            return true;
        }
        return false;
    }
    static method(func) {
        if (typeof (func) === "function") {
            game.methods.push(func);
            return true;
        }
        return false;
    }
    static remove(func) {
        if (typeof (func) === "function") {
            let index = game.methods.indexOf(func);
            if (index !== -1) {
                game.methods.splice(index, 1);
                return true;
            }
            index = game.initializers.indexOf(func);
            if (index !== -1) {
                game.initializers.splice(index, 1);
                return true;
            }
        }
        return false;
    }
    static save_transport() {
        localStorage.setItem("last_level", window.location.pathname);
    }
    static load_transport() {
        if (localStorage.getItem("last_level") === null) {
            window.location.href = "/pages/world0/s1.html";
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
            return;
        }
        if (sessionStorage.getItem("update_pending") === "1") {
            window.location.href = "/pages/loading/loading.html";
            return;
        }
        // Background check: detect new deploys via GitHub API.
        // Non-blocking — player keeps playing. If a new version is found,
        // sets a flag so the next page navigation triggers the loading screen.
        fetch("https://api.github.com/repos/NicoNicoCip/To-The-Core/commits/main")
            .then(res => res.ok ? res.json() : null)
            .then(data => {
            if (!data)
                return;
            const remote = data.sha;
            const local = localStorage.getItem("jump_clone_version");
            if (remote && local && remote !== local) {
                sessionStorage.setItem("update_pending", "1");
            }
        })
            .catch(() => { });
    }
    static save_collectable(world, item) {
        const local_data = window.localStorage.getItem("collectables");
        const collect = local_data === null
            ? { [world]: {} }
            : JSON.parse(local_data);
        if (!collect[world]) {
            collect[world] = {};
        }
        collect[world][item] = true;
        window.localStorage.setItem("collectables", JSON.stringify(collect));
    }
    static check_collectable(world, item) {
        const local_data = window.localStorage.getItem("collectables");
        const collect = local_data === null
            ? null
            : JSON.parse(local_data);
        return collect !== null && collect[world] !== undefined && collect[world][item] === true;
    }
}
export class obj {
    graphic = null;
    name = "";
    x = 0;
    y = 0;
    _prev_x = -1;
    _prev_y = -1;
    width = 0;
    height = 0;
    constructor({ name = null, x = null, y = null, width = null, height = null, }) {
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
        return obj.copy(this);
    }
    static copy(other) {
        return new obj({
            name: other.name,
            x: other.x,
            y: other.y,
            width: other.width,
            height: other.height,
        });
    }
    move(x = null, y = null) {
        if (x !== null)
            this.x = x;
        if (y !== null)
            this.y = y;
        this._prev_x = this.x;
        this._prev_y = this.y;
        this.graphic.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
    shift(x = null, y = null) {
        if (x !== null)
            this.x += x;
        if (y !== null)
            this.y += y;
        this._prev_x = this.x;
        this._prev_y = this.y;
        this.graphic.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
    to_string() {
        return JSON.stringify(this);
    }
}
export class bobj extends obj {
    constructor({ name = null, x = null, y = null, width = null, height = null, }) {
        super({
            name, x, y,
            width: width == null ? game.width : width,
            height: height == null ? game.height : height
        });
    }
}
export class cobj extends obj {
    collider = null;
    x_speed = 0;
    y_speed = 0;
    grounded = false;
    dynamic = false;
    collides = true;
    shows_debug_col = false;
    one_way = false;
    drop_through = false;
    constructor({ name = null, x = null, y = null, width = null, height = null, dynamic = null, collides = null, shows_debug_col = null, one_way = null }) {
        super({ name, x, y, width, height });
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
        if (one_way !== null)
            this.one_way = one_way;
        this.collider = document.createElement("div");
        this.collider.style.border = "solid 1px #FF0000";
        this.collider.style.width = this.width + "px";
        this.collider.style.height = this.height + "px";
        this.collider.style.zIndex = "2000";
        this.collider.style.position = "absolute";
        this.collider.style.visibility = "hidden";
    }
    collide(other = null, resolve = true) {
        if (other === null)
            return false;
        this.drop_through = input.probe("s", input.KEYHELD);
        if (other.one_way) {
            const was_above = this._prev_y + this.height <= other.y;
            if (!was_above)
                return false;
            if (this.drop_through)
                return false;
        }
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
        return col;
    }
    copy() {
        return cobj.copy(this);
    }
    static copy(other) {
        return new cobj({
            name: other.name,
            x: other.x,
            y: other.y,
            width: other.width,
            height: other.height,
            dynamic: other.dynamic,
            collides: other.collides,
            shows_debug_col: other.shows_debug_col,
            one_way: other.one_way
        });
    }
    move(x = null, y = null) {
        super.move(x, y);
        this.collider.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
    shift(x = null, y = null) {
        super.shift(x, y);
        this.collider.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
}
export class pobj extends cobj {
    facing = 1;
    was_grounded = false;
    just_landed = false;
    landed_once = false;
    landing = false;
    landing_timer = 0;
    max_acc = 2;
    max_gravity = 6;
    acc_modifier = 0.4;
    gravity = 0.2;
    friction = 0.4;
    jump_force = 4;
    movedir = null;
    shake = true;
    _squash_x = 1;
    _squash_y = 1;
    _squash_lerp = 0.15;
    _force_x = 0;
    _force_y = 0;
    _force_x_time = 0;
    _force_y_time = 0;
    coyote = 0;
    coyote_time = 4;
    constructor({ name = null, x = null, y = null, width = null, height = null, dynamic = null, collides = null, shows_debug_col = null, one_way = null }) {
        super({ name, x, y, width, height, dynamic, collides, shows_debug_col, one_way });
    }
    update() {
        if (this.movedir === 1) {
            this.x_speed += this.acc_modifier;
            this.facing = 1;
        }
        if (this.movedir === -1) {
            this.x_speed -= this.acc_modifier;
            this.facing = -1;
        }
        if (this.movedir !== null) {
            if (this.x_speed > this.max_acc) {
                this.x_speed = this.max_acc;
            }
            if (this.x_speed < -this.max_acc) {
                this.x_speed = -this.max_acc;
            }
        }
        else {
            this.x_speed += (this.acc_modifier * -math.sign(this.x_speed)) * this.friction;
            if (this.x_speed < 0.2 && this.x_speed > -0.2) {
                this.x_speed = 0;
            }
        }
        this.y_speed += this.gravity;
        if (this.y_speed > this.max_gravity) {
            this.y_speed = this.max_gravity;
        }
        // Move position without updating _prev or DOM.
        // Collision detection needs the delta (x - _prev_x).
        // move_and_collide() will call move() afterward to sync everything.
        this.x += this.x_speed;
        this.y += this.y_speed;
    }
    squash(sx, sy) {
        this._squash_x = sx;
        this._squash_y = sy;
    }
    _squash_transform() {
        this._squash_x += (1 - this._squash_x) * this._squash_lerp;
        this._squash_y += (1 - this._squash_y) * this._squash_lerp;
        if (Math.abs(this._squash_x - 1) < 0.01)
            this._squash_x = 1;
        if (Math.abs(this._squash_y - 1) < 0.01)
            this._squash_y = 1;
        return `translate(${this.x}px, ${this.y}px) scaleX(${this.facing}) scale(${this._squash_x}, ${this._squash_y})`;
    }
    move(x = null, y = null) {
        super.move(x, y);
        this.graphic.style.transform = this._squash_transform();
        this.collider.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
    shift(x = null, y = null) {
        super.shift(x, y);
        this.graphic.style.transform = this._squash_transform();
        this.collider.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
    call_force({ x = null, y = null, x_time = null, y_time = null }) {
        if (x !== null && x_time !== null) {
            this._force_x = x;
            this._force_x_time = x_time;
        }
        if (y !== null && y_time !== null) {
            this._force_y = y;
            this._force_y_time = y_time;
        }
    }
    apply_force() {
        let res = { x_end: false, y_end: false };
        if (this._force_x_time > 0) {
            this.x_speed = this._force_x;
            this._force_x_time--;
        }
        else {
            this._force_x = 0;
            res.x_end = true;
        }
        if (this._force_y_time > 0) {
            this.y_speed = this._force_y;
            this._force_y_time--;
        }
        else {
            this._force_y = 0;
            res.y_end = true;
        }
        return res.x_end && res.y_end
            ? true
            : res;
    }
}
export class input {
    static key_pairs = {};
    static KEYDOWN = "key_down";
    static KEYHELD = "key_held";
    static KEYUP = "key_up";
    static MOUSE_LEFT = false;
    static MOSE_RIGHT = false;
    static MOUSE_MIDDLE = false;
    static MOUSE_SCROLL_UP = false;
    static MOUSE_SCROLL_DOWN = false;
    static push(key, state) {
        if (typeof (key) !== "string") {
            throw new Error("Key must be string");
        }
        if (typeof (state) !== "string") {
            throw new Error("State must be string");
        }
        input.key_pairs[key] = state;
    }
    static pull(key) {
        delete input.key_pairs[key];
    }
    static probe(key, state) {
        if (key.toLowerCase() === "any") {
            return Object.keys(input.key_pairs).length > 0;
        }
        return input.key_pairs[key] === state;
    }
    static init() {
        window.addEventListener("keydown", (e) => {
            const key = e.key.toLowerCase();
            if (!(key in input.key_pairs)) {
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
                    if (obj.collider)
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
                    if (obj.collider)
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
    debug_col_visible = false;
    toggle_debug(player) {
        if (input.probe("p", input.KEYDOWN)) {
            this.debug_col_visible = !this.debug_col_visible;
            const visibility = this.debug_col_visible ? "visible" : "hidden";
            player.collider.style.visibility = visibility;
            this.flat.forEach(o => {
                if (o !== null && o.shows_debug_col)
                    o.collider.style.visibility = visibility;
            });
        }
    }
}
export class particle {
    x = 0;
    y = 0;
    x_speed = 0;
    y_speed = 0;
}
