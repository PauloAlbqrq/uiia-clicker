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

sceneManager.update = function(){
	this.original()

	this.children.sort((a, b) => a.z - b.z)

	//se não houver player definido, ignora
	if(!this.player)return

	updateCamera(this)
	handleTransitions(this)
}
sceneManager.draw = function(ctx) {
    const saveOrNot = (this.pos.x || this.pos.y || this.rotation || this.scale.x || this.scale.y);
    if (saveOrNot) ctx.save();

    if (this.pos.x || this.pos.y) ctx.translate(Math.round(this.pos.x), Math.round(this.pos.y));
    if (this.rotation) ctx.rotate(this.rotation);
    if (this.scale.x || this.scale.y) ctx.scale(this.scale.x, this.scale.y);

    this.render(ctx);

    let clippingStarted = false;
	const collided = []
	const abovePlayer = this.children.slice(this.children.indexOf(this.player)+1)
        if(abovePlayer.length > 0){
                const nodes = []
                for(let layer of abovePlayer) nodes.push(...layer.getAllNodes(layer))
                for(let node of nodes) {
                        const tile = new CollisionBox(16, 16, node.getWorldX(), node.getWorldY())
                        //console.log(this.player.children[1].getAABB(), tile.getAABB())
                        if(this.player.children[1].intersects(tile)) collided.push(node)
                        //console.log(collided.length)
                }
        }

	// Check the collision box for accurate player dimensions
	const playerRect = this.player.children[1];
	const playerAABB = playerRect.getAABB(); 

	// --- Configuration ---
	const RESOLUTION = 1; // Check every pixel or every other pixel
	const totalPlayerArea = playerAABB.w * playerAABB.h;
	var overdrawnArea = 0

	// Calculate grid size based on resolution
	const numX = Math.ceil(playerAABB.w / RESOLUTION);
	const numY = Math.ceil(playerAABB.h / RESOLUTION);
	const totalPlayerCheckPoints = numX * numY;

	let overdrawnCheckPoints = 0;

	if (collided.length > 0) {
	    for (let j = 0; j < numY; j++) {
		for (let i = 0; i < numX; i++) {
		    
		    // Calculate the world coordinates of the center of this check point
		    const checkX = playerAABB.x + i * RESOLUTION + RESOLUTION / 2;
		    const checkY = playerAABB.y + j * RESOLUTION + RESOLUTION / 2;

		    let pointIsCovered = false;
		    for (let node of collided) {
			
			// Get the tile's world coordinates and dimensions directly 
			// from the source (the node and the known tile size).
			const tileX = node.getWorldX(); 
			const tileY = node.getWorldY();
			const tileW = 16;
			const tileH = 16;

			// Manual point-in-box check
			if (
			    checkX >= tileX && 
			    checkX < tileX + tileW && 
			    checkY >= tileY && 
			    checkY < tileY + tileH 
			) {
			    pointIsCovered = true;
			    break;
			}
		    }
		    
		    if (pointIsCovered) {
			overdrawnCheckPoints++;
		    }
		}
	    }

	    const overdrawnAreaRatio = overdrawnCheckPoints / totalPlayerCheckPoints;
	    overdrawnArea = overdrawnAreaRatio * totalPlayerArea;

	}


    for (let child of this.children) {
        if (!clippingStarted && child === this.player) {
            child.draw(ctx);

            ctx.save();

            ctx.beginPath();
            ctx.rect(-9999, -9999, 19999, 19999);

            const radius = (overdrawnArea/totalPlayerArea)*16
            const playerX = this.player.pos.x + 16
            const playerY = this.player.pos.y + 22
            ctx.arc(playerX, playerY, radius, 0, Math.PI * 2, true);

            ctx.clip("evenodd");

            clippingStarted = true;
            continue; 
        }
        child.draw(ctx);
    }

    if (clippingStarted) ctx.restore();

    if (saveOrNot) ctx.restore();
};


sceneManager.drawOriginal = sceneManager.draw

export default sceneManager
