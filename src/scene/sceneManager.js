import {Node, Tilemap, Input, Tileset, load, Vector2, CollisionBox, TextSprite, Sprite} from "../base/joaoEngine.js"
import updateCamera from "./camera.js"
import loadWorld from "./sceneLoader.js"
import handleTransitions from "./transition.js"
import behindtree from "./behindtree.js"

const sceneManager = new Node()

sceneManager.previous = 0
sceneManager.current = 0
sceneManager.cameraActive = true
sceneManager.fadeDelay = 30
sceneManager.cooldown = 0  //para impedir o player de ficar indo e voltando toda hora
sceneManager.input = new Input()
sceneManager.battle = false
sceneManager.enemy = null
sceneManager.shop = null
sceneManager.turn = null
sceneManager.option = 0
sceneManager.enterBattle = 0
sceneManager.exitBattle = 0
sceneManager.attack = 0
sceneManager.options = new Sprite(await load("assets/sprites/options.png"))
sceneManager.background = new Sprite(await load("assets/sprites/background.png"))
sceneManager.hud = new Sprite(await load("assets/sprites/hud.png"))
sceneManager.bar1 = new Sprite(await load("assets/sprites/health.png"))
sceneManager.bar2 = new Sprite(await load("assets/sprites/health.png"))
sceneManager.textbox = new Sprite(await load("assets/sprites/textbox.png"))
sceneManager.text = new TextSprite(await load("assets/sprites/SMW.Monospace.png"), "Um inimigo selvagem\navança para o combate\n\nescolha sua ação", true)
sceneManager.text.filter = "brightness(10%)"
sceneManager.textbox.add(sceneManager.text)
sceneManager.optionsTarget = new Vector2()
sceneManager.npcs = []


sceneManager.addRoom = function(index){
	for(let layer of this.tilemaps[index].children) this.add(layer)
	this.previous = this.current
	this.current = index
	this.cameraBounds = {
		xMin: this.tilemaps[index].worldX,
		yMin: this.tilemaps[index].worldY,
		xMax: this.tilemaps[index].worldX + this.tilemaps[index].width - 256,
		yMax: this.tilemaps[index].worldY + this.tilemaps[index].height - 224
	}
}

//carrega o mundo e adiciona a primeira sala
Object.assign(sceneManager, await loadWorld())
sceneManager.addRoom(0)

sceneManager.original = sceneManager.update

