import Object from "./object.js";

class Mirror extends Object{
  constructor(x, y, x2, y2, angle, object, ctx) {
    super(x,y,angle, object, ctx)
    this.x2 = x2;
    this.y2 = y2;
    this.draw();
  }

  draw() {
    // let midPoint = {
    //   x: this.x + (this.x2 - this.x) * 0.5,
    //   y: this.y + (this.y2 - this.y) * 0.5
    // };
    this.ctx.beginPath();
    // this.ctx.translate(midPoint.x, midPoint.y);

    // // rotate some angle (radians)
    // this.ctx.rotate(this.angle * Math.PI / 180);  // = 45°
    // // translate back
    // this.ctx.translate(-midPoint.x, -midPoint.y);
    // const { x, y, x2, y2 } = this.rotatePoints(
    //   this.x,
    //   this.y,
    //   this.x2,
    //   this.y2,
    //   this.angle
    // );
    // this.x = x;
    // this.y = y;
    // this.x2 = x2;
    // this.y2 = y2;
    // this.angle = 0;
    this.ctx.save();
    this.object = new Path2D();
    let rotatedPoint = this.rotatePoint(this.x, this.y, this.angle, this.getCenter().x, this.getCenter().y);
    this.object.moveTo(rotatedPoint.x, rotatedPoint.y);
    rotatedPoint = this.rotatePoint(this.x2, this.y2, this.angle, this.getCenter().x, this.getCenter().y);
    this.object.lineTo(rotatedPoint.x, rotatedPoint.y);
    this.ctx.strokeStyle = "black";
    this.ctx.stroke(this.object);
    this.ctx.restore();
  }

  getCenter() {
    const center = {
      x: (this.x + this.x2) / 2,
      y: (this.y + this.y2) / 2,
    };
    return center;
  }

  isPointInPath(x, y, fixdistance = 5) {
    const point = { x, y };

    // Sprawdź czy punkt znajduje się między końcami linii
    const minX = Math.min(this.x, this.x2);
    const maxX = Math.max(this.x, this.x2);
    const minY = Math.min(this.y, this.y2);
    const maxY = Math.max(this.y, this.y2);

    if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) {
      return false;
    }

    const distance = this.pointToLineDistance(point);
    return distance < fixdistance;
  }

  pointToLineDistance(point) {
    const { x: x1, y: y1 } = { x: this.x, y: this.y };
    const { x: x2, y: y2 } = { x: this.x2, y: this.y2 };
    const { x: x0, y: y0 } = point;

    const numerator = Math.abs(
      (y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1
    );
    const denominator = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);

    return numerator / denominator;
  }

  // getAngle() {
  //   const deltaX = this.x2 - this.x;
  //   const deltaY = this.y2 - this.y;
  //   return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  // }
  calculateReflectionAngle(incidentAngle) {
    // Oblicz kąt padania w radianach
    const incidentAngleRad = incidentAngle * (Math.PI / 180);

    // Oblicz współczynniki kierunkowe linii lustra
    const mirrorSlope = (this.y2 - this.y) / (this.x2 - this.x);

    // Oblicz współczynnik kierunkowy prostopadłej do lustra (linii prostopadłej)
    const perpendicularSlope = -1 / mirrorSlope;

    // Oblicz kąt nachylenia linii prostopadłej
    const perpendicularAngleRad = Math.atan(perpendicularSlope);

    // Oblicz kąt odbicia korzystając z zasady równości kątów padania i odbicia
    const reflectionAngleRad = 2 * perpendicularAngleRad - incidentAngleRad;

    // Przekształć kąt odbicia z radianów na stopnie
    const reflectionAngle = reflectionAngleRad * (180 / Math.PI);

    return reflectionAngle;
  }

  isPointOnRightSide(x, y) {
    // Oblicz wartość funkcji liniowej opisującej lusterko w punkcie światła
    const mirrorFunctionValue =
      (this.y2 - this.y) * (x - this.x) - (this.x2 - this.x) * (y - this.y);

    // Sprawdź, po której stronie lustra znajduje się punkt światła
    return mirrorFunctionValue > 0;
  }

  getSettings() {
    return ["x", "y", "x2", "y2", "angle"]
  }
}

export default Mirror;
