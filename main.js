import {Sprite} from "./js/Sprite.js"
import {TextSprite} from "./js/TextSprite.js"
import {Game, Vector2} from "./js/Game.js"
import {Node} from "./js/Node.js"
import {CollisionBox} from "./js/CollisionBox.js"
import { StaticBody } from "./js/StaticBody.js"
import { DynamicBody } from "./js/DynamicBody.js"

const jogo = new Game()

const catImage = await jogo.load("./sprites/cat.png")

const cat = new Sprite(catImage, new Vector2(4, 9))
const cat2 = new Sprite(catImage, new Vector2(4, 9))

const shape = new CollisionBox(16, 16, 8, 16)
const shape2 = new CollisionBox(16, 16, 8, 16)

const box = new StaticBody()
box.add(shape)
box.add(cat)
box.pos = new Vector2(60, 70)

const player = new DynamicBody()
player.add(shape2)
player.add(cat2)

jogo.add(box)
jogo.add(player)

shape.debug = true
shape2.debug = true

jogo.start(() => {
	player.vel.x = (jogo.input.keys.d-jogo.input.keys.a)
	player.vel.y = (jogo.input.keys.s-jogo.input.keys.w)
})