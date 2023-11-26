import { objects, update, updateObj } from "./core.js";
import LightBeam from "./obj/lightbeam.js";

export let isDragging = false;
export let movingObject = null;
export let lastSelected = null;

export const settings = document.getElementById("settings");

function calculateMouseCoordinates(event) {
  return {
    x: event.clientX - canvas.getBoundingClientRect().left,
    y: event.clientY - canvas.getBoundingClientRect().top,
  };
}

export function handleMouseDown(event) {
  const { x: mouseX, y: mouseY } = calculateMouseCoordinates(event);
  isDragging = true;
  settings.innerHTML = "";
  settings.style.display = "none";

  for (const object of objects) {
    if (object.isPointInPath(mouseX, mouseY)) {
      movingObject = object;
      lastSelected = object;
      openSettings(object);
      settings.style.display = "flex";
    }
  }
}

export function openSettings(object) {
  settings.innerHTML = "";
  object.getSettings().forEach((property) => {
    createSettingsElements(object, [property], "number");
  });
}

export function createSettingsElements(obj, properties, type) {
  properties.forEach((property) => {
    const label = document.createElement("label");
    label.textContent = property;
    const input = document.createElement("input");
    input.type = type;
    input.value = obj[property];
    input.addEventListener("input", (event) => {
      obj[property] = Number(event.target.value);
      updateObj();
    });
    settings.appendChild(label);
    settings.appendChild(input);
  });
}

export function handleMouseUp() {
  isDragging = false;
  movingObject = null;
}

export function handleMouseMove(event) {
  if (isDragging && movingObject) {
    const { x: mouseX, y: mouseY } = calculateMouseCoordinates(event);
    const deltaX = mouseX - movingObject.getCenter().x;
    const deltaY = mouseY - movingObject.getCenter().y;

    movingObject.x += deltaX;
    movingObject.y += deltaY;
    movingObject.x2 += deltaX;
    movingObject.y2 += deltaY;
    movingObject.points.p1.x += deltaX;
    movingObject.points.p1.y += deltaY;

    openSettings(movingObject);
    updateObj();
  }
}

export function handleMouseWheel(event) {
  const { x: mouseX, y: mouseY } = calculateMouseCoordinates(event);

  for (const object of objects) {
    if (object.isPointInPath(mouseX, mouseY) && !(object instanceof LightBeam)) {
      const delta = Math.sign(event.deltaY);
      const angleChange = delta;
      object.angle += angleChange;

      updateObj();
      openSettings(object);
    }
  }

  event.preventDefault();
}
