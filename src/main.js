import {Sprite} from "./base/Sprite.js"
import {TextSprite} from "./base/TextSprite.js"
import {Game, Vector2} from "./base/Game.js"
import {Node} from "./base/Node.js"
import {CollisionBox} from "./base/CollisionBox.js"
import { StaticBody } from "./base/StaticBody.js"
import { DynamicBody } from "./base/DynamicBody.js"

const jogo = new Game()

const textImage = await jogo.load("./sprites/SMW.Monospace.png")

const text = new TextSprite(textImage, "qwertyuiopasdfghjklçzxcvbnm")
text.animated = true

jogo.add(text)

jogo.start(() => {
})
