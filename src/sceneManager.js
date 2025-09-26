import {Node, Tilemap, load, Vector2, CollisionBox} from "./base/joaoEngine.js"
import tileset from "./tileset.js"

const sceneManager = new Node()

sceneManager.world = await load("assets/tilemaps/mundo.world")
sceneManager.tilemaps = []
for(let i = 0; i < sceneManager.world.maps.length; i++){
	const tilemapJSON = await load("assets/tilemaps/"+sceneManager.world.maps[i].fileName)
	const tilemap = new Tilemap(tileset, tilemapJSON, true)
	tilemap.pos.x = sceneManager.world.maps[i].x
	tilemap.pos.y = sceneManager.world.maps[i].y
	tilemap.width = sceneManager.world.maps[i].width
	tilemap.height = sceneManager.world.maps[i].height
	sceneManager.tilemaps.push(tilemap)
}
sceneManager.add(sceneManager.tilemaps[0])
sceneManager.cameraBounds = {
	xMin: sceneManager.children[0].pos.x,
	yMin: sceneManager.children[0].pos.y,
	xMax: sceneManager.children[0].pos.x + sceneManager.children[0].width - 256,
	yMax: sceneManager.children[0].pos.y + sceneManager.children[0].height - 224
}
sceneManager.current = 0

sceneManager.player = null

sceneManager.original = sceneManager.update
console.log(sceneManager.tilemaps)

sceneManager.update = function(){
	this.original()

	//se não houver player definido, ignora
	if(!this.player)return

	//camera para seguir o player
	var target = new Vector2(this.canvas.width/2-this.player.pos.x-16, this.canvas.height/2-this.player.pos.y-22)
	this.pos = this.pos.add(target.sub(this.pos).scale(0.1))
	this.pos.x = Math.min(Math.max(this.pos.x, -this.cameraBounds.xMax), -this.cameraBounds.xMin)
	this.pos.y = Math.min(Math.max(this.pos.y, -this.cameraBounds.yMax), -this.cameraBounds.yMin)
	
	const currentScene = this.tilemaps[this.current]

	if(this.player.pos.y > currentScene.pos.y + currentScene.height){
		for(let tilemap in this.tilemaps){
			const box = new CollisionBox(tilemap.width, tilemap.height, tilemap.pos.x, tilemap.pos.y)
			if(this.player.children[1].intersects(box) && tilemap != currentScene) console.log("oi")
		}
	}
}


export default sceneManager
