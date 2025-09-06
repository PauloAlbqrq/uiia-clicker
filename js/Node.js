import {Vector2} from "./utils.js"

export class Node{
	constructor(){
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

	draw(ctx = document.getElementById("canvas").getContext("2d")){
		ctx.save()

		ctx.translate(this.pos.x, this.pos.y)
		ctx.rotate(this.rotation)
		ctx.scale(this.scale.x, this.scale.y)
		this.render(ctx)

		for(let child of this.children){
			child.draw(ctx)
		}

		ctx.restore()
	}
	render(ctx){
		//does nothing
	}
}
