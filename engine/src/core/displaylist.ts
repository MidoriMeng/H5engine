namespace engine {    

    export abstract class DisplayObject implements Citizen, IDrawable, touchable {
        x: number;
        y: number;
        width: number;
        height: number;
        father: IDrawable;
        localMat: MathUtil.Matrix;
        globalMat: MathUtil.Matrix;
        listeners: TouchListener[];
        protected _id: string;
        touchEnabled = false;
        alpha = 1;
        color = "#FFFF00";

        get id(): string {
            return this._id;
        }

        constructor(x: number, y: number, width: number, height: number) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.localMat = MathUtil.identityMatrix(3);
            this.globalMat = MathUtil.identityMatrix(3);
            this.listeners = [];
        }

        draw(context: IContext) {
            if (this.father)
                this.globalMat = this.localMat.multiply(this.father.globalMat);
            else
                this.globalMat = this.localMat;
            var m = this.globalMat.data;
            context.setTransform(m[0][0], m[1][0], m[0][1], m[1][1], m[0][2], m[1][2]);
            var alpha = context.globalAlpha;
            context.globalAlpha = this.alpha * (this.father.alpha || 1);
            var color = context.fillStyle;
            context.fillStyle = this.color;

            this.render(context);

            context.globalAlpha = alpha;
            context.fillStyle = color;
        }

        addEventListener(type: number, listener: Function, capture?: boolean, priority?: number) {
            var event = new TouchListener(type, listener, capture, priority);
            this.listeners.push(event);//todo check listeners
        }

        protected render(context: IContext) { }

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

        hitTest(event: TouchEvent): DisplayObject[] {
            if (!this.touchEnabled)
                return null;
            //矩阵逆变换
            var inverseMat = this.globalMat.inverse();
            var localClickMat = new MathUtil.Matrix(3, 1);
            localClickMat.data[0][0] = event.stageX;
            localClickMat.data[1][0] = event.stageY;
            localClickMat.data[2][0] = 1;
            localClickMat = inverseMat.multiply(localClickMat);
            var localClickX = localClickMat.a - this.x;
            var localClickY = localClickMat.b - this.y;
            if (0 < localClickX &&
                localClickX < this.width &&
                0 < localClickY &&
                localClickY < this.height) {
                event.target = this;
                return [this];
            }

            else return null;
        }

        dispatchEvent(type: "capture" | "bubble", chain: DisplayObject[], event: TouchEvent) {
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
                console.log("no chain");
        }

        beginFill(color: string) {

            this.color = color;
        }
    }


    export class Shape extends DisplayObject {
        private static count = 0;
        private shapes: DisplayObject[] = [];

        constructor() {
            super(0, 0, 0, 0);
            this._id = IDs.SHAPE_ID + Shape.count;
            Shape.count++;
        }

        protected render(context: IContext) {
            this.shapes.forEach((value) => { value.draw(context) });
        }

        drawRect(x: number, y: number, width: number, height: number) {
            this.shapes.push(new Rectangle(x, y, width, height));
            this.width += width;
            this.height += height;
        }

        hitTest(event: TouchEvent): DisplayObject[] {
            var result;
            this.shapes.forEach((value) => {
                var temp = value.hitTest(event);
                if (temp)
                    result = temp;
            })
            return result;
        }
    }

    class Rectangle extends DisplayObject {
        x: number;
        y: number;
        width: number;
        height: number;


        constructor(x: number, y: number, width: number, height: number) {
            super(x, y, width, height);
        }

        render(context: IContext) {
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    export class Bitmap extends DisplayObject {
        private texture: Texture;
        private static count = 0;

        constructor(img?: string) {
            //load texture
            RES.getRes(img).then(value=>{
                //this.texture = value;
                //this.width = value.width;
                //this.height = value.height;
                console.log("load complete "+value);
            })
            super(0, 0, 0, 0);
            // var texture =loadTexture(img);
            
            //generate ID
            this._id = IDs.PICTURE_ID + Bitmap.count;
            Bitmap.count++;

        }


        protected render(context: IContext) {
            context.drawPicture(this.texture, this.x, this.y);
        }
    }

    export class TextField extends DisplayObject {
        // size: number;
        //maxWidth: number;
        str: string;
        private static count = 0;

        constructor(x: number, y: number, str: string) {
            super(x, y, str.length * 15, 20);
            this.str = str;
            //  this.size = size;
            this._id = IDs.TEXT_ID + TextField.count;
            TextField.count++;
        }

        protected render(context: IContext) {
            //  var font = this.context.font;
            // this.context.font = this.size + "px Verdana";
            context.fillText(this.str, this.x, this.y);
            //  this.context.font = font;
        }


    }

    export class DisplayObjectContainer extends DisplayObject {
        children: DisplayObject[] = [];
        private canvas: ICanvas;
        private static count = 0;

        constructor() {
            super(0, 0, canvas.width, canvas.height);
            this.canvas = canvas;
            this._id = IDs.CONTAINER_ID + DisplayObjectContainer.count;
            DisplayObjectContainer.count++;
        }

        addChild(drawable: DisplayObject) {
            this.children.push(drawable);
            drawable.father = this;
        }

        draw() {
            super.draw(this.canvas.getContext2D());
        }

        render() {
            var self = this;
            this.children.forEach((value) => {
                value.draw(self.canvas.getContext2D());
            });
        }

        hitTest(event: TouchEvent): DisplayObject[] {
            var result: DisplayObject[];
            //执行孩子的检测，储存最后一个（…）碰到的物体
            for (var i = 0; i < this.children.length; i++) {
                result = this.children[i].hitTest(event);
                if (result) {
                    result.unshift(this);
                    return result;
                }
            }
            return result;
        }
    }

}