export class TextSprite{
	constructor(ctx, image){
		this.fontImage = image
		this.chars = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~∎ÄÖÜäöüßàáāèéēìíīòóōőùúūűçčćšđžñÑë→↑←↓↔≈²³"
		this.charWidth = 8
		this.charHeight = 11
		this.charsPerRow = 16
		this.ctx = ctx

	}
	draw(text, x, y){
		for(let i = 0; i < text.length; i++){
			const char = text[i]
			const index = this.chars.indexOf(char)
			if (index === -1) continue;

			const sx = (index % this.charsPerRow) * this.charWidth
			const sy = Math.floor(index / this.charsPerRow) * this.charHeight

			this.ctx.drawImage(
				this.fontImage,
				sx, sy,
				this.charWidth, this.charHeight,
				x + i * this.charWidth, y,
				this.charWidth, this.charHeight
			)
		}
	}
}

