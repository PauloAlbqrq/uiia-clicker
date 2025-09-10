import {Vector2} from "./base/Utils.js"
import Node from "./base/Node.js"
import cat from "./cat.js"

const scene = new Node()
scene.add(cat)

scene.start(() => {
	var target = new Vector2(scene.canvas.width/2-cat.pos.x-16,
				scene.canvas.height/2-cat.pos.y-22)
	scene.pos = scene.pos.add(target.sub(scene.pos).mul(new Vector2(0.1, 0.1)))
})
