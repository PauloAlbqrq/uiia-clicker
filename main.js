const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

import {Vector2} from './js/Vector2.js'
import {resizeCanvas} from './js/resizeCanvas.js'
import {TextSprite} from './js/TextSprite.js'
import {Input} from './js/Input.js'
import {Sprite} from './js/Sprite.js'

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); 

const input = new Input()

var pos = new Vector2()
var vel = new Vector2()

const grid = new Vector2()
const sprite = new Sprite("./sprites/cat.png")
var x = 0

const texto = new TextSprite(ctx)

function draw() {
	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	sprite.draw(ctx)

	vel.x = (input.keys["d"] - input.keys["a"])
	vel.y = (input.keys["s"] - input.keys["w"])
	pos = pos.add(vel)

	texto.draw("agora eu consigo escrever", 10, 10)
	texto.draw("uns texto igual snes", 10, 28)

	requestAnimationFrame(draw)
}
draw()
