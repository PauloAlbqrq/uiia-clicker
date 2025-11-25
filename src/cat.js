import Sprite from "./base/Sprite.js"
import TextSprite from "./base/TextSprite.js"
import {Vector2, Input, load} from "./base/Utils.js"
import Node from "./base/Node.js"
import CollisionBox from "./base/CollisionBox.js"
import StaticBody from "./base/StaticBody.js"
import DynamicBody from "./base/DynamicBody.js"

const cat = new DynamicBody()
cat.active = true
cat.hp = 100
cat.kp = 0
cat.kc = 99999
cat.xp = 0
const catBox = new CollisionBox(16, 16, 8, 12)
const catImage = await load("assets/sprites/cat.png")
const animation = {idle_down: [[0, 0]],
	idle_right: [[0, 1]],
	idle_up: [[0, 2]],
	idle_left: [[0, 3]],
	walk_down: [[0, 0], [1, 0], [2, 0], [3, 0]],
	walk_right: [[0, 1], [1, 1], [2, 1], [3, 1]],
	walk_up: [[0, 2], [1, 2], [2, 2], [3, 2]],
	walk_left: [[0, 3], [1, 3], [2, 3], [3, 3]],
	sit_licking: [[0, 5], [1, 5], [2, 5], [3, 5]]
}
//timerzin
var tempo = null;
let intervalId = null;
let isSitting = false;

function resetTimer() {
  tempo = 3;
  isSitting = false;
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    tempo--;
    if (tempo <= 0) {
      clearInterval(intervalId);
      isSitting = true;
    }
  }, 1000);
}

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (['w', 'a', 's', 'd'].includes(key)) {
    resetTimer();
  }
});


const catSprite = new Sprite(catImage, 4, 9, animation)
cat.input = new Input()

const dialogNode = new Node()
const dialogCollision = new CollisionBox(8, 8, 4, 4)
dialogNode.pos.set(8, 32)
dialogNode.add(dialogCollision)

cat.add(catSprite, catBox, dialogNode)

cat.original = cat.update	

cat.update = function(){
  this.original();

  this.vel.set(0, 0);
  if(this.active){
    this.vel.x = (this.input.keys.d - this.input.keys.a);
    this.vel.y = (this.input.keys.s - this.input.keys.w);
  }

  if(isSitting) {
	this.children[0].frameDuration = 10;
    this.children[0].play("sit_licking");
    this.vel.set(0, 0); // garante que o gato não ande
  }
  else {
    this.children[0].frameDuration = 5 - (this.input.keys.shift*2);
    this.speed = 1 * (this.input.keys.shift+1);

    if(this.vel.x > 0) {
      this.children[0].play("walk_right");
      this.children[1].setAttributes(18, 14, 10, 14);
      this.children[2].pos.set(32, 14);
    }
    else if(this.vel.x < 0){
      this.children[0].play("walk_left");
      this.children[1].setAttributes(18, 14, 6, 14);
      this.children[2].pos.set(-16, 14);
    } 
    else if(this.vel.y > 0) {
      this.children[0].play("walk_down");
      this.children[1].setAttributes(12, 16, 10, 12);
      this.children[2].pos.set(8, 32);
    }
    else if(this.vel.y < 0){
      this.children[0].play("walk_up");
      this.children[1].setAttributes(12, 16, 10, 12);
      this.children[2].pos.set(8, -8);
    }
    else if(this.children && this.children[0] && typeof this.children[0].play === 'function'){
      this.children[0].play(Object.keys(this.children[0].animations)[Object.keys(this.children[0].animations).indexOf(this.children[0].currentAnimation)-4]);
    }
  }
};

export default cat
