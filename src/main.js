import {Node, StaticBody, Sprite, CollisionBox, TextSprite, Vector2, load} from "./base/joaoEngine.js"
import cat from "./cat.js"
import dialogManager from "./dialogManager.js"
import sceneManager from "./sceneManager.js"

cat.pos.set(300, 600)
cat.z = 1.5

dialogManager.dialogCollision = cat.children[2].children[0]
dialogManager.pos.y = 148

sceneManager.player = cat

//sans
const sans = new StaticBody()
sans.dialog = ["  oieeeeeeee\neu sou o sans\no sans undertale -w-\n ,;,w,;,/*"]
sans.pos.set(340, 770)
sans.z = 1.1
sans.add(new Sprite(await load("assets/sprites/sans.png")))
sans.add(new CollisionBox(16, 24, 3, 0))

const hud = new Node()
const game = new Node()

sceneManager.add(sans, cat)
hud.add(dialogManager)
game.add(sceneManager, hud)

game.start(()=>{
    if(dialogManager.active) cat.active = false
    else if(dialogManager.interacting && !dialogManager.active) cat.active = true
})

