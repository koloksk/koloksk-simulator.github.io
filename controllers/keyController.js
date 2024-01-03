import { ws } from "../app.js";
import { selectedObject } from "./moveController.js";

export function handleKeyDown(event){
    if (event.key == "Delete" && selectedObject != null) {
        ws.removeObject(selectedObject);
        console.log(`Key "${event.key}" pressed [event: keydown]`);
        //ws.updateObjects();
    
      } 
}
