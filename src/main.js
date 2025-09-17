import {Node, TextSprite, Tileset, Tilemap, Vector2, load} from "./base/joaoEngine.js"
import cat from "./cat.js"

const tileset = new Tileset(await load("sprites/tileset.png"))
const tilemap = new Tilemap(tileset, await load("sprites/tilemap.json"), 0, true)
const text = new TextSprite(await load("sprites/SMW.Monospace.png"), 
							`ai que não sei o que tá ligado
							ai que não sei o que lá
							sou um texto com várias linha
							várias linhas eu tenho`)
text.animated = true

const game = new Node()
const scene = new Node()
const hud = new Node()

scene.add(tilemap, cat)
hud.add(text)
game.add(scene, hud)

game.start(() => {
	//faz a câmera seguir o gato
	var target = new Vector2(scene.canvas.width/2-cat.pos.x-16, scene.canvas.height/2-cat.pos.y-22)
	scene.pos = target
})

