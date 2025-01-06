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
const bullet = new Image();

background.src = "assets/background.png";
ground.src = "assets/ground.png";
cannon_base.src = "assets/cannon2.png";
cannon.src = "assets/cannon.png";
sun.src = "assets/sun.png";
bullet.src = "assets/bullet.png";

const pivotX = 100 + cannon_base.width / 2;
const pivotY = gameArea.height - ground.height - cannon_base.height;

const drawGame = () => {
    ctx.clearRect(0, 0, gameArea.width, gameArea.height);

    ctx.drawImage(background, 0, 0, gameArea.width, gameArea.height);
    for (let x = 0; x < gameArea.width; x += ground.width) {
        ctx.drawImage(ground, x, gameArea.height - ground.height);
    }
    rotateCannon(ctx, pivotX, pivotY, cannon, 0);
    ctx.drawImage(
        cannon_base,
        100,
        gameArea.height - ground.height - cannon_base.height
    );
    ctx.drawImage(sun, 1024, 100, 128, 128);
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
let currentVelocity = 0;
let increasing = true;
const angle = 45;
function drawProjectilePath(initialVelocity, angle, gravity = 9.8, timeInterval  = 0.1){
    // Clear the canvas
    ctx.clearRect(0, 0, gameArea.width, gameArea.height);

    // Redraw all objects
    drawBackground();
    drawCannon();
    drawCannonBase();
    drawSun();
    drawGround();

    const angleRad = (angle * Math.PI) / 180;
    const vx = initialVelocity * Math.cos(angleRad);
    const vy = initialVelocity * Math.sin(angleRad);
    ctx.beginPath();
    ctx.moveTo(0, gameArea.height);
    let t = 0;
    let x = 0;
    let y = 0;
    while (y >= 0) {
        x = vx * t;
        y = vy * t - 0.5 * gravity * t * t;

        const canvasX = x;
        const canvasY = gameArea.height - y;

        ctx.lineTo(canvasX, canvasY);

        t += timeInterval;

        if (canvasX > gameArea.width) break;
    }
    ctx.strokeStyle = `hsl(${initialVelocity * 3.6}, 100%, 50%)`; // Color changes with velocity
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, gameArea.height);
    ctx.lineTo(gameArea.width, gameArea.height);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.stroke();
}

// Example functions to draw other objects
function drawBackground() {
    ctx.drawImage(background, 0, 0, gameArea.width, gameArea.height);
}

function drawCannon() {
    rotateCannon(ctx, pivotX, pivotY, cannon, 0);
}

function drawCannonBase() {
    ctx.drawImage(
        cannon_base,
        100,
        gameArea.height - ground.height - cannon_base.height
    );
}

function drawSun() {
    ctx.drawImage(sun, 1024, 100, 128, 128);
}

function drawGround() {
    for (let x = 0; x < gameArea.width; x += ground.width) {
        ctx.drawImage(ground, x, gameArea.height - ground.height);
    }
}

function updateVelocity(){
    if(increasing){
        currentVelocity += 1;
        if(currentVelocity >= 100){
            increasing = false;
        }
    }else{
        currentVelocity -= 1;
        if(currentVelocity <= 0){
            increasing = true;
        }
    }
    drawProjectilePath(currentVelocity, angle);
}
setInterval(updateVelocity, 50);