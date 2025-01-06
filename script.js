import { rotateCannon, getCannonAngle } from "./utils/rotate.js";

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

// Add projectile state
let projectile = {
    active: false,
    time: 0,
    initialVelocity: 0,
    angle: 0
};

let currentVelocity = 10;
let increasing = true;
const MIN_VELOCITY = 60; // Set minimum velocity
const MAX_VELOCITY = 120; 

function drawProjectilePath(initialVelocity, gravity = 9.8, timeInterval = 0.1) {
    const angleRad = (-getCannonAngle() * Math.PI) / 180;
    const vx = initialVelocity * Math.cos(angleRad);
    const vy = initialVelocity * Math.sin(angleRad);

    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    
    let t = 0;
    let hitGround = false;
    
    while (!hitGround) {
        const x = vx * t;
        const y = vy * t - 0.5 * gravity * t * t;

        const canvasX = pivotX + x;
        const canvasY = pivotY - y;

        if (canvasX > gameArea.width || canvasY > gameArea.height - ground.height) {
            hitGround = true;
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
        t += timeInterval;
    }

    // Style and draw the path
    ctx.strokeStyle = `hsl(${initialVelocity * 3.6}, 100%, 50%)`; // Color changes with velocity
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
}

function updateAndDrawProjectile() {
    if (!projectile.active) return;

    const angleRad = (-projectile.angle * Math.PI) / 180;
    const vx = projectile.initialVelocity * Math.cos(angleRad);
    const vy = projectile.initialVelocity * Math.sin(angleRad);
    const gravity = 9.8;

    const x = vx * projectile.time;
    const y = vy * projectile.time - 0.5 * gravity * projectile.time * projectile.time;

    const bulletX = pivotX + x;
    const bulletY = pivotY - y;

    // Check if bullet hits ground or goes off screen
    if (bulletY >= gameArea.height - ground.height || bulletX > gameArea.width) {
        projectile.active = false;
        return;
    }

    ctx.drawImage(bullet, bulletX - bullet.width/2, bulletY - bullet.height/2);
    projectile.time += 0.2; // Increased bullet speed
}

function drawGame() {
    ctx.clearRect(0, 0, gameArea.width, gameArea.height);

    // Draw background
    ctx.drawImage(background, 0, 0, gameArea.width, gameArea.height);
    
    // Draw ground
    for (let x = 0; x < gameArea.width; x += ground.width) {
        ctx.drawImage(ground, x, gameArea.height - ground.height);
    }
    
    // Draw aiming trajectory
    drawProjectilePath(currentVelocity);
    
    // Draw projectile if active
    if (projectile.active) {
        updateAndDrawProjectile();
    }
    
    // Draw cannon and base
    rotateCannon(ctx, pivotX, pivotY, cannon, 0);
    ctx.drawImage(
        cannon_base,
        100,
        gameArea.height - ground.height - cannon_base.height
    );
    ctx.drawImage(sun, 1024, 100, 128, 128);
    
    // Request next frame
    requestAnimationFrame(drawGame);
}

function updateVelocity() {
    if(increasing) {
        currentVelocity += 1;
        if(currentVelocity >= MAX_VELOCITY) {
            increasing = false;
        }
    } else {
        currentVelocity -= 1;
        if(currentVelocity <= MIN_VELOCITY) {
            increasing = true;
        }
    }
}

// Event listeners
window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        rotateCannon(ctx, pivotX, pivotY, cannon, -5);
    } else if (event.key === "ArrowRight") {
        rotateCannon(ctx, pivotX, pivotY, cannon, 5);
    } else if (event.key === " " && !projectile.active) {
        projectile = {
            active: true,
            time: 0,
            initialVelocity: currentVelocity,
            angle: getCannonAngle()
        };
    }
});

// Image loading and game start
const imagesLoaded = [background, ground, cannon_base, cannon, sun, bullet];
let loadedCount = 0;

imagesLoaded.forEach((img) => {
    img.onload = () => {
        loadedCount++;
        if (loadedCount === imagesLoaded.length) {
            // Start the game loop once all images are loaded
            requestAnimationFrame(drawGame);
            setInterval(updateVelocity, 50);
        }
    };
});