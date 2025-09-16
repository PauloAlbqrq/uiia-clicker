import {Vector2} from "./Utils.js"

export default class Node{
	constructor(){
		this.canvas = document.getElementById("canvas")
		this.ctx = canvas.getContext("2d", {willReadFrequently: false})
		this.ctx.imageSmoothingEnabled = false

		this.pos = new Vector2()
		this.rotation = 0
		this.scale = new Vector2(1, 1)
		this.filter = "brightness(100%)"
		this.delta = performance.now()
		
		this.children = []
		this.parent = null }

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
	clone() {
	const newNode = Object.create(Object.getPrototypeOf(this))

	// Copy all own properties except parent/children
	for (const key of Object.keys(this)) {
		if (key === "children") continue;

		const value = this[key];

		if (value instanceof Vector2) {
			// deep copy vectors
			newNode[key] = new Vector2(value.x, value.y);
		} else {
			// shallow copy (works for primitives and functions)
			newNode[key] = value;
		}
	}

	newNode.children = []

		// Recursively clone children
	for (const child of this.children) {
		const clonedChild = child.clone();
		newNode.add(clonedChild);
	}

	return newNode;
	}

	getRoot(){
		let current = this
		while (current.parent) current = current.parent
		return current
	}

	getAllNodes(root){
		const result = []
		function walk(node){
			result.push(node)
			for (const child of node.children){
				walk(child)
			}
		}
		walk(root)
		return result
	}

	update(deltaTime) {
        for (const child of this.children) {
            child.update(deltaTime);
        }
    }

	draw(ctx){
		ctx.save()

		ctx.translate(Math.round(this.pos.x), Math.round(this.pos.y))
		if(this.rotation != 0)ctx.rotate(this.rotation)
		if(this.scale.x != 0 || this.scale.y != 0) ctx.scale(this.scale.x, this.scale.y)
		//this.ctx.filter = this.filter
		
		this.render(ctx)

		for(let child of this.children){
			child.draw(ctx)
		}

		this.ctx.restore()
	}
	render(ctx){
		//does nothing
	}

	//prepara a tela para iniciar o looping
	start(func = () => {}){
		window.addEventListener("resize", this.resizeCanvas)
		this.resizeCanvas()
		this.delta = performance.now()
		requestAnimationFrame(() => this.loop(func))
	}
	loop(func){
		this.ctx.fillStyle = "white"
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
		
		const timeStamp = performance.now()
		//const deltaTime = (timeStamp - this.delta) / 1000
		this.delta = timeStamp
		const deltaTime = 0.1

		func()
		
		this.update(deltaTime)
		this.draw(this.ctx)

		requestAnimationFrame(() => this.loop(func))
	}
	resizeCanvas() {
		const windowWidth = window.innerWidth
		const windowHeight = window.innerHeight
		const scaleX = windowWidth / this.canvas.width
		const scaleY = windowHeight / this.canvas.height
		const scale = Math.min(scaleX, scaleY)

		this.canvas.style.width = this.canvas.width * scale + "px"
		this.canvas.style.height = this.canvas.height * scale + "px"
	}
}
