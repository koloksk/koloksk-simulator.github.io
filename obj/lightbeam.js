import { ws } from "../app.js";
import { getMaxLineLength, wavelengthToColor, getPointsDistance, refractiveIndex } from "../utils/util.js";
import Light from "./light.js";
import Prism from "./prism.js";
class LightBeam {
    constructor(x, y , angle, color = 0, opacity = 1) {
        this.ctx = ws.ctxBeams;
        this.x = x;
        this.y = y;
        this.endx;
        this.endy;
        this.angle = angle;
        this.color = color;
        this.width = 1;
        this.opacity = opacity;
        this.maxLength = getMaxLineLength();
        this.init();
        //this.draw();
      }
  //https://www.w3schools.com/jsref/canvas_linejoin.asp

      draw() {
        this.ctx.save();
        //this.ctx.globalAlpha = this.opacity;

        this.ctx.beginPath();
        this.ctx.lineWidth = this.width;
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(this.endx, this.endy);

        this.ctx.strokeStyle = wavelengthToColor(this.color, this.opacity);
        this.ctx.stroke();

        this.ctx.restore();

      }

      init() {        
        let endX = this.x + this.maxLength * Math.cos((this.angle * Math.PI) / 180);
        let endY = this.y + this.maxLength * Math.sin((this.angle * Math.PI) / 180);
        
        let hitObj = ws.objects.reduce(
          (closest, currentObject) => {
            //console.log("a "+endX,endY)
            let hit = currentObject.isPointInStroke(this.x, this.y, endX, endY);
            if (hit && !(currentObject instanceof Light)) {
              const distance = getPointsDistance({x: this.x, y: this.y},hit)
      
              if (distance < closest.distance) {
                return { object: currentObject, distance: distance };
              }
            }
      
            // Jeśli warunki nie zostały spełnione lub obiekt nie jest bliższy, zwracamy poprzednio najbliższy obiekt
            return closest;
          },
          { object: null, distance: Infinity }
        ).object;
      
      
        
        if (hitObj != null) {
          let intersect = hitObj.isPointInStroke(this.x, this.y, endX, endY);
          this.endx = intersect.x;
          this.endy = intersect.y;
          this.draw();

          let newAngle = hitObj.calculateReflectionAngle(this.angle);


        
            if (this.color == 0 && hitObj instanceof Prism) {
              for (let j = 77; j > 38; j--) {
                console.log(refractiveIndex(j*10))
                new LightBeam(
                  this.endx,
                  this.endy,
                  newAngle - refractiveIndex(j*10),
                  j*10,
                  this.opacity
                );
              }
            } else {
              new LightBeam(this.endx, this.endy, newAngle, this.color, this.opacity)
            } 
          } else {
          this.endx = endX;
          this.endy = endY;
          this.draw();
        }}
      
    

      
      getAngle(){
        return Math.atan2( this.endy - this.y, this.endx - this.x )* (180 / Math.PI)
      }
}

export default LightBeam;
