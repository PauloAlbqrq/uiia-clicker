const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

import {Vector2} from './js/Vector2.js'
import {resizeCanvas} from './js/resizeCanvas.js'
import {TextSprite} from './js/TextSprite.js'

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); 

const img = new Image()
img.src = "https://www.spriters-resource.com/media/assets/221/224030.png?updated=1755490532"

var x = 0

const texto = new TextSprite(ctx)

function draw() {
	ctx.fillStyle = "white"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.drawImage(img, 0, 0, 32, 32, x, 0, 32, 32)

	x++
	texto.draw("teste legal", 10, 10)

	requestAnimationFrame(draw)
}
draw()
