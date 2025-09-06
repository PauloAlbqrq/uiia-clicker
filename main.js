import {Scene} from "./js/Scene.js"
import {Sprite} from "./js/Sprite.js"
import {TextSprite} from "./js/TextSprite.js"
import {Vector2} from "./js/utils.js"
import {Node} from "./js/Node.js"

/**class MainScene extends Scene{
	preload(){
		this.imageSources = {
			cat: "./sprites/cat.png",
			text: "./sprites/SMW.Monospace.png",
			map: "https://www.spriters-resource.com/media/assets/179/182049.png?updated=1755487190"
		}
	}
	create(){
		this.vel = new Vector2()
		this.sprites = {}

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
		this.cat = new Sprite(this.ctx, this.images.cat, grid, animation)
		this.sprites.cat = this.cat
		this.cat.frameDuration = 7

		this.sprites.texto = new TextSprite(this.ctx, this.images.text, "agr eu consigo animações e tal", new Vector2(10, 10))

		//sprites.map = new Sprite(ctx, images.map)
	}
	update(){
		this.sprites.cat.draw()
		this.sprites.texto.draw()


		this.vel.x = (this.input.keys["d"] - this.input.keys["a"])
		this.vel.y = (this.input.keys["s"] - this.input.keys["w"])
		this.cat.pos = this.cat.pos.add(this.vel)

		if(this.vel.x > 0) this.cat.play("walk_right")
		else if(this.vel.x < 0) this.cat.play("walk_left")
		else if(this.vel.y > 0) this.cat.play("walk_down")
		else if(this.vel.y < 0) this.cat.play("walk_up")
		if(this.vel.x == 0 && this.vel.y == 0) this.cat.play(Object.keys(this.cat.animations)[Object.keys(this.cat.animations).indexOf(this.cat.currentAnimation)-4])
		
		this.camera.follow(this.cat.pos.add(new Vector2(16, 25)))
	}
}

const mainScene = new MainScene()
mainScene.start()**/

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
ctx.imageSmoothingEnabled = false;

const root = new Node()
const catImage = new Image()
catImage.src = "./sprites/cat.png"
const cat = new Sprite(catImage)

function update(){
	cat.pos.x++

	cat.draw()

	requestAnimationFrame(update)
}
update()