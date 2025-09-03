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

const imageSources = {
	cat: "./sprites/cat.png",
	text: "./sprites/SMW.Monospace.png"
}

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

	var pos = new Vector2()
	var vel = new Vector2()

	const grid = new Vector2()
	const sprite = new Sprite(ctx, images.cat)

	//const texto = new TextSprite(ctx)
	requestAnimationFrame(draw)
} 

function draw() {
	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	sprite.draw()

	vel.x = (input.keys["d"] - input.keys["a"])
	vel.y = (input.keys["s"] - input.keys["w"])
	pos = pos.add(vel)

	requestAnimationFrame(draw)
}
