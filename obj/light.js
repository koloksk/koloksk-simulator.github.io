import Object from "./object.js";
import LightBeam from "./lightbeam.js";

class Light extends Object{
    constructor(position, radius, angle, object, ctx) {
        super(position, angle, object, ctx)
        this.radius = radius;
        this.opacity = 1;
        this.draw();
      }
  
      draw() {
        this.ctx.save();
        this.object = new Path2D();
        this.object.moveTo(this.position.x, this.position.y);
        this.object.arc(this.position.x, this.position.y, this.radius,0, 360);
        this.ctx.fillStyle = `yellow`;
        this.ctx.fill(this.object);
        //this.ctx.stroke(this.object);
        this.ctx.restore();
        //console.log("draw")
        new LightBeam(this.position.x, this.position.y, this.angle, 0,this.opacity);
      }
      getCenter(){
        const center = {
          x: this.position.x,
          y: this.position.y,
        };
    
        return center;
      }

      clear() {
        this.ctx.clearRect(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
      }

      
      getSettings() {
        return ["x", "y", "angle", "opacity"]
      }
}

export default Light;
