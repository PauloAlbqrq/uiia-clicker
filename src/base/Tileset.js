import Node from "./Node.js"
import Sprite from "./Sprite.js"

export default class Tileset extends Node{
    constructor(image){
        super()
        this.image = image
        this.tileWidth = 16
        this.tileHeight = 16
        this.gridX = Math.floor(this.image.width/this.tileWidth)
        this.gridY = Math.floor(this.image.height/this.tileHeight)

        for(var y = 0; y < this.gridY; y++){
            for(var x = 0; x < this.gridX; x++){
                const sprite = new Sprite(this.image, this.gridX, this.gridY,{"idle": [[x, y]]})
                this.children.push(sprite)
            }
        }
    }
}
