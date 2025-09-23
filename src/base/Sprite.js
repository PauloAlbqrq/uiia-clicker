import {Vector2} from './Utils.js'
import Node from './Node.js'

export default class Sprite extends Node{
	constructor(image, gridX = 1, gridY = 1,
		animations = {"idle": [[0, 0]]}){
		super()

		this.image = image
	
		this.grid = new Vector2(gridX, gridY)

		this.animations = animations
		this.currentAnimation = Object.keys(animations)[0]
		this.frameIndex = 0
		this.elapsedTime = 0
		this.frameDuration = 5
		
		this.frameWidth = this.image.width / this.grid.x
		this.frameHeight = this.image.height / this.grid.y
		this.frameSources = {};
		for (const [name, frames] of Object.entries(this.animations)) {
		    if (!Array.isArray(frames)) {
			throw new Error(`Animation "${name}" must be an array of [col,row] frames`);
		    }
		    this.frameSources[name] = frames.map(([col, row]) => ({
			x: col * this.frameWidth,
			y: row * this.frameHeight
		    }));
		}
		}
	play(name){
		if (this.animations[name] && 
			this.currentAnimation !== name){
			this.currentAnimation = name;
			this.frameIndex = 0;
			this.elapsedTime = 0;
		}
	}
	render(ctx){
		
		const frame = this.frameSources[this.currentAnimation][this.frameIndex];

		ctx.drawImage(
		this.image,
		frame.x, frame.y, this.frameWidth, this.frameHeight,
		0, 0,
		this.frameWidth, this.frameHeight)
	}
	update(){
		super.update()

		const frames = this.frameSources[this.currentAnimation];

		this.elapsedTime++
		if(this.elapsedTime >= this.frameDuration){
			this.frameIndex++
			this.elapsedTime -= this.frameDuration
		}
		if(this.frameIndex >= frames.length) this.frameIndex = 0
	}
}
