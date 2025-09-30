import Node from "./Node.js";

class TilemapLayer extends Node{
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

    this.GIDs = this.extractGIDs(tilemap)

        for(let y = 0; y < this.height; y++){
            for(let x = 0; x < this.width; x++){
                const localIndex = this.data[y * this.width + x]
		    if(localIndex <= 0) continue
                const index = this.convertGID(localIndex, this.tileset.GIDs, this.GIDs) - 1
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
		ctx.drawImage(this.bufferCanvas, this.pos.x, this.pos.y)
	}
    extractGIDs(mapJson) {
        const gidMap = {};
        for (const tileset of mapJson.tilesets) {
            // extract only the filename, not the full path
            const filename = tileset.source.split("/").pop();
            gidMap[filename] = tileset.firstgid;
        }
        return gidMap;
    }
    convertGID(num, dictA, dictB) {
        for (const key in dictB) {
            const startB = dictB[key];
            const startA = dictA[key];
            const offset = num - startB;

            if (offset >= 0) {
            // find the next boundary in dictB (if any)
            const nextStarts = Object.values(dictB).filter(v => v > startB);
            const nextBoundary = nextStarts.length > 0 ? Math.min(...nextStarts) : Infinity;

            if (num < nextBoundary) {
                return startA + offset;
            }
            }
        }
        throw new Error(`Number ${num} does not belong to any range in dictB`);
    }
}

class Tilemap extends Node{
    constructor(tileset, tilemap, fixed = false){
        super()
        this.tileset = tileset
        this.tilemap = tilemap
        this.fixed = fixed
        this.objects = []

	var z = 0
        for(let i in tilemap.layers){
        if(tilemap.layers[i].type == "objectgroup") this.objects.push(tilemap.layers[i])
	    if(tilemap.layers[i].type != "tilelayer") continue
            const newLayer = new TilemapLayer(this.tileset, this.tilemap, i, this.fixed)
            newLayer.z = z
            this.add(newLayer)
 	    z++
        }
    }
}

export default Tilemap
export {Tilemap, TilemapLayer}
