let data_player = {
    x: 0,
    y: 0,
    offset_x: -16,
    offset_y: -16,
    width: 32,
    height: 32
}

const player = document.getElementById("player")
const play_area = document.getElementById("game_area")

player.style.width = data_player.width + "px"
player.style.height = data_player.height + "px"
player.style.left = data_player.x
player.style.top = data_player.y

let mouse_x = 0
let mouse_y = 0
let acc_y = 0
let gravity = 0.7

document.addEventListener("mousemove", (e) => {
    mouse_x = e.pageX
    mouse_y = e.pageY
})

setInterval(() => {
        data_player.x = window.width / 2
        acc_y += gravity
        data_player.y += acc_y

        if(data_player.y + data_player.height > document.height) {
            acc_y = 0
            data_player.y = window.height - data_player.height 
        }

        player.style.left = data_player.x + "px"
        player.style.top = data_player.y + "px"
}, 10)
