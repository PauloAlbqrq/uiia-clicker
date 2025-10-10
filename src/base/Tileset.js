import Node from "./Node.js"
import Sprite from "./Sprite.js"

export default class Tileset extends Node{
    constructor(tilesetsData){
        super()
        this.images = []
	this.tsxs = []
        this.tileWidth = 16
        this.tileHeight = 16

	this.GIDs = {}
	let nextGID = 1
	for(const { tsx, image } of tilesetsData){
		this.images.push(image)
		this.tsxs.push(tsx)

		const tilesetElem = tsx.querySelector("tileset")
		const tilecount = parseInt(tilesetElem.getAttribute("tilecount"))
		const tilesetName = tilesetElem.getAttribute("name")

		this.GIDs[tilesetName+".tsx"] = nextGID
		nextGID += tilecount
	}

	for(let image of this.images){
		console.log(image)
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
