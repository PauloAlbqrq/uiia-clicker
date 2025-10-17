import {Node, Tilemap, Tileset, load, Vector2, CollisionBox} from "../base/joaoEngine.js"
import updateCamera from "./camera.js"
import loadWorld from "./sceneLoader.js"
import handleTransitions from "./transition.js"

const sceneManager = new Node()

sceneManager.fadeDelay = 30
sceneManager.cooldown = 0  //para impedir o player de ficar indo e voltando toda hora

sceneManager.addRoom = function(index){
	for(let layer of this.tilemaps[index].children) this.add(layer)
	this.previous = this.current
	this.current = index
	this.cameraBounds = {
		xMin: this.tilemaps[index].worldX,
		yMin: this.tilemaps[index].worldY,
		xMax: this.tilemaps[index].worldX + this.tilemaps[index].width - 256,
		yMax: this.tilemaps[index].worldY + this.tilemaps[index].height - 224
	}
}

//carrega o mundo e adiciona a primeira sala
Object.assign(sceneManager, await loadWorld())
sceneManager.addRoom(0)

sceneManager.original = sceneManager.update
sceneManager.drawOriginal = sceneManager.draw

sceneManager.update = function(){
	this.original()

	this.children.sort((a, b) => a.z - b.z)

	//se não houver player definido, ignora
	if(!this.player)return

	updateCamera(this)
	handleTransitions(this)
}


export default sceneManager
