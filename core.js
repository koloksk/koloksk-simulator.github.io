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
export const ctx = canvas.getContext("2d", { willReadFrequently: true });

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const canvas1 = document.getElementById("canvas1");
export const ctx1 = canvas1.getContext("2d", { willReadFrequently: true });

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
  const mirror = new Mirror(60, 60, 300, 60);
  objects.push(mirror);
}
function addLight() {
  const light = new Light(canvas.width / 2, canvas.height / 2, 20);
  objects.push(light);
}
function addPrism() {
  const prism = new Prism(canvas.width / 2, canvas.height / 2);
  objects.push(prism);
}

function getMaxLineLength(x, y, kat) {
  // Zamień kąt na radiany
  var katWRad = kat * (Math.PI / 180);

  // Oblicz współrzędne końcowe
  var endX = canvas1.width * Math.cos(katWRad);
  var endY = canvas1.height * Math.sin(katWRad);

  // Oblicz odległość między punktem a końcem canvas
  var distance = Math.sqrt(
    Math.pow(endX - x, 2) + Math.pow(endY - y, 2)
  );

  return distance;
}
export function drawLightBeam(startX, startY, angle, color) {
  let line;
  const lineLength = getMaxLineLength(startX, startY, angle);
  
  let endX = startX + lineLength * Math.cos((angle * Math.PI) / 180);
  let endY = startY + lineLength * Math.sin((angle * Math.PI) / 180);
  
  let hitObj = objects.reduce(
    (closest, currentObject) => {

      let hit = currentObject.isPointInStroke(startX, startY, endX, endY);
      if (hit && !(currentObject instanceof Light)) {
        const distance = Math.sqrt(
          Math.pow(hit.x - startX, 2) + Math.pow(hit.y - startY, 2)
        );

        if (distance < closest.distance) {
          return { object: currentObject, distance: distance };
        }
      }

      // Jeśli warunki nie zostały spełnione lub obiekt nie jest bliższy, zwracamy poprzednio najbliższy obiekt
      return closest;
    },
    { object: null, distance: Infinity }
  ).object;


  
  while (hitObj != null) {
    let intersect = hitObj.isPointInStroke(startX, startY, endX, endY);
    line = new LightBeam(startX, startY, intersect.x, intersect.y, color); //jest udezenie, robi linie do uderzonego obiektu

    if (
      hitObj instanceof Mirror ||
      hitObj instanceof ConvexLens ||
      hitObj instanceof Prism
    ) {
      // oblicza kat odbicia dla lustra
      let reflectionAngle = hitObj.calculateReflectionAngle(line.getAngle());
      angle = reflectionAngle;
    }
    //zmienia parametry punktu p1 i p2
    startX = intersect.x + Math.cos((angle * Math.PI) / 180);
    startY = intersect.y + Math.sin((angle * Math.PI) / 180);
    if (hitObj instanceof Prism) break;
    endX =
      startX +
      getMaxLineLength(startX, startY, angle) *
        Math.cos((angle * Math.PI) / 180);
    endY =
      startY +
      getMaxLineLength(startX, startY, angle) *
        Math.sin((angle * Math.PI) / 180);
    //robi petle od nowa
    hitObj = objects.reduce(
      (closest, currentObject) => {
        // Sprawdzamy, czy obecny obiekt spełnia warunki
        let hit = currentObject.isPointInStroke(startX, startY, endX, endY);
        if (hit && !(currentObject instanceof Light)) {
          // Obliczamy odległość od punktu (startX, startY) do obiektu
          const distance = Math.sqrt(
            Math.pow(hit.x - startX, 2) + Math.pow(hit.y - startY, 2)
          );

          // Jeśli obiekt jest bliższy niż poprzednio najbliższy, aktualizujemy
          if (distance < closest.distance) {
            return { object: currentObject, distance: distance };
          }
        }

        // Jeśli warunki nie zostały spełnione lub obiekt nie jest bliższy, zwracamy poprzednio najbliższy obiekt
        return closest;
      },
      { object: null, distance: Infinity }
    ).object;
  }

  if (hitObj instanceof Prism) {
    // line = new LightBeam(startX, startY, intersect.x, intersect.y, color);

    let reflectionAngle = hitObj.calculateReflectionAngle(line.getAngle());

    angle = reflectionAngle;

    if (color == null) {
      for (let j = 0; j < 7; j++) {
        drawLightBeam(
          startX,
          startY,
          hitObj.calculateReflectionAngle(line.getAngle()) + j / 10,
          rainbowColors[j]
        );
      }
    } else {
      drawLightBeam(
        startX,
        startY,
        hitObj.calculateReflectionAngle(line.getAngle()),
        color
      );
    }
  } else {
    line = new LightBeam(startX, startY, endX, endY, color);
  }
}

