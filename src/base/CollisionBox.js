import Node from "./Node.js"

export default class CollisionBox extends Node{
    constructor(width = 16, height = 16, offsetX = 0, offsetY = 0, debug = false){
        super()
        this.width = width
        this.height = height

        this.offsetX = offsetX
        this.offsetY = offsetY

        this.debug = debug
    }
    setAttributes(w, h, x, y){
        this.width = w
        this.height = h
        this.offsetX = x
        this.offsetY = y
    }
    getAABB() {
        // world position from parent transforms
        return {
            x: this.getWorldX() + this.offsetX,
            y: this.getWorldY() + this.offsetY,
            w: this.width,
            h: this.height
        };
    }

    getWorldX() {
	let x = this.pos.x
	let p = this.parent
	while (p) {
		x += p.pos.x
		p = p.parent
	}
	return x
    }

    getWorldY() {
        let y = this.pos.y
        let p = this.parent
        while (p) {
            y += p.pos.y
            p = p.parent
        }
        return y
    }

    intersects(otherBox) {
	if(!(otherBox instanceof CollisionBox)) return false
        const a = this.getAABB();
        const b = otherBox.getAABB();

        return !(
            a.x + a.w < b.x ||
            a.x > b.x + b.w ||
            a.y + a.h < b.y ||
            a.y > b.y + b.h
        );
    }
   render(){
        if(this.debug){
		const { x, y, w, h } = this.getAABB();
		this.ctx.save();
		this.ctx.strokeStyle = "red";
		this.ctx.lineWidth = 2;
		this.ctx.strokeRect(this.offsetX, this.offsetY, w, h);
		this.ctx.restore();

       }
    }
}
