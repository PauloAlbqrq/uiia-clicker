import {
  Node,
  StaticBody,
  Sprite,
  CollisionBox,
  TextSprite,
  Vector2,
  load,
} from "./base/joaoEngine.js";
import cat from "./cat.js";
import dialogManager from "./dialogManager.js";
import sceneManager from "./scene/sceneManager.js";
import { createNPCs } from "./npcs.js";

cat.pos.set(100, 100);
cat.z = 2.5;

dialogManager.dialogCollision = cat.children[2].children[0];
dialogManager.pos.y = 148;
dialogManager.pos.x = 8;

sceneManager.player = cat;

//sans
const sans = new StaticBody();
sans.dialog = ["oieeeeeeee eu sou o sans\no sans undertale -w-\n ,;,w,;,/*"];
sans.pos.set(368, -120);
sans.z = 1.1;
sans.add(new Sprite(await load("assets/sprites/sans.png")));
sans.add(new CollisionBox(16, 24, 3, 0));
sans.hp = 50

//geometria
const edu = new StaticBody();
edu.dialog = ["Olha essa geometria!!!!"];
edu.pos.set(170, 217);
edu.z = 1.1;
edu.add(new Sprite(await load("assets/sprites/edu.png")));
edu.add(new CollisionBox(16, 24, 3, 0));
edu.enemy = false;

const geo = new StaticBody();
geo.dialog = ["Esse cara gosta muito\nde mim."];
geo.pos.set(186, 217);
geo.z = 1.1;
geo.add(new Sprite(await load("assets/sprites/Slime.png")));
geo.add(new CollisionBox(16, 24, 3, 0));
geo.enemy = true;
geo.hp = 20

// SHOP LOGICA
function subtrairKittyCoins(nomeItem, valorItem) {
  if (cat.kc - valorItem >= 0) {
    cat.kc -= valorItem;
    dialogManager.renderOptions(`Comprou ${nomeItem}!`);
    console.log("Comprou Poção! - main.js:56");
  } else {
    dialogManager.renderOptions("LISO LISO!! Item não comprado.");
    console.log("Saldo insuficiente. Item não comprado. - main.js:59");
  }
}
const itemsForSale = [
  {
    text: "Poção (50g)",
    function: () => subtrairKittyCoins("Poção", 50),
  },
  {
    text: "Espada (100g)",
    function: () => subtrairKittyCoins("Espada", 100),
  },
  {
    text: "Voltar",
    function: () => {
      // Restore Main Menu
      loadMainMenu();
    },
  },
];

const mainMenuActions = [
  {
    text: "Comprar",
    function: () => {
      // Switch to Item List
      dialogManager.shopOptions = itemsForSale;
      dialogManager.activeChoice = 0; // Reset cursor to top
      dialogManager.renderOptions("O que vai levar?"); // Update text header
    },
  },
  {
    text: "Sair",
    function: () => {
      console.log("sair - main.js:93");
      dialogManager.shop = false;
      dialogManager.children = [];
      dialogManager.active = false;
      dialogManager.currentLine = 0;
      sceneManager.shop = false;
    },
  },
];

function loadMainMenu() {
  dialogManager.shopOptions = mainMenuActions;
  dialogManager.activeChoice = 0;
  dialogManager.renderOptions("Lojinha suspeita");
}

const amogus = new StaticBody();
amogus.pos.set(170, 73);
amogus.z = 1.1;
amogus.add(new Sprite(await load("assets/sprites/purple_catloja.png")));
amogus.add(new CollisionBox(16, 25, 0, 0, true));
amogus.dialog = ["Lojinha suspeita"];
amogus.dialogChoices = mainMenuActions;
amogus.shop = true;

const hud = new Node();
const game = new Node();

// Carregar NPCs do arquivo npcs.js
const npcs = await createNPCs();

sceneManager.add(sans, cat, amogus, edu, geo, ...npcs);
game.add(sceneManager, dialogManager);

game.start(() => {
  if (dialogManager.active) cat.active = false;
  else if (dialogManager.interacting && !dialogManager.active)
    cat.active = true;
  if (sceneManager.battle) cat.active = false;
  if (sceneManager.shop) cat.active = false;
});
