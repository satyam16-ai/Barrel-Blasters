export class Projectile {
    constructor(x, y, initialVelocity, angle) {
        this.x = x;
        this.y = y;
        this.time = 0;
        this.active = true;
        this.initialVelocity = initialVelocity;
        this.angle = angle;
        this.gravity = 9.8;
    }

    calculatePosition() {
        const angleRad = (-this.angle * Math.PI) / 180;
        const vx = this.initialVelocity * Math.cos(angleRad);
        const vy = this.initialVelocity * Math.sin(angleRad);
        
        const x = vx * this.time;
        const y = vy * this.time - 0.5 * this.gravity * this.time * this.time;
        
        return {
            x: this.x + x,
            y: this.y - y,
            hitGround: this.y - y > 720 - 32
        };
    }

    update(deltaTime) {
        this.time += deltaTime;
        const position = this.calculatePosition();
        this.active = !position.hitGround && position.x <= window.innerWidth;
        return position;
    }
}

export function drawProjectilePath(ctx, pivotX, pivotY, initialVelocity, angle, gravity = 9.8, timeInterval = 0.1) {
    const angleRad = (-angle * Math.PI) / 180;
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

        if (canvasX > window.innerWidth || canvasY > 720 - 32) {
            hitGround = true;
        } else {
            ctx.lineTo(canvasX, canvasY);
        }
        t += timeInterval;
    }

    ctx.strokeStyle = `hsl(${initialVelocity * 3.6}, 100%, 50%)`; // Color changes with velocity
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
}