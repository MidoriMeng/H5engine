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

class DisplayObject implements IDrawable {
    x: number;
    y: number;
    width: number;
    height: number;
    father: IDrawable;
    localMat: MathUtil.Matrix;
    globalMat: MathUtil.Matrix;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.localMat = MathUtil.identity(3);
        this.globalMat = MathUtil.identity(3);
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

    }

    protected render(context: CanvasRenderingContext2D) {
        context.drawImage(this.image, this.x, this.y);
        /*this.image.onload = () => {
            this.context.drawImage(this.image, this.x, this.y);
        }*/

    }
}

class TextField extends DisplayObject {
    // size: number;
    //maxWidth: number;
    str: string;

    constructor(x: number, y: number, str: string) {
        super(x, y, 100, 20);
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



