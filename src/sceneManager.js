import {Node, Tilemap, load, Vector2, CollisionBox} from "./base/joaoEngine.js"
import tileset from "./tileset.js"

const sceneManager = new Node()

sceneManager.rectangles = {}
sceneManager.points = {}

sceneManager.world = await load("assets/tilemaps/mundo.world")
sceneManager.tilemaps = []
for(let i = 0; i < sceneManager.world.maps.length; i++){
	const tilemapJSON = await load("assets/tilemaps/"+sceneManager.world.maps[i].fileName)
	const tilemap = new Tilemap(tileset, tilemapJSON, true)
	tilemap.worldX = sceneManager.world.maps[i].x
	tilemap.worldY = sceneManager.world.maps[i].y
	tilemap.width = sceneManager.world.maps[i].width
	tilemap.height = sceneManager.world.maps[i].height
	for(let layer of tilemap.children){
		layer.pos.x = sceneManager.world.maps[i].x
		layer.pos.y = sceneManager.world.maps[i].y
	}
	for(let layer of tilemap.objects){
		for(let object of layer.objects){
			if(object.width && object.height) {
				sceneManager.rectangles[object.name] = object
				sceneManager.rectangles[object.name].x += sceneManager.world.maps[i].x
				sceneManager.rectangles[object.name].y += sceneManager.world.maps[i].y
			}
			else {
				sceneManager.points[object.name] = object
				sceneManager.points[object.name].x += sceneManager.world.maps[i].x
				sceneManager.points[object.name].y += sceneManager.world.maps[i].y
			}
			
		}
	}
	sceneManager.tilemaps.push(tilemap)
}
sceneManager.current = 0
sceneManager.previous = 0

sceneManager.player = null
sceneManager.playerVel = new Vector2()
sceneManager.playerTarget = new Vector2()
sceneManager.color = "rgba(0, 0, 0, 0)"
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

sceneManager.addRoom(0)

sceneManager.original = sceneManager.update
sceneManager.drawOriginal = sceneManager.draw

sceneManager.update = function(){
	this.original()

	const currentScene = this.tilemaps[this.current]

	this.children.sort((a, b) => a.z - b.z)

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
	// clamp player position so the collision box stays inside the current scene
	if(this.fade == null && !this.cooldown){
		if(box.x < currentScene.worldX) {
			this.player.pos.x += currentScene.worldX - box.x;
		}
		if(box.y < currentScene.worldY) {
			this.player.pos.y += currentScene.worldY - box.y;
		}
		if(box.x + box.width > currentScene.worldX + currentScene.width) {
			this.player.pos.x -= (box.x + box.width) - (currentScene.worldX + currentScene.width);
		}
		if(box.y + box.height > currentScene.worldY + currentScene.height) {
			this.player.pos.y -= (box.y + box.height) - (currentScene.worldY + currentScene.height);
		}
	}
	var corner = new Vector2()
	if(box.y + box.height > currentScene.worldY + currentScene.height) corner.y = 1
	if(box.y < currentScene.worldY) corner.y = -1
	if(box.x + box.width < currentScene.worldX) corner.x = -1
	if(box.x > currentScene.worldX + currentScene.width) corner.x = 1

	if(this.fade != null){
	    this.fade--; // decrement fade
	    const fadePlateau = 15

	    // teleport player when fade reaches plateau upper edge
	    if(this.fade == fadePlateau){
		this.player.pos.x = this.playerTarget.x;
		this.player.pos.y = this.playerTarget.y;
		for(let layer of this.tilemaps[this.previous].children) this.remove(layer)
	    }

	    // activate player when fade reaches plateau lower edge
	    if(this.fade <= -fadePlateau) this.player.active = true;

	    // reset when fade reaches fadeDelay
	    if(this.fade <= -this.fadeDelay){
		this.draw = this.drawOriginal;
		this.fade = null
	    }

	    // compute color
	    let f = this.fade;
	    let color;

	    if (f >= -fadePlateau && f <= fadePlateau) {
		color = 1; // plateau
	    } else if (f > fadePlateau && f <= this.fadeDelay) {
		color = 1 - (f - fadePlateau) / (this.fadeDelay - fadePlateau);
	    } else if (f < -fadePlateau && f >= -this.fadeDelay) {
		color = 1 - (-fadePlateau - f) / (this.fadeDelay - fadePlateau);
	    } else {
		color = 0;
	    }

	    this.color = "rgba(0, 0, 0," + color + ")";
	}

	//detectar se entrou num teletransporte
	for(let key of Object.keys(this.rectangles)){
		const rect = this.rectangles[key]
		const entered = (box.x < rect.x + rect.width &&
						box.x + box.width > rect.x &&
						box.y < rect.y + rect.height &&
						box.y + box.height > rect.y)
		
		if(entered && this.points[key] && (this.fade == null || this.fade < 15)){
			
			this.fade = this.fadeDelay
			this.player.active = false
			this.playerTarget.x = this.points[key].x - 16 
			this.playerTarget.y = this.points[key].y - 22
			this.color = "rgba(0, 0, 0, 0)"
			this.draw = (ctx) => {
				this.drawOriginal(ctx)
				this.ctx.fillStyle = this.color
				this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
			}
		}
	}

	if(this.cooldown && this.fade == null){
		this.cooldown -= 1
		if(corner.x || corner.y)this.player.vel.set(this.playerVel.x, this.playerVel.y)
		if(this.cooldown <= 0){
			this.cooldown = 0
			for(let layer of this.tilemaps[this.previous].children) this.remove(layer)
		}
		return
	}

	//vai primeiro detectar se o jogador tocou na borda da sala (lá ele)
	if(corner.x || corner.y){
		//então ele vai verificar cada sala para detectar se o jogador entrou em alguma
		for(let x in this.tilemaps){
			const tilemap = this.tilemaps[x]
			const isColliding = (box.x < tilemap.worldX + tilemap.width &&
					box.x + box.width > tilemap.worldX &&
					box.y < tilemap.worldY + tilemap.height &&
					box.y + box.height > tilemap.worldY)

			//se o jogador entrou em alguma sala, vai iniciar a transição
			if(isColliding && this.tilemaps[x] != currentScene){
				this.playerVel.set(corner.x, corner.y)
				this.cooldown = 60
				this.addRoom(x)
			}
		}
	}
}


export default sceneManager
