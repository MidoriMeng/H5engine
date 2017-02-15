interface IDrawable {
    context: CanvasRenderingContext2D;
    draw();
}

class DisplayObject implements IDrawable {
    x: number;
    y: number;
    context: CanvasRenderingContext2D;

    draw() {
        this.context = Stage.getInstance().getContext();
    }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Rectangle extends DisplayObject {
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y);
        this.width = width;
        this.height = height;
    }
    draw() {
        super.draw();
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class ImageField extends DisplayObject {
    image:HTMLImageElement;
    constructor(x: number, y: number,img:string,width?:number, height?:number) {
        super(x, y);
        this.image = new Image();
        this.image.src = img;
    }
    draw() {
        super.draw();
        this.image.onload = ()=>{
            this.context.drawImage(this.image,this.x, this.y);
        }
        
    }
}

class TextField extends DisplayObject {
    // size: number;
    //maxWidth: number;
    str: string;

    constructor(x: number, y: number, str: string) {
        super(x, y);
        this.str = str;
        //  this.size = size;
    }
    draw() {
        super.draw();
        //  var font = this.context.font;
        // this.context.font = this.size + "px Verdana";
        this.context.fillText(this.str, this.x, this.y);
        //  this.context.font = font;
    }
}

class DisplayObjectContainer extends DisplayObject {
    drawList: IDrawable[] = [];

    addChild(drawable: IDrawable) {
        this.drawList.push(drawable);
    }

    draw() {
        this.drawList.forEach((value) => {
            value.draw();
        });
    }
}

class Stage {//singleton
    private static instance = new Stage();
    private context: CanvasRenderingContext2D;
    drawList: IDrawable[] = [];
    addChild(drawable: IDrawable) {
        this.drawList.push(drawable);
    }

    draw() {
        this.drawList.forEach((value) => { value.draw() });
    }

    static getInstance(): Stage {
        if (Stage.instance)
            return Stage.instance;
        else
            Stage.instance = new Stage();
    }

    setContext(context: CanvasRenderingContext2D) {
        console.log("set context");
        this.context = context;
    }

    getContext(): CanvasRenderingContext2D {
        if (this.context)
            return this.context;
        console.error("please set CanvasRenderingContext2D context");
    }
}