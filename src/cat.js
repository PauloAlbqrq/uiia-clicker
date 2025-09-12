import Sprite from "./base/Sprite.js"
import TextSprite from "./base/TextSprite.js"
import {Vector2, Input, load} from "./base/Utils.js"
import Node from "./base/Node.js"
import CollisionBox from "./base/CollisionBox.js"
import StaticBody from "./base/StaticBody.js"
import DynamicBody from "./base/DynamicBody.js"

const cat = new DynamicBody()
const catBox = new CollisionBox(16, 16, 8, 14)
const catImage = await load("sprites/cat.png")
const animation = {idle_down: [[0, 0]],
	idle_right: [[0, 1]],
	idle_up: [[0, 2]],
	idle_left: [[0, 3]],
	walk_down: [[0, 0], [1, 0], [2, 0], [3, 0]],
	walk_right: [[0, 1], [1, 1], [2, 1], [3, 1]],
	walk_up: [[0, 2], [1, 2], [2, 2], [3, 2]],
	walk_left: [[0, 3], [1, 3], [2, 3], [3, 3]],
}
const catSprite = new Sprite(catImage, 4, 9, animation)
cat.input = new Input()

cat.add(catSprite)
cat.add(catBox)

cat.original = cat.update

cat.update = function(){
	this.original()

	this.vel.x = (this.input.keys.d - this.input.keys.a)
	this.vel.y = (this.input.keys.s - this.input.keys.w)

	this.vel = this.vel.scale(this.input.keys.shift + 1)
	this.children[0].frameDuration = 6
	this.children[0].frameDuration -= this.input.keys.shift * 2

	if(this.vel.x > 0) this.children[0].play("walk_right")
	else if(this.vel.x < 0) this.children[0].play("walk_left")
	else if(this.vel.y > 0) this.children[0].play("walk_down")
	else if(this.vel.y < 0) this.children[0].play("walk_up")
	if(this.vel.x == 0 && this.vel.y == 0) this.children[0].play(Object.keys(this.children[0].animations)[Object.keys(this.children[0].animations).indexOf(this.children[0].currentAnimation)-4])
}

export default cat
