import Node from "./Node.js"
import Sprite from "./Sprite.js"

export default class Tileset extends Node{
    constructor(...images){
        super()
        this.images = images
        this.tileWidth = 16
        this.tileHeight = 16

	this.GIDs = {
		"Overworld.tsx": 1,
		"Inner.tsx": 1441
	}
	for(let image of images){
		this.gridX = Math.floor(image.width/this.tileWidth)
		this.gridY = Math.floor(image.height/this.tileHeight)
		for(var y = 0; y < this.gridY; y++){
		    for(var x = 0; x < this.gridX; x++){
			const sprite = new Sprite(image, this.gridX, this.gridY,{"idle": [[x, y]]})
			this.children.push(sprite)
		    }
		}
	}
    }
}
