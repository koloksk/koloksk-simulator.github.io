class Grid {
  constructor(gridSize) {
    this.gridSize = gridSize;
    this.draw();
  }

  draw() {
    const canvas = document.getElementById("grid");
    const ctx = canvas.getContext("2d");

    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
// Get the current transformation matrix

//const transform = ctx.getTransform();
// Destructure to get the x and y values out of the transformed DOMPoint.
//const { x, y } = transform.transformPoint(new DOMPoint(0, 0));
let left = 0.5 - Math.ceil(canvasWidth / this.gridSize) * this.gridSize;
let top = 0.5 - Math.ceil(canvasHeight / this.gridSize) * this.gridSize;
let right = 2*canvasWidth;
let bottom = 2*canvasHeight;

//console.log("offset: "+x + " " + y);
    // Rysowanie pionowych linii siatki
    ctx.beginPath();

    for (let x = left; x < right; x += this.gridSize) {
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
    }

    // Rysowanie poziomych linii siatki
    for (let y = top; y < bottom; y += this.gridSize) {
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
    }
    ctx.stroke();

  }
}
export default Grid;
