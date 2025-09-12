import {Vector2} from "./base/Utils.js"
import Node from "./base/Node.js"
import cat from "./cat.js"

const scene = new Node()

const cats = []

for(let i = 0; i < 100; i++){
	cats.push(cat.clone())
	cats[i].pos.x = Math.floor(Math.random()*200)
	cats[i].pos.y = Math.floor(Math.random()*200)
	scene.add(cats[i])
}
	
var subpos = new Vector2()


scene.start(() => {
	//var target = new Vector2(scene.canvas.width/2-cat.pos.x-16,
//				scene.canvas.height/2-cat.pos.y-22)
	//subpos = subpos.add(target.sub(subpos).scale(0.05))
	//scene.pos = subpos.floor()
})
