const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

import {Vector2} from './js/Vector2.js'

function resizeCanvas() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const scaleX = windowWidth / canvas.width;
      const scaleY = windowHeight / canvas.height;
      const scale = Math.min(scaleX, scaleY);

      canvas.style.width = canvas.width * scale + "px";
      canvas.style.height = canvas.height * scale + "px";
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas(); 

const img = new Image()
img.src = "https://www.spriters-resource.com/media/assets/221/224030.png?updated=1755490532"

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	ctx.drawImage(img, 0, 0)

	requestAnimationFrame(draw)
}
draw()
