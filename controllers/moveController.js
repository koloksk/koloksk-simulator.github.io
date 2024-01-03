import { ws } from "../app.js";
import { openSettings, settings } from "./settingsController.js";
import Grid from "../obj/grid.js";

export let isDragging = false;
export let movingObject = null;
export let selectedObject = null;

let scale = 1;
export let wpscale = 1;

let dragStartX = null;
let dragStartY = null;
let lastX;
let lastY;


export function handleMouseDown(event) {
  const { x: mouseX, y: mouseY } = calculateMouseCoordinates(event);
  isDragging = true;
  dragStartX = mouseX;
  dragStartY = mouseY;
  settings.innerHTML = "";
  settings.style.display = "none";
  selectedObject = null;

  const clickedObject = findObject(event);

  if (clickedObject) {
    movingObject = clickedObject;
    selectedObject = clickedObject;
    openSettings(clickedObject);
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

  if (movingObject) {
    changeObjectPositionHandler(event);
  } else {
    changeWorkspacePositionHandler(event)
  }
}

export function handleMouseWheel(event) {
  changeWorkspaceScaleHandler(event);
  changeObjectAngleHandler(event);
  event.preventDefault();
}

function changeWorkspacePositionHandler(event) {
  const { x: mouseX, y: mouseY } = calculateMouseCoordinates(event);

  //console.log(mouseX + " " + mouseY)
  ws.ctx.translate(mouseX - dragStartX, mouseY - dragStartY);
  ws.ctxBeams.translate(mouseX - dragStartX, mouseY - dragStartY);
  ws.grid.getContext("2d").translate(mouseX - dragStartX, mouseY - dragStartY)
  new Grid(20);
  dragStartX = mouseX;
  dragStartY = mouseY;
  //ws.updateObjects();
}

function changeObjectPositionHandler(event) {
  const { x: mouseX, y: mouseY } = calculateMouseCoordinates(event);
  const deltaX = mouseX - movingObject.getCenter().x;
  const deltaY = mouseY - movingObject.getCenter().y;
  movingObject.clear();

  movingObject.x += deltaX;
  movingObject.y += deltaY;
  movingObject.position.x += deltaX;
  movingObject.position.y += deltaY;
  movingObject.x2 += deltaX;
  movingObject.y2 += deltaY;
  movingObject.points.p1.x += deltaX;
  movingObject.points.p1.y += deltaY;

  openSettings(movingObject);
  //ws.updateObjects();
}

function changeObjectAngleHandler(event) {
  let object = findObject(event);
  object.clear();
  object.angle += event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0;
  openSettings(object);

  //ws.updateObjects();

}

function changeWorkspaceScaleHandler(event){
  if(findObject(event)) return;
  if(wpscale + event.deltaY * -0.0005 <= 0) return;
  wpscale += event.deltaY * -0.0005;
  scale = 1 + event.deltaY * -0.0005;
  var pt = ws.ctx.getTransform().transformPoint(new DOMPoint(lastX, lastY));

  ws.ctx.translate(pt.x,pt.y);
  ws.ctx.scale(scale, scale);
  ws.ctx.translate(-pt.x,-pt.y);
  ws.ctxBeams.translate(pt.x,pt.y);
  ws.ctxBeams.scale(scale, scale);
  ws.ctxBeams.translate(-pt.x,-pt.y);

  document.getElementById("grid").getContext("2d").translate(pt.x,pt.y);
  document.getElementById("grid").getContext("2d").scale(scale, scale);
  document.getElementById("grid").getContext("2d").translate(-pt.x,-pt.y);
  new Grid(20);

  //ws.updateObjects();
}

function findObject(event) {
  const { x: mouseX, y: mouseY } = calculateMouseCoordinates(event);
  return ws.objects.find((object) => object.isPointInPath(mouseX, mouseY) || object.isPointInStroke(mouseX, mouseY));
}

function calculateMouseCoordinates(event) {
  return {
    x: event.clientX - canvas.getBoundingClientRect().left,
    y: event.clientY - canvas.getBoundingClientRect().top,
  };
}
