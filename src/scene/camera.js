import {Vector2} from "../base/joaoEngine.js"

export default function updateCamera(scene){

	if(!scene.cameraActive) return
	const target = new Vector2(
        scene.canvas.width / 2 - scene.player.pos.x - 16,
        scene.canvas.height / 2 - scene.player.pos.y - 22
	)
	target.x = Math.min(Math.max(target.x, -scene.cameraBounds.xMax), -scene.cameraBounds.xMin)
	target.y = Math.min(Math.max(target.y, -scene.cameraBounds.yMax), -scene.cameraBounds.yMin)

	scene.pos = scene.pos.add(target.sub(scene.pos).scale(0.1))
}
