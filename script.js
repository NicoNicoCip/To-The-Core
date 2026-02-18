import { jloop, jobj, sign } from "./game_object.js"


// const player = document.getElementById("player")
const game_area = document.getElementById("game_area")
const debug = document.getElementById("debug")
const game_rect = game_area.getBoundingClientRect()

const player = new jobj(
    "player",
    game_rect.x + game_rect.width / 2, game_rect.y + game_rect.height - 32,
    32, 32,
)

const ground = new jobj(
    "ground",
    game_rect.x + 0, game_rect.y + 480,
    640, 32,
)

game_area.appendChild(player.graphic_link)
game_area.appendChild(ground.graphic_link)

let mouse_x = 0
let mouse_y = 0

const key_events = []
const max_acc = 5
const acc_modifier = 2;
const gravity = 1
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

jloop.add(() => {
    if (key_events.length != 0) {
        if (key_events.indexOf("d") != -1) {
            player.x_speed = acc_modifier
        }

        if (key_events.indexOf("a") != -1) {
            player.x_speed = -acc_modifier
        }

        if (key_events.indexOf("w") != -1) {
            player.y_speed = -acc_modifier
        }

        if (key_events.indexOf("s") != -1) {
            player.y_speed = acc_modifier
        }
    } else {
        player.x_speed = 0
        player.y_speed = 0
    }

    player.do_collide_resolve(ground)

    player.x += player.x_speed
    player.y += player.y_speed

    // if (!player.grounded) {
    //     player.y_speed += gravity
    //     player.y += player.y_speed
    // }

    
    player.move()


    debug.innerHTML = /*html*/`<div>${player.to_string("XXXXX", "XXXXX\n")}</div>`
})
jloop.start_update(60)
