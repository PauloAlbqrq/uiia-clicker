import Sprite from "./base/Sprite.js"
import TextSprite from "./base/TextSprite.js"
import {Vector2, Input, load} from "./base/Utils.js"
import Node from "./base/Node.js"
import CollisionBox from "./base/CollisionBox.js"
import StaticBody from "./base/StaticBody.js"
import DynamicBody from "./base/DynamicBody.js"

const catImage = await load("sprites/cat.png")

const cat = new Sprite(catImage, new Vector2(4, 9))

cat.start(() => {
})
