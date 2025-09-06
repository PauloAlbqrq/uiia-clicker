import {Vector2} from "./utils.js"

export class Camera{
	constructor(){
		this.pos = new Vector2()
		this.subpos = this.pos
		this.smooth = 0.05
	}
	follow(vec){
		this.subpos = this.subpos.add(vec.sub(this.subpos).mul(new Vector2(this.smooth, this.smooth)))
		this.pos = this.subpos.floor()
	}
}
