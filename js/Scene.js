import {Sprite} from "./Sprite.js"
import {TextSprite} from "./TextSprite.js"
import {Vector2, resizeCanvas, Input} from "./utils.js"
import {Camera} from "./Camera.js"
export class Scene{
	constructor(canvas = document.getElementById("canvas")){
		this.canvas = canvas
		this.ctx = canvas.getContext("2d")

		window.addEventListener("resize", resizeCanvas);
		resizeCanvas();

		this.input = new Input()

		this.imageSources = {}
		this.images = {}
		
		this.camera = new Camera()
	}
	preload(){
		//override
	}
	create(){
		//override
	}
	update(){
		//override
	}
	
	start(){
		this.preload()
		var loadedImages = 0
		const totalImages = Object.keys(this.imageSources).length

		for (let key in this.imageSources){
			this.images[key] = new Image()
			this.images[key].src = this.imageSources[key]
			this.images[key].onload = () => {
				loadedImages++
				if (loadedImages === totalImages){
					this.startLoop()
				}
			}
		}
	}

	startLoop(){
		this.create()
		this.loop()
	}
	loop(){
		this.ctx.fillStyle = "white"
		this.ctx.fillRect(0, 0, canvas.width, canvas.height)

		this.ctx.save()
		this.ctx.translate(this.canvas.width / 2 - this.camera.pos.x,
			this.canvas.height / 2 - this.camera.pos.y)

		this.update()

		this.ctx.restore()

		requestAnimationFrame(this.loop.bind(this))
	}
}
