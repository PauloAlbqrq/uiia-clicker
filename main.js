import {Sprite} from "./js/Sprite.js"
import {TextSprite} from "./js/TextSprite.js"
import {Game, Vector2} from "./js/Game.js"
import {Node} from "./js/Node.js"
import {CollisionBox} from "./js/CollisionBox.js"
import { StaticBody } from "./js/StaticBody.js"
import { DynamicBody } from "./js/DynamicBody.js"

const jogo = new Game()

const textImage = await jogo.load("./sprites/SMW.Monospace.png")

const text = new TextSprite(textImage, "qwertyuiopasdfghjklçzxcvbnm")
text.animated = true

jogo.add(text)

jogo.start(() => {
})
