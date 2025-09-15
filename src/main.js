import {Vector2, load} from "./base/Utils.js"
import Node from "./base/Node.js"
import Tileset from "./base/Tileset.js"
import cat from "./cat.js"

const tilemap = await load("sprites/tilemap.json")
const tilesetImage = await load("sprites/tileset.png")
const tileset = new Tileset(tilesetImage)
console.log(tilemap.layers[0].data)
