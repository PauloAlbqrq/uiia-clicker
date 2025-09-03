const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

import {TextSprite} from './js/TextSprite.js'
import {Sprite} from './js/Sprite.js'
import {Vector2, resizeCanvas, Input} from './js/utils.js'

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); 

const input = new Input()

const imageSources = {
	cat: "./sprites/cat.png",
	text: "./sprites/SMW.Monospace.png"
}

const sprites = {}
const vel = new Vector2()

const images = {}
var loadedImages = 0
const totalImages = Object.keys(imageSources).length

function loadImages(callback) {
	for (let key in imageSources){
		images[key] = new Image()
		images[key].src = imageSources[key]
		images[key].onload = () => {
			loadedImages++
			if (loadedImages === totalImages) {
				callback()
			}
		}
	}
}
loadImages(setup)

function setup(){
	const animation = {idle_down: [[0, 0]],
			idle_right: [[0, 1]],
			idle_up: [[0, 2]],
			idle_left: [[0, 3]],
			walk_down: [[0, 0], [1, 0], [2, 0], [3, 0]],
			walk_right: [[0, 1], [1, 1], [2, 1], [3, 1]],
			walk_up: [[0, 2], [1, 2], [2, 2], [3, 2]],
			walk_left: [[0, 3], [1, 3], [2, 3], [3, 3]],
			}
	const grid = new Vector2(4, 9)
	sprites.cat = new Sprite(ctx, images.cat, grid, animation)
	sprites.cat.frameDuration = 10

	sprites.texto = new TextSprite(ctx, images.text, "texto")

	requestAnimationFrame(draw)
} 

function draw() {
	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	sprites.cat.draw()
	sprites.texto.draw()

	vel.x = (input.keys["d"] - input.keys["a"])
	vel.y = (input.keys["s"] - input.keys["w"])
	sprites.cat.pos = sprites.cat.pos.add(vel)

	if(vel.x > 0) sprites.cat.play("walk_right")
	else if(vel.x < 0) sprites.cat.play("walk_left")
	else if(vel.y > 0) sprites.cat.play("walk_down")
	else if(vel.y < 0) sprites.cat.play("walk_up")
	if(vel.x == 0 && vel.y == 0) sprites.cat.play(Object.keys(sprites.cat.animations)[Object.keys(sprites.cat.animations).indexOf(sprites.cat.currentAnimation)-4])

	requestAnimationFrame(draw)
}
