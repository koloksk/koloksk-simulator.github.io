import Light from "./light.js";
import LightBeam from "./lightbeam.js";

class RadialLight extends Light{
    constructor(position, radius, angle, object, ctx) {
        super(position,angle, object, ctx)
        this.radius = radius;
        this.opacity = 1;
        this.beams = 10; 
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
        for(var i = 0; i < this.beams; i++){
          new LightBeam(this.position.x, this.position.y, (360 / this.beams * i)+this.angle, 0 ,this.opacity);
        }
      }
      
      getSettings() {
        return ["x", "y", "angle","opacity", "beams"]
      }
}

export default RadialLight;
