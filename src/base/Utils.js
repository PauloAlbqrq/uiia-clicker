async function load(src){
	const extension = src.split(".").pop().toLowerCase()
	if(extension == "png" || extension == "jpg" || extension == "jpeg"){
		return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = (err) => reject(err);
		img.src = src;
		})
	}
	else if(extension == "json" || extension == "world"){
		const response = await fetch(src);
		if (!response.ok) {
		    throw new Error(`Failed to fetch JSON file: ${response.status}`);
		}
		return await response.json();
	}
	else{
		throw new Error("unsupported file")
	}
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
	this.keysPressed = {}
	for (const key in this.keys) {
		this.keysPressed[key] = 0
	}

	window.addEventListener("keydown", (e) => {
		const key = e.key.toLowerCase()
		if (this.keys.hasOwnProperty(key)){
			if(!this.keys[key]){
				this.keysPressed[key] = 1
			}
			this.keys[key] = 1
		}
	})

	window.addEventListener("keyup", (e) => {
		const key = e.key.toLowerCase()
		if (this.keys.hasOwnProperty(key)){
			this.keys[key] = 0
			this.keysPressed[key] = 0
		}
	})
}
isPressed(key){
	if(this.keysPressed.hasOwnProperty(key)){
		const value = this.keysPressed[key]
		this.keysPressed[key] = 0
		return value
	}
}
}
class Vector2{
	constructor(x = 0, y = 0){
		this.x = x
		this.y = y
	}
	set(x, y){
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
