import { objects, updateObj, ctx, ctx1 } from "./core.js";
import LightBeam from "./obj/lightbeam.js";
import { openSettings, settings } from "./settingsController.js";
import Grid from "./obj/grid.js";

export let isDragging = false;
export let movingObject = null;
export let lastSelected = null;
let cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let scale = 1;
let dragStartX = null;
let dragStartY = null;
let lastX;
let lastY;
function calculateMouseCoordinates(event) {
  return {
    x: event.clientX - canvas.getBoundingClientRect().left,
    y: event.clientY - canvas.getBoundingClientRect().top,
  };
}

export function handleMouseDown(event) {
  const { x: mouseX, y: mouseY } = calculateMouseCoordinates(event);
  isDragging = true;
  dragStartX = mouseX;
  dragStartY = mouseY;
  settings.innerHTML = "";
  settings.style.display = "none";

  const clickedObject = objects.find((object) =>
    object.isPointInPath(mouseX, mouseY)
  );
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
  lastX = event.offsetX || (event.pageX - canvas.offsetLeft);
  lastY = event.offsetY || (event.pageY - canvas.offsetTop);

  if(!isDragging) return;
  const { x: mouseX, y: mouseY } = calculateMouseCoordinates(event);

  if (movingObject) {
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
  } else {
    console.log(mouseX + " " + mouseY)
    ctx.translate(mouseX - dragStartX, mouseY - dragStartY);
    ctx1.translate(mouseX - dragStartX, mouseY - dragStartY);
    document.getElementById("grid").getContext("2d").translate(mouseX - dragStartX, mouseY - dragStartY)
    new Grid(20);
    dragStartX = mouseX;
    dragStartY = mouseY;
    updateObj();

  }
}


export function handleMouseWheel(event) {
  const { x: mouseX, y: mouseY } = calculateMouseCoordinates(event);
  const object = objects.find((object) => object.isPointInPath(mouseX, mouseY));

  if (!object || object instanceof LightBeam) {
    scale = 1 + event.deltaY * 0.0005;
    var pt = ctx.getTransform().transformPoint(new DOMPoint(lastX, lastY));
    // Calculate zoom center
    // const zoomCenterX = event.offsetX - (event.offsetX - 0) * scale;
    // const zoomCenterY = event.offsetY - (event.offsetY- 0) * scale;

    // Scale canvas
    ctx.translate(pt.x,pt.y);
    ctx.scale(scale, scale);
    ctx.translate(-pt.x,-pt.y);

    ctx1.translate(pt.x,pt.y);

    ctx1.scale(scale, scale);
    ctx1.translate(-pt.x,-pt.y);


    document.getElementById("grid").getContext("2d").translate(pt.x,pt.y);
    document.getElementById("grid").getContext("2d").scale(scale, scale);
    document.getElementById("grid").getContext("2d").translate(-pt.x,-pt.y);
    new Grid(20);

    // Update objects
    updateObj();

    // Prevent default behavior
    event.preventDefault();
    return;
  }

  const delta = Math.sign(event.deltaY);
  const angleChange = delta * 0.1;
  object.clear();
  object.angle += angleChange;
  openSettings(object);

  updateObj();
  event.preventDefault();
}

