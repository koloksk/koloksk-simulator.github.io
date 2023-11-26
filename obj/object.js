class Object {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.object = new Path2D();
    this.points = { p1: { x: x, y: y } };
    this.ctx = document.getElementById("canvas").getContext("2d");
  }

  isPointInPath(x, y) {
    return this.ctx.isPointInPath(this.object, x, y);
  }
  isPointInStroke(x, y) {
    return this.ctx.isPointInStroke(this.object, x, y);
  }
  rotatePoint(x, y, angle, cx, cy) {
    angle = angle * Math.PI / 180;
    var rotatedX = (x - cx) * Math.cos(angle) - (y - cy) * Math.sin(angle) +
    cx;
    var rotatedY = (x - cx) * Math.sin(angle) +
        (y - cy) * Math.cos(angle) +
        cy;
    return { x: rotatedX, y: rotatedY };
  }
}

export default Object;
