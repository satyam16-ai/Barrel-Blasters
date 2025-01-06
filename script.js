import { rotateCannon , getCannonAngle } from "./utils/rotate.js";

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
        drawProjectilePath(currentVelocity);
    } else if (event.key === "ArrowRight") {
        rotateCannon(ctx, pivotX, pivotY, cannon, 5);
        drawProjectilePath(currentVelocity);
    }
});
let currentVelocity = 0;
let increasing = true;

function drawProjectilePath(initialVelocity, gravity = 9.8, timeInterval = 0.1) {
    // Clear and redraw background elements
    ctx.clearRect(0, 0, gameArea.width, gameArea.height);
    drawBackground();
    drawCannon();
    drawCannonBase();
    drawSun();
    drawGround();

    // Get current cannon angle (negative because cannon rotates upward)
    const angleRad = (-getCannonAngle() * Math.PI) / 180;
    
    // Calculate velocity components based on cannon angle
    const vx = initialVelocity * Math.cos(angleRad);
    const vy = initialVelocity * Math.sin(angleRad);

    // Draw trajectory path
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    
    let t = 0;
    let x = 0;
    let y = 0;
    
    while (y >= 0) {
        x = vx * t;
        y = vy * t - 0.5 * gravity * t * t;

        const canvasX = pivotX + x;
        const canvasY = pivotY - y;

        if (canvasX > gameArea.width || canvasY > gameArea.height) break;
        
        ctx.lineTo(canvasX, canvasY);
        t += timeInterval;
    }

    // Style and draw the path
    ctx.strokeStyle = `hsl(${initialVelocity * 3.6}, 100%, 50%)`;
    ctx.lineWidth = 2;
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

function updateVelocity() {
    if(increasing) {
        currentVelocity += 1;
        if(currentVelocity >= 100) {
            increasing = false;
        }
    } else {
        currentVelocity -= 1;
        if(currentVelocity <= 0) {
            increasing = true;
        }
    }
    drawProjectilePath(currentVelocity);
}

setInterval(updateVelocity, 50);