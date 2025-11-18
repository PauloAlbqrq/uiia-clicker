import {Node, Input, Sprite, TextSprite, load} from "./base/joaoEngine.js"

const dialogManager = new Node()

dialogManager.dialogCollision = null
dialogManager.input = new Input()

dialogManager.original = dialogManager.update
dialogManager.active = false
dialogManager.sprite = new Sprite(await load("assets/sprites/textbox.png"))
dialogManager.textArray = []
dialogManager.text = new TextSprite(await load("assets/sprites/SMW.Monospace.png"), "aaa", true)
dialogManager.text.filter = "brightness(10%)"
dialogManager.text.frameDuration = 2
dialogManager.currentLine = 0
dialogManager.interacting = 0
dialogManager.update = function(){
	this.original()


	if(!this.dialogCollision)return
	this.interacting = this.input.isPressed("z")
	for(const obj of this.getAllNodes(this.getRoot())){
		if(obj != this.dialogCollision && this.dialogCollision.intersects(obj) && obj.parent.dialog && this.interacting && !this.active){
			this.add(this.sprite)
			this.add(this.text)
			this.textArray = obj.parent.dialog
			this.text.text = this.textArray[this.currentLine]
			this.text.currentChar = 0
			this.text.pos.set(16, 12)
			this.active = true
		}
	}
	if(this.active && this.interacting && this.text.currentChar >= this.text.text.length){
		this.currentLine++
		if(this.currentLine >= this.textArray.length){
			this.children = []
			this.active = false
			this.currentLine = 0
		}
		else{
			this.text.text = this.textArray[this.currentLine]
			this.text.currentChar = 0
		}
	}
	
}

export default dialogManager
