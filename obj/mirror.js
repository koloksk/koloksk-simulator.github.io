import Object from "./object.js";

class Mirror extends Object{
  constructor(x, y, x2, y2, angle, object, ctx) {
    super(x,y,angle, object, ctx)
    this.x2 = x2;
    this.y2 = y2;
    this.draw();
  }

  draw() {
    this.ctx.beginPath();

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

  clear() {
    const margin = 5; // adjust this value as needed

    const rotatedStart = this.rotatePoint(this.x, this.y, this.angle, this.getCenter().x, this.getCenter().y);
    const rotatedEnd = this.rotatePoint(this.x2, this.y2, this.angle, this.getCenter().x, this.getCenter().y);

    const minX = Math.min(rotatedStart.x, rotatedEnd.x) - margin;
    const minY = Math.min(rotatedStart.y, rotatedEnd.y) - margin;
    const width = Math.abs(rotatedEnd.x - rotatedStart.x) + 2 * margin;
    const height = Math.abs(rotatedEnd.y - rotatedStart.y) + 2 * margin;

    this.ctx.clearRect(minX, minY, width, height);
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
