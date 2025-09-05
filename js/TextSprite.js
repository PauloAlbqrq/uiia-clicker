import {Vector2} from './utils.js'
export class TextSprite{
	constructor(ctx, image, text, pos = new Vector2()){
		this.fontImage = image
		this.chars = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~∎ÄÖÜäöüßàáãèéēìíīòóõőùúūűçčćšđžñÑë→↑←↓↔≈²³"
		this.charWidth = 8
		this.charHeight = 11
		this.charsPerRow = 16
		this.ctx = ctx
		this.text = text
		this.pos = pos
	}
	draw(){
		for(let i = 0; i < this.text.length; i++){
			const char = this.text[i]
			const index = this.chars.indexOf(char)
			if (index === -1) continue;

			const sx = (index % this.charsPerRow) * this.charWidth
			const sy = Math.floor(index / this.charsPerRow) * this.charHeight

			this.ctx.drawImage(
				this.fontImage,
				sx, sy,
				this.charWidth, this.charHeight,
				this.pos.x + i * this.charWidth, this.pos.y,
				this.charWidth, this.charHeight
			)
		}
	}
}

