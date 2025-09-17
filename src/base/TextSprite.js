import {Vector2} from './Utils.js'
import Node from './Node.js'
export default class TextSprite extends Node{
	constructor(image, text){
		super()

		this.fontImage = image
		this.chars = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~∎ÄÖÜäöüßàáãèéēìíīòóõőùúūűçčćšđžñÑë→↑←↓↔≈²³"
		this.charWidth = 8
		this.charHeight = 11
		this.charsPerRow = 16
		this.text = text
		
		this.animated = false
		this.currentChar = 0
		this.elapsedTime = 0
		this.frameDuration = 3
	}
	update(){
		super.update()
		if(!this.animated){
			this.currentChar = this.text.length
			return;
		}
		this.elapsedTime++
		if(this.elapsedTime >= this.frameDuration &&
		this.currentChar < this.text.length) {
			this.currentChar++
			this.elapsedTime -= this.frameDuration
		}
	}	
	render(ctx){
		let x = 0
		let y = 0
		for(let i = 0; i < this.currentChar; i++){
			const char = this.text[i]

			if (char === "\n") {
				x = 0
				y += this.charHeight
				continue
			}

			const index = this.chars.indexOf(char)
			if (index === -1) continue;

			const sx = (index % this.charsPerRow) * this.charWidth
			const sy = Math.floor(index / this.charsPerRow) * this.charHeight
			ctx.drawImage(
				this.fontImage,
				sx, sy,
				this.charWidth, this.charHeight,
				x, y,
				this.charWidth, this.charHeight
			)
			x += this.charWidth
		}
	}
}

