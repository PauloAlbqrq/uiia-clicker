import {Node, StaticBody, Sprite, CollisionBox, TextSprite, Tileset, Tilemap, Vector2, load} from "./base/joaoEngine.js"
import cat from "./cat.js"
import tileset from "./tileset.js"
import dialogManager from "./dialogManager.js"


const tilemap = new Tilemap(tileset, await load("sprites/tilemap.json"), 0, true)
const tilemap2 = new Tilemap(tileset, await load("sprites/tilemap.json"), 1, true)
cat.pos.set(50, 50)
dialogManager.dialogCollision = cat.children[2].children[0]
dialogManager.pos.y = 148

//sans
const sans = new StaticBody()
sans.dialog = ["  este texto tem\nvárias linhas e\nvárias linhas tem\nesse texto aqui", "  e e e e e e e e e\ne e e e e e e e e\ne e e e e e e e e e\ne e e e e e e e e"]
sans.pos.set(100, 50)
sans.add(new Sprite(await load("sprites/sans.png")))
sans.add(new CollisionBox(16, 30, 3, 0, true))

const scene = new Node()
const hud = new Node()
const game = new Node()

scene.add(tilemap, tilemap2, sans, cat)
hud.add(dialogManager)
game.add(scene, hud)

const cameraBounds = {
	xMin: 0,
	yMin: 0,
	xMax: 544,
	yMax: 352
}

game.start(() => {
	//faz a câmera seguir o gato
	var target = new Vector2(scene.canvas.width/2-cat.pos.x-16, scene.canvas.height/2-cat.pos.y-22)
	scene.pos = scene.pos.add(target.sub(scene.pos).scale(0.1))
	scene.pos.x = Math.min(Math.max(scene.pos.x, -cameraBounds.xMax), -cameraBounds.xMin)
	scene.pos.y = Math.min(Math.max(scene.pos.y, -cameraBounds.yMax), -cameraBounds.yMin)
})

