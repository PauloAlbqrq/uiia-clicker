import {Node, Tilemap, load, Vector2, CollisionBox} from "./base/joaoEngine.js"
import {TilemapLayer} from "./base/Tilemap.js"
import tileset from "./tileset.js"

const sceneManager = new Node()

sceneManager.world = await load("assets/tilemaps/mundo.world")
sceneManager.tilemaps = []
for(let i = 0; i < sceneManager.world.maps.length; i++){
	const tilemapJSON = await load("assets/tilemaps/"+sceneManager.world.maps[i].fileName)
	const tilemap = new Tilemap(tileset, tilemapJSON, true)
	tilemap.posX = sceneManager.world.maps[i].x
	tilemap.posY = sceneManager.world.maps[i].y
	tilemap.width = sceneManager.world.maps[i].width
	tilemap.height = sceneManager.world.maps[i].height
	for(let layer of tilemap.children){
		layer.pos.x = sceneManager.world.maps[i].x
		layer.pos.y = sceneManager.world.maps[i].y
	}
	sceneManager.tilemaps.push(tilemap)
}
sceneManager.add(sceneManager.tilemaps[0])
sceneManager.current = 0
sceneManager.cameraBounds = {
	xMin: sceneManager.tilemaps[0].posX,
	yMin: sceneManager.tilemaps[0].posY,
	xMax: sceneManager.tilemaps[0].posX + sceneManager.tilemaps[0].width - 256,
	yMax: sceneManager.tilemaps[0].posY + sceneManager.tilemaps[0].height - 224
}

sceneManager.player = null
sceneManager.playerVel = new Vector2()
sceneManager.cooldown = 0  //para impedir o player de ficar indo e voltando toda hora

sceneManager.original = sceneManager.update

sceneManager.update = function(){
	this.original()

	const currentScene = this.tilemaps[this.current]

	const toTransfer = this.children.filter(child => !(child instanceof Tilemap))
	for(const child of toTransfer) {
		this.remove(child)
		currentScene.add(child)
	}
	currentScene.children.sort((a, b) => a.z - b.z)

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

	//área de colisão do player
	const box = {
		"x": this.player.pos.x + this.player.children[1].offsetX,
		"y": this.player.pos.y + this.player.children[1].offsetY,
		"width": this.player.children[1].width,
		"height": this.player.children[1].height
	}
	var corner = new Vector2()
	if(box.y + box.height > currentScene.posY + currentScene.height) corner.y = 1
	if(box.y < currentScene.posY) corner.y = -1
	if(box.x + box.width < currentScene.posX) corner.x = -1
	if(box.x > currentScene.posX + currentScene.width) corner.x = 1

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
			const isColliding = (box.x < tilemap.posX + tilemap.width &&
					box.x + box.width > tilemap.posX &&
					box.y < tilemap.posY + tilemap.height &&
					box.y + box.height > tilemap.posY)

			//se o jogador entrou em alguma sala, vai iniciar a transição
			if(isColliding && this.tilemaps[x] != currentScene){
				this.playerVel.set(corner.x, corner.y)
				this.cooldown = 60
				this.current = Number(x)
				this.add(this.tilemaps[this.current])
				const toTransfer = currentScene.children.filter(child => !(child instanceof TilemapLayer))
				for(const child of toTransfer) {
					currentScene.remove(child)
					this.tilemaps[this.current].add(child)
				}
				sceneManager.cameraBounds = {
				xMin: sceneManager.tilemaps[this.current].posX,
				yMin: sceneManager.tilemaps[this.current].posY,
				xMax: sceneManager.tilemaps[this.current].posX + sceneManager.tilemaps[this.current].width - 256,
				yMax: sceneManager.tilemaps[this.current].posY + sceneManager.tilemaps[this.current].height - 224
				
				}
			}
		}
	}
}


export default sceneManager
