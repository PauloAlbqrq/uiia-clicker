import { Node, StaticBody, Sprite, CollisionBox, TextSprite, Vector2, load } from "./base/joaoEngine.js"
import cat from "./cat.js"
import dialogManager from "./dialogManager.js"
import sceneManager from "./scene/sceneManager.js"

cat.pos.set(100, 100)
cat.z = 2.5

dialogManager.dialogCollision = cat.children[2].children[0]
dialogManager.pos.y = 148
dialogManager.pos.x = 8

sceneManager.player = cat

//sans
const sans = new StaticBody()
sans.dialog = ["oieeeeeeee eu sou o sans\no sans undertale -w-\n ,;,w,;,/*"]
sans.pos.set(368, -120)
sans.z = 1.1
sans.add(new Sprite(await load("assets/sprites/sans.png")))
sans.add(new CollisionBox(16, 24, 3, 0))
sans.enemy = true

// yahu
const amogus = new StaticBody()
amogus.pos.set(195, 73)
amogus.z = 1.1
amogus.add(new Sprite(await load("assets/sprites/amogusSprite.png")))
amogus.add(new CollisionBox(16, 25, 0, 0, true))
amogus.dialog = ["Lojinha sus"]
amogus.dialogChoices = [
    {
    text: "comprar",
    function: () => {
        dialogManager.shop = true
        dialogManager.active = false
        sceneManager.shop = true
    }
},
{
    text: "sair",
    function: () => {
        console.log('sair')
        dialogManager.shop = false
        dialogManager.active = false
        sceneManager.shop = false
    }
}
]
amogus.shop = true

const hud = new Node()
const game = new Node()


sceneManager.add(sans, cat, amogus)
game.add(sceneManager, dialogManager)

game.start(() => {
    if (dialogManager.active) cat.active = false
    else if (dialogManager.interacting && !dialogManager.active) cat.active = true
    if (sceneManager.battle) cat.active = false
    if (sceneManager.shop) cat.active = false
})

