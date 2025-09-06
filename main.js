import {Sprite} from "./js/Sprite.js"
import {TextSprite} from "./js/TextSprite.js"
import {Game, Vector2} from "./js/Game.js"
import {Node} from "./js/Node.js"

const jogo = new Game()

const catImage = await jogo.load("./sprites/cat.png")
const cat = new Sprite(catImage, new Vector2(4, 9))

jogo.add(cat)

jogo.start(update)

function update(){
	cat.pos.x++
}