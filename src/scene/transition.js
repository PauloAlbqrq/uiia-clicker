import { Vector2 } from "../base/joaoEngine.js"

export default function handleTransitions(scene) {
	const currentScene = scene.tilemaps[scene.current]
	const box = {
		"x": scene.player.pos.x + scene.player.children[1].offsetX,
		"y": scene.player.pos.y + scene.player.children[1].offsetY,
		"width": scene.player.children[1].width,
		"height": scene.player.children[1].height
	}
	// clamp player position so the collision box stays inside the current scene
	if(scene.fade == null && !scene.cooldown){
		if(box.x < currentScene.worldX) {
			scene.player.pos.x += currentScene.worldX - box.x;
		}
		if(box.y < currentScene.worldY) {
			scene.player.pos.y += currentScene.worldY - box.y;
		}
		if(box.x + box.width > currentScene.worldX + currentScene.width) {
			scene.player.pos.x -= (box.x + box.width) - (currentScene.worldX + currentScene.width);
		}
		if(box.y + box.height > currentScene.worldY + currentScene.height) {
			scene.player.pos.y -= (box.y + box.height) - (currentScene.worldY + currentScene.height);
		}
	}
	var corner = new Vector2()
	if(box.y + box.height > currentScene.worldY + currentScene.height) corner.y = 1
	if(box.y < currentScene.worldY) corner.y = -1
	if(box.x + box.width < currentScene.worldX) corner.x = -1
	if(box.x > currentScene.worldX + currentScene.width) corner.x = 1

	if(scene.fade != null){
	    scene.fade--; // decrement fade
	    const fadePlateau = 15

	    // teleport player when fade reaches plateau upper edge
	    if(scene.fade == fadePlateau){
		scene.player.pos.x = scene.playerTarget.x;
		scene.player.pos.y = scene.playerTarget.y;
		for(let layer of scene.tilemaps[scene.previous].children) scene.remove(layer)
	    }

	    // activate player when fade reaches plateau lower edge
	    if(scene.fade <= -fadePlateau) scene.player.active = true;

	    // reset when fade reaches fadeDelay
	    if(scene.fade <= -scene.fadeDelay){
		scene.draw = scene.drawOriginal;
		scene.fade = null
	    }

	    // compute color
	    let f = scene.fade;
	    let color;

	    if (f >= -fadePlateau && f <= fadePlateau) {
		color = 1; // plateau
	    } else if (f > fadePlateau && f <= scene.fadeDelay) {
		color = 1 - (f - fadePlateau) / (scene.fadeDelay - fadePlateau);
	    } else if (f < -fadePlateau && f >= -scene.fadeDelay) {
		color = 1 - (-fadePlateau - f) / (scene.fadeDelay - fadePlateau);
	    } else {
		color = 0;
	    }

	    scene.color = "rgba(0, 0, 0," + color + ")";
	}

	//detectar se entrou num teletransporte
	for(let key of Object.keys(scene.rectangles)){
		const rect = scene.rectangles[key]
		const entered = (box.x < rect.x + rect.width &&
						box.x + box.width > rect.x &&
						box.y < rect.y + rect.height &&
						box.y + box.height > rect.y)
		
		if(entered && scene.points[key] && (scene.fade == null || scene.fade < 15)){
			
			scene.fade = scene.fadeDelay
			scene.player.active = false
			scene.playerTarget = new Vector2()
			scene.playerTarget.x = scene.points[key].x - 16 
			scene.playerTarget.y = scene.points[key].y - 22
			scene.color = "rgba(0, 0, 0, 0)"
			scene.draw = (ctx) => {
				scene.drawOriginal(ctx)
				scene.ctx.fillStyle = scene.color
				scene.ctx.fillRect(0, 0, scene.canvas.width, scene.canvas.height)
			}
		}
	}

	if(scene.cooldown && scene.fade == null){
		scene.cooldown -= 1
		if(corner.x || corner.y)scene.player.vel.set(scene.playerVel.x, scene.playerVel.y)
		if(scene.cooldown <= 0){
			scene.cooldown = 0
			for(let layer of scene.tilemaps[scene.previous].children) scene.remove(layer)
		}
		return
	}

	//vai primeiro detectar se o jogador tocou na borda da sala (lá ele)
	if(corner.x || corner.y){
		//então ele vai verificar cada sala para detectar se o jogador entrou em alguma
		for(let x in scene.tilemaps){
			const tilemap = scene.tilemaps[x]
			const isColliding = (box.x < tilemap.worldX + tilemap.width &&
					box.x + box.width > tilemap.worldX &&
					box.y < tilemap.worldY + tilemap.height &&
					box.y + box.height > tilemap.worldY)

			//se o jogador entrou em alguma sala, vai iniciar a transição
			if(isColliding && scene.tilemaps[x] != currentScene){
				scene.playerVel = new Vector2(corner.x, corner.y)
				scene.cooldown = 60
				scene.addRoom(x)
			}
		}
	}

}

