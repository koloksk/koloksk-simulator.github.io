function drawGrid(canvas, gridSize) {
    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
  
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
  
    // Rysowanie pionowych linii siatki
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
  
    // Rysowanie poziomych linii siatki
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
  }
  
  const canvas = document.getElementById('grid');
  canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
  drawGrid(canvas, 20);