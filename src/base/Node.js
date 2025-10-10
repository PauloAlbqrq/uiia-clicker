import {Vector2} from "./Utils.js"

export default class Node{
	constructor(){
		this.canvas = document.getElementById("canvas")
		this.ctx = this.canvas.getContext("2d", {willReadFrequently: false})
		this.ctx.imageSmoothingEnabled = false

		this.pos = new Vector2()
		this.z = 0
		this.rotation = 0
		this.scale = new Vector2(1, 1)
		this.filter = "brightness(100%)"
		//coisa pra calcular fps e tals
		this.lastTime = 0
		this.step = 1/60
		this.accumulator = 0
		
		this.children = []
		this.parent = null }

	add(...children){
		for(let child of children){
			child.parent = this
			this.children.push(child)
		}
	}
	addAt(child, index){
		child.parent = this

		if(index < 0) index = 0
		if(index > this.children.length) index = this.children.length

		this.children.splice(index, 0, child)
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

		for (const key of Object.keys(this)) {
			if (key === "children") continue;

			const value = this[key];

			if (value instanceof Vector2) {
				newNode[key] = new Vector2(value.x, value.y);
			} else {
				newNode[key] = value;
			}
		}

		newNode.children = []

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

	update() {
        for (const child of this.children) {
            child.update();
        }
    }
	draw(ctx){
		const saveOrNot = (this.pos.x || this.pos.y ||
				this.rotation ||
				this.scale.x || this.scale.y )
		if(saveOrNot) ctx.save()

		if(this.pos.x || this.pos.y) ctx.translate(Math.round(this.pos.x), Math.round(this.pos.y))
		if(this.rotation)ctx.rotate(this.rotation)
		if(this.scale.x || this.scale.y ) ctx.scale(this.scale.x, this.scale.y)
		
		this.render(ctx)

		for(let child of this.children){
			child.draw(ctx)
		}

		if(saveOrNot) ctx.restore()
	}
	render(ctx){
		//nos Sprites essa função aqui vai desenhar o sprite em si
	}
	//prepara a tela para iniciar o looping
	start(func = () => {}){
		window.addEventListener("resize", this.resizeCanvas)
		this.resizeCanvas()
		this.delta = performance.now()
		requestAnimationFrame((t) => this.loop(t, func))
	}
	loop(currentTime, func){
		if(!this.lastTime) this.lastTime = currentTime
		let deltaTime = (currentTime - this.lastTime) / 1000

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

		this.accumulator += deltaTime
		while (this.accumulator >= this.step){
			func()
			this.update()
			this.accumulator -= this.step
		}

		this.draw(this.ctx)

		this.lastTime = currentTime

		requestAnimationFrame((t) => this.loop(t, func))
	}
	resizeCanvas() {
	    const baseWidth = this.canvas.width;   // 256
	    const baseHeight = this.canvas.height; // 224
	    const windowWidth = window.innerWidth;
	    const windowHeight = window.innerHeight;

	    // Find max integer scale factor that fits within the window
	    const scaleX = Math.floor(windowWidth / baseWidth);
	    const scaleY = Math.floor(windowHeight / baseHeight);
	    const scale = Math.max(1, Math.min(scaleX, scaleY)); // At least 1x scale

	    // Apply scaled size to the canvas
	    this.canvas.style.width = `${baseWidth * scale}px`;
	    this.canvas.style.height = `${baseHeight * scale}px`;
	}	
}
