import Node from "./Node.js"
import Sprite from "./Sprite.js"
import StaticBody from "./StaticBody.js"
import CollisionBox from "./CollisionBox.js"

export default class Tileset extends Node{
    constructor(tilesetsData){
        super()
        this.images = []
	this.tsxs = []
        this.tileWidth = 16
        this.tileHeight = 16

	this.GIDs = {}
	let nextGID = 1
	//preenche os atributos internos com os dados do tilesetsData
	for(const { tsx, image } of tilesetsData){
		this.images.push(image)
		const tilesetElem = tsx.querySelector("tileset")
		const tilecount = parseInt(tilesetElem.getAttribute("tilecount"))
		const tilesetName = tilesetElem.getAttribute("name")

		this.tsxs[tilesetName+".tsx"] = tsx
		this.GIDs[tilesetName+".tsx"] = nextGID
		nextGID += tilecount
	}

	//cria um sprite para cada tile
	for(let image of this.images){
		this.gridX = Math.floor(image.width/this.tileWidth)
		this.gridY = Math.floor(image.height/this.tileHeight)
		for(var y = 0; y < this.gridY; y++){
		    for(var x = 0; x < this.gridX; x++){
			const sprite = new Sprite(image, this.gridX, this.gridY,{"idle": [[x, y]]})
			this.children.push(sprite)
		    }
		}
	}
	//cria um objeto com colisão para cada tile com colisão ,;,w,;,
	for(const key in this.tsxs){
		const tsx = this.tsxs[key]
		const GID = this.GIDs[key]
		const tiles = tsx.querySelectorAll("tile")
		tiles.forEach(tile => {
			const tileId = Number(tile.getAttribute("id"))
			const id = tileId + GID - 1
			const block = new StaticBody()
			const sprite = this.children[id].clone()
			block.add(sprite)
			const objectGroups = tile.querySelectorAll("objectgroup")
			objectGroups.forEach(group => {
				const groupId = group.getAttribute("id")
				const objects = group.querySelectorAll("object")
				objects.forEach(obj => {
					const id = Number(obj.getAttribute("id"))
					const x = Number(obj.getAttribute("x"))
					const y = Number(obj.getAttribute("y"))
					const width = Number(obj.getAttribute("width"))
					const height = Number(obj.getAttribute("height"))
					const box = new CollisionBox(width, height, x, y)
					box.debug = true
					block.add(box)
				})
			})
			block.parent = this
			this.children[id] = block
		})
	}
    }
}
