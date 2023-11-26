var canvas = new fabric.Canvas("canvas", { selection: false });
const ctx = canvas.getContext("2d");

const mirrors = [];
const lights = [];

// Funkcja do dodawania swiatła
function addLight() {
  var light = new fabric.Rect({
    width: 40,
    height: 40,
    fill: "yellow",
    left: canvas.width / 2 - 20,
    top: canvas.height / 2 - 50,
    selectable: true,
  });
  canvas.add(light);
  lights.push(light);
}

// Funkcja do dodawania lustra
function addMirror() {
  var mirror = new fabric.Rect({
    width: 10,
    height: 100,
    fill: "gray",
    left: canvas.width / 2 - 20,
    top: canvas.height / 2 - 50,
    selectable: true,
  });
  canvas.add(mirror);
  mirrors.push(mirror);
}

//Dodaj obsługę przesuwania obiektów
function handleObjectTransformation(e) {
  var actObj = e.target;
  var coords = actObj.calcCoords(); 
  // calcCoords returns an object of corner points like this 
  //{bl:{x:val, y:val},tl:{x:val, y:val},br:{x:val, y:val},tr:{x:val, y:val}}
  var left = coords.tl.x;
  var top = coords.tl.y;
  actObj.left = left;
  actObj.top = top;

  var lines = canvas.getObjects().filter(function (object) {
    return object instanceof fabric.Line;
  });

  canvas.remove(...lines);

  for (const light of lights) {
    drawLightBeam(light.left, light.top, light.angle, 700);
  }
}

canvas.on("object:moving", handleObjectTransformation);
canvas.on("object:rotating", handleObjectTransformation);

// Funkcja do rysowania promienia świetlnego
function isPointInsideFabricObject(object, x, y) {
    return object.containsPoint({ x: x, y: y });
  }

function isPointOnCanvasEdge(x, y) {
    return x <= 0 || x >= canvas.width || y <= 0 || y >= canvas.height;
}
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
function anglea(startx, starty, endx, endy) {
  const dy = endy - starty;
  const dx = endx - startx;
  const radius = Math.sqrt(dy ** 2 + dx ** 2);
  const pos = polarToCartesian(startx, starty, radius, 45);
  let theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  //if (theta < 0) theta = 360 + theta; // range [0, 360)
  return Math.abs(theta) > 90 ? theta % 90 : theta;
}
function drawLightBeam(startX, startY, angle, reflectionCount) {
    let x = startX + 5;
    let y = startY + 5;
    let length = 1;
    let endX, endY;

    while (!isPointOnCanvasEdge(x, y)) {
        endX = x + Math.cos((angle * Math.PI) / 180) * length;
        endY = y + Math.sin((angle * Math.PI) / 180) * length;
        if (isPointOnCanvasEdge(endX, endY)) {
            //console.log("edge")

            var line = new fabric.Line([x, y, endX, endY], {
                stroke: "yellow",
                selectable: false,
            });
            canvas.add(line);
            break;
        }
        for(const mirror of mirrors){
        if (isPointInsideFabricObject(mirror, endX, endY)) {
            // Jeśli punkt znajduje się wewnątrz lustra, dodaj aktualną linię do Canvas
            //console.log("inside")
            // endX = x + Math.cos((angle * Math.PI) / 180) * (length-3);
            // endY = y + Math.sin((angle * Math.PI) / 180) * (length-3);
            var line = new fabric.Line([x, y, endX, endY], {
                stroke: "yellow",
                selectable: false,
            });
            canvas.add(line);

            // Oblicz nowy kąt odbicia
            const incidentAngle = Math.atan2(endY - y, endX - x) + 90;
            let mirrorAngle = mirror.angle;
            const reflectionAngle = mirrorAngle + incidentAngle *2;
            console.log(reflectionAngle)
            // Oblicz nowe współrzędne dla linii odbitej
            length = 1;
            angle = reflectionAngle;
            x = endX + Math.cos((angle * Math.PI) / 180) * length;
            y = endY + Math.sin((angle * Math.PI) / 180) * length;

        } }
        //console.log("add")

            length++;
        
    }

    // Dodaj ostatnią linię tylko jeśli jej ostatni punkt znajduje się na krawędzi lub poza obszarem canvasa

}

// Dodaj funkcję, która sprawdzi, czy punkt znajduje się na krawędzi obszaru canvasa


  

function obliczKatOdbicia(katSwiatla, katLustra) {
  // Zamień kąty z stopni na radiany
  const katSwiatlaRad = katSwiatla * (Math.PI / 180);
  const katLustraRad = katLustra * (Math.PI / 180);

  // Oblicz kąt odbicia z wykorzystaniem prawa odbicia światła
  const katOdbiciaRad = 2 * katLustraRad - katSwiatlaRad;

  return katOdbiciaRad;
}

function calculateAngle(line, targetObject) {
  var deltaX = line.get("left") - targetObject.get("left");
  var deltaY = line.get("top") - targetObject.get("top");
  var angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  return angle;
}
