import { ws } from "../app.js";
class Object {
  constructor(position) {
    this.position = position;
    this.angle = 0;
    this.object = new Path2D();
    this.points = { p1: { x: position.x, y: position.y } };
    this.ctx = ws.ctx;
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

  findIntersectionPoint(a1, a2, p1, p2, p3) {
      var intersections=[];
      this.ctx.save();
      this.object = new Path2D();
      this.object.moveTo(p1.x, p1.y);
      this.object.arc(p1.x, p1.y, 3,0, 360);
      this.ctx.fillStyle = `red`;
      this.ctx.fill(this.object);

      this.object = new Path2D();
      this.object.moveTo(p2.x, p2.y);
      this.object.arc(p2.x, p2.y, 3,0, 360);
      this.ctx.fillStyle = `red`;
      this.ctx.fill(this.object);

      this.object = new Path2D();
      this.object.moveTo(p3.x, p3.y);
      this.object.arc(p3.x, p3.y, 3,0, 360);
      this.ctx.fillStyle = `red`;
      this.ctx.fill(this.object);

      this.object = new Path2D();
      this.object.moveTo(a1.x, a1.y);
      this.object.arc(a1.x, a1.y, 15,0, 360);
      this.ctx.fillStyle = `blue`;
      this.ctx.fill(this.object);

      this.object = new Path2D();
      this.object.moveTo(a2.x, a2.y);
      this.object.arc(a2.x, a2.y, 15,0, 360);
      this.ctx.fillStyle = `blue`;
      this.ctx.fill(this.object);
      //this.ctx.stroke(this.object);
      this.ctx.restore();
      // inverse line normal
      var normal={
        x: a1.y-a2.y,
        y: a2.x-a1.x,
      }
    
      // Q-coefficients
      var c2={
        x: p1.x + p2.x*-2 + p3.x,
        y: p1.y + p2.y*-2 + p3.y
      }
    
      var c1={
        x: p1.x*-2 + p2.x*2,
        y: p1.y*-2 + p2.y*2,
      }
    
      var c0={
        x: p1.x,
        y: p1.y
      }
    
      // Transform to line 
      var coefficient=a1.x*a2.y-a2.x*a1.y;
      var a=normal.x*c2.x + normal.y*c2.y;
      var b=(normal.x*c1.x + normal.y*c1.y)/a;
      var c=(normal.x*c0.x + normal.y*c0.y + coefficient)/a;
    
      // solve the roots
      var roots=[];
      let d=b*b-4*c;
      if(d>0){
        var e=Math.sqrt(d);
        roots.push((-b+Math.sqrt(d))/2);
        roots.push((-b-Math.sqrt(d))/2);
      }else if(d==0){
        roots.push(-b/2);
      }
    
      // calc the solution points
      for(var i=0;i<roots.length;i++){
        var minX=Math.min(a1.x,a2.x);
        var minY=Math.min(a1.y,a2.y);
        var maxX=Math.max(a1.x,a2.x);
        var maxY=Math.max(a1.y,a2.y);
        var t = roots[i];
        if (t>=0 && t<=1) {
          // possible point -- pending bounds check
          var point={
            x:this.lerp(this.lerp(p1.x,p2.x,t),this.lerp(p2.x,p3.x,t),t),
            y:this.lerp(this.lerp(p1.y,p2.y,t),this.lerp(p2.y,p3.y,t),t)
          }
          var x=point.x;
          var y=point.y;
          // bounds checks
          if(a1.x==a2.x && y>=minY && y<=maxY){  
            // vertical line
            intersections.push(point);
          }else if(a1.y==a2.y && x>=minX && x<=maxX){
            // horizontal line
            intersections.push(point);
          }else if(x>=minX && y>=minY && x<=maxX && y<=maxY){
            // line passed bounds check
            intersections.push(point);
          }
        }
      }
      return intersections;
    
}
  lerp=function(a,b,x){ return(a+x*(b-a)); };

  distanceBetweenPoints(point1, point2) {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
  }
}

export default Object;
