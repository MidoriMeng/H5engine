namespace engine {

    export abstract class DisplayObject implements Citizen, IDrawable, touchable {
        protected _x: number;
        protected _y: number;
        protected _scaleX: number;
        protected _scaleY: number;
        protected _rotate: number;

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

        get x(): number {
            return this._x;
        }
        get y(): number {
            return this._y;
        }
        get scaleX(): number {
            return this._scaleX;
        }
        get scaleY(): number {
            return this._scaleY;
        }
        get rotate(): number {
            return this._rotate;
        }

        set x(value) {
            this._x = value;
            this.calculateMat();
        }
        set y(value) {
            this._y = value;
            this.calculateMat();
        }
        set scaleX(value) {
            this._scaleX = value;
            this.calculateMat();
        }
        set scaleY(value) {
            this._scaleY = value;
            this.calculateMat();
        }
        set rotate(value) {
            this._rotate = value;
            this.calculateMat();
        }

        protected calculateMat() {
            var transMat = MathUtil.move2Mat(this._x, this._y);
            var rotateMat = MathUtil.rotate2Mat(this.rotate);
            var scaleMat = MathUtil.scale2Mat(this._scaleX, this._scaleY);
            this.localMat = transMat.multiply(rotateMat).multiply(scaleMat)
                .multiply(MathUtil.identityMatrix(3));
        }

        constructor(x: number, y: number, width: number, height: number) {
            this._x = x;
            this._y = y;
            this._scaleX = 1;
            this._scaleY = 1;
            this._rotate = 0;
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

        hitTest(event: TouchEvent): DisplayObject[] {
            if (this.touchEnabled || this.father.touchEnabled) {
                //矩阵逆变换
                var inverseMat = this.globalMat.inverse();
                var localClickMat = new MathUtil.Matrix(3, 1);
                localClickMat.data[0][0] = event.stageX;
                localClickMat.data[1][0] = event.stageY;
                localClickMat.data[2][0] = 1;
                localClickMat = inverseMat.multiply(localClickMat);
                var localX = localClickMat.data[0][0];
                var localY= localClickMat.data[1][0];
                if (0 < localX &&
                    localX < this.width &&
                    0 < localY &&
                    localY < this.height) {
                    event.target = this;
                    event.localX = localX;
                    event.localY = localY;
                    return [this];
                }
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
            context2D.fillRect(0, 0, this.width, this.height);
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

        constructor(texture?) {
            super(0, 0, 0, 0);
            this.texture = texture;
            //generate ID
            this._id = IDs.PICTURE_ID + Bitmap.count;
            Bitmap.count++;
            if (this._id == "02108") {
                console.log("hhh");
            }

        }


        protected render() {
            try {
                if (this.texture)
                    context2D.drawImage(this.texture.data, 0, 0);
            } catch (e) { }
        }
    }

    export class Texture extends DisplayObject implements ITexture {
        data;
        constructor() {
            super(0, 0, 0, 0);
        }
    }
    export class TextField extends DisplayObject {
        // size: number;
        //maxWidth: number;
        fontSize: number = 15;
        text: string;
        private static count = 0;
        bold: boolean = false;

        constructor() {
            super(0, 0, 0, 0);
            this._id = IDs.TEXT_ID + TextField.count;
            this.height = 20;//todo
            TextField.count++;
        }

        protected render() {
            //  var font = this.context.font;
            context2D.font = (this.bold ? "bold " : "") + this.fontSize + "px Verdana";
            context2D.fillText(this.text, 0, 0);
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
            this.touchEnabled = true;
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