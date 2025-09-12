function load(src){
	return new Promise((resolve, reject) => {
	const img = new Image();
	img.onload = () => resolve(img);
	img.onerror = (err) => reject(err);
	img.src = src;
	})
}
class Input{
constructor(){
	this.keys = {
	arrowup: 0,
	arrowdown: 0,
	arrowleft: 0,
	arrowright: 0,
	w: 0,
	a: 0,
	s: 0,
	d: 0,
	z: 0,
	x: 0,
	z: 0,
	shift: 0
	}

	window.addEventListener("keydown", (e) => {
		const key = e.key.toLowerCase()
		if (this.keys.hasOwnProperty(key)){
			this.keys[key] = 1
		}
	})

	window.addEventListener("keyup", (e) => {
		const key = e.key.toLowerCase()
		if (this.keys.hasOwnProperty(key)){
			this.keys[key] = 0
		}
	})
	}
}
class Vector2{
	constructor(x = 0, y = 0){
		this.x = x
		this.y = y
	}
	add(v){
		return new Vector2(this.x + v.x,
				this.y + v.y)
	}
	sub(v){
		return new Vector2(this.x - v.x,
				this.y - v.y)
	}
	mul(v){
		return new Vector2(this.x * v.x,
				this.y * v.x)
	}
	floor(){
		return new Vector2(Math.floor(this.x),
				Math.floor(this.y))
	}
	scale(n){
		return new Vector2(this.x*n, this.y*n)
	}
}

export {Vector2, Input, load}
export default {Vector2, Input, load}
