import {Vector2} from "./Game.js"

export class Node{
	constructor(){
		this.canvas = document.getElementById("canvas")
		this.ctx = canvas.getContext("2d")

		this.pos = new Vector2()
		this.rotation = 0
		this.scale = new Vector2(1, 1)
		this.children = [];
		this.parent = null
	}

	add(child){
		child.parent = this
		this.children.push(child)
	}
	
	remove(child) {
		const i = this.children.indexOf(child);
		if (i !== -1) {
		    this.children.splice(i, 1);
		    child.parent = null;
		}
    }

	update(deltaTime) {
        for (const child of this.children) {
            child.update(deltaTime);
        }
    }

	draw(){
		this.ctx.save()

		this.ctx.translate(this.pos.x, this.pos.y)
		this.ctx.rotate(this.rotation)
		this.ctx.scale(this.scale.x, this.scale.y)
		
		this.render()

		for(let child of this.children){
			child.draw()
		}

		this.ctx.restore()
	}
	render(){
		//does nothing
	}

	start(func){
		this.ctx.fillStyle = "white"
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		func()
		
		this.update()
		this.draw()

		requestAnimationFrame(() => this.start(func))
	}
}
