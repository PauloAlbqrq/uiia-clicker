import {Vector2} from "./utils.js"

export Node{
	construct(){
		this.pos = new Vector2()
		this.rotation = 0
		this.scale = new Vector2(1, 1)
		this.children = []
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
	draw(ctx){
		ctx.save()

		ctx.translate(this.pos.x, this.pos.y)
		ctx.rotate(rotation)
		ctx.scale(this.scale.x, this.scale.y)

		this.render(ctx)

		for(let child of this.childen){
			child.draw(ctx)
		}

		ctx.restore()
	}
	render(ctx){
		//does nothing
	}
}
