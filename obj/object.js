import { ctx } from "../core.js";
class Object {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.object = new Path2D();
    this.points = { p1: { x: x, y: y } };
    this.ctx = ctx;
  }

  isPointInPath(x, y) {
    return this.ctx.isPointInPath(this.object, x, y);
  }
  isPointInStroke(x, y) {
    return this.ctx.isPointInStroke(this.object, x, y);
  }
  rotatePoint(x, y, angle, cx, cy) {
    angle = (angle * Math.PI) / 180;
    var rotatedX = (x - cx) * Math.cos(angle) - (y - cy) * Math.sin(angle) + cx;
    var rotatedY = (x - cx) * Math.sin(angle) + (y - cy) * Math.cos(angle) + cy;
    return { x: rotatedX, y: rotatedY };
  }

  line_intersect(x, y, x2, y2, x3, y3, x4, y4) {
    const denominator = (y4 - y3) * (x2 - x) - (x4 - x3) * (y2 - y);

    if (denominator === 0) {
      return null; // Odcinki są równoległe lub nakładają się
    }

    const ua = ((x4 - x3) * (y - y3) - (y4 - y3) * (x - x3)) / denominator;
    const ub = ((x2 - x) * (y - y3) - (y2 - y) * (x - x3)) / denominator;
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
      const intersectionX = x + ua * (x2 - x);
      const intersectionY = y + ua * (y2 - y);
      if (
        (intersectionX == x3 && intersectionY == y3) ||
        (intersectionX == x4 && intersectionY == y4)
      )
        return null;

      return { x: intersectionX, y: intersectionY };
    } else {
      return null;
    }
  }
//TODO: Implement

  findIntersectionPoint(x1, y1, x2, y2, cx1, cy1, cx2, cy2, cx3, cy3) {
    const epsilon = 1e-6; // Dokładność obliczeń

    // Parametryczna reprezentacja odcinka
    const line = (t) => ({
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1)
    });

    // Parametryczna reprezentacja krzywej kwadratowej
    const quadraticCurve = (t) => ({
        x: Math.pow(1 - t, 2) * cx1 + 2 * (1 - t) * t * cx2 + t * t * cx3,
        y: Math.pow(1 - t, 2) * cy1 + 2 * (1 - t) * t * cy2 + t * t * cy3
    });

    // Algorytm znajdujący punkt przecięcia
    const iterate = (t0, t1) => {
        let p0 = line(t0);
        let p1 = line(t1);
        let mid = (t0 + t1) / 2;
        let pm = line(mid);

        let q0 = quadraticCurve(t0);
        let q1 = quadraticCurve(t1);
        let qm = quadraticCurve(mid);

        if (Math.abs(p1.x - p0.x) < epsilon && Math.abs(p1.y - p0.y) < epsilon) {
            return pm;
        }

        if ((p1.x - p0.x) * (qm.y - p0.y) - (qm.x - p0.x) * (p1.y - p0.y) > 0) {
            return iterate(mid, t1);
        } else {
            return iterate(t0, mid);
        }
    };

    // Sprawdzenie czy punkt przecięcia istnieje
    if (
        (x1 < Math.min(cx1, cx2, cx3) && x2 < Math.min(cx1, cx2, cx3)) ||
        (x1 > Math.max(cx1, cx2, cx3) && x2 > Math.max(cx1, cx2, cx3)) ||
        (y1 < Math.min(cy1, cy2, cy3) && y2 < Math.min(cy1, cy2, cy3)) ||
        (y1 > Math.max(cy1, cy2, cy3) && y2 > Math.max(cy1, cy2, cy3))
    ) {
        return null; // Odcinek i krzywa nie mają punktu przecięcia
    }

    return iterate(0, 1);
}


  distanceBetweenPoints(point1, point2) {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  }
}

export default Object;
