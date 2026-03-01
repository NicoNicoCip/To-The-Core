import { boil_the_plate, Player, Shaker } from "../../../src/prefabs.js"
import { bobj, cobj, game, level, obj } from "../../../src/system.js"

boil_the_plate()

const background1 = new bobj({ name: "background1" })
const background2 = new bobj({ name: "background2" })
const background2_transit = new bobj({ name: "background2_transit" })
const background3 = new bobj({ name: "background3" })

const midground0 = new bobj({ name: "midground_s1" })

const foreground0 = new bobj({ name: "scene_s1" })

const splash = new obj({ name: "splash", width: 180, height: 60 })
splash.graphic.innerHTML = `MADE BY:<br>MANEL<br>JOAN<br>NICO<br>
<br><br><br><br><br><br><br><br><br><br><br><br>
A Paper Wing Studio Production <br>
<br><br><br><br><br><br><br><br>
< DOG
`

let player = new Player(60, 50, true)

const lvl = new level({
    x: 0,
    y: 0,
    width: 32,
    height: 18,
    tile_width: 10,
    tile_height: 10,
    keys: [
        {
            char: "#", object: new cobj({
                name: "wall",
                width: 10,
                height: 10,
                shows_debug_col: true
            })
        },
        {
            char: "P", object: new cobj({
                name: "player",
                width: 10,
                height: 10,
                dynamic: true,
                shows_debug_col: true
            })
        },
        {
            char: "x", object: new cobj({
                name: "inviz_wall",
                width: 10,
                height: 10,
                shows_debug_col: true
            })
        }
    ],
    map: [
        "x                              x",
        "x                              x",
        "x                              x",
        "x                              x",
        "x                              x",
        "x     P                        x",
        "x                              x",
        "x                              x",
        "x                              x",
        "x                              x",
        "x                              x",
        "x                              x",
        "xxxxxxxxxxxxxxxxxxxxx          x",
        "xxxxxxxxxxxxxxxxxxxxx          x",
        "xxxxxxxxxxxxxxxxxxxxx          x",
        "xxxxxxxxxxxxxxxxxxxxx          x",
        "xxxxxxxxxxxxxxxxxxxxx          x",
        "xxxxxxxxxxxxxxxxxxxxx          x",
    ]
})

game.world.appendChild(background2.graphic)
game.world.appendChild(background1.graphic)
game.world.appendChild(splash.graphic)
game.world.appendChild(player.graphic)
game.world.appendChild(player.collider)

const shaker = new Shaker()

let timr = 0

splash.move(180, 200)
player.move(60, 449)

/*function intro() {

    if (input.probe("escape", input.KEYDOWN)) {
        if (background1.graphic.parentNode) {
            game.world.removeChild(background1.graphic)
        }

        if (background2.graphic.parentNode) {
            game.world.removeChild(background2.graphic)
        }

        if (splash.graphic.parentNode) {
            game.world.removeChild(splash.graphic)
        }

        if (background2_transit.graphic.parentNode) {
            game.world.removeChild(background2_transit.graphic)
        }
        game.world.appendChild(background3.graphic)
        game.world.appendChild(midground0.graphic)

        lvl.substitute("player", player)
        lvl.spawn()
        player.y_speed = player.max_gravity
        player.move(60, -17)

        game.world.appendChild(foreground0.graphic)

        game.remove(intro)
        game.method(player_move)
        timr = -1
    }

    if (timr == 0) {
        document.getElementById("fade").style.backgroundColor = "transparent"
        player.graphic.classList.add("falling")
    }

    if (timr > 0 && timr < 600) {

        if (timr < 600) {
            splash.shift(0, -1)
        }

        if (timr < 400) {
            player.shift(0, -1)
        }
    }

    if (timr == 550) {
        game.world.appendChild(background2_transit.graphic)
    }

    if (timr == 600) {
        game.world.removeChild(background1.graphic)
        game.world.removeChild(background2.graphic)
        game.world.removeChild(splash.graphic)
    }

    if (timr > 600 && timr < 778) {
        player.shift(0, - 0.4)
    }

    if (timr == 778) {

    }

    if (timr == 780) {
        
        timr = -1
    }
    timr++
}*/

game.world.appendChild(background3.graphic)
game.world.appendChild(midground0.graphic)

lvl.substitute("player", player)
lvl.spawn()
player.y_speed = player.max_gravity

game.world.appendChild(foreground0.graphic)


function player_move() {
    player.update()

    lvl.toggle_debug(player)

    if (player.just_landed && player.landing && player.landed_once) {
        shaker.shake(1, 20)
    }

    shaker.tick_shake()
    lvl.move_and_collide()

    if (player.y > 180) {
        //send_to("./s2.html")
    }
}

game.method(player_move)
game.update()