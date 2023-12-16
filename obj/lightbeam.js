import {ctx1} from "../core.js";

class LightBeam {
    constructor(x, y, endx, endy, color = "white", opacity) {
        this.ctx = ctx1;
        this.x = x;
        this.y = y;
        this.endx = endx;
        this.endy = endy;
        this.color = color;
        this.width = 1;
        this.opacity = opacity ? opacity : 1;
        this.draw();
      }
  //https://www.w3schools.com/jsref/canvas_linejoin.asp
      draw() {
        this.ctx.save();
        this.ctx.globalAlpha = this.opacity;
        this.ctx.beginPath();
        this.ctx.lineWidth = this.width;
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(this.endx, this.endy);
        this.ctx.strokeStyle = this.color;
        this.ctx.stroke();
        this.ctx.restore();

      }
      calculateIncidentAngle() {
        const deltaX = this.endx - this.x;
        const deltaY = this.endy - this.y;
        const incidentAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        return incidentAngle;
      }
      getAngle(){
        return Math.atan2( this.endy - this.y, this.endx - this.x )* (180 / Math.PI)
      }
}

export default LightBeam;
