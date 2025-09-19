import Node from "./Node.js";

export default class extends Node{
    constructor(tileset, tilemap, layer = 0, fixed = false){
        super()
        this.tileset = tileset
        this.tilemap = tilemap.layers[layer]

        this.data = this.tilemap.data
        this.width = this.tilemap.width
        this.height = this.tilemap.height

	this.bufferCanvas = document.createElement("canvas")
	this.bufferCanvas.width = this.width * this.tileset.tileWidth
	this.bufferCanvas.height = this.height * this.tileset.tileHeight
	this.bufferCtx = this.bufferCanvas.getContext("2d")
	this.fixed = fixed

        for(let y = 0; y < this.height; y++){
            for(let x = 0; x < this.width; x++){
                const index = this.data[y * this.width + x] - 1
		if(index < 0) continue
                const tile = this.tileset.children[index].clone()
                tile.pos.x = x * this.tileset.tileWidth
                tile.pos.y = y * this.tileset.tileHeight
                this.add(tile)
            }
        }
	
	if(this.fixed) super.draw(this.bufferCtx)
	
    }
	draw(ctx){
		if(!this.fixed){
			super.draw(ctx)
			return
		}
		ctx.drawImage(this.bufferCanvas, 0, 0)
	}
}
