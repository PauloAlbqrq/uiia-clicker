import {Vector2, load} from "./base/Utils.js"
import Node from "./base/Node.js"
import Tileset from "./base/Tileset.js"
import Tilemap from "./base/Tilemap.js"
import cat from "./cat.js"
import StaticBody from "./base/StaticBody.js"
import CollisionBox from "./base/CollisionBox.js"

const tilesetImage = await load("sprites/tileset.png")
const tileset = new Tileset(tilesetImage)

const tilemapJSON = await load("sprites/tilemap.json")
const tilemap = new Tilemap(tileset, tilemapJSON)

const scene = new Node()

scene.add(tilemap)
scene.add(cat)

scene.start(() => {
	var target = new Vector2(scene.canvas.width/2-cat.pos.x-16, scene.canvas.height/2-cat.pos.y-22)
	scene.pos = target
})

