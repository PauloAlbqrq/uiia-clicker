export class Input {
	constructor(){
		this.keys = {
		arrowup:0,
		arrowdown: 0,
		arrowleft: 0,
		arrowright: 0,
		w: 0,
		a: 0,
		s: 0, 
		d: 0,
		z: 0
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
