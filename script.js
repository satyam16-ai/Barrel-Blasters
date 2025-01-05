const gameArea = document.getElementById("gameArea");
const ctx = gameArea.getContext("2d");
console.log(gameArea);
gameArea.width = window.innerWidth;
gameArea.height = 720;

const background = new Image();
const ground = new Image();
const cannon_base = new Image();
const cannon = new Image();
const bullet = new Image();

cannon_base.src = "assets/cannon2.png";
ground.src = "assets/ground.png";
background.src = "assets/background.png";
cannon.src = "assets/cannon.png";
bullet.src = "assets/ball.png";

const drawGround = function drawGround() {
  ctx.drawImage(background, 0, 0, gameArea.width, gameArea.height);
  for (let x = 0; x < gameArea.width; x += ground.width) {
    ctx.drawImage(ground, x, gameArea.height - ground.height);
  }
  // Draw the cannon barrel first
  ctx.drawImage(
    cannon,
    ground.width + (cannon_base.width - cannon.width) / 2 + 30, 
    gameArea.height - ground.height - cannon_base.height - cannon.height / 2
  );
  ctx.drawImage(cannon_base, ground.width, gameArea.height - ground.height - cannon_base.height);
};

const imagesLoaded = [background, ground, cannon_base, cannon, bullet];
let loadedCount = 0;

imagesLoaded.forEach((img) => {
  img.onload = () => {
    loadedCount++;
    if (loadedCount === imagesLoaded.length) {
      drawGround();
    }
  };
});
