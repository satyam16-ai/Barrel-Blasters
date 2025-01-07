
export class Crate {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isDestroyed = false;
    }

    draw(ctx, crateImage) {
        if (!this.isDestroyed) {
            ctx.drawImage(crateImage, this.x, this.y, this.width, this.height);
        }
    }

    checkCollision(bulletX, bulletY, bulletRadius) {
        if (
            bulletX + bulletRadius > this.x &&
            bulletX - bulletRadius < this.x + this.width &&
            bulletY + bulletRadius > this.y &&
            bulletY - bulletRadius < this.y + this.height
        ) {
            this.isDestroyed = true;
            return true;
        }
        return false;
    }
}

export function createTower(baseX, baseY, rows, columns, crateWidth, crateHeight) {
    const crates = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const x = baseX + col * crateWidth;
            const y = baseY - row * crateHeight;
            crates.push(new Crate(x, y, crateWidth, crateHeight));
        }
    }
    return crates;
}

export function drawCrates(ctx, crates, crateImage) {
    crates.forEach((crate) => crate.draw(ctx, crateImage));
}

export function simulateCratePhysics(crates) {
    crates.forEach((crate) => {
        if (crate.isDestroyed) {
            crate.y += 5; // Simulates falling effect
        }
    });
}
