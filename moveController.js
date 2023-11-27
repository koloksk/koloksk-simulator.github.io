import { objects, updateObj } from "./core.js";
import LightBeam from "./obj/lightbeam.js";
import { openSettings, settings } from "./settingsController.js";

export let isDragging = false;
export let movingObject = null;
export let lastSelected = null;

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

  const clickedObject = objects.find((object) => object.isPointInPath(mouseX, mouseY));
  if (clickedObject) {
    movingObject = clickedObject;
    lastSelected = clickedObject;
    openSettings(clickedObject);
    settings.style.display = "flex";
  }
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
    movingObject.clear();

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
  const object = objects.find((object) => object.isPointInPath(mouseX, mouseY));

    if (
      object &&
      !(object instanceof LightBeam)
    ) {
      const delta = Math.sign(event.deltaY);
      const angleChange = delta;
      object.clear();
      object.angle += angleChange;

      updateObj();
      openSettings(object);
    }
  

  event.preventDefault();
}
