let cannonAngle = 0;

export function rotateCannon(ctx, pivotX, pivotY, cannonImage, angleDelta) {
  cannonAngle += angleDelta;

  cannonAngle = Math.max(-45, Math.min(45, cannonAngle));

  ctx.save();

  ctx.translate(pivotX, pivotY);

  ctx.rotate(cannonAngle * (Math.PI / 180));

  ctx.drawImage(cannonImage, -cannonImage.width / 2, -cannonImage.height / 2);

  ctx.restore();
}

export function getCannonAngle() {
  return cannonAngle;
}
