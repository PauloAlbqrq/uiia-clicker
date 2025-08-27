const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

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

var x = 10

const img = new Image()
img.src = "https://mario.wiki.gallery/images/9/97/YoshisIsland2.png"

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	ctx.drawImage(img, 0, 0)
	x++

	requestAnimationFrame(draw)
}
draw()
