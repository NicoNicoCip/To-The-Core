export class jobj {
    graphic_link = null     // html element graphic

    // physics
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
    constructor(
        name = null,
        x = null,
        y = null,
        width = null,
        height = null
    ) {
        if (name !== null) this.name = name

        if (x !== null) this.x = x
        if (y !== null) this.y = y

        if (width !== null) this.width = width
        if (height !== null) this.height = height

        this.graphic_link = document.createElement("div")
        this.graphic_link.id = name
        this.graphic_link.classList.add("jobj")
        this.graphic_link.style.left = this.x + "px"
        this.graphic_link.style.top = this.y + "px"
        this.graphic_link.style.width = this.width + "px"
        this.graphic_link.style.height = this.height + "px"

        console.log(this.x, this.y)
    }

    /**
     * Set the position of the jobj with proper offset and string format
     * @param {number} x 
     * @param {number} y 
     */
    move(x = null, y = null) {
        if (x !== null) this.x = x
        if (y !== null) this.y = y

        this.graphic_link.style.left = this.x + "px"
        this.graphic_link.style.top = this.y + "px"
    }

    do_collide_resolve(other = null) {
        if (other === null) return

        const x_col = this.x + this.width > other.x && this.x < other.x + other.width
        const y_col = this.y + this.height > other.y && this.y < other.y + other.height

        if (y_col) {
            if (this.x + this.width > other.x) {
                this.x = other.x 
            }
        }



        // if (this.y + this.height > other.y) {
        //     this.y += this.y_speed
        // }



        // if (this.y < other.y + other.height) {
        //     this.y += this.y_speed
        // }
    }

    to_string() {
        return JSON.stringify(this)
    }
}

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


