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
     * @param {number} x_offset the x offset in graphic
     * @param {number} y_offset the y offset in graphic
     * @param {number} width width of the graphic
     * @param {number} height height of the graphic
     * @param {number} col_x the x offset from the origin of the collider
     * @param {number} col_y the y offset from the origin
     * @param {number} col_width width of the collider
     * @param {number} col_height height of the collider
     */
    constructor(
        name = null,
        x = null,
        y = null,
        x_offset = null,
        y_offset = null,
        width = null,
        height = null,
        col_x = null,
        col_y = null,
        col_width = null,
        col_height = null
    ) {
        if (name !== null) this.name = name

        if (x !== null) this.x = x
        if (y !== null) this.y = y

        if (x_offset !== null) this.x_offset = x_offset
        if (y_offset !== null) this.y_offset = y_offset

        if (width !== null) this.width = width
        if (height !== null) this.height = height

        if (col_x !== null) this.col_x = col_x
        if (col_y !== null) this.col_y = col_y
        if (col_width !== null) this.col_width = col_width
        if (col_height !== null) this.col_height = col_height

        this.origin = document.createElement("div")
        this.origin.style.width = "4px"
        this.origin.style.height = "4px"
        this.origin.x = (this.x - this.x_offset) + "px"
        this.origin.y = (this.y - this.y_offset) + "px"

        this.graphic_link = document.createElement("div")
        this.graphic_link.id = name
        this.graphic_link.style.left = this.origin.x
        this.graphic_link.style.top = this.origin.y
        this.graphic_link.style.width = this.width + "px"
        this.graphic_link.style.height = this.height + "px"
    }

    /**
     * Set the position of the jobj with proper offset and string format
     * @param {number} x 
     * @param {number} y 
     */
    move(x = null, y = null) {
        if (x !== null) this.x = x
        if (y !== null) this.y = y

        this.origin.x = (this.x - this.x_offset) + "px"
        this.origin.y = (this.y - this.y_offset) + "px"

        this.graphic_link.style.left = this.origin.x
        this.graphic_link.style.top = this.origin.y
    }

    do_collide_with(other = null, action = null) {
        const this_left = (this.x - this.x_offset) + this.col_x
        const this_top = (this.y - this.y_offset) + this.col_y
        const this_right = this_left + this.col_width
        const this_botton = this_top + this.col_height

        const other_left = (other.x - other.x_offset) + other.col_x
        const other_top = (other.y - other.y_offset) + other.col_y
        const other_right = other_left + other.col_width
        const other_botton = other_top + other.col_height

        if (this_left < other_right && this_right > other_left &&
            this_top < other_botton && this_botton > other_top) {
            action(other)
        }
    }

    do_collide_resolve(other = null) {
        const this_left = (this.x - this.x_offset) + this.col_x
        const this_top = (this.y - this.y_offset) + this.col_y
        const this_right = this_left + this.col_width
        const this_botton = this_top + this.col_height

        const other_left = (other.x - other.x_offset) + other.col_x
        const other_top = (other.y - other.y_offset) + other.col_y
        const other_right = other_left + other.col_width
        const other_botton = other_top + other.col_height

        if (this_left < other_right && this_right > other_left &&
            this_top < other_botton && this_botton > other_top) {
            return false
        }

        const penetrarion_left = other_right - this_left
        const penetration_right = this_right - other_left
        const penetration_top = other_botton - this_top
        const penetration_botton = this_botton - other_top

        const min_penetration_x = Math.min(penetrarion_left, penetration_right)
        const min_penetration_y = Math.min(penetration_top, penetration_botton)

        if (min_penetration_x < min_penetration_y) {
            if (penetrarion_left < penetration_right) {
                this.x = other_left - this.col_x - this.col_width + this.x_offset
            } else {
                this.x = other_right - this.col_x + this.x_offset
            }

            this.x_speed = 0
        } else {
            if (penetration_top < penetration_botton) {
                this.y = other_top - this.col_y - this.col_height + this.y_offset
            } else {
                this.y = other_botton - this.col_y - this.col_height + this.y_offset
                this.grounded = true
            }

            this.y_speed = 0
        }

        return true
    }

    to_string() {
        return JSON.stringify(this)
    }

    debug_print_origin() {

    }
}

export function sign(value) {
    if (value === 0) return 0
    else if (value > 0) return 1
    else if (value < 0) return -1

    return 0
}