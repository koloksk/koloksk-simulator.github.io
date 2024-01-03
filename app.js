
import WorkSpace from "./WorkSpace.js";
import * as listeners from "./listeners/init.js";
import * as ui from "./ui.js";
export const ws = new WorkSpace();
ui.init();
listeners.init()

function draw() {
    requestAnimationFrame(draw);

    ws.updateObjects();

}

requestAnimationFrame(draw);
