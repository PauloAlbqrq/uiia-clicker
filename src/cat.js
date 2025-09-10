import Sprite from "./base/Sprite.js"
import TextSprite from "./base/TextSprite.js"
import {Vector2, Input, load} from "./base/Utils.js"
import Node from "./base/Node.js"
import CollisionBox from "./base/CollisionBox.js"
import StaticBody from "./base/StaticBody.js"
import DynamicBody from "./base/DynamicBody.js"

const cat = new DynamicBody()
const catBox = new CollisionBox(16, 16)
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
catSprite.frameDuration = 6
const catInput = new Input()

cat.add(catSprite)
cat.add(catBox)

var status = "active"
var counter = 0
var frameDuration = 100 

const original = cat.update.bind(cat)

cat.update = function(){
	original()
	cat.vel.x = (catInput.keys.d - catInput.keys.a)
	cat.vel.y = (catInput.keys.s - catInput.keys.w)

	counter++
	if(counter >= frameDuration){
		status = "inactive"
		counter = 0
	}

	if(cat.vel.x > 0) catSprite.play("walk_right")
	else if(cat.vel.x < 0) catSprite.play("walk_left")
	else if(cat.vel.y > 0) catSprite.play("walk_down")
	else if(cat.vel.y < 0) catSprite.play("walk_up")
	if(cat.vel.x == 0 && cat.vel.y == 0) catSprite.play(Object.keys(catSprite.animations)[Object.keys(catSprite.animations).indexOf(catSprite.currentAnimation)-4])
}

export default cat
