import { handleKeyDown } from "../controllers/keyController.js";
import * as moveController from "../controllers/moveController.js";
import { ws } from "../app.js";

export function init(){
document.addEventListener("mousedown", moveController.handleMouseDown);
document.addEventListener("mouseup", moveController.handleMouseUp);
document.addEventListener("mousemove", moveController.handleMouseMove);
document.addEventListener("wheel", moveController.handleMouseWheel);
document.addEventListener("keydown", handleKeyDown);
}