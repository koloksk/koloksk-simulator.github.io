import Object from "./object.js";

class Prism extends Object {
  constructor(position, angle, ctx, object, points) {
    super(position, angle, object, ctx, points);
    this.sideLength = 100; // długość boku trójkąta
    this.height = (Math.sqrt(3) / 2) * this.sideLength; // wysokość trójkąta

    this.draw();
  }

  draw() {
    this.points["p1"] = {
      x: this.position.x,
      y: this.position.y,
    };
    this.points["p2"] = {
      x: this.points.p1.x - this.sideLength / 2,
      y: this.points.p1.y + this.height,
    };
    this.points["p3"] = {
      x: this.points.p1.x + this.sideLength / 2,
      y: this.points.p1.y + this.height,
    };

    this.ctx.save();
    this.object = new Path2D();

    let rotatedPoint = this.rotatePoint(this.points.p1.x, this.points.p1.y, this.angle, this.getCenter().x, this.getCenter().y);
    this.object.moveTo(rotatedPoint.x , rotatedPoint.y);

    rotatedPoint = this.rotatePoint(this.points.p2.x, this.points.p2.y, this.angle, this.getCenter().x, this.getCenter().y);
    this.object.lineTo(rotatedPoint.x , rotatedPoint.y);

    rotatedPoint = this.rotatePoint(this.points.p3.x, this.points.p3.y, this.angle, this.getCenter().x, this.getCenter().y);
    this.object.lineTo(rotatedPoint.x , rotatedPoint.y);

    this.object.closePath();
    this.ctx.strokeStyle = "black";
    this.ctx.stroke(this.object);
    this.ctx.restore();
  }

  getCenter(){
    const center = {
      x: (this.points.p1.x + this.points.p2.x + this.points.p3.x) / 3,
      y: (this.points.p1.y + this.points.p2.y + this.points.p3.y) / 3,
    };

    return center;

  }
  clear() {
    // Wyczyść obszar, na którym znajduje się obiekt
    const boundingBox = this.calculateBoundingBox();
    this.ctx.clearRect(boundingBox.x - 2, boundingBox.y-2, boundingBox.width+4, boundingBox.height+4);
  }
  calculateBoundingBox() {
    let rotatedPoint = this.rotatePoint(this.points.p1.x, this.points.p1.y, this.angle, this.getCenter().x, this.getCenter().y);
    let rotatedPoint2 = this.rotatePoint(this.points.p2.x, this.points.p2.y, this.angle, this.getCenter().x, this.getCenter().y);
    let rotatedPoint3 = this.rotatePoint(this.points.p3.x, this.points.p3.y, this.angle, this.getCenter().x, this.getCenter().y);

    const minX = Math.min(rotatedPoint.x, rotatedPoint2.x, rotatedPoint3.x);
    const minY = Math.min(rotatedPoint.y, rotatedPoint2.y, rotatedPoint3.y);
    const maxX = Math.max(rotatedPoint.x, rotatedPoint2.x, rotatedPoint3.x);
    const maxY = Math.max(rotatedPoint.y, rotatedPoint2.y, rotatedPoint3.y);

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }
  isPointInStroke(x3, y3, x4, y4) {
    const lines = [
        [this.points.p1.x, this.points.p1.y, this.points.p2.x, this.points.p2.y],
        [this.points.p2.x, this.points.p2.y, this.points.p3.x, this.points.p3.y],
        [this.points.p3.x, this.points.p3.y, this.points.p1.x, this.points.p1.y]
    ];

    let closestIntersection = null;
    let closestDistance = Infinity;

    for (const line of lines) {
        const intersection = this.line_intersect(...line, x3, y3, x4, y4);

        if (intersection) {
            const distance = this.distanceBetweenPoints(intersection, { x: x3, y: y3 });

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIntersection = intersection;
            }
        }
    }

    return closestIntersection;
}
  

  calculateReflectionAngle(incidentAngle){
    let wspolczynnikZalamania = 1.5;
    // console.log(Math.abs(incidentAngle))
    if(Math.abs(incidentAngle) > 90 && Math.abs(incidentAngle) < 270){
      return incidentAngle - 30  
    } else {
      return incidentAngle + 30  

    }
  }
  getSettings() {
    return [
      "points.p1.x",
      "points.p1.y",
      "points.p2.x",
      "points.p2.y",
      "angle",
    ];
  }
}

export default Prism;
