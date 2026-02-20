import { jinput, jlevel, jloop, jobj, sign } from "./niko_system.js"



// const player = document.getElementById("player")
const game_area = document.getElementById("game_area")
const debug = document.getElementById("debug")

jloop.register_world(game_area)
jinput.init()

const level = new jlevel({
    x: "centered",
    y: "centered",
    width: 16,
    height: 16,
    tile_width: 32,
    tile_height: 32,
    keys: [
        {
            char: "#", object: new jobj({
                name: "wall",
                width: 32,
                height: 32,
            })
        },
        {
            char: "P", object: new jobj({
                name: "player",
                width: 32,
                height: 32,
                dynamic: true
            })
        }
    ],
    map: [
        "#".repeat(16),
        "#              #",
        "#              #",
        "#              #",
        "#              #",
        "#              #",
        "#              #",
        "#              #",
        "#              #",
        "#              #",
        "#              #",
        "#              #",
        "#              #",
        "#              #",
        "#     P        #",
        "#".repeat(16),

    ]
})

const player = level.find("player")

level.spawn()

let mouse_x = 0
let mouse_y = 0

const key_events = []
const max_acc = 8
const acc_modifier = 5;
const gravity = 2.5
const friction = 0.4
const jump_force = 35

jloop.add(() => {
    let movedir = undefined

    if (jinput.probe("d", jinput.KEYHELD)) {
        movedir = 1
    }

    if (jinput.probe("a", jinput.KEYHELD)) {
        movedir = -1
    }

    if (movedir && movedir == 1) {
        player.x_speed += acc_modifier
    }

    if (movedir && movedir == -1) {
        player.x_speed -= acc_modifier

    }

    if (movedir !== undefined) {
        if (player.x_speed > max_acc) {
            player.x_speed = max_acc
        }

        if (player.x_speed < -max_acc) {
            player.x_speed = -max_acc
        }
    } else {
        player.x_speed += (acc_modifier * -sign(player.x_speed)) * friction

        if (player.x_speed < 0.2 && player.x_speed > -0.2) {
            player.x_speed = 0
        }
    }

    if (jinput.probe(" ", jinput.KEYHELD) && player.grounded) {
        player.y_speed = -jump_force
    }

    player.x += player.x_speed

    player.y_speed += gravity
    player.y += player.y_speed

    level.move_and_collide()
})

jloop.update()