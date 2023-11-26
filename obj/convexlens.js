import Object from "./object.js";

class ConvexLens extends Object{
  constructor(x, y, r1, r2, focalLength, angle, ctx, object) {
    super(x,y,angle, object, ctx)
    this.r1 = r1;
    this.r2 = r2;
    this.width = 100;
    this.height = 100;

    this.focalLength = focalLength;

    this.draw();
  }

  draw() {
  let maxx = this.x + this.width + this.r2;
  let minx = this.x - this.r1;
  
  this.ctx.save();

  this.object = new Path2D();
  this.object.moveTo(this.x, this.y);
  this.object.lineTo(this.x + this.width, this.y);
  this.object.quadraticCurveTo(maxx, this.y+this.height/2, this.x+this.width, this.y+this.height)
  this.object.lineTo(this.x, this.y+this.height);
  this.object.quadraticCurveTo(minx, this.y+this.height/2, this.x, this.y)

  this.ctx.stroke(this.object);
  this.ctx.restore();

  }

  getCenter() {
    const center = {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    };
    return center;
  }

  calculateReflectionAngle(incidentAngle) {
    // Oblicz kąt odbicia od soczewki zgodnie z działaniem optycznym soczewki sferycznej

    const incidentAngleRad = incidentAngle * (Math.PI / 180);

    // Odległość od środka soczewki do powierzchni soczewki
    const r = this.r1;

    // Odległość od punktu dotknięcia wiązki światła do środka soczewki
    const d = Math.abs(
      this.y - this.r1 - Math.tan(incidentAngleRad) * this.x
    );

    // Promień krzywizny soczewki (dla soczewki wypukłej jest dodatni)
    const f = r;

    // Odległość od środka soczewki do punktu, w którym wiązka światła przecina oś optyczną
    const u = this.x;

    // Zgodnie z równaniem soczewki 1/f = 1/v - 1/u, gdzie v to odległość od soczewki do obrazu
    const v = 1 / (1 / f + 1 / u);

    // Kąt odbicia zgodnie z równaniem soczewki (theta' = arcsin((n2/n1) * sin(theta)))
    const n1 = 1; // Współczynnik załamania dla medium przed soczewką (na przykład powietrze)
    const n2 = 1.5; // Współczynnik załamania dla soczewki (na przykład szkło)

    const sinTheta = Math.sin(incidentAngleRad);
    const sinThetaPrime = (n1 / n2) * sinTheta;
    const thetaPrimeRad = Math.asin(sinThetaPrime);

    // Kąt odbicia (theta') przekształcony na stopnie
    const reflectionAngle = thetaPrimeRad * (180 / Math.PI);

    return reflectionAngle;
  }
  getSettings() {
    return ["x", "y", "width", "height","r1", "r2", "angle"]
  }
}

export default ConvexLens;
