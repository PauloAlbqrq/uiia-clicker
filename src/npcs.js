import { StaticBody, Sprite, CollisionBox, load } from "./base/joaoEngine.js";

const catAnimations4x8 = {
  idle_down: [[0, 0]],
  idle_right: [[0, 1]],
  idle_up: [[0, 2]],
  idle_left: [[0, 3]],
  walk_down: [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  walk_right: [
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
  ],
  walk_up: [
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
  ],
  walk_left: [
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
  ],
  // Poses deitadas/especiais
  idle_sleeping_down: [[0, 4]], // Deitado olhando pra baixo
  idle_sleeping_right: [[0, 5]], // Deitado olhando pra direita
  idle_sleeping_up: [[0, 6]], // Deitado olhando pra cima
  idle_sleeping_left: [[0, 7]], // Deitado olhando pra esquerda
  sleeping_down: [
    [0, 4],
    [1, 4],
  ], // Animação dormindo
  sleeping_right: [
    [0, 5],
    [1, 5],
  ],
  sleeping_up: [
    [0, 6],
    [1, 6],
  ],
  sleeping_left: [
    [0, 7],
    [1, 7],
  ],
};

// Animações para spritesheet 4x9 (mesmo formato do jogador)
const catAnimations4x9 = {
  idle_down: [[0, 0]],
  idle_right: [[0, 1]],
  idle_up: [[0, 2]],
  idle_left: [[0, 3]],
  walk_down: [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  walk_right: [
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
  ],
  walk_up: [
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
  ],
  walk_left: [
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
  ],
};

// Animações para spritesheet 12x4 (cow/vaca, orange-white)
const catAnimations12x4 = {
  idle_down: [[0, 0]],
  idle_right: [[0, 1]],
  idle_up: [[0, 2]],
  idle_left: [[0, 3]],
  walk_down: [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  walk_right: [
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
  ],
  walk_up: [
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
  ],
  walk_left: [
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
  ],
};

// Animações para spritesheet 12x5 (brown/marrom)
const catAnimations12x5 = {
  idle_down: [[0, 0]],
  idle_right: [[0, 1]],
  idle_up: [[0, 2]],
  idle_left: [[0, 3]],
  walk_down: [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  walk_right: [
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
  ],
  walk_up: [
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
  ],
  walk_left: [
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
  ],
};

export async function createNPCs() {
  // OTIMIZAÇÃO: Carregar todos os sprites em paralelo (muito mais rápido!)
  const [brownImg, grayImg, whiteImg, orangeImg, blackImg, newImg, purpleImg] =
    await Promise.all([
      load("assets/sprites/brown_cat.png"),
      load("assets/sprites/gray_cat.png"),
      load("assets/sprites/white_cat.png"),
      load("assets/sprites/orange_cat.png"),
      load("assets/sprites/black_cat.png"),
      load("assets/sprites/new_cat.png"),
      load("assets/sprites/purple_cat.png"),
    ]);

  const npcs = [];

  // Gato marrom
  const brownCat = new StaticBody();
  brownCat.pos.set(200, 150);
  brownCat.z = 1.1;
  const brownSprite = new Sprite(brownImg, 12, 5, catAnimations12x5);
  brownSprite.play("idle_down");
  brownCat.add(brownSprite);
  brownCat.add(new CollisionBox(16, 16, 8, 12));
  brownCat.dialog = ["Miau! Quero CATNIP!"];
  npcs.push(brownCat);

  // Gato cinza
  const grayCat = new StaticBody();
  grayCat.pos.set(300, 200);
  grayCat.z = 1.1;
  const graySprite = new Sprite(grayImg, 4, 8, catAnimations4x8);
  graySprite.play("idle_left");
  grayCat.add(graySprite);
  grayCat.add(new CollisionBox(16, 16, 8, 12));
  grayCat.dialog = ["Miau miau! ^w^\nQuer brincar?"];
  npcs.push(grayCat);

  // Gato branco
  const whiteCat = new StaticBody();
  whiteCat.pos.set(320, 50);
  whiteCat.z = 1.1;
  const whiteSprite = new Sprite(whiteImg, 4, 8, catAnimations4x8);
  whiteSprite.play("idle_down");
  whiteCat.add(whiteSprite);
  whiteCat.add(new CollisionBox(16, 16, 8, 12));
  whiteCat.dialog = ["Miau! Adoro peixes!"];
  npcs.push(whiteCat);

  // Gato laranja
  const grayCat3 = new StaticBody();
  grayCat3.pos.set(120, 200);
  grayCat3.z = 1.1;
  const orangeSprite = new Sprite(grayImg, 4, 8, catAnimations4x8);
  orangeSprite.play("idle_up");
  grayCat3.add(orangeSprite);
  grayCat3.add(new CollisionBox(16, 16, 8, 12));
  grayCat3.dialog = ["Miau miau!\nEstou procurando aventura!"];
  npcs.push(grayCat3);

  // Gato preto
  const blackCat = new StaticBody();
  blackCat.pos.set(400, 300);
  blackCat.z = 1.1;
  const blackSprite = new Sprite(blackImg, 4, 9, catAnimations4x9);
  blackSprite.play("idle_left");
  blackCat.add(blackSprite);
  blackCat.add(new CollisionBox(16, 16, 8, 12));
  blackCat.dialog = ["Miau... somos iguais?!\nsIrmãos de outra mãe?"];
  npcs.push(blackCat);

  // Gato novo
  const newCat = new StaticBody();
  newCat.pos.set(250, 100);
  newCat.z = 1.1;
  const newSprite = new Sprite(newImg, 4, 8, catAnimations4x8);
  newSprite.play("idle_down");
  newCat.add(newSprite);
  newCat.add(new CollisionBox(16, 16, 8, 12));
  newCat.dialog = ["Miau! Sou novo aqui!"];
  npcs.push(newCat);

  // Gato roxo
  const purpleCat = new StaticBody();
  purpleCat.pos.set(130, 280);
  purpleCat.z = 1.1;
  const purpleSprite = new Sprite(purpleImg, 4, 8, catAnimations4x8);
  purpleSprite.play("idle_down");
  purpleCat.add(purpleSprite);
  purpleCat.add(new CollisionBox(16, 16, 8, 12));
  purpleCat.dialog = ["Miau! Gosto de magia e feitiços!"];
  npcs.push(purpleCat);

  // Gato cinza 2 - explorando
  const grayCat2 = new StaticBody();
  grayCat2.pos.set(440, 120);
  grayCat2.z = 1.1;
  const graySprite2 = new Sprite(grayImg, 4, 8, catAnimations4x8);
  graySprite2.play("idle_right");
  grayCat2.add(graySprite2);
  grayCat2.add(new CollisionBox(16, 16, 8, 12));
  grayCat2.dialog = ["Miau! Estou explorando!"];
  npcs.push(grayCat2);

  // Gato branco 2 - descansando
  const whiteCat2 = new StaticBody();
  whiteCat2.pos.set(500, 280);
  whiteCat2.z = 1.1;
  const whiteSprite2 = new Sprite(whiteImg, 4, 9, catAnimations4x9);
  whiteSprite2.play("idle_right");
  whiteCat2.add(whiteSprite2);
  whiteCat2.add(new CollisionBox(16, 16, 8, 12));
  whiteCat2.dialog = ["Miau~ Que dia lindo!"];
  npcs.push(whiteCat2);

  // Gato laranja 2 - correndo
  const orangeCat2 = new StaticBody();
  orangeCat2.pos.set(30, 140);
  orangeCat2.z = 1.1;
  const orangeSprite2 = new Sprite(orangeImg, 4, 8, catAnimations4x8);
  orangeSprite2.play("idle_down");
  orangeCat2.add(orangeSprite2);
  orangeCat2.add(new CollisionBox(16, 16, 8, 12));
  orangeCat2.dialog = ["Miau miau! Rápido como o vento!"];
  npcs.push(orangeCat2);

  // Gato preto 2 - escondido
  const blackCat2 = new StaticBody();
  blackCat2.pos.set(350, 80);
  blackCat2.z = 1.1;
  const blackSprite2 = new Sprite(blackImg, 4, 8, catAnimations4x8);
  blackSprite2.play("idle_up");
  blackCat2.add(blackSprite2);
  blackCat2.add(new CollisionBox(16, 16, 8, 12));
  blackCat2.dialog = ["Miau... Shh, silêncio..."];
  npcs.push(blackCat2);

  // Gato roxo 2 - estudando
  const purpleCat2 = new StaticBody();
  purpleCat2.pos.set(280, 310);
  purpleCat2.z = 1.1;
  const purpleSprite2 = new Sprite(purpleImg, 4, 8, catAnimations4x8);
  purpleSprite2.play("idle_right");
  purpleCat2.add(purpleSprite2);
  purpleCat2.add(new CollisionBox(16, 16, 8, 12));
  purpleCat2.dialog = ["Miau! Estou estudando\nfeitiços!"];
  npcs.push(purpleCat2);

  // Gato novo 2 - brincando
  const newCat2 = new StaticBody();
  newCat2.pos.set(430, 220);
  newCat2.z = 1.1;
  const newSprite2 = new Sprite(newImg, 4, 8, catAnimations4x8);
  newSprite2.play("idle_left");
  newCat2.add(newSprite2);
  newCat2.add(new CollisionBox(16, 16, 8, 12));
  newCat2.dialog = ["Miau miau! Vamos brincar?"];
  npcs.push(newCat2);

  // Gato marrom 2 - vendedor ambulante
  const brownCat2 = new StaticBody();
  brownCat2.pos.set(530, 160);
  brownCat2.z = 1.1;
  const brownSprite2 = new Sprite(brownImg, 12, 5, catAnimations12x5);
  brownSprite2.play("idle_right");
  brownCat2.add(brownSprite2);
  brownCat2.add(new CollisionBox(16, 16, 8, 12));
  brownCat2.dialog = ["Miau! Precisa de algo? \n Estou vendendo!"];
  npcs.push(brownCat2);

  // Gato laranja 3 - caçando
  const orangeCat3 = new StaticBody();
  orangeCat3.pos.set(520, 50);
  orangeCat3.z = 1.1;
  const orangeSprite3 = new Sprite(orangeImg, 4, 8, catAnimations4x8);
  orangeSprite3.play("idle_left");
  orangeCat3.add(orangeSprite3);
  orangeCat3.add(new CollisionBox(16, 16, 8, 12));
  orangeCat3.dialog = ["Miau! Vi um passarinho!"];
  npcs.push(orangeCat3);

  // Gato preto 3 - vigia
  const blackCat3 = new StaticBody();
  blackCat3.pos.set(50, 250);
  blackCat3.z = 1.1;
  const blackSprite3 = new Sprite(blackImg, 4, 8, catAnimations4x8);
  blackSprite3.play("idle_right");
  blackCat3.add(blackSprite3);
  blackCat3.add(new CollisionBox(16, 16, 8, 12));
  blackCat3.dialog = ["Miau... Vigiando a área \n escondido..."];
  npcs.push(blackCat3);

  // Gato roxo 3 - lendo
  const purpleCat3 = new StaticBody();
  purpleCat3.pos.set(380, 340);
  purpleCat3.z = 1.1;
  const purpleSprite3 = new Sprite(purpleImg, 4, 9, catAnimations4x9);
  purpleSprite3.play("idle_down");
  purpleCat3.add(purpleSprite3);
  purpleCat3.add(new CollisionBox(16, 16, 8, 12));
  purpleCat3.dialog = ["Miau... Este livro é \n fascinante!"];
  npcs.push(purpleCat3);

  // Gato novo 3 - saltando
  const newCat3 = new StaticBody();
  newCat3.pos.set(280, 180);
  newCat3.z = 1.1;
  const newSprite3 = new Sprite(newImg, 4, 8, catAnimations4x8);
  newSprite3.play("idle_up");
  newCat3.add(newSprite3);
  newCat3.add(new CollisionBox(16, 16, 8, 12));
  newCat3.dialog = ["Miau! Olhe como salto alto!"];
  npcs.push(newCat3);

  // Gato cinza 4 - DEITADO DESCANSANDO
  const grayCat4 = new StaticBody();
  grayCat4.pos.set(540, 310);
  grayCat4.z = 1.1;
  const graySprite4 = new Sprite(grayImg, 4, 8, catAnimations4x8);
  graySprite4.play("idle_sleeping_right");
  grayCat4.add(graySprite4);
  grayCat4.add(new CollisionBox(16, 16, 8, 12));
  grayCat4.dialog = ["Miau~ Descansando ao sol!"];
  npcs.push(grayCat4);

  // Gato branco 4 - fazendo ginástica
  const whiteCat4 = new StaticBody();
  whiteCat4.pos.set(370, 150);
  whiteCat4.z = 1.1;
  const whiteSprite4 = new Sprite(whiteImg, 4, 9, catAnimations4x9);
  whiteSprite4.play("idle_left");
  whiteCat4.add(whiteSprite4);
  whiteCat4.add(new CollisionBox(16, 16, 8, 12));
  whiteCat4.dialog = ["Miau! Exercícios são\nimportantes!"];
  npcs.push(whiteCat4);

  // Gato laranja 4 - DEITADO RELAXANDO
  const orangeCat4 = new StaticBody();
  orangeCat4.pos.set(60, 90);
  orangeCat4.z = 1.1;
  const orangeSprite4 = new Sprite(orangeImg, 4, 8, catAnimations4x8);
  orangeSprite4.play("idle_sleeping_left");
  orangeCat4.add(orangeSprite4);
  orangeCat4.add(new CollisionBox(16, 16, 8, 12));
  orangeCat4.dialog = ["Miau... Que preguiça..."];
  npcs.push(orangeCat4);

  return npcs;
}

// Função helper para criar NPCs gatos customizados
export async function createCatNPC(
  spritePath,
  x,
  y,
  dialogText,
  direction = "down",
  isEnemy = false,
  spriteType = "4x8"
) {
  const npc = new StaticBody();
  npc.pos.set(x, y);
  npc.z = 1.1;

  // Escolher configuração baseada no tipo de sprite
  let cols, rows, animations;
  if (spriteType === "4x8") {
    cols = 4;
    rows = 8;
    animations = catAnimations4x8;
  } else if (spriteType === "12x4") {
    cols = 12;
    rows = 4;
    animations = catAnimations12x4;
  } else if (spriteType === "12x5") {
    cols = 12;
    rows = 5;
    animations = catAnimations12x5;
  }

  const sprite = new Sprite(await load(spritePath), cols, rows, animations);
  sprite.play(`idle_${direction}`);
  npc.add(sprite);

  npc.add(new CollisionBox(16, 16, 8, 12));
  npc.dialog = [dialogText];
  npc.enemy = isEnemy;

  return npc;
}
