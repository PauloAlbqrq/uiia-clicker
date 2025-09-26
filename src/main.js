import {Node, StaticBody, Sprite, CollisionBox, TextSprite, Vector2, load} from "./base/joaoEngine.js"
import cat from "./cat.js"
import dialogManager from "./dialogManager.js"
import sceneManager from "./sceneManager.js"

cat.pos.set(50, 500)
cat.z = 1.5

dialogManager.dialogCollision = cat.children[2].children[0]
dialogManager.pos.y = 148

sceneManager.player = cat

//sans
const sans = new StaticBody()
sans.dialog = ["  sou um StaticBody \ncom Sprite e Collision\nBox que define a minha\nárea de colisão", "  tenho um atributo\nchamado dialog,\nque consiste num array\nde strings", "  e e e e e e\n e e ee e e e e"]
sans.pos.set(100, 50)
sans.add(new Sprite(await load("assets/sprites/sans.png")))
sans.add(new CollisionBox(16, 30, 3, 0, true))

const hud = new Node()
const game = new Node()

sceneManager.add(sans, cat)
hud.add(dialogManager)
game.add(sceneManager, hud)

const cameraBounds = {
	xMin: 0,
	yMin: 0,
	xMax: 544,
	yMax: 700
}

game.start()

