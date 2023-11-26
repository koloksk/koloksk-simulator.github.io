class LightBeam {
    constructor(canvas, x, y, endx, endy, color = "white") {
        this.canvas = canvas;
        this.ctx = document.getElementById("canvas1").getContext("2d");
        this.x = x;
        this.y = y;
        this.endx = endx;
        this.endy = endy;
        this.color = color;
        this.width = 1;
        this.draw();
      }
  //https://www.w3schools.com/jsref/canvas_linejoin.asp
      draw() {
        this.ctx.save();
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
