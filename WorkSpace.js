import Grid from "./obj/grid.js";
import {clear} from "./utils/canvas.js";

export default class WorkSpace {

    constructor(){
        this.scale = 1;
        this.objects = [];
    
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d", { willReadFrequently: true });
    
        this.beams = document.getElementById("canvas1");
        this.ctxBeams = canvas1.getContext("2d", { willReadFrequently: true });
        
        this.grid = document.getElementById("grid");
        this.init();
    }
    
    init(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.grid.width = window.innerWidth;
        this.grid.height = window.innerHeight;
        this.beams.width = window.innerWidth;
        this.beams.height = window.innerHeight;

        this.ctxBeams.globalCompositeOperation = "lighter";
        this.canvas.globalCompositeOperation = "lighter";

        // enable grid
        new Grid(20);


    }

    addObject(obj) {
        this.objects.push(obj);
    }

    removeObject(obj){
        this.objects = this.objects.filter((object) => object !== obj)
      }

    updateObjects(){
        clear(this.ctxBeams); // clear light canvas
        clear(this.ctx); // clear light canvas
      
        for (let i = this.objects.length - 1; i >= 0; i--) {
          const object = this.objects[i];
          //ctx.clearRect(object.x, object.y, object.width, object.height);
          object.draw();
        }
    }
}