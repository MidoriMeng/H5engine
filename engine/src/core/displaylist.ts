namespace engine {

    export abstract class DisplayObject implements Citizen, IDrawable, touchable {
        protected _x: number;
        protected _y: number;
        protected _scaleX: number;
        protected _scaleY: number;
        protected _rotate: number;
        protected dirty = true;
        width: number;
        height: number;
        parent: IDrawable;
        localMat: MathUtil.Matrix;
        globalMat: MathUtil.Matrix;
        listeners: TouchListener[];
        protected _id: string;
        touchEnabled = false;
        alpha = 1;
        color = "#000000";
        displayType = "DisplayObject";



        protected calculateLocalMatrix() {
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

        update(chain: DisplayObject[]): DisplayObject[] {
            //local matrix
            if (this.dirty)
                this.calculateLocalMatrix();
            this.dirty = false;
            //global matrix
            if (this.parent)
                this.globalMat = this.localMat.multiply(this.parent.globalMat);
            else
                this.globalMat = this.localMat;
            //add to chain
            chain.push(this);

            /*
            //render settings
            var m = this.globalMat.data;
            context2D.setTransform(m[0][0], m[1][0], m[0][1], m[1][1], m[0][2], m[1][2]);
            var alpha = context2D.globalAlpha;
            context2D.globalAlpha = this.alpha * (this.parent ? this.parent.alpha : 1);
            var color = context2D.fillStyle;
            context2D.fillStyle = this.color;

            //render
            this.render();

            context2D.globalAlpha = alpha;
            context2D.fillStyle = color;
            */
            return chain;
        }

        addEventListener(type: number, listener: Function, capture?: boolean, priority?: number) {
            var event = new TouchListener(type, listener, capture, priority);
            this.listeners.push(event);//todo check listeners
        }

        protected render() { }

        hitTest(event: TouchEvent): DisplayObject[] {
            //矩阵逆变换
            var inverseMat = this.globalMat.inverse();
            var localClickMat = new MathUtil.Matrix(3, 1);
            localClickMat.data[0][0] = event.stageX;
            localClickMat.data[1][0] = event.stageY;
            localClickMat.data[2][0] = 1;
            localClickMat = inverseMat.multiply(localClickMat);
            var localX = localClickMat.data[0][0];
            var localY = localClickMat.data[1][0];
            if (0 < localX &&
                localX < this.width &&
                0 < localY &&
                localY < this.height) {
                event.localX = localX;
                event.localY = localY;
                if (this.touchEnabled)
                    event.target = this;
                return [this];
            }
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
                            value.func(event);
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
            if (value != this._x) {
                this._x = value;
                this.dirty = true;
            }
        }
        set y(value) {
            if (value != this._y) {
                this._y = value;
                this.dirty = true;
            }
        }
        set scaleX(value) {
            if (value != this._scaleX) {
                this._scaleX = value;
                this.dirty = true;
            }
        }
        set scaleY(value) {
            if (value != this._scaleY) {
                this._scaleY = value;
                this.dirty = true;
            }
        }
        set rotate(value) {
            if (value != this._rotate) {
                this._rotate = value;
                this.dirty = true;
            }
        }
        /*set height(value) {
            if (this._height) {
                this.scaleY = value / this._height * this._scaleY;
                this._height = value;
            } else {
                this._height = value;
            }
        }
        set width(value) {
            if (this._width) {
                this.scaleX = value / this._width * this._scaleX;
            this._width = value;
            } else {
                this._width = 0;
            }
        }*/
    }

    export class ShapeDisplayObject extends DisplayObject {

        update(chain: DisplayObject[]): DisplayObject[] {
            super.update(chain);
            this.color = this.parent.color;
            return chain;
        }
    }

    export class Rectangle extends ShapeDisplayObject {
        x: number;
        y: number;
        width: number;
        height: number;
        displayType = "Rectangle";

        render() {
            context2D.fillRect(0, 0, this.width, this.height);
        }
    }

    export class Bitmap extends DisplayObject implements IBitmap {
        _texture: Texture;
        width: number;
        height: number;
        private static count = 0;
        displayType = "Bitmap";

        get texture() {
            return this._texture;
        }

        set texture(value) {
            this._texture = value;
            if (value) {
                this.width = value.width;
                this.height = value.height;
            }
        }

        constructor(texture?: string | Texture) {
            super(0, 0, 0, 0);
            this._texture = null;
            if (texture instanceof Texture) {
                this.texture = texture;
            } else if (texture)
                this.texture = RES.getRes(texture);
            //generate ID
            this._id = IDs.PICTURE_ID + Bitmap.count;
            Bitmap.count++;

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
        private _text: string;
        private static count = 0;
        bold: boolean = false;
        displayType = "TextField";

        get text():string{
            return this._text;
        }
        set text(value:string){
            this._text = value;
            this.width = value.length * 10;
        }
        constructor() {
            super(0, 0, 0, 0);
            this._id = IDs.TEXT_ID + TextField.count;
            this.height = 15;//todo
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
        protected static count = 0;
        displayType = "DisplayObjectContainer";

        constructor() {
            super(0, 0, 0, 0);
            this.generateID();
        }

        protected generateID() {
            this._id = IDs.CONTAINER_ID + DisplayObjectContainer.count;
            DisplayObjectContainer.count++;
        }

        addChild(drawable: DisplayObject) {
            this.children.push(drawable);
            drawable.parent = this;
            if (drawable.x + drawable.width > this.width)
                this.width = drawable.x + drawable.width;
            if (drawable.y + drawable.height > this.height)
                this.height = drawable.y + drawable.height;
        }

        removeChild(child: DisplayObject) {
            var index = this.children.indexOf(child);
            this.children.splice(index, 1);
        }

        removeChildren() {
            this.children.splice(0);
        }

        update(chain: DisplayObject[]): DisplayObject[] {
            super.update(chain);
            this.children.forEach((value) => {
                value.update(chain);
            });
            return chain;
        }

        hitTest(event: TouchEvent): DisplayObject[] {
            var result: DisplayObject[];
            for (var i = this.children.length - 1; i > -1; i--) {
                result = this.children[i].hitTest(event);
                if (result) {
                    result.unshift(this);
                    if (this.touchEnabled && event.target == null)
                        event.target = this;
                    return result;
                }
            }
            return result;
        }
    }

    export class Shape extends DisplayObjectContainer {
        //private static count = 0;
        children: ShapeDisplayObject[];
        displayType = "Shape";

        protected generateID() {
            this._id = IDs.SHAPE_ID + Shape.count;
            Shape.count++;
        }

        drawRect(x: number, y: number, width: number, height: number) {
            this.addChild(new Rectangle(x, y, width, height));
        }
    }
}