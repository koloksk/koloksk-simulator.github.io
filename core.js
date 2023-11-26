import Mirror from "./obj/mirror.js";
import Light from "./obj/light.js";
import LightBeam from "./obj/lightbeam.js";
import ConvexLens from "./obj/convexlens.js";
import Prism from "./obj/prism.js";

import * as moveController from "./moveController.js";

const rainbowColors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
];
export var objects = [];
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const canvas1 = document.getElementById("canvas1");
const ctx1 = canvas1.getContext("2d");

canvas1.width = window.innerWidth;
canvas1.height = window.innerHeight;

ctx.globalCompositeOperation = "lighter";
ctx1.globalCompositeOperation = "lighter";

document.getElementById("1").addEventListener("click", addLight);
document.getElementById("2").addEventListener("click", addMirror);
document.getElementById("3").addEventListener("click", addConvexLens);
document.getElementById("4").addEventListener("click", addPrism);

function addConvexLens() {
  const convexLens = new ConvexLens(200, 200, 30, -20, 30);
  objects.push(convexLens);
}
function addMirror() {
  const mirror = new Mirror(60, 60, 100, 100);
  objects.push(mirror);
}
function addLight() {
  const light = new Light(canvas.width/2, canvas.height/2, 20);
  drawLightBeam(light.x, light.y, light.angle);
  objects.push(light);
}
function addPrism() {
  const prism = new Prism(canvas.width/2, canvas.height/2);
  objects.push(prism);
}
function isPointOnCanvasEdge(x, y) {
  const canvasLeft = 0;
  const canvasTop = 0;
  const canvasRight = canvas.width;
  const canvasBottom = canvas.height;

  return (
    x <= canvasLeft || x >= canvasRight || y <= canvasTop || y >= canvasBottom
  );
}

async function drawLightBeam(startX, startY, angle, color) {
  let x = startX;
  let y = startY;
  let length = 1;
  let endX, endY;
  let stop = false;
  let line;

  while (!stop) {
    endX = x + Math.cos((angle * Math.PI) / 180) * length;
    endY = y + Math.sin((angle * Math.PI) / 180) * length;
    
    if (isPointOnCanvasEdge(endX, endY)) break;

    for (const object of objects) {
      if (object instanceof Light) continue;

      if (object.isPointInStroke(endX, endY, 1)) {
        line = new LightBeam(canvas, x, y, endX, endY, color);
        length = 1;

        if (object instanceof Mirror) {
          const reflectionAngle =
            object.calculateReflectionAngle(
              line.calculateIncidentAngle(object)
            ) + 180;

          angle = reflectionAngle;
        }
        if (object instanceof ConvexLens) {
          const reflectionAngle = object.calculateReflectionAngle(
            line.calculateIncidentAngle(object)
          );
          angle = reflectionAngle;
        }
        if (object instanceof Prism) {
          let newx = endX + Math.cos((angle * Math.PI) / 180) * length--;
          let newy = endY + Math.sin((angle * Math.PI) / 180) * length--;
          if (color == null) {
            for (let j = 0; j < 7; j++) {
              stop = true;
              drawLightBeam(newx, newy, object.calculateReflectionAngle(line.getAngle()) + j / 10, rainbowColors[j]);
            }
          } else {
            stop = true;
            drawLightBeam(newx, newy, object.calculateReflectionAngle(line.getAngle()) , color);
          }
        }
        x = endX + Math.cos((angle * Math.PI) / 180) * length;
        y = endY + Math.sin((angle * Math.PI) / 180) * length;
      }
    }
    length++;
  }
  line = new LightBeam(canvas, x, y, endX, endY, color);
}

// Dodaj ostatnią linię tylko jeśli jej ostatni punkt znajduje się na krawędzi lub poza obszarem canvasa
canvas1.addEventListener("mousedown", moveController.handleMouseDown);
canvas1.addEventListener("mouseup", moveController.handleMouseUp);
canvas1.addEventListener("mousemove", moveController.handleMouseMove);
canvas1.addEventListener("wheel", moveController.handleMouseWheel);
// canvas1.addEventListener("mousedown", handleMouseDown);
// canvas1.addEventListener("mouseup", handleMouseUp);
// canvas1.addEventListener("mousemove", handleMouseMove);
// canvas1.addEventListener("wheel", handleMouseWheel);
// let isDragging = false;
// let movingObject = null;
// let lastSelected = null;

