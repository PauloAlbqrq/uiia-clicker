import {Vector2} from './Utils.js'
import Node from './Node.js'

export default class Sprite extends Node{
	constructor(image,
		grid = new Vector2(1, 1), 
		animations = {"idle": [[0, 0]]}){
		super()

		this.image = image
	
		this.grid = grid

		this.animations = animations
		this.currentAnimation = Object.keys(animations)[0]
		this.frameIndex = 0
		this.elapsedTime = 0
		this.frameDuration = 50
		
		this.frameWidth = this.image.width / this.grid.x
		this.frameHeight = this.image.height / this.grid.y
	}
	play(name){
		if (this.animations[name] && 
			this.currentAnimation !== name){
			this.currentAnimation = name;
			this.frameIndex = 0;
			this.elapsedTime = 0;
		}
	}
	render(){
		this.frameWidth = this.image.width / this.grid.x
		this.frameHeight = this.image.height / this.grid.y
		
		const frames = this.animations[this.currentAnimation]

		const [col, row] = frames[this.frameIndex]

		const s = new Vector2(col * this.frameWidth,
					row * this.frameHeight)

		this.ctx.drawImage(
		this.image,
		s.x, s.y, this.frameWidth, this.frameHeight,
		0, 0,
		this.frameWidth, this.frameHeight)
	}
	update(){
		super.update()

		const frames = this.animations[this.currentAnimation]

		this.elapsedTime++
		if(this.elapsedTime >= this.frameDuration){
			this.frameIndex++
			this.elapsedTime = 0
		}
		if(this.frameIndex >= frames.length) this.frameIndex = 0
	}
}
