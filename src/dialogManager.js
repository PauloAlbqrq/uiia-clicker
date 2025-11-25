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
dialogManager.interacting = false
dialogManager.shop = false
dialogManager.activeChoice = 0
dialogManager.shopOptions = []
dialogManager.reset = function() {
	this.active = false;
	this.textArray = []
	this.currentLine = 0
	this.interacting = true
}
dialogManager.update = function(){
	this.original()

    if(!this.dialogCollision) return

    this.interacting = this.input.isPressed("z")
    
    // 1. DETECT AND START DIALOG (Standard & Shop)
    for(const obj of this.getAllNodes(this.getRoot())){
        // Standard Dialog Start
        if(obj != this.dialogCollision && this.dialogCollision.intersects(obj) && obj.parent.dialog && !obj.parent.shop && this.interacting && !this.active){
            this.add(this.sprite)
            this.add(this.text)
            this.textArray = obj.parent.dialog
            this.text.text = this.textArray[this.currentLine]
            this.text.currentChar = 0
            this.text.pos.set(16, 12)
            this.shopOptions = [] // Ensure this is empty
            this.active = true
        }
        
        // Shop Dialog Start
        if(obj != this.dialogCollision && this.dialogCollision.intersects(obj) && obj.parent.dialog && obj.parent.shop && this.interacting && !this.active){
            this.add(this.sprite)
            this.add(this.text)
            this.textArray = ['Deseja comprar algo?']
            this.text.text = this.textArray[this.currentLine]
            this.text.currentChar = 0
            this.text.pos.set(16, 15)
            this.shopOptions = []
            this.active = true

            // Populate options
            obj.parent.dialogChoices.forEach((choice, index) => {
                if (index === this.activeChoice) {
                    this.text.text += `\n>>> ${choice.text}`
                } else {
                    this.text.text += `\n${choice.text}`
                }
                this.shopOptions.push(choice)
            })
        }
    }

    // 2. HANDLE TEXT PROGRESSION (Standard Only)
    // FIX: Added check "&& this.shopOptions.length === 0"
    // This prevents Z from skipping text when a menu is open
    if(this.active && this.interacting && this.text.currentChar >= this.text.text.length && this.shopOptions.length === 0){
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
	// handle shop choices
	if (this.active && this.shopOptions.length > 0) {

		// tecla W
		if (this.input.isPressed('w')) {
			this.activeChoice = (this.activeChoice - 1 + this.shopOptions.length) % this.shopOptions.length;
			console.log(this.activeChoice)
			this.reset();
			this.textArray = ['Deseja comprar algo?']
			this.text.text = this.textArray[this.currentLine]
			this.text.currentChar = 0
			this.text.pos.set(16, 15)
			this.active = true

			this.shopOptions.forEach((choice,index) => {
				if (index === this.activeChoice) {
					this.text.text += `\n>>> ${choice.text}`
				} else {
					this.text.text += `\n${choice.text}`
				}
			})
		}

		// tecla S
		if (this.input.isPressed('s')) {
			this.activeChoice = (this.activeChoice + 1) % this.shopOptions.length;
			console.log(this.activeChoice)
			this.reset();
			this.textArray = ['Deseja comprar algo?']
			this.text.text = this.textArray[this.currentLine]
			this.text.currentChar = 0
			this.text.pos.set(16, 15)
			this.active = true

			this.shopOptions.forEach((choice,index) => {
				if (index === this.activeChoice) {
					this.text.text += `\n>>> ${choice.text}`
				} else {
					this.text.text += `\n${choice.text}`
				}
			})
		}

		if (this.interacting && this.text.currentChar >= this.text.text.length) {
            const selectedOption = this.shopOptions[this.activeChoice];
            if(selectedOption && selectedOption.function) {
                selectedOption.function();
            }
        }
	}

	
	
}

export default dialogManager
