import { Node, Input, Sprite, TextSprite, load } from "./base/joaoEngine.js";
import cat from "./cat.js";

const dialogManager = new Node();

dialogManager.dialogCollision = null;
dialogManager.input = new Input();

dialogManager.original = dialogManager.update;
dialogManager.active = false;
dialogManager.sprite = new Sprite(await load("assets/sprites/textbox.png"));
dialogManager.textArray = [];
dialogManager.text = new TextSprite(
  await load("assets/sprites/SMW.Monospace.png"),
  "aaa",
  true
);
dialogManager.text.filter = "brightness(10%)";
dialogManager.text.frameDuration = 2;
dialogManager.currentLine = 0;
dialogManager.interacting = 0;
dialogManager.shop = false;
dialogManager.activeChoice = 0;
dialogManager.shopOptions = [];
dialogManager.update = function () {
  this.original();

  this.interacting = this.input.isPressed("z");

  if (this.input.isPressed("c") && !this.active) {
    this.add(this.sprite);
    this.add(this.text);
    this.textArray = [`stats\nHP: ${cat.hp}\nKP: ${cat.kp}\nKC: ${cat.kc}\nXP: ${cat.xp}`];
    this.text.text = this.textArray[this.currentLine];
    this.text.currentChar = 0;
    this.text.pos.set(16, 12);
    this.active = true;
  }

    if (!this.dialogCollision) return;

  for (const obj of this.getAllNodes(this.getRoot())) {
    if (
      obj != this.dialogCollision &&
      this.dialogCollision.intersects(obj) &&
      obj.parent.dialog &&
      !obj.parent.shop &&
      this.interacting &&
      !this.active
    ) {
      this.add(this.sprite);
      this.add(this.text);
      this.textArray = obj.parent.dialog;
      this.text.text = this.textArray[this.currentLine];
      this.text.currentChar = 0;
      this.text.pos.set(16, 12);
      this.active = true;
    }
    // shop dialog render
    if (
      obj != this.dialogCollision &&
      this.dialogCollision.intersects(obj) &&
      obj.parent.dialog &&
      obj.parent.shop &&
      this.interacting &&
      !this.active
    ) {
      this.add(this.sprite);
      this.add(this.text);
      this.textArray = ["Lojinha sus amogus"];
      this.text.text = this.textArray[this.currentLine];
      this.text.currentChar = 0;
      this.text.pos.set(16, 15);
      this.active = true;
      this.shopOptions = [];

      obj.parent.dialogChoices.forEach((choice, index) => {
        if (index === this.activeChoice) {
          this.text.text += `\n>> ${choice.text}`;
        } else {
          this.text.text += `\n${choice.text}`;
        }
        this.shopOptions.push(choice);
      });
    }
  }
  if (
    this.active &&
    this.interacting &&
    this.text.currentChar >= this.text.text.length
  ) {
    this.currentLine++;
    if (this.currentLine >= this.textArray.length) {
      this.children = [];
      this.active = false;
      this.currentLine = 0;
    } else {
      this.text.text = this.textArray[this.currentLine];
      this.text.currentChar = 0;
    }
  }
  // handle shop choices

  if (this.active && this.shopOptions.length > 0) {
    if (this.input.isPressed("s")) {
      this.activeChoice = (this.activeChoice + 1) % this.shopOptions.length;
      console.log(this.activeChoice);
      this.update();
    }
    if (this.input.isPressed("w")) {
      this.shopOptions[this.activeChoice].function();
      this.children = [];
      this.active = false;
      this.currentLine = 0;
      this.activeChoice = 0;
    }
  }
};

export default dialogManager;
