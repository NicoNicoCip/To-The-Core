export class math {
    static sign(value) {
        if (value === 0) {
            return 0;
        }
        else if (value > 0) {
            return 1;
        }
        else if (value < 0) {
            return -1;
        }
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
    static starts = [];
    static updates = [];
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
    static run() {
        if (game.world === null || game.world === undefined) {
            throw new Error("World in non optional.");
        }
        if (game.width === null || game.width === undefined) {
            throw new Error("Width in non optional.");
        }
        if (game.height === null || game.height === undefined) {
            throw new Error("Height in non optional.");
        }
        requestAnimationFrame(game.run);
        game.now = performance.now();
        game.delta = game.now - game.then;
        game.then = game.now;
        const starts = game.starts.splice(0);
        starts.forEach(i => i());
        if (game.delta > 200) {
            game.delta = 200;
        }
        game.accumulator += game.delta;
        while (game.accumulator >= game.fixed_delta) {
            game.updates.forEach(m => m());
            while (game.deferred.length > 0) {
                game.deferred.shift()();
            }
            game.accumulator -= game.fixed_delta;
        }
    }
    static start(func) {
        if (typeof (func) === "function") {
            game.starts.push(func);
            return true;
        }
        return false;
    }
    static update(func) {
        if (typeof (func) === "function") {
            game.updates.push(func);
            return true;
        }
        return false;
    }
    static remove(func) {
        if (typeof (func) === "function") {
            let index = game.updates.indexOf(func);
            if (index !== -1) {
                game.updates.splice(index, 1);
                return true;
            }
            index = game.starts.indexOf(func);
            if (index !== -1) {
                game.starts.splice(index, 1);
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
            window.location.href = "/pages/world0/s0.html";
        }
        else {
            window.location.href = localStorage.getItem("last_level");
        }
    }
    static check_version() {
        const is_local = location.hostname === "localhost" || location.hostname === "127.0.0.1";
        if (is_local) {
            return;
        }
        if (sessionStorage.getItem("loading_in_progress") === "1") {
            return;
        }
        if (localStorage.getItem("jump_clone_version") === null) {
            window.location.href = "/pages/loading/loading.html";
            return;
        }
        if (sessionStorage.getItem("update_pending") === "1") {
            window.location.href = "/pages/loading/loading.html";
            return;
        }
        fetch("https://api.github.com/repos/NicoNicoCip/To-The-Core/commits/main")
            .then(res => res.ok ? res.json() : null)
            .then(data => {
            if (!data) {
                return;
            }
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
        if (name !== null) {
            this.name = name;
        }
        if (x !== null) {
            this.x = x;
        }
        if (y !== null) {
            this.y = y;
        }
        if (width !== null) {
            this.width = width;
        }
        if (height !== null) {
            this.height = height;
        }
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
        if (x !== null) {
            this.x = x;
        }
        if (y !== null) {
            this.y = y;
        }
        this._prev_x = this.x;
        this._prev_y = this.y;
        this.graphic.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
    shift(x = null, y = null) {
        if (x !== null) {
            this.x += x;
        }
        if (y !== null) {
            this.y += y;
        }
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
        if (width !== null) {
            this.width = width;
        }
        if (height !== null) {
            this.height = height;
        }
        if (dynamic !== null) {
            this.dynamic = dynamic;
        }
        if (collides !== null) {
            this.collides = collides;
        }
        if (shows_debug_col !== null) {
            this.shows_debug_col = shows_debug_col;
        }
        if (one_way !== null) {
            this.one_way = one_way;
        }
        this.collider = document.createElement("div");
        this.collider.style.border = "solid 1px #FF0000";
        this.collider.style.width = this.width + "px";
        this.collider.style.height = this.height + "px";
        this.collider.style.zIndex = "2000";
        this.collider.style.position = "absolute";
        this.collider.style.visibility = "hidden";
    }
    collide(other = null, resolve = true) {
        if (other === null) {
            return false;
        }
        this.drop_through = input.probe("s", input.KEYHELD);
        if (other.one_way) {
            const was_above = this._prev_y + this.height <= other.y;
            if (!was_above) {
                return false;
            }
            if (this.drop_through) {
                return false;
            }
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
            if (!x_overlap) {
                x_entry_t = Infinity;
            }
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
            if (!y_overlap) {
                y_entry_t = Infinity;
            }
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
    overlaps(other) {
        if (!other) {
            return false;
        }
        return this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y;
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
    _ext_x = 0;
    _ext_y = 0;
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
        this.y_speed += this._ext_y;
        this.x += this.x_speed + this._ext_x;
        this.y += this.y_speed;
        this._ext_x = 0;
        this._ext_y = 0;
    }
    squash(sx, sy) {
        this._squash_x = sx;
        this._squash_y = sy;
    }
    _squash_transform() {
        this._squash_x += (1 - this._squash_x) * this._squash_lerp;
        this._squash_y += (1 - this._squash_y) * this._squash_lerp;
        if (Math.abs(this._squash_x - 1) < 0.01) {
            this._squash_x = 1;
        }
        if (Math.abs(this._squash_y - 1) < 0.01) {
            this._squash_y = 1;
        }
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
        if (x !== null) {
            this.x = x;
        }
        if (y !== null) {
            this.y = y;
        }
        if (width !== null) {
            this.width = width;
        }
        if (height !== null) {
            this.height = height;
        }
        if (tile_width !== null) {
            this.tile_width = tile_width;
        }
        if (tile_height !== null) {
            this.tile_height = tile_height;
        }
        if (keys !== null) {
            this.keys = keys;
        }
        if (map !== null) {
            this.map = map;
        }
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
                const char = map[yy].charAt(xx);
                if (char === " " || char === ".") {
                    this.objects[yy].push(null);
                    continue;
                }
                let mapping = null;
                for (let k of keys) {
                    if (k.char === char) {
                        mapping = k.object.copy();
                    }
                }
                if (mapping === null) {
                    throw new Error(`The key ${char} does not exist in the keys map.`);
                }
                mapping.move(xx * tile_width + this.x, yy * tile_height + this.y);
                this.objects[yy].push(mapping);
            }
        }
        for (let yy = 0; yy < this.height; yy++) {
            let obj = null;
            let start = { x: 0, y: yy };
            for (let xx = 0; xx < this.width; xx++) {
                const tile = this.objects[yy][xx];
                if (tile !== null && obj !== null && tile.name === obj.name) {
                    obj.width += tile.width;
                    obj.graphic.style.width = obj.width + "px";
                    if (obj.collider) {
                        obj.collider.style.width = obj.width + "px";
                    }
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
        for (let xx = 0; xx < this.width; xx++) {
            let obj = null;
            let start = { x: xx, y: 0 };
            for (let yy = 0; yy < this.height; yy++) {
                const tile = this.objects[yy][xx];
                if (tile !== null && obj !== null && tile.name === obj.name && tile.width === obj.width) {
                    obj.height += tile.height;
                    obj.graphic.style.height = obj.height + "px";
                    if (obj.collider) {
                        obj.collider.style.height = obj.height + "px";
                    }
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
        if (other) {
            this.flat[this.flat.indexOf(other)] = obj;
        }
        for (let yy = 0; yy < this.height; yy++) {
            for (let xx = 0; xx < this.width; xx++) {
                if (this.objects[yy][xx] === other) {
                    this.objects[yy][xx] = obj;
                }
            }
        }
        const di = this.dynamic_objs.indexOf(other);
        const si = this.static_objs.indexOf(other);
        if (di !== -1) {
            this.dynamic_objs.splice(di, 1);
        }
        if (si !== -1) {
            this.static_objs.splice(si, 1);
        }
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
                if (o !== null && o.shows_debug_col) {
                    o.collider.style.visibility = visibility;
                }
            });
        }
    }
}
export class particle {
    x = 0;
    y = 0;
    x_speed = 0;
    y_speed = 0;
    rotation = 0;
    lifetime = 60;
    max_lifetime = 60;
    size = 4;
    color = "#ffffff";
    alpha = 1;
    _el = null;
}
export class emitter {
    x = 0;
    y = 0;
    mode = "pixel";
    rate = 0;
    angle_min = 0;
    angle_max = Math.PI * 2;
    speed_min = 1;
    speed_max = 3;
    x_spread = 0;
    lifetime_min = 30;
    lifetime_max = 90;
    size_min = 2;
    size_max = 6;
    color = "#ffffff";
    sprite_url = null;
    sprite_class = null;
    sprite_w = 10;
    sprite_h = 10;
    gravity = 0.1;
    fade = true;
    shrink = false;
    spin = false;
    spin_speed = 5;
    _particles = [];
    _active = false;
    _rate_acc = 0;
    _container = null;
    static _canvas = null;
    static _ctx = null;
    static _all_pixel = [];
    static init_canvas() {
        if (emitter._canvas) {
            return;
        }
        const canvas = document.createElement("canvas");
        canvas.width = game.width;
        canvas.height = game.height;
        canvas.style.cssText = `position:absolute;left:0;top:0;width:${game.width}px;height:${game.height}px;z-index:9999;pointer-events:none;image-rendering:pixelated;`;
        game.world.appendChild(canvas);
        emitter._canvas = canvas;
        emitter._ctx = canvas.getContext("2d");
    }
    attach(container) {
        this._container = container;
        return this;
    }
    start() {
        this._active = true;
        if (this.mode === "pixel") {
            emitter.init_canvas();
            if (!emitter._all_pixel.includes(this)) {
                emitter._all_pixel.push(this);
            }
        }
        return this;
    }
    stop() {
        this._active = false;
        return this;
    }
    burst(count = 10) {
        if (this.mode === "pixel") {
            emitter.init_canvas();
            if (!emitter._all_pixel.includes(this)) {
                emitter._all_pixel.push(this);
            }
        }
        for (let i = 0; i < count; i++) {
            this._spawn_one();
        }
        return this;
    }
    update() {
        if (this._active && this.rate > 0) {
            this._rate_acc += this.rate;
            while (this._rate_acc >= 1) {
                this._spawn_one();
                this._rate_acc -= 1;
            }
        }
        for (let i = this._particles.length - 1; i >= 0; i--) {
            const p = this._particles[i];
            p.y_speed += this.gravity;
            p.x += p.x_speed;
            p.y += p.y_speed;
            if (this.spin) {
                p.rotation += this.spin_speed;
            }
            p.lifetime--;
            p.alpha = this.fade ? Math.max(0, p.lifetime / p.max_lifetime) : 1;
            if (p.lifetime <= 0) {
                if (p._el) {
                    p._el.parentNode?.removeChild(p._el);
                    p._el = null;
                }
                this._particles.splice(i, 1);
            }
            else if (p._el) {
                const scale = this.shrink ? p.alpha : 1;
                p._el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg) scale(${scale})`;
                p._el.style.opacity = String(p.alpha);
            }
        }
    }
    clear() {
        for (const p of this._particles) {
            if (p._el) {
                p._el.parentNode?.removeChild(p._el);
                p._el = null;
            }
        }
        this._particles = [];
        const idx = emitter._all_pixel.indexOf(this);
        if (idx !== -1) {
            emitter._all_pixel.splice(idx, 1);
        }
    }
    _spawn_one() {
        const p = new particle();
        p.x = this.x + (Math.random() - 0.5) * 2 * this.x_spread;
        p.y = this.y;
        const angle = this.angle_min + Math.random() * (this.angle_max - this.angle_min);
        const speed = this.speed_min + Math.random() * (this.speed_max - this.speed_min);
        p.x_speed = Math.cos(angle) * speed;
        p.y_speed = Math.sin(angle) * speed;
        p.lifetime = Math.floor(this.lifetime_min + Math.random() * (this.lifetime_max - this.lifetime_min));
        p.max_lifetime = p.lifetime;
        p.size = this.size_min + Math.random() * (this.size_max - this.size_min);
        p.color = this.color;
        p.alpha = 1;
        if (this.mode === "sprite") {
            const el = document.createElement("div");
            el.style.cssText = `position:absolute;left:0;top:0;width:${this.sprite_w}px;height:${this.sprite_h}px;transform:translate(${p.x}px,${p.y}px);image-rendering:pixelated;background-size:cover;transform-origin:center center;z-index:9999;pointer-events:none;`;
            if (this.sprite_url) {
                el.style.backgroundImage = `url(${this.sprite_url})`;
            }
            if (this.sprite_class) {
                el.className = this.sprite_class;
            }
            const container = this._container ?? game.world;
            container.appendChild(el);
            p._el = el;
        }
        this._particles.push(p);
    }
    static draw_pixels() {
        if (!emitter._canvas || !emitter._ctx) {
            return;
        }
        const ctx = emitter._ctx;
        ctx.clearRect(0, 0, emitter._canvas.width, emitter._canvas.height);
        for (const e of emitter._all_pixel) {
            for (const p of e._particles) {
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                const s = e.shrink ? p.size * p.alpha : p.size;
                ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
            }
        }
        ctx.globalAlpha = 1;
    }
}
export class Scene {
    _layer_entries = [];
    _layer_objs = [];
    _tile_w = 10;
    _tile_h = 10;
    _tile_keys = {};
    _tile_map = [];
    _map_w = 0;
    _map_h = 0;
    _level_px_w = 0;
    _level_px_h = 0;
    _char_instances = {};
    _dynamic_objs = [];
    _static_objs = [];
    _tile_objs = [];
    _placed_objs = [];
    _debug_overlay = null;
    _spawn_markers = new Set();
    _spawns = [];
    _spawned_objs = [];
    _collectables = [];
    _cam_target = null;
    _cam_lerp_x = 0.1;
    _cam_lerp_y = 0.1;
    _cam_bounds = true;
    _cam_x = 0;
    _cam_y = 0;
    _cam_offset_x = 0;
    _cam_offset_y = 0;
    _cam_look_ahead = 0;
    _cam_look_x = 0;
    _cam_deadzone_x = 0;
    _cam_deadzone_y = 0;
    _update_fn = null;
    _debug_visible = false;
    layer(visual_obj, z, parallax = 1.0) {
        this._ensure_layer(z, parallax);
        this._layer_objs.push({ obj: visual_obj, z });
        return this;
    }
    tiles(tile_w, tile_h, keys, map) {
        this._tile_w = tile_w;
        this._tile_h = tile_h;
        this._tile_keys = keys;
        this._tile_map = map;
        this._map_w = map[0].length;
        this._map_h = map.length;
        this._level_px_w = this._map_w * tile_w;
        this._level_px_h = this._map_h * tile_h;
        this._build_tiles();
        return this;
    }
    find(char) {
        const arr = this._char_instances[char];
        return arr ? arr[0] : undefined;
    }
    find_all(char) {
        return this._char_instances[char] || [];
    }
    spawn(obj, at, when, on_spawn) {
        this._spawns.push({ obj, at, when, on_spawn });
        if (at instanceof cobj) {
            this._spawn_markers.add(at);
        }
        return this;
    }
    layer_visible(z, visible) {
        const entry = this._layer_entries.find(l => l.z === z);
        if (entry) {
            entry.el.style.display = visible ? '' : 'none';
        }
        return this;
    }
    place(obj) {
        this._placed_objs.push(obj);
        return this;
    }
    collectable(obj, id) {
        this._collectables.push({ obj, id, collected: false });
        return this;
    }
    camera(target, opts = {}) {
        this._cam_target = target;
        if (opts.lerp !== undefined) {
            this._cam_lerp_x = opts.lerp;
            this._cam_lerp_y = opts.lerp;
        }
        if (opts.lerp_x !== undefined) {
            this._cam_lerp_x = opts.lerp_x;
        }
        if (opts.lerp_y !== undefined) {
            this._cam_lerp_y = opts.lerp_y;
        }
        if (opts.bounds !== undefined) {
            this._cam_bounds = opts.bounds;
        }
        if (opts.offset_x !== undefined) {
            this._cam_offset_x = opts.offset_x;
        }
        if (opts.offset_y !== undefined) {
            this._cam_offset_y = opts.offset_y;
        }
        if (opts.look_ahead !== undefined) {
            this._cam_look_ahead = opts.look_ahead;
        }
        if (opts.deadzone_x !== undefined) {
            this._cam_deadzone_x = opts.deadzone_x;
        }
        if (opts.deadzone_y !== undefined) {
            this._cam_deadzone_y = opts.deadzone_y;
        }
        return this;
    }
    cam_snap() {
        if (!this._cam_target) {
            return;
        }
        this._cam_look_x = 'facing' in this._cam_target
            ? this._cam_target.facing * this._cam_look_ahead
            : 0;
        let tx = this._cam_target.x + this._cam_offset_x + this._cam_look_x - game.width / 2;
        let ty = this._cam_target.y + this._cam_offset_y - game.height / 2;
        if (this._cam_bounds) {
            tx = Math.max(0, Math.min(tx, Math.max(0, this._level_px_w - game.width)));
            ty = Math.max(0, Math.min(ty, Math.max(0, this._level_px_h - game.height)));
        }
        this._cam_x = tx;
        this._cam_y = ty;
    }
    get cam_x() {
        return this._cam_x;
    }
    get cam_y() {
        return this._cam_y;
    }
    update(fn) {
        this._update_fn = fn;
        return this;
    }
    move_and_collide() {
        for (let i = 0; i < this._dynamic_objs.length; i++) {
            this._dynamic_objs[i].grounded = false;
            for (let j = 0; j < this._static_objs.length; j++) {
                this._dynamic_objs[i].collide(this._static_objs[j]);
            }
            for (let j = i + 1; j < this._dynamic_objs.length; j++) {
                this._dynamic_objs[i].collide(this._dynamic_objs[j]);
            }
            this._dynamic_objs[i].move();
        }
    }
    toggle_debug() {
        if (input.probe('p', input.KEYDOWN)) {
            this._debug_visible = !this._debug_visible;
            const vis = this._debug_visible ? 'visible' : 'hidden';
            for (const sp of this._spawned_objs) {
                if (sp.collider) {
                    sp.collider.style.visibility = vis;
                }
            }
            for (const t of this._tile_objs) {
                if (t.shows_debug_col && t.collider) {
                    t.collider.style.visibility = vis;
                }
            }
            for (const o of this._placed_objs) {
                if (o.shows_debug_col && o.collider) {
                    o.collider.style.visibility = vis;
                }
            }
        }
    }
    run({ save_transport = true } = {}) {
        this._setup_dom();
        this.cam_snap();
        if (save_transport) {
            game.save_transport();
        }
        game.update(() => this._tick());
        game.run();
    }
    _ensure_layer(z, parallax = 1.0) {
        let entry = this._layer_entries.find(l => l.z === z);
        if (!entry) {
            const el = document.createElement('div');
            el.style.cssText = `position:absolute;left:0;top:0;width:100%;height:100%;z-index:${z + 100};`;
            const px = typeof parallax === 'number' ? parallax : (parallax.x ?? 0);
            const py = typeof parallax === 'number' ? parallax : (parallax.y ?? 0);
            entry = { el, z, px, py };
            this._layer_entries.push(entry);
            this._layer_entries.sort((a, b) => a.z - b.z);
        }
        return entry;
    }
    _build_tiles() {
        const { _tile_map: map, _tile_keys: keys, _tile_w: tw, _tile_h: th, _map_w: W, _map_h: H } = this;
        const first_used = {};
        const tile_to_char = new Map();
        const grid = Array.from({ length: H }, () => new Array(W).fill(null));
        for (let yy = 0; yy < H; yy++) {
            for (let xx = 0; xx < W; xx++) {
                const char = map[yy].charAt(xx);
                if (char === ' ' || char === '.') {
                    continue;
                }
                const template = keys[char];
                if (!template) {
                    throw new Error(`Scene.tiles: no key for '${char}'`);
                }
                let tile;
                if (!first_used[char]) {
                    first_used[char] = true;
                    tile = template;
                }
                else {
                    tile = template.copy();
                }
                tile.move(xx * tw, yy * th);
                grid[yy][xx] = tile;
                tile_to_char.set(tile, char);
            }
        }
        for (let yy = 0; yy < H; yy++) {
            let cur = null;
            for (let xx = 0; xx < W; xx++) {
                const t = grid[yy][xx];
                if (t && cur && t.name === cur.name) {
                    cur.width += t.width;
                    cur.graphic.style.width = cur.width + 'px';
                    if (cur.collider) {
                        cur.collider.style.width = cur.width + 'px';
                    }
                    grid[yy][xx] = null;
                }
                else {
                    cur = t;
                }
            }
        }
        for (let xx = 0; xx < W; xx++) {
            let cur = null;
            for (let yy = 0; yy < H; yy++) {
                const t = grid[yy][xx];
                if (t && cur && t.name === cur.name && t.width === cur.width) {
                    cur.height += t.height;
                    cur.graphic.style.height = cur.height + 'px';
                    if (cur.collider) {
                        cur.collider.style.height = cur.height + 'px';
                    }
                    grid[yy][xx] = null;
                }
                else {
                    cur = t;
                }
            }
        }
        this._char_instances = {};
        for (let yy = 0; yy < H; yy++) {
            for (let xx = 0; xx < W; xx++) {
                const t = grid[yy][xx];
                if (!t) {
                    continue;
                }
                this._tile_objs.push(t);
                if (t.dynamic && t.collides) {
                    this._dynamic_objs.push(t);
                }
                else if (t.collides) {
                    this._static_objs.push(t);
                }
                const char = tile_to_char.get(t);
                if (char) {
                    if (!this._char_instances[char]) {
                        this._char_instances[char] = [];
                    }
                    this._char_instances[char].push(t);
                }
            }
        }
    }
    _setup_dom() {
        this._ensure_layer(0, 1.0);
        this._layer_entries.sort((a, b) => a.z - b.z);
        this._debug_overlay = document.createElement('div');
        this._debug_overlay.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;z-index:9999;pointer-events:none;';
        game.world.appendChild(this._debug_overlay);
        for (const marker of this._spawn_markers) {
            const di = this._dynamic_objs.indexOf(marker);
            if (di !== -1) {
                this._dynamic_objs.splice(di, 1);
            }
            const si = this._static_objs.indexOf(marker);
            if (si !== -1) {
                this._static_objs.splice(si, 1);
            }
        }
        for (const col of this._collectables) {
            const [world, item] = col.id.split('/');
            if (game.check_collectable(world, item)) {
                col.collected = true;
                const di = this._dynamic_objs.indexOf(col.obj);
                if (di !== -1) {
                    this._dynamic_objs.splice(di, 1);
                }
            }
        }
        for (const s of this._spawns) {
            if (!s.when()) {
                continue;
            }
            s.obj.move(s.at.x, s.at.y);
            s.obj.y_speed = s.obj.max_gravity;
            s.obj.graphic.classList.add('falling');
            if (s.obj.dynamic && s.obj.collides) {
                this._dynamic_objs.push(s.obj);
            }
            this._spawned_objs.push(s.obj);
            if (s.on_spawn) {
                s.on_spawn();
            }
            break;
        }
        for (const entry of this._layer_entries) {
            game.world.appendChild(entry.el);
        }
        for (const lo of this._layer_objs) {
            const layer = this._layer_entries.find(l => l.z === lo.z);
            if (layer) {
                layer.el.appendChild(lo.obj.graphic);
            }
        }
        const main = this._layer_entries.find(l => l.z === 0);
        for (const tile of this._tile_objs) {
            if (this._spawn_markers.has(tile)) {
                continue;
            }
            const col = this._collectables.find(c => c.obj === tile);
            if (col && col.collected) {
                continue;
            }
            main.el.appendChild(tile.graphic);
            if (tile.shows_debug_col && tile.collider) {
                tile.collider.style.visibility = 'hidden';
                this._debug_overlay.appendChild(tile.collider);
            }
        }
        for (const o of this._placed_objs) {
            main.el.appendChild(o.graphic);
            if (o.shows_debug_col && o.collider) {
                o.collider.style.visibility = 'hidden';
                this._debug_overlay.appendChild(o.collider);
            }
        }
        for (const sp of this._spawned_objs) {
            main.el.appendChild(sp.graphic);
            if (sp.shows_debug_col && sp.collider) {
                sp.collider.style.visibility = 'hidden';
                this._debug_overlay.appendChild(sp.collider);
            }
        }
    }
    _tick() {
        if (this._update_fn) {
            this._update_fn();
        }
        this._check_collectables();
        this._update_camera();
    }
    _check_collectables() {
        const main = this._layer_entries.find(l => l.z === 0);
        for (const col of this._collectables) {
            if (col.collected) {
                continue;
            }
            for (const sp of this._spawned_objs) {
                if (sp.overlaps(col.obj)) {
                    col.collected = true;
                    const [world, item] = col.id.split('/');
                    game.save_collectable(world, item);
                    if (main) {
                        if (col.obj.graphic.parentNode === main.el) {
                            main.el.removeChild(col.obj.graphic);
                        }
                        if (col.obj.collider && col.obj.collider.parentNode === main.el) {
                            main.el.removeChild(col.obj.collider);
                        }
                    }
                    const di = this._dynamic_objs.indexOf(col.obj);
                    if (di !== -1) {
                        this._dynamic_objs.splice(di, 1);
                    }
                    break;
                }
            }
        }
    }
    _update_camera() {
        if (!this._cam_target) {
            return;
        }
        if (this._cam_look_ahead > 0 && 'facing' in this._cam_target) {
            const desired = this._cam_target.facing * this._cam_look_ahead;
            this._cam_look_x += (desired - this._cam_look_x) * 0.05;
        }
        const base_x = this._cam_target.x + this._cam_offset_x + this._cam_look_x;
        const base_y = this._cam_target.y + this._cam_offset_y;
        let tx, ty;
        if (this._cam_deadzone_x > 0) {
            const sx = base_x - this._cam_x - game.width / 2;
            if (sx > this._cam_deadzone_x) {
                tx = base_x - game.width / 2 - this._cam_deadzone_x;
            }
            else if (sx < -this._cam_deadzone_x) {
                tx = base_x - game.width / 2 + this._cam_deadzone_x;
            }
            else {
                tx = this._cam_x;
            }
        }
        else {
            tx = base_x - game.width / 2;
        }
        if (this._cam_deadzone_y > 0) {
            const sy = base_y - this._cam_y - game.height / 2;
            if (sy > this._cam_deadzone_y) {
                ty = base_y - game.height / 2 - this._cam_deadzone_y;
            }
            else if (sy < -this._cam_deadzone_y) {
                ty = base_y - game.height / 2 + this._cam_deadzone_y;
            }
            else {
                ty = this._cam_y;
            }
        }
        else {
            ty = base_y - game.height / 2;
        }
        if (this._cam_bounds) {
            tx = Math.max(0, Math.min(tx, Math.max(0, this._level_px_w - game.width)));
            ty = Math.max(0, Math.min(ty, Math.max(0, this._level_px_h - game.height)));
        }
        this._cam_x += (tx - this._cam_x) * this._cam_lerp_x;
        this._cam_y += (ty - this._cam_y) * this._cam_lerp_y;
        if (Math.abs(this._cam_x - tx) < 0.01) {
            this._cam_x = tx;
        }
        if (Math.abs(this._cam_y - ty) < 0.01) {
            this._cam_y = ty;
        }
        const world_w = Math.max(this._level_px_w, game.width);
        const world_h = Math.max(this._level_px_h, game.height);
        for (const l of this._layer_entries) {
            if (l.px < 1.0 || l.py < 1.0) {
                l.el.style.transform = '';
                if (this._cam_target) {
                    const bx = -(this._cam_target.x / world_w) * game.width * l.px;
                    const by = -(this._cam_target.y / world_h) * game.height * l.py;
                    for (const lo of this._layer_objs) {
                        if (lo.z === l.z) {
                            lo.obj.graphic.style.backgroundPositionX = bx + 'px';
                            lo.obj.graphic.style.backgroundPositionY = by + 'px';
                        }
                    }
                }
            }
            else {
                l.el.style.transform = `translate(${-(this._cam_x * l.px)}px, ${-(this._cam_y * l.py)}px)`;
            }
        }
        if (this._debug_overlay) {
            this._debug_overlay.style.transform = `translate(${-this._cam_x}px, ${-this._cam_y}px)`;
        }
    }
}
