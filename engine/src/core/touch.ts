namespace engine {

    export interface touchable {
        touchEnabled: boolean;
    }
    
    export class TouchListener {
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

    export class TouchEvent {
        stageX: number;
        stageY: number;
        type: number;
        target:any;

        static MOUSEDOWN = 0;
        static MOUSEUP = 1;
        static CLICK = 2;

        constructor(x: number, y: number, type: number) {
            this.stageX = x;
            this.stageY = y;
            this.type = type;
        }

    }
}