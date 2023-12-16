import {drawLightBeam} from "../core.js";
import Light from "./light.js";

class RadialLight extends Light{
    constructor(x, y, radius, angle, object, ctx) {
        super(x,y,angle, object, ctx)
        this.radius = radius;
        this.opacity = 1;
        this.beams = 10; 
        this.draw();
      }
  
      draw() {
        this.ctx.save();
        this.object = new Path2D();
        this.object.moveTo(this.x, this.y);
        this.object.arc(this.x, this.y, this.radius,0, 360);
        this.ctx.fillStyle = `yellow`;
        this.ctx.fill(this.object);
        //this.ctx.stroke(this.object);
        this.ctx.restore();
        for(var i = 0; i < this.beams; i++){
          drawLightBeam(this.x, this.y, (360 / this.beams * i)+this.angle, "white",this.opacity);
        }
      }
      
      getSettings() {
        return ["x", "y", "angle","opacity", "beams"]
      }
}

export default RadialLight;
