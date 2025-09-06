export function resizeCanvas() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const scaleX = windowWidth / canvas.width;
      const scaleY = windowHeight / canvas.height;
      const scale = Math.min(scaleX, scaleY);

      canvas.style.width = canvas.width * scale + "px";
      canvas.style.height = canvas.height * scale + "px";
}

export class Vector2{
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
}

export class Input {
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

