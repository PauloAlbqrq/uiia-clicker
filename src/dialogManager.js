import {Node, Input, Sprite, TextSprite, load} from "./base/joaoEngine.js"

const dialogManager = new Node()

dialogManager.dialogCollision = null
dialogManager.input = new Input()

dialogManager.original = dialogManager.update
dialogManager.active = false
dialogManager.sprite = new Sprite(await load("sprites/textbox.png"))
dialogManager.text = new TextSprite(await load("sprites/SMW.Monospace.png"), "aaa", true)

dialogManager.update = function(){
	this.original()


	if(!this.dialogCollision)return
	for(const obj of this.getAllNodes(this.getRoot())){
		if(obj != this.dialogCollision && this.dialogCollision.intersects(obj) && obj.parent.dialog && this.input.keys.z && !this.active){
			this.add(this.sprite)
			this.add(this.text)
			this.text.text = obj.parent.dialog
			this.text.currentChar = 0
			this.text.pos.set(85, 12)
			this.active = true
		}
	}
	if(this.active && this.input.keys.z && this.text.currentChar 
}

export default dialogManager
