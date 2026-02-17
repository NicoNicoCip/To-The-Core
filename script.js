import { jobj } from "./game_object.js"


// const player = document.getElementById("player")
const game_area = document.getElementById("game_area")
const debug = document.getElementById("debug")
const game_rect = game_area.getBoundingClientRect()

let last_update = performance.now()

const player = new jobj(
    "player",
    game_rect.width / 2, game_rect.height - 32,
    0, 0,
    32, 32,
    0, 0,
    32, 32
)

const ground = new jobj(
    "ground",
    game_rect.width / 2, game_rect.height / 2,
    320, 16,
    640, 32,
    0, 0,
    640, 32
)

game_area.appendChild(player.graphic_link)
game_area.appendChild(ground.graphic_link)

player.grounded = false;

let mouse_x = 0
let mouse_y = 0
let delta = 0

const key_events = []
const max_acc_x = 5
const vertical_acc_modifier = 100;
const gravity = 9.8 * 4
const friction = 300
const jump_force = 10


document.addEventListener("mousemove", (e) => {
    mouse_x = e.pageX
    mouse_y = e.pageY
})

window.addEventListener("keypress", (e) => {
    if (key_events.indexOf(e.key.toLowerCase()) == -1) {
        key_events.push(e.key.toLowerCase())
    }
})

window.addEventListener("keyup", (e) => {
    let index = key_events.indexOf(e.key.toLowerCase())
    if (index != -1) {
        key_events.splice(index, 1)
    }
})

function run() {
    const now = performance.now()
    delta = (now - last_update) / 1000
    last_update = now

    if (key_events.length != 0) {
        if (key_events.indexOf("d") != -1) {
            player.x_speed += vertical_acc_modifier * delta
        }

        if (key_events.indexOf("a") != -1) {
            player.x_speed -= vertical_acc_modifier * delta
        }

        if (key_events.indexOf(" ") != -1 && player.grounded === true) {
            player.y_speed = -jump_force
        }

        if (player.x_speed > max_acc_x) {
            player.x_speed = max_acc_x
        }

        if (player.x_speed < -max_acc_x) {
            player.x_speed = -max_acc_x
        }
    } else {
        player.x_speed += ((vertical_acc_modifier * delta) * -sign(player.x_speed)) * friction * delta

        if (player.x_speed < 0.2 && player.x_speed > -0.2) {
            player.x_speed = 0
        }
    }

    player.x += player.x_speed

    player.y_speed += gravity * delta
    player.y += player.y_speed

    if (player.y + player.height > game_rect.height - 1) {
        player.y_speed = 0
        player.y = game_rect.height - player.height - 1
        player.grounded = true
    } else {
        player.grounded = false
    }

    if (player.x + player.width > game_rect.width) {
        player.x_speed = 0
        player.x = game_rect.width - player.width
    }

    if (player.x < 0) {
        player.x_speed = 0
        player.x = 0
    }

    player.move()
    debug.innerHTML = /*html*/`<div>${player.to_string("XXXXX", "XXXXX\n")}</div>`
    debug.innerHTML += /*html*/`<div>${player.do_collide_with(ground, () => {console.log("Colliding")})}</div>`
}

function update() {
    run()
    requestAnimationFrame(update)
}

update()