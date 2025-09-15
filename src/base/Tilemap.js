import Node from "./Node.js";

export default class extends Node{
    constructor(tileset, tilemap, layer = 0){
        super()
        this.tileset = tileset
        this.tilemap = tilemap.layers[layer]

        this.data = this.tilemap.data
        this.width = this.tilemap.width
        this.height = this.tilemap.height

        for(let y = 0; y < this.height; y++){
            for(let x = 0; x < this.width; x++){
                const index = this.data[y * this.width + x] - 1
                const tile = this.tileset.children[index].clone()
                tile.pos.x = x * this.tileset.tileWidth
                tile.pos.y = y * this.tileset.tileHeight
                this.add(tile)
            }
        }
    }
}