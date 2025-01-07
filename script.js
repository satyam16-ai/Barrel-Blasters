import { rotateCannon, getCannonAngle } from "./utils/rotate.js";
import { Crate, createTower, drawCrates, simulateCratePhysics } from "./physics/crates.js";
import { Projectile, drawProjectilePath } from "./physics/projectile.js";

const gameArea = document.getElementById("gameArea");
const ctx = gameArea.getContext("2d");

let pivotX, pivotY;
let crates = [];

// Load images
const background = new Image();
const ground = new Image();
const cannon_base = new Image();
const cannon = new Image();
const sun = new Image();
const bullet = new Image();
const crate = new Image();

background.src = "assets/background.png";
ground.src = "assets/ground.png";
cannon_base.src = "assets/cannon2.png";
cannon.src = "assets/cannon.png";
sun.src = "assets/sun.png";
bullet.src = "assets/bullet.png";
crate.src = "assets/crate.png";

// Load sounds
const cannonSound = new Audio("assets/sound/cannon_sound.mp3");
const hitCrateSound = new Audio("assets/sound/cannon-explosion.mp3");
const hitGroundSound = new Audio("assets/sound/cannon-explosion.mp3");

// Add game initialization state
let isGameInitialized = false;

// Move all initialization logic into this function
function initializeGame() {
    gameArea.width = window.innerWidth;
    gameArea.height = 720;

    // Calculate pivot points after images are loaded
    pivotX = 100 + cannon_base.width / 2;
    pivotY = gameArea.height - ground.height - cannon_base.height;

    // Initialize tower after ground height is known
    const towerBaseY = gameArea.height - ground.height - crateHeight;
    crates = createTower(towerBaseX, towerBaseY, towerRows, towerColumns, crateWidth, crateHeight);
    
    isGameInitialized = true;
    requestAnimationFrame(drawGame);
    setInterval(updateVelocity, 50);
}

// Modify image loading
const requiredImages = [
    { img: background, src: "assets/background.png" },
    { img: ground, src: "assets/ground.png" },
    { img: cannon_base, src: "assets/cannon2.png" },
    { img: cannon, src: "assets/cannon.png" },
    { img: sun, src: "assets/sun.png" },
    { img: bullet, src: "assets/bullet.png" },
    { img: crate, src: "assets/crate.png" }
];

let loadedImages = 0;

// Replace image loading section
requiredImages.forEach(({img, src}) => {
    img.onload = () => {
        loadedImages++;
        if (loadedImages === requiredImages.length) {
            initializeGame();
        }
    };
    img.src = src;
});

// Cannon pivot point
// Projectile state
let projectile = {
    active: false,
    time: 0,
    initialVelocity: 0,
    angle: 0
};

let currentVelocity = 10;
let increasing = true;
const MIN_VELOCITY = 60; // Minimum velocity
const MAX_VELOCITY = 120; // Maximum velocity

// Tower setup
const crateWidth = 50;
const crateHeight = 50;
const towerBaseX = gameArea.width + 500; // Position on the right side
const towerRows = 5;
const towerColumns = 3;

// Update and draw projectile
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
        hitGroundSound.play(); // Play ground hit sound
        return;
    }

    // Check collision with crates
    crates.forEach((crate) => {
        if (crate.checkCollision(bulletX, bulletY, bullet.width / 2)) {
            projectile.active = false; // Stop projectile on collision
            hitCrateSound.play(); // Play crate hit sound
        }
    });

    // Draw the bullet
    ctx.drawImage(bullet, bulletX - bullet.width / 2, bulletY - bullet.height / 2);
    projectile.time += 0.2; // Increased bullet speed
}

// Main game loop
function drawGame() {
    if (!isGameInitialized) return;
    
    ctx.clearRect(0, 0, gameArea.width, gameArea.height);

    // Draw background
    ctx.drawImage(background, 0, 0, gameArea.width, gameArea.height);

    // Draw ground
    for (let x = 0; x < gameArea.width; x += ground.width) {
        ctx.drawImage(ground, x, gameArea.height - ground.height);
    }

    // Draw aiming trajectory
    drawProjectilePath(ctx, pivotX, pivotY, currentVelocity, getCannonAngle());

    // Draw projectile if active
    if (projectile.active) {
        updateAndDrawProjectile();
    }

    // Draw and simulate crate tower
    simulateCratePhysics(crates);
    drawCrates(ctx, crates, crate);

    // Draw cannon and base
    rotateCannon(ctx, pivotX, pivotY, cannon, 0);
    ctx.drawImage(
        cannon_base,
        100,
        gameArea.height - ground.height - cannon_base.height
    );
    ctx.drawImage(sun, gameArea.width - 150, 100, 128, 128);

    // Check if all crates are destroyed
    if (crates.every(crate => crate.isDestroyed)) {
        alert("All crates destroyed! Restarting game...");
        initializeGame();
    }

    // Request next frame
    requestAnimationFrame(drawGame);
}

// Update velocity
function updateVelocity() {
    if (increasing) {
        currentVelocity += 1;
        if (currentVelocity >= MAX_VELOCITY) {
            increasing = false;
        }
    } else {
        currentVelocity -= 1;
        if (currentVelocity <= MIN_VELOCITY) {
            increasing = true;
        }
    }
    drawProjectilePath(ctx, pivotX, pivotY, currentVelocity, getCannonAngle());
}

// Event listeners
window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        rotateCannon(ctx, pivotX, pivotY, cannon, -5);
        drawProjectilePath(ctx, pivotX, pivotY, currentVelocity, getCannonAngle());
    } else if (event.key === "ArrowRight") {
        rotateCannon(ctx, pivotX, pivotY, cannon, 5);
        drawProjectilePath(ctx, pivotX, pivotY, currentVelocity, getCannonAngle());
    } else if (event.code === "Space" && !projectile.active) {
        // Play cannon sound
        cannonSound.play();
        
        projectile = new Projectile(pivotX, pivotY, currentVelocity, getCannonAngle());
    }
});
