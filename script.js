const gameArea = document.getElementById("gameArea");
const ctx = gameArea.getContext("2d");
console.log(gameArea);
gameArea.width = window.innerWidth;
gameArea.height = 720;

const background = new Image();
const ground = new Image();
const crate = new Image();
crate.src = "assets/cannon2.png";
ground.src = "assets/ground.png";
background.src = "assets/background.png";

const drawGround = function drawGround() {
  ctx.drawImage(background, 0, 0, gameArea.width, gameArea.height);
  for (let x = 0; x < gameArea.width; x += ground.width) {
    ctx.drawImage(ground, x, gameArea.height - ground.height);
  }
  ctx.drawImage(crate, 0, gameArea.height - ground.height - crate.height);
};

background.onload = () => {
  drawGround();
};
