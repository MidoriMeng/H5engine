declare namespace engine {
    namespace MathUtil {
        class Matrix {
            data: number[][];
            readonly degreeI: number;
            readonly degreeJ: number;
            row(r: number): Vector;
            column(c: number): Vector;
            constructor(degreeI: number, degreeJ: number);
            /**a.multiply(b) == a*b  */
            multiply(other: Matrix): Matrix;
            a: number;
            b: number;
            c: number;
            d: number;
            tx: number;
            ty: number;
            inverse(): Matrix;
        }
        function swap(a: any, b: any): void;
        function identityMatrix(degree: number): Matrix;
        function move2Mat(x: number, y: number): Matrix;
        function rotate2Mat(eularDegree: number): Matrix;
        function scale2Mat(x: number, y: number): Matrix;
        class Vector {
            data: number[];
            readonly degree: number;
            constructor(num: number[]);
            dotProduct(other: Vector): number;
        }
    }
}
declare namespace engine {
    type Ticker_Listener_Type = (deltaTime?: number) => void;
    let FPS: number;
    function setTimeout(func: Function, delayTime: number): string;
    /**注册一个每隔delayTime执行一次的ticker并返回它的key */
    function setInterval(func: Function, delayTime: number): string;
    function clearInterval(key: string): void;
    class Ticker {
        listeners: Map<string, Ticker_Listener_Type>;
        private static instance;
        private static count;
        static getInstance(): Ticker;
        register(listener: Ticker_Listener_Type): string;
        unregister(key: string): void;
        notify(deltaTime: number): void;
    }
}
declare namespace engine {
    class Tween {
        private target;
        private onChange;
        private onFinish;
        private static tweens;
        private moving;
        private static getTweens;
        static removeTweens(target: IDrawable): boolean;
        constructor(target: IDrawable, properties?: {
            onChange?: Function;
            onFinish?: Function;
        });
        to(toTarget: any, time: number): void;
        private move;
    }
}
declare namespace engine {
    let context2D: IContext;
    let canvas: ICanvas;
    interface IDrawable {
        x: number;
        y: number;
        width: number;
        height: number;
        localMat: MathUtil.Matrix;
        globalMat: MathUtil.Matrix;
        parent: IDrawable;
        update(chain: DisplayObject[]): DisplayObject[];
        alpha: number;
        color: string;
        displayType: string;
        touchEnabled: boolean;
    }
    interface IContext {
        data: any;
        font: string;
        drawImage(tex: ITexture, x: number, y: number): any;
        fillRect(x: number, y: number, width: number, height: number): any;
        setTransform(a: any, b: any, c: any, d: any, tx: any, ty: any): any;
        fillText(str: string, x: number, y: number): any;
        clearRect(x: number, y: number, width: number, height: number): any;
        draw(list: DisplayObject[]): any;
    }
    interface ICanvas {
        data: any;
        width: number;
        height: number;
        getContext(type: string): any;
    }
    interface IBitmap {
        texture: ITexture;
    }
    interface ITexture {
        data: any;
    }
}
declare namespace engine {
    abstract class DisplayObject implements Citizen, IDrawable, touchable {
        protected _x: number;
        protected _y: number;
        protected _scaleX: number;
        protected _scaleY: number;
        protected _rotate: number;
        protected dirty: boolean;
        width: number;
        height: number;
        parent: IDrawable;
        localMat: MathUtil.Matrix;
        globalMat: MathUtil.Matrix;
        listeners: TouchListener[];
        protected _id: string;
        touchEnabled: boolean;
        alpha: number;
        color: string;
        displayType: string;
        protected calculateLocalMatrix(): void;
        constructor(x: number, y: number, width: number, height: number);
        update(chain: DisplayObject[]): DisplayObject[];
        addEventListener(type: number, listener: Function, capture?: boolean, priority?: number): void;
        protected render(): void;
        hitTest(event: TouchEvent): DisplayObject[];
        dispatchEvent(type: "capture" | "bubble", chain: DisplayObject[], event: TouchEvent): void;
        beginFill(color: string): void;
        endFill(): void;
        readonly id: string;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        rotate: number;
    }
    class ShapeDisplayObject extends DisplayObject {
        update(chain: DisplayObject[]): DisplayObject[];
    }
    class Rectangle extends ShapeDisplayObject {
        x: number;
        y: number;
        width: number;
        height: number;
        displayType: string;
        render(): void;
    }
    class Bitmap extends DisplayObject implements IBitmap {
        _texture: Texture;
        width: number;
        height: number;
        private static count;
        displayType: string;
        texture: Texture;
        constructor(texture?: string | Texture);
        protected render(): void;
    }
    class Texture extends DisplayObject implements ITexture {
        data: any;
        constructor();
    }
    class TextField extends DisplayObject {
        fontSize: number;
        private _text;
        private static count;
        bold: boolean;
        displayType: string;
        text: string;
        constructor();
        protected render(): void;
    }
    class DisplayObjectContainer extends DisplayObject {
        children: DisplayObject[];
        protected static count: number;
        displayType: string;
        constructor();
        protected generateID(): void;
        addChild(drawable: DisplayObject): void;
        removeChild(child: DisplayObject): void;
        removeChildren(): void;
        update(chain: DisplayObject[]): DisplayObject[];
        hitTest(event: TouchEvent): DisplayObject[];
    }
    class Shape extends DisplayObjectContainer {
        children: ShapeDisplayObject[];
        displayType: string;
        protected generateID(): void;
        drawRect(x: number, y: number, width: number, height: number): void;
    }
}
declare namespace engine {
    class Context implements IContext {
        data: CanvasRenderingContext2D;
        font: string;
        drawImage(tex: ITexture, x: number, y: number): void;
        fillRect(x: number, y: number, width: number, height: number): void;
        setTransform(a: any, b: any, c: any, d: any, tx: any, ty: any): void;
        fillText(str: string, x: number, y: number): void;
        clearRect(x: number, y: number, width: number, height: number): void;
        draw(list: DisplayObject[]): void;
    }
    class Canvas implements ICanvas {
        data: HTMLCanvasElement;
        readonly width: number;
        readonly height: number;
        getContext(type: string): Context;
    }
}
declare namespace engine {
    interface Citizen {
        id: string;
    }
    class IDs {
        static SHAPE_ID: string;
        static PICTURE_ID: string;
        static TEXT_ID: string;
        static CONTAINER_ID: string;
        static TICKER_ID: string;
    }
}
declare namespace engine {
    interface touchable {
        touchEnabled: boolean;
        listeners: TouchListener[];
        addEventListener(type: number, listener: Function, capture?: boolean, priority?: number): any;
        hitTest(event: TouchEvent): DisplayObject[];
        dispatchEvent(type: "capture" | "bubble", chain: DisplayObject[], event: TouchEvent): any;
    }
    interface EventEmitter {
        notify(...a: any[]): any;
    }
    class TouchListener {
        type: number;
        func: Function;
        capture: boolean;
        priority: number;
        constructor(type: number, func: Function, capture?: boolean, priority?: number);
    }
    class TouchEvent {
        stageX: number;
        stageY: number;
        localX: number;
        localY: number;
        type: number;
        target: any;
        static MOUSEDOWN: number;
        static MOUSEUP: number;
        static CLICK: number;
        constructor(x: number, y: number, type: number);
    }
}
declare namespace engine {
    function click(x: number, y: number): void;
    let run: (main: any) => void;
}
declare namespace engine {
    namespace RES {
        function getResAsync(path: string): Promise<{}>;
        function loadJSON(url: string, callback: (loadedObj: any) => void): void;
        function getRes(path: string, onload?: Function): Texture;
        function loadConfig(onCompleted: Function): void;
    }
}