// export function drawLightBeam(startX, startY, angle, color) {

//   //TODO:
//   //- make line to the canvas end nd check if intersect with obiect instead of isPointInStroke()
//   let x = startX;
//   let y = startY;
//   let length = 1;
//   let endX, endY;
//   let stop = false;
//   let line;

//   while (!stop) {
//     endX = x + Math.cos((angle * Math.PI) / 180) * length;
//     endY = y + Math.sin((angle * Math.PI) / 180) * length;

//     if (isPointOnCanvasEdge(endX, endY)) break;

//     for (const object of objects) {
//       if (object instanceof Light) continue;

//       if (object.isPointInStroke(endX, endY, 1)) {
//         line = new LightBeam(x, y, endX, endY, color);
//         length = 1;

//         if (object instanceof Mirror) {
//           const reflectionAngle =
//             object.calculateReflectionAngle(
//               line.getAngle()
//               );

//           angle = reflectionAngle;
//         }
//         if (object instanceof ConvexLens) {
//           const reflectionAngle = object.calculateReflectionAngle(
//             line.getAngle()
//           );
//           angle = reflectionAngle;
//         }
//         if (object instanceof Prism) {
//           let newx = endX + Math.cos((angle * Math.PI) / 180) * length--;
//           let newy = endY + Math.sin((angle * Math.PI) / 180) * length--;
//           if (color == null) {
//             for (let j = 0; j < 7; j++) {
//               stop = true;
//               drawLightBeam(newx, newy, object.calculateReflectionAngle(line.getAngle()) + j / 10, rainbowColors[j]);
//             }
//           } else {
//             stop = true;
//             drawLightBeam(newx, newy, object.calculateReflectionAngle(line.getAngle()) , color);
//           }
//         }
//         x = endX + Math.cos((angle * Math.PI) / 180) * length;
//         y = endY + Math.sin((angle * Math.PI) / 180) * length;
//       }
//     }
//     length++;
//   }
//   line = new LightBeam(x, y, endX, endY, color);
// }

// Dodaj ostatnią linię tylko jeśli jej ostatni punkt znajduje się na krawędzi lub poza obszarem canvas
canvas1.addEventListener("mousedown", moveController.handleMouseDown);
canvas1.addEventListener("mouseup", moveController.handleMouseUp);
canvas1.addEventListener("mousemove", moveController.handleMouseMove);
canvas1.addEventListener("wheel", moveController.handleMouseWheel);

// export function update() {
//   ctx1.clearRect(0, 0, canvas1.width, canvas1.height);

//   for (let i = objects.length - 1; i >= 0; i--) {
//      const object = objects[i];
//      if (object instanceof Light)
//      drawLightBeam(object.x, object.y, object.angle);
//   }
//   requestAnimationFrame(update);
//  }

export function updateObj() {
  let ctx1 = document.getElementById("canvas1").getContext("2d");
  ctx1.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (let i = objects.length - 1; i >= 0; i--) {
    const object = objects[i];
    //ctx.clearRect(object.x, object.y, object.width, object.height);
    object.draw();
  }
}

//update();
