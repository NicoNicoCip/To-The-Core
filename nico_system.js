export function sign(value) {
    if (value === 0) return 0
    else if (value > 0) return 1
    else if (value < 0) return -1

    return 0
}

export class jloop {
    static fps = 0
    static fps_interval = 0
    static start_time = 0
    static now = 0
    static then = 0
    static elapsed = 0
    static methods = Array.from(() => { })
    static graphic = null
    static world = null

    static register_world(world) {
        if (world === null || world === undefined) {
            throw new Error("World in non optional.")
        }
        jloop.graphic = world
        jloop.world = world.getBoundingClientRect()

        window.addEventListener("resize", () => {
            jloop.world = world.getBoundingClientRect()
        })
    }

    static update() {
        requestAnimationFrame(jloop.update)

        jloop.now = performance.now()
        jloop.elapsed = jloop.now - jloop.then

        if (jloop.elapsed > jloop.fps_interval) {
            jloop.then = jloop.now - (jloop.elapsed % jloop.fps_interval)
            jloop.methods.forEach(m => {
                m()
            });
        }
    }

    static start_update(fps) {
        jloop.fps = fps
        jloop.fps_interval = 1000 / jloop.fps
        jloop.then = performance.now()
        jloop.start_time = jloop.then
        jloop.update()
    }

    static add(func) {
        if (typeof (func) === "function") {
            jloop.methods.push(func)
            return true
        }

        return false
    }

    static remove(func_or_id) {
        if (typeof (func_or_id) === "function") {
            const index = jloop.methods.indexOf(func_or_id)
            if (index !== -1) {
                jloop.methods.splice(index, 1)
                return true
            }
        }

        if (typeof (func_or_id) === "number") {
            if (func_or_id !== -1 && func_or_id >= 0 && func_or_id < jloop.methods.length) {
                jloop.methods.splice(func_or_id, 1)
                return true
            }
        }

        return false
    }
}

export class jobj {
    graphic = null
    x_speed = 0
    y_speed = 0
    grounded = false

    /**
     * An object with all the data and special funccionalaty in one place
     * @param {string} name The name of the jobj
     * @param {number} x the x position of the obj
     * @param {number} y the y position of the obj
     * @param {number} width width of the graphic
     * @param {number} height height of the graphic
     */
    constructor({
        name = null,
        x = null,
        y = null,
        width = null,
        height = null,
    }) {

        if (name !== null) this.name = name
        if (x !== null) this.x = x
        if (y !== null) this.y = y
        if (width !== null) this.width = width
        if (height !== null) this.height = height

        this.graphic = document.createElement("div")
        this.graphic.id = name
        this.graphic.classList.add("jobj")
        this.graphic.style.left = jloop.world.x + this.x + "px"
        this.graphic.style.top = jloop.world.y + this.y + "px"
        this.graphic.style.width = this.width + "px"
        this.graphic.style.height = this.height + "px"

        console.log(this.x, this.y)
    }

    copy() {
        return new jobj({
            name: this.name,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        })
    }

    static copy(obj) {
        return new jobj({
            name: obj.name,
            x: obj.x,
            y: obj.y,
            width: obj.width,
            height: obj.height
        })
    }

    /**
     * Set the position of the jobj with proper offset and string format
     * @param {number} x 
     * @param {number} y 
     */
    move(x = null, y = null) {
        if (x !== null) this.x = x
        if (y !== null) this.y = y

        this.graphic.style.left = jloop.world.x + this.x + "px"
        this.graphic.style.top = jloop.world.y + this.y + "px"
    }

    collide(other = null, resolve = true) {
        if (other === null) return

        const x_col = this.x + this.width > other.x && this.x < other.x + other.width
        const y_col = this.y + this.height > other.y && this.y < other.y + other.height
        const col = x_col && y_col

        const x_overlap = Math.min(this.x + this.width, other.x + other.width) - Math.max(this.x, other.x)
        const y_overlap = Math.min(this.y + this.height, other.y + other.height) - Math.max(this.y, other.y)

        if (col && resolve) {
            if (x_overlap < y_overlap) {
                this.x += x_overlap * -sign(this.x_speed)
                this.x_speed = 0
            } else {
                const vert_sign = -sign(this.y_speed)
                this.y += y_overlap * vert_sign
                this.y_speed = 0

                if (vert_sign == -1) {
                    this.grounded = true
                } else {
                    this.grounded = false
                }
            }
        }

        return { x_col: x_col, y_col: y_col, col: col }
    }

    to_string() {
        return JSON.stringify(this)
    }
}

export class jlevel {
    objects = []    // Array.from(Array.from(jobj))
    keys = []       // Array.from({char: "", object: null})
    map = []        // Array.from(String)

    constructor({
        width = null,
        height = null,
        tile_width = null,
        tile_height = null,
        keys = null,
        map = null
    }) {

        if (width !== null) this.width = width
        if (height !== null) this.height = height
        if (tile_width !== null) this.tile_width = tile_width
        if (tile_height !== null) this.tile_height = tile_height
        if (keys !== null) this.keys = keys
        if (map !== null) this.map = map

        if (this.map[0].length != width) {
            throw new Error("The width of the map does not match the level width")
        }

        if (this.map.length != height) {
            throw new Error("The height of the map does not match the level height")
        }

        for (let yy = 0; yy < this.height; yy++) {
            this.objects.push([])
            for (let xx = 0; xx < this.width; xx++) {
                // take the char from the map
                const char = map[yy].charAt(xx)

                if (char === " " || char === ".") {
                    this.objects[yy].push(null)
                    continue
                }

                // find its mapping
                let mapping = null
                for (let k of keys) {
                    if (k.char === char) {
                        mapping = k.object.copy()
                    }
                }

                if (mapping === null) {
                    throw new Error(`The key ${char} does not exist in the keys map.`)
                }

                // put an instance copy of the mapping in the array
                mapping.move(xx * tile_width, yy * tile_height)
                this.objects[yy].push(mapping)
            }
        }
    }

    batch() {
        let obj = null
        let start = {x: 0, y: 0}
        for (let yy = 0; yy < this.height; yy++) {
            for (let xx = 0; xx < this.width; xx++) {
                const tile = this.objects[yy][xx]
                if(tile === null && tile.name === obj.name) {
                    obj.width += tile.width
                    this.objects[xx][yy] = null
                    continue
                }

                if(obj !== null) {
                    this.objects[start.y][start.x] = obj
                }
            }
        }
    }

    spawn() {
        for (let yy = 0; yy < this.height; yy++) {
            for (let xx = 0; xx < this.width; xx++) {
                if (this.objects[yy][xx] === null) {
                    continue
                }

                jloop.graphic.appendChild(this.objects[yy][xx].graphic)
            }
        }
    }

    despawn() {
        for (let yy = 0; yy < this.height; yy++) {
            for (let xx = 0; xx < this.width; xx++) {
                if (this.objects[yy][xx] === null) {
                    continue
                }

                jloop.graphic.removeChild(this.objects[yy][xx].graphic)
            }
        }
    }
}