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
        color = "#000000";

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

        draw() {
            if (this.father)
                this.globalMat = this.localMat.multiply(this.father.globalMat);
            else
                this.globalMat = this.localMat;
            var m = this.globalMat.data;
            context2D.setTransform(m[0][0], m[1][0], m[0][1], m[1][1], m[0][2], m[1][2]);
            var alpha = context2D.globalAlpha;
            context2D.globalAlpha = this.alpha * (this.father ? this.father.alpha : 1);
            var color = context2D.fillStyle;
            context2D.fillStyle = this.color;

            this.render();

            context2D.globalAlpha = alpha;
            context2D.fillStyle = color;
        }

        addEventListener(type: number, listener: Function, capture?: boolean, priority?: number) {
            var event = new TouchListener(type, listener, capture, priority);
            this.listeners.push(event);//todo check listeners
        }

        protected render() { }

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

        endFill() { }
    }

    class ShapeDisplayObject extends DisplayObject {
        draw() {
            super.draw();
            this.color = this.father.color;
        }
    }

    class Rectangle extends ShapeDisplayObject {
        x: number;
        y: number;
        width: number;
        height: number;

        render() {
            context2D.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    export class Bitmap extends DisplayObject implements IBitmap {
        texture;
        private _width;
        private _height;
        private static count = 0;
        get width(): number { return this.texture.width; }
        get height(): number { return this.texture.height; }
        set width(value) {
            if (this.texture) {
                this.texture.width = value;
                this._width = value;
            }
        }
        set height(value) {
            if (this.texture) {
                this.texture.height = value;
                this._height = value;
            }
        }

        constructor(img?: string) {
            super(0, 0, 0, 0);
            RES.getRes(img).then((value) => {
                this.texture = value;
                console.log(value);
            });

            //generate ID
            this._id = IDs.PICTURE_ID + Bitmap.count;
            Bitmap.count++;

        }


        protected render() {
            //todo 应用数值指定的变换
            if (this.texture)
                context2D.drawImage(this.texture, this.x, this.y);
        }
    }

    export class TextField extends DisplayObject {
        // size: number;
        //maxWidth: number;
        fontSize:number = 15;
        text: string;
        private static count = 0;
        

        constructor() {
            super(0, 0, 0, 0);
            this._id = IDs.TEXT_ID + TextField.count;
            this.height = 20;//todo
            TextField.count++;
        }

        protected render() {
            //  var font = this.context.font;
             context2D.font = this.fontSize + "px Verdana";
            context2D.fillText(this.text, this.x, this.y);
            //  this.context.font = font;
        }


    }

    export class DisplayObjectContainer extends DisplayObject {
        children: DisplayObject[] = [];
        private static count = 0;

        constructor() {
            super(0, 0, 0, 0);
            this._id = IDs.CONTAINER_ID + DisplayObjectContainer.count;
            DisplayObjectContainer.count++;
        }

        addChild(drawable: DisplayObject) {
            this.children.push(drawable);
            drawable.father = this;
        }

        removeChild(child: DisplayObject) {
            var index = this.children.indexOf(child);
            this.children.splice(index, 1);
        }

        removeChildren() {
            this.children.splice(0);
        }

        render() {
            this.children.forEach((value) => {
                value.draw();
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

    export class Shape extends DisplayObjectContainer {
        //private static count = 0;

        render() {
            this.children.forEach((value) => { value.draw() });
        }

        drawRect(x: number, y: number, width: number, height: number) {
            this.addChild(new Rectangle(x, y, width, height));
            this.width += width;
            this.height += height;
        }

        hitTest(event: TouchEvent): DisplayObject[] {
            var result;
            this.children.forEach((value) => {
                var temp = value.hitTest(event);
                if (temp)
                    result = temp;
            })
            return result;
        }
    }
}