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

            clippingStarted = true;
            continue; 
        }
		// A utility function to get or create a temporary canvas
function getTempCanvas(width, height) {
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

// ... inside your loop ...
if (clippingStarted && collided.length > 0) {
    const radius = (overdrawnArea / totalPlayerArea) * 18;
    const playerX = this.player.pos.x + 16;
    const playerY = this.player.pos.y + 22;

    // --- 1. Draw the child *outside* the circle (original behavior) ---
    // This part is safe even if radius is 0
    ctx.save();
    ctx.beginPath();
    ctx.rect(-9999, -9999, 19999, 19999);
    ctx.arc(playerX, playerY, radius, 0, Math.PI * 2, true);
    ctx.clip();
    child.draw(ctx);
    ctx.restore();

    // -----------------------------------------------------------------
    // --- 2. Create the FADING drawing (Only if radius > 0) ---
    // -----------------------------------------------------------------

    // 🔥 FIX: Check if the radius is greater than 0 before creating and drawing to the canvas.
    if (radius > 0) {
    // 1. Define Overlap and Size the Canvas based on the overlap
    const overlapAmount = 1; 
    const radiusWithOverlap = radius + overlapAmount;
    const diameterWithOverlap = radiusWithOverlap * 2; 

    // FIX 1: Size the temp canvas to fit the overlapped radius
    const tempCanvas = getTempCanvas(diameterWithOverlap, diameterWithOverlap);
    const tempCtx = tempCanvas.getContext('2d');
    
    // Calculate coordinates for the expanded canvas
    const tempX = radiusWithOverlap;
    const tempY = radiusWithOverlap;
    const mainX = playerX - radiusWithOverlap; 
    const mainY = playerY - radiusWithOverlap;

    // Clear the canvas from the previous frame
    tempCtx.clearRect(0, 0, diameterWithOverlap, diameterWithOverlap);
    
    // A. Draw the child onto the temporary context
    tempCtx.save();
    tempCtx.translate(tempX - playerX, tempY - playerY);
    
    // FIX 2: Use radiusWithOverlap for the clipping arc to overlap the outer drawing
    tempCtx.beginPath();
    tempCtx.arc(playerX, playerY, radiusWithOverlap, 0, Math.PI * 2);
    tempCtx.clip();
    child.draw(tempCtx);
    tempCtx.restore();

    // B. Create and apply the radial gradient mask
    
    const gradient = tempCtx.createRadialGradient(
        tempX, tempY, 0,                 
        tempX, tempY, radiusWithOverlap  
    );

    // ✅ FINAL FIX: Correct Gradient Stops for a Center-Transparent fade-in
    // Center: Fully Transparent Mask (resulting in a fully transparent drawing)
    gradient.addColorStop(0.0, 'rgba(0, 0, 0, 0.4)');
    
    // Edge: Fully OPAQUE Mask (resulting in a fully opaque drawing)
    gradient.addColorStop(1.0, 'rgba(0, 0, 0, 1)');  

    tempCtx.globalCompositeOperation = 'destination-in';
    tempCtx.fillStyle = gradient;

    // Fill the entire temp canvas with the gradient mask
    tempCtx.fillRect(0, 0, diameterWithOverlap, diameterWithOverlap); 
    
    // C. Draw the temporary canvas result back onto the main context
    ctx.save();
    if(tempCanvas.width > 0 && tempCanvas.height > 0) ctx.drawImage(tempCanvas, mainX, mainY);
    ctx.restore();
}
    // -----------------------------------------------------------------
}
        else child.draw(ctx);
    }
    if (saveOrNot) ctx.restore();
};


sceneManager.drawOriginal = sceneManager.draw

export default sceneManager
