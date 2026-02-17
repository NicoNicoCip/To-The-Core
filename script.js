let data_player = {
    x: 0,
    y: 0,
    offset_x: 0,
    offset_y: 0,
    width: 32,
    height: 32,
    acc_y: 0,
    acc_x: 0,
    grounded: false
}

const player = document.getElementById("player")
const game_area = document.getElementById("game_area")
const debug = document.getElementById("debug")
const game_rect = game_area.getBoundingClientRect()

let last_update = performance.now()

player.style.width = data_player.width + "px"
player.style.height = data_player.height + "px"
player.style.left = game_rect.width / 2
player.style.top = data_player.y

let mouse_x = 0
let mouse_y = 0
let delta = 0

const key_events = []
const max_acc_x = 30
const vertical_acc_modifier = 24;
const gravity = 9.8 * 4
const friction = 300
const jump_force = 15


document.addEventListener("mousemove", (e) => {
    mouse_x = e.pageX
    mouse_y = e.pageY
})

window.addEventListener("keypress", (e) => {
    if (key_events.indexOf(e.key) == -1) {
        key_events.push(e.key)
    }
})

window.addEventListener("keyup", (e) => {
    let index = key_events.indexOf(e.key)
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
            data_player.acc_x += vertical_acc_modifier * delta
        }

        if (key_events.indexOf("a") != -1) {
            data_player.acc_x -= vertical_acc_modifier * delta
        }

        if (key_events.indexOf(" ") != -1 && data_player.grounded === true) {
            data_player.acc_y = -jump_force
        }

        if (data_player.acc_x > max_acc_x) {
            data_player.acc_x = max_acc_x
        }

        if (data_player.acc_x < -max_acc_x) {
            data_player.acc_x = -max_acc_x
        }
    } else {
        data_player.acc_x += ((vertical_acc_modifier * delta) * -sign(data_player.acc_x)) * friction * delta

        if (data_player.acc_x < 0.2 && data_player.acc_x > -0.2) {
            data_player.acc_x = 0
        }
    }

    data_player.x += data_player.acc_x

    data_player.acc_y += gravity * delta
    data_player.y += data_player.acc_y

    if (data_player.y + data_player.height > game_rect.height - 1) {
        data_player.acc_y = 0
        data_player.y = game_rect.height - data_player.height - 1
        data_player.grounded = true
    } else {
        data_player.grounded = false
    }

    if (data_player.x + data_player.width > game_rect.width) {
        data_player.acc_x = 0
        data_player.x = game_rect.width - data_player.width
    }

    if (data_player.x < 0) {
        data_player.acc_x = 0
        data_player.x = 0
    }



    player.style.left = data_player.x + "px"
    player.style.top = data_player.y + "px"
}

function update() {
    run()
    requestAnimationFrame(update)
}

function sign(value) {
    if (value === 0) return 0
    else if (value > 0) return 1
    else if (value < 0) return -1

    return 0
}

update()