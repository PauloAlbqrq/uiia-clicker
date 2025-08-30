export function resizeCanvas() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const scaleX = windowWidth / canvas.width;
      const scaleY = windowHeight / canvas.height;
      const scale = Math.min(scaleX, scaleY);

      canvas.style.width = canvas.width * scale + "px";
      canvas.style.height = canvas.height * scale + "px";
}

