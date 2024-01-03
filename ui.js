import { ws } from "./app.js";
import ConvexLens from "./obj/convexlens.js";
import Light from "./obj/light.js";
import Mirror from "./obj/mirror.js";
import Prism from "./obj/prism.js";
import RadialLight from "./obj/radialLight.js";

export function init(){
    document.getElementById("1").addEventListener("click", addLight);
document.getElementById("2").addEventListener("click", addMirror);
document.getElementById("3").addEventListener("click", addConvexLens);
document.getElementById("4").addEventListener("click", addPrism);
document.getElementById("5").addEventListener("click", addRadialLight);

function addConvexLens() {
    const convexLens = new ConvexLens({x:200, y:200}, 30, -20, 30);
    ws.addObject(convexLens)
  }
  function addMirror() {
    console.log('draw mirror');
    const mirror = new Mirror({x:60, y:60}, 60);
    ws.addObject(mirror)
  }
  function addLight() {
    console.log('addLight');
    const light = new Light({x: canvas.width / 2, y: canvas.height / 2}, 20);
    
    ws.addObject(light)
  }
  function addPrism() {
    const prism = new Prism({x: canvas.width / 2, y: canvas.height / 2});
    ws.addObject(prism)
  }
  function addRadialLight() {
    const radialLight = new RadialLight({x: canvas.width / 2, y: canvas.height / 2}, 20);
    ws.addObject(radialLight)
  }
}