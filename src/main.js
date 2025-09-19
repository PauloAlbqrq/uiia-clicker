import {Node, TextSprite, Tileset, Tilemap, Vector2, load} from "./base/joaoEngine.js"
import cat from "./cat.js"
import tileset from "./tileset.js"

const tilemap = new Tilemap(tileset, await load("sprites/tilemap.json"), 0, false)
const tilemap2 = new Tilemap(tileset, await load("sprites/tilemap.json"), 1, false)

const scene = new Node()

scene.add(tilemap, cat, tilemap2)

scene.start(() => {
	//faz a câmera seguir o gato
	var target = new Vector2(scene.canvas.width/2-cat.pos.x-16, scene.canvas.height/2-cat.pos.y-22)
	scene.pos = target
})