sceneManager.update = function(){
	this.original()

    this.right = this.input.isPressed("d")
    this.left = this.input.isPressed("a")
    this.confirm = this.input.isPressed("z")

	this.children.sort((a, b) => a.z - b.z)

	//se não houver player definido, ignora
	if(!this.player)return

	updateCamera(this)
	handleTransitions(this)

    for(const obj of this.getAllNodes(this)){
        if(obj.enemy && !this.battle){
            //var distance = Math.sqrt(((this.player.pos.x - obj.pos.x)**2) + ((this.player.pos.y - obj.pos.y)**2))
            if(obj.children[1].intersects(this.player.children[1])){
                this.battle = true
                this.enemy = obj
                this.turn = this.player
                this.enterBattle = 100
                this.color = "rgba(0, 0, 0, 0)"
                this.draw = (ctx) => {
                    this.drawOriginal(ctx)
                    this.ctx.fillStyle = this.color
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
                }
                this.cameraActive = false
                //for(let layer of this.tilemaps[this.previous].children) this.remove(layer)
            }
        }

        if (obj.shop && !this.shop) {
            // if
        }
    }
    if(this.battle){
        if(this.enemy){
        if(this.enemy.hp <= 0 && this.exitBattle <= 0){
            this.attack = 0
            this.exitBattle = 100
            this.draw = (ctx) => {
                this.drawOriginal(ctx)
                this.ctx.fillStyle = this.color
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
            }
        }
    }
        this.bar1.pos.x = (this.player.hp*0.75) - 49
        this.bar1.pos.y = 25
        this.bar2.pos.y = 25
        if(this.enemy)this.bar2.pos.x = -(this.enemy.hp*2.8) + 250
        if (this.enterBattle > 0) {
    this.enterBattle--;

    // --------------- FASE 1: Fade para preto (80 → 60)
    if (this.enterBattle < 80 && this.enterBattle > 60) {
        const t = 1 - ((this.enterBattle - 60) / 20);
        this.color = `rgba(0, 0, 0, ${t})`;
    }

    // --------------- FASE 2: Momento da troca (60)
    else if (this.enterBattle === 60) {

        // ZERA a posição da cena: evita tela torta
        this.originalScenePos = new Vector2(this.pos.x, this.pos.y);
        this.pos.set(0, 0);

        // Remove o tilemap da cena
        for (let layer of this.tilemaps[this.current].children) {
            this.remove(layer);
        }

        // Remove NPCs da cena
        this.npcs = [];
        for (let child of [...this.children]) {
            if (child !== this.player && child !== this.enemy) {
                this.npcs.push(child);
                this.remove(child);
            }
        }

        // Salva a posição original do player
        this.originalPos = new Vector2(this.player.pos.x, this.player.pos.y);

        // Coloca PLAYER e ENEMY em posições absolutas
        this.player.pos.set(55, 90);
        this.player.children[0].play("idle_right");

        this.enemy.pos.set(180, 90);

        // Adiciona UI de batalha
        this.add(this.background);
        this.add(this.options);
        this.add(this.bar1);
        this.add(this.bar2);
        this.add(this.hud);
        this.add(this.textbox);

        this.textbox.pos.set(8, 148);
        this.text.pos.set(16, 12);
    }

    // --------------- FASE 3: Tela preta (60 → 20)
    else if (this.enterBattle < 60 && this.enterBattle >= 20) {
        this.color = "rgba(0, 0, 0, 1)";
    }

    // --------------- FASE 4: Fade de volta (20 → 0)
    else if (this.enterBattle < 20 && this.enterBattle > 0) {
        const t = this.enterBattle / 20;
        this.color = `rgba(0, 0, 0, ${t})`;
    }

    // --------------- FIM DA TRANSIÇÃO
    if (this.enterBattle <= 0) {
        this.draw = this.drawOriginal;
    }
}
        if(this.exitBattle > 0){
            this.exitBattle--
            if (this.exitBattle < 80 && this.exitBattle > 60) {
                this.color = "rgba(0, 0, 0," + (1 - ((this.exitBattle - 60) / 20)) + ")";
            }
            else if (this.exitBattle == 60){
                this.cameraActive = true
                    this.player.pos.set(this.originalPos.x, this.originalPos.y)
                    this.remove(this.enemy)
                    this.remove(this.options)
                    this.remove(this.background)
                    this.remove(this.hud)
                    this.remove(this.bar1)
                    this.remove(this.bar2)
                    this.remove(this.textbox)
                    this.enemy = null
                    this.addRoom(this.current)
                    for(let npc of this.npcs) this.add(npc)

            }
            else if (this.exitBattle < 60 && this.exitBattle >= 20) {
                this.color = "rgba(0, 0, 0, 1)"; 
            }
            else if (this.exitBattle < 20 && this.exitBattle > 0) {
                this.color = "rgba(0, 0, 0," + ((this.exitBattle / 20)) + ")";
            }
            if(this.exitBattle <= 0){
                this.draw = this.drawOriginal;
                this.battle = false
                this.player.active = true
            }
        }
        if(this.attack > 0){
            this.attack--

            if(this.attack == 60) {
                this.enemy.hp-= 10
                this.text.text = "o inimigo recebeu\n10 de dano"
                
                if(this.enemy.hp <= 0) this.text.text = "vitória!"
                this.text.currentChar = 0
            }
            if(this.attack <= 0) this.turn = this.player
        }
        if(this.turn == this.player){
            if(this.right){
                this.option++
                if(this.option > 3) this.option = 0
            }
            if(this.left){
                this.option--
                if(this.option < 0) this.option = 3
            }
            this.optionsTarget.set(this.player.pos.x-(17*this.option)+11, this.player.pos.y-8)
            this.options.pos = this.options.pos.add(this.optionsTarget.sub(this.options.pos).scale(0.1))
            if(this.confirm){
                if(this.option == 3){
                    this.exitBattle = 100
                    this.draw = (ctx) => {
                        this.drawOriginal(ctx)
                        this.ctx.fillStyle = this.color
                        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
                    }
                }
                if(this.option == 0){
                    this.attack = 120
                    this.turn = this.enemy
                }
            }
        }
    }
}


sceneManager.draw = behindtree.draw


sceneManager.drawOriginal = sceneManager.draw

export default sceneManager
