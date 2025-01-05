import { rotateCannon } from "./utils/rotate.js";

const gameArea = document.getElementById("gameArea");
const ctx = gameArea.getContext("2d");

gameArea.width = window.innerWidth;
gameArea.height = 720;

const background = new Image();
const ground = new Image();
const cannon_base = new Image();
const cannon = new Image();
const sun = new Image();

background.src = "assets/background.png";
ground.src = "assets/ground.png";
cannon_base.src = "assets/cannon2.png";
cannon.src = "assets/cannon.png";
sun.src = "assets/sun.png";

const pivotX = 100 + cannon_base.width / 2;
const pivotY = gameArea.height - ground.height - cannon_base.height;

const drawGame = () => {
    ctx.clearRect(0, 0, gameArea.width, gameArea.height);

    ctx.drawImage(background, 0, 0, gameArea.width, gameArea.height);
    for (let x = 0; x < gameArea.width; x += ground.width) {
        ctx.drawImage(ground, x, gameArea.height - ground.height);
    }

    ctx.drawImage(
        cannon_base,
        100,
        gameArea.height - ground.height - cannon_base.height
    );
    ctx.drawImage(sun, 1024, 100, 128, 128);

    rotateCannon(ctx, pivotX, pivotY, cannon, 0);
};

const imagesLoaded = [background, ground, cannon_base, cannon, sun];
let loadedCount = 0;

imagesLoaded.forEach((img) => {
    img.onload = () => {
        loadedCount++;
        if (loadedCount === imagesLoaded.length) {
            drawGame();
        }
    };
});

window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        rotateCannon(ctx, pivotX, pivotY, cannon, -5);
        drawGame();
    } else if (event.key === "ArrowRight") {
        rotateCannon(ctx, pivotX, pivotY, cannon, 5);
        drawGame();
    }
});
