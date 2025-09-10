import {Vector2} from "./Utils.js"

export default class Node{
	constructor(){
		this.canvas = document.getElementById("canvas")
		this.ctx = canvas.getContext("2d")
		this.ctx.imageSmoothingEnabled = false

		this.pos = new Vector2()
		this.rotation = 0
		this.scale = new Vector2(1, 1)
		this.filter = "brightness(100%)"
		
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

	draw(){
		this.ctx.save()

		this.ctx.translate(this.pos.x, this.pos.y)
		this.ctx.rotate(this.rotation)
		this.ctx.scale(this.scale.x, this.scale.y)
		this.ctx.filter = this.filter
		
		this.render()

		for(let child of this.children){
			child.draw()
		}

		this.ctx.restore()
	}
	render(){
		//does nothing
	}

	//prepara a tela para iniciar o looping
	start(func = () => {}){
		window.addEventListener("resize", this.resizeCanvas)
		this.resizeCanvas()
		this.loop(func)
	}
	loop(func){
		this.ctx.fillStyle = "white"
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		func()
		
		this.update()
		this.draw()

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
