//var math = require('mathjs');
interface IDrawable {
    width: number;
    height: number;
    localMat: MathUtil.Matrix;
    globalMat: MathUtil.Matrix;
    father: IDrawable;
    draw(context: CanvasRenderingContext2D);
    transform(x: number, y: number);
    rotate(eularDegree: number);
    scale(x: number, y: number);
}

abstract class DisplayObject implements IDrawable {
    x: number;
    y: number;
    width: number;
    height: number;
    father: IDrawable;
    localMat: MathUtil.Matrix;
    globalMat: MathUtil.Matrix;
    listeners: TouchListener[];

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.localMat = MathUtil.identity(3);
        this.globalMat = MathUtil.identity(3);
        this.listeners = [];
    }

    draw(context: CanvasRenderingContext2D) {
        if (this.father)
            this.globalMat = this.localMat.multiply(this.father.globalMat);
        else
            this.globalMat = this.localMat;
        var m = this.globalMat.data;
        context.setTransform(m[0][0], m[1][0], m[0][1], m[1][1], m[0][2], m[1][2]);
        this.render(context);
    }

    addEventListener(type: number, listener: Function, capture?: boolean, priority?: number) {
        var event = new TouchListener(type, listener, capture, priority);
        this.listeners.push(event);//todo check listeners
    }

    protected render(context: CanvasRenderingContext2D) { }

    rotate(eularDegree: number) {
        var mat = MathUtil.rotate2Mat(eularDegree);
        this.localMat = mat.multiply(this.localMat);
    }

    transform(x: number, y: number) {
        var mat = MathUtil.move2Mat(x, y);
        this.localMat = mat.multiply(this.localMat);
    }

    scale(x: number, y: number) {
        var mat = MathUtil.scale2Mat(x, y);
        this.localMat = mat.multiply(this.localMat);
    }

    hitTest(event: TouchEvents): DisplayObject[] {
        var localClickX = event.x - this.x;
        var localClickY = event.y - this.y;
        if (0 < localClickX &&
            localClickX < this.width &&
            0 < localClickY &&
            localClickY < this.height) {
            return [this];
        }

        else return null;
    }

    dispatchEvent(type: "capture" | "bubble", chain: DisplayObject[], event: TouchEvents) {
        if (chain) {
            var transformedChain = chain.slice(0);
            if (type == "bubble") {
                transformedChain.reverse();
            }
            for (var i = 0; i < transformedChain.length; i++) {//逆向遍历点击事件链的元素
                var element = transformedChain[i];
                element.listeners.forEach((value) => {//每个元素派发事件
                    var t = (type == "capture") ? value.capture : !value.capture;
                    if (value.type == event.type && t) {
                        //value.obj.func();todo更新func调用
                        value.func();
                    }
                });
            }
        } else
            console.error("no chain");
    }
}

class Rectangle extends DisplayObject {
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
    }

    protected render(context: CanvasRenderingContext2D) {
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Picture extends DisplayObject {
    private image: HTMLImageElement;

    constructor(x: number, y: number, img: string, width?: number, height?: number) {
        var image = new Image();
        image.src = img;
        super(x, y, image.width, image.height);
        this.image = image;
        var self = this;
        this.image.onload = () => {
            self.width = image.width;
            self.height = image.height;
            console.log("width" + self.width + "height" + self.height);
        }

    }

    protected render(context: CanvasRenderingContext2D) {
        context.drawImage(this.image, this.x, this.y);
        this.image.onload = () => {
            context.drawImage(this.image, this.x, this.y);
        }
    }
}

class TextField extends DisplayObject {
    // size: number;
    //maxWidth: number;
    str: string;

    constructor(x: number, y: number, str: string) {
        super(x, y, str.length * 15, 20);
        this.str = str;
        //  this.size = size;
    }

    protected render(context: CanvasRenderingContext2D) {
        //  var font = this.context.font;
        // this.context.font = this.size + "px Verdana";
        context.fillText(this.str, this.x, this.y);
        //  this.context.font = font;
    }


}