// // canvas.addEventListener("mousedown", handleMouseDown);
// // canvas.addEventListener("mouseup", handleMouseUp);
// // canvas.addEventListener("mousemove", handleMouseMove);
// // canvas.addEventListener("wheel", handleMouseWheel);

// var settings = document.getElementById("settings");

// function handleMouseDown(event) {
//   const mouseX = event.clientX - canvas.getBoundingClientRect().left;
//   const mouseY = event.clientY - canvas.getBoundingClientRect().top;
//   console.log("click");
//   isDragging = true;
//   settings.innerHTML = "";
//   settings.style.display = "none"

//   for (let i = 0; i < objects.length; i++) {
//     const object = objects[i];
//     if (object.isPointInPath(mouseX, mouseY)) {
//       movingObject = object;
//       lastSelected = object;
//       openSettings(object);
//       settings.style.display = "flex"
//     }
//   }
// }

// function openSettings(object) {
//   settings.innerHTML = "";
//   object.getSettings().forEach((property) => {
//     console.log(property);
    
//     createSettingsElements(object, [property], "number");

//   })
// }


// function createSettingsElements(obj, properties, type) {
//   properties.forEach((property) => {
//     var label = document.createElement("Label");
//     label.innerHTML = property;
//     var input = document.createElement("input");
//     input.type = type;
//     input.value = obj[property];
//     input.addEventListener("input", (event) => {
//       obj[property] = event.target.value * 1;
//       updateObj();
//     });
//     settings.appendChild(label);
//     settings.appendChild(input);
//   });
// }


// function handleMouseUp() {
//   isDragging = false;
//   movingObject = null;
// }

// function handleMouseMove(event) {
//   if (isDragging) {
//     if (movingObject != null) {
//       const mouseX = event.clientX - canvas.getBoundingClientRect().left;
//       const mouseY = event.clientY - canvas.getBoundingClientRect().top;

//       // Oblicz różnicę między poprzednim środkiem obiektu a nowym punktem myszy
//       const deltaX = mouseX - movingObject.getCenter().x;
//       const deltaY = mouseY - movingObject.getCenter().y;

//       // Aktualizuj współrzędne obiektu na podstawie różnicy
//       movingObject.x += deltaX;
//       movingObject.y += deltaY;

//       // Jeśli obiekt jest lustrzaną, zaktualizuj również współrzędne x2 i y2
//       if (movingObject instanceof Mirror) {
//         movingObject.x2 += deltaX;
//         movingObject.y2 += deltaY;
//       }

//       // Aktualizuj punkty obiektu
//       movingObject.points.p1.x += deltaX;
//       movingObject.points.p1.y += deltaY;

//       // Otwórz ustawienia dla obiektu
//       openSettings(movingObject);

//       // Zaktualizuj obiekt
//       updateObj();
//     }
//   }
// }


// function handleMouseWheel(event) {
//   const mouseX = event.clientX - canvas.getBoundingClientRect().left;
//   const mouseY = event.clientY - canvas.getBoundingClientRect().top;
//   for (let i = 0; i < objects.length; i++) {
//     let object = objects[i];
//     // console.log("wheel");

//     if (object.isPointInPath(mouseX, mouseY)) {
//       if (!(object instanceof LightBeam)) {
//         // console.log(object.angle);

//         const delta = Math.sign(event.deltaY); // Sprawdź kierunek przewijania

//         // Dostosuj kąt na podstawie kierunku przewijania
//         const angleChange = delta; // Możesz dostosować tę wartość

//         object.angle += angleChange;

//         //update();
//         updateObj();
//         openSettings(object);

//       }
//     }
//   }

//   event.preventDefault();
// }

export function update() {
  ctx1.clearRect(0, 0, canvas1.width, canvas1.height);

  for (let i = objects.length - 1; i >= 0; i--) {
     const object = objects[i];
     if (object instanceof Light)
     drawLightBeam(object.x, object.y, object.angle);
  }
  requestAnimationFrame(update);
 }

 export function updateObj() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = objects.length - 1; i >= 0; i--) {
    const object = objects[i];
    object.draw();
 }
 }

update();