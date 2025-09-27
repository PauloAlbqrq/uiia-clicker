import {Node, Tilemap, load, Vector2, CollisionBox} from "./base/joaoEngine.js"
import {TilemapLayer} from "./base/Tilemap.js"
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
sceneManager.current = 0
sceneManager.cameraBounds = {
	xMin: sceneManager.tilemaps[0].pos.x,
	yMin: sceneManager.tilemaps[0].pos.y,
	xMax: sceneManager.tilemaps[0].pos.x + sceneManager.tilemaps[0].width - 256,
	yMax: sceneManager.tilemaps[0].pos.y + sceneManager.tilemaps[0].height - 224
}
const toTransfer = sceneManager.tilemaps[sceneManager.current].children.filter(child => !(child instanceof TilemapLayer))
for(const child of toTransfer) sceneManager.tilemaps[sceneManager.current].add(toTransfer(child))

sceneManager.player = null
sceneManager.playerVel = new Vector2()
sceneManager.cooldown = 0  //para impedir o player de ficar indo e voltando toda hora

sceneManager.original = sceneManager.update

sceneManager.update = function(){
	this.original()

	//se não houver player definido, ignora
	if(!this.player)return

	//camera para seguir o player
	var target = new Vector2(
		this.canvas.width/2-this.player.pos.x-16, 
		this.canvas.height/2-this.player.pos.y-22
	)
	target.x = Math.min(Math.max(target.x, -this.cameraBounds.xMax), -this.cameraBounds.xMin)
	target.y = Math.min(Math.max(target.y, -this.cameraBounds.yMax), -this.cameraBounds.yMin)
	this.pos = this.pos.add(target.sub(this.pos).scale(0.1))
	
	const currentScene = this.tilemaps[this.current]

	//área de colisão do player
	const box = {
		"x": this.player.pos.x + this.player.children[1].offsetX,
		"y": this.player.pos.y + this.player.children[1].offsetY,
		"width": this.player.children[1].width,
		"height": this.player.children[1].height
	}
	var corner = new Vector2()
	if(box.y + box.height > currentScene.pos.y + currentScene.height) corner.y = 1
	if(box.y < currentScene.pos.y) corner.y = -1

	if(this.cooldown){
		this.cooldown -= 1
		if(corner.x || corner.y)this.player.vel.set(this.playerVel.x, this.playerVel.y)
		if(this.cooldown <= 0){
			this.cooldown = 0
			this.children.shift()
		}
		return
	}

	//vai primeiro detectar se o jogador tocou na borda da sala (lá ele)
	if(corner.x || corner.y){
		//então ele vai verificar cada sala para detectar se o jogador entrou em alguma
		for(let x in this.tilemaps){
			const tilemap = this.tilemaps[x]
			const isColliding = (box.x < tilemap.pos.x + tilemap.width &&
					box.x + box.width > tilemap.pos.x &&
					box.y < tilemap.pos.y + tilemap.height &&
					box.y + box.height > tilemap.pos.y)

			//se o jogador entrou em alguma sala, vai iniciar a transição
			if(isColliding && this.tilemaps[x] != currentScene){
				this.playerVel.set(corner.x, corner.y)
				this.cooldown = 60
				this.current = x
				this.addAt(this.tilemaps[this.current], 1)
				const toTransfer = this.tilemaps[this.current].children.filter(child => !(child instanceof TilemapLayer))
				sceneManager.cameraBounds = {
				xMin: sceneManager.tilemaps[this.current].pos.x,
				yMin: sceneManager.tilemaps[this.current].pos.y,
				xMax: sceneManager.tilemaps[this.current].pos.x + sceneManager.tilemaps[this.current].width - 256,
				yMax: sceneManager.tilemaps[this.current].pos.y + sceneManager.tilemaps[this.current].height - 224
				
				}
			}
		}
	}
}


export default sceneManager
