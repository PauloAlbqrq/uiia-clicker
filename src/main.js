import {Node, TextSprite, Tileset, Tilemap, Vector2, load} from "./base/joaoEngine.js"
import cat from "./cat.js"
import tileset from "./tileset.js"

const tilemap = new Tilemap(tileset, await load("sprites/tilemap.json"), 0, false)
const tilemap2 = new Tilemap(tileset, await load("sprites/tilemap.json"), 1, false)
cat.pos.x = 50
cat.pos.y = 50

const scene = new Node()

scene.add(tilemap, tilemap2, cat)

const cameraBounds = {
	xMin: 0,
	yMin: 0,
	xMax: 544,
	yMax: 352
}

scene.start(() => {
	//faz a câmera seguir o gato
	var target = new Vector2(scene.canvas.width/2-cat.pos.x-16, scene.canvas.height/2-cat.pos.y-22)
	scene.pos = scene.pos.add(target.sub(scene.pos).scale(0.1))
	scene.pos.x = Math.min(Math.max(scene.pos.x, -cameraBounds.xMax), -cameraBounds.xMin)
	scene.pos.y = Math.min(Math.max(scene.pos.y, -cameraBounds.yMax), -cameraBounds.yMin)
})

