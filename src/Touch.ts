
class TouchListener{
    type: number;
    func: Function;
    capture = false;
    priority = 0;

    constructor(type: number, func: Function, capture?: boolean, priority?: number) {
        this.type = type;
        this.func = func;
        this.capture = capture || false;
        this.priority = priority || 0;
    }
}

class TouchEvents {
    x: number;
    y: number;
    type: number;

    static MOUSEDOWN = 0;
    static MOUSEUP = 1;
    static CLICK = 2;

    constructor( x: number, y: number, type:number){
        this.x = x;
        this.y = y;
        this.type = type;
    }

}