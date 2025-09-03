import {Vector2} from './Vector2.js'

export class Sprite{
	constructor(ctx,
		image,
		grid = new Vector2(1, 1), 
		animations = {"idle": [[0, 0]]}){
		this.ctx = ctx

		this.image = image
	
		this.pos = new Vector2()
		this.grid = grid

		this.animations = animations
		this.currentAnimation = Object.keys(animations)[0]
		this.frameIndex = 0;
		this.elapsedTime = 0;
		this.frameDuration = 100;
		
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
	draw(){
		const frames = this.animations[this.currentAnimation]
		const [col, row] = frames[this.frameIndex]

		const s = new Vector2(col * this.frameWidth,
					row * this.frameHeight)

		this.ctx.drawImage(
		this.image,
		s.x, s.y, this.frameWidth, this.frameHeight,
		this.pos.x, this.pos.y,
		this.frameWidth, this.frameHeight)
	}
}
