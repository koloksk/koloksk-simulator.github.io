import Object from "./object.js";

class Light extends Object{
    constructor(x, y, radius, angle, object, ctx) {
        super(x,y,angle, object, ctx)
        this.radius = radius;

        this.draw();
      }
  
      draw() {
        this.ctx.save();
        this.object = new Path2D();
        this.object.moveTo(this.x, this.y);
        this.object.arc(this.x, this.y, this.radius,0, 360);
        this.ctx.fillStyle = "orange";
        this.ctx.fill(this.object);
        this.ctx.stroke(this.object);
        this.ctx.restore();

      }
      getCenter(){
        const center = {
          x: this.x,
          y: this.y,
        };
    
        return center;
      }
      getSettings() {
        return ["x", "y", "angle"]
      }
}

export default Light;
