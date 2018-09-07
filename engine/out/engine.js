var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var engine;
(function (engine) {
    let MathUtil;
    (function (MathUtil) {
        class Matrix {
            constructor(degreeI, degreeJ) {
                this.data = [];
                for (var i = 0; i < degreeI; i++) {
                    this.data.push([]);
                    for (var j = 0; j < degreeJ; j++) {
                        this.data[i].push(0);
                    }
                }
            }
            get degreeI() {
                return this.data.length;
            }
            get degreeJ() {
                return this.data[0].length;
            }
            row(r) {
                if (this.data[r]) {
                    return new Vector(this.data[r]);
                }
                else {
                    console.error("wrong row");
                    return null;
                }
            }
            column(c) {
                if (this.degreeJ <= c) {
                    console.error("wrong column");
                    return null;
                }
                var ctemp = [];
                this.data.forEach((value) => {
                    ctemp.push(value[c]);
                });
                return new Vector(ctemp);
            }
            /**a.multiply(b) == a*b  */
            multiply(other) {
                if (this.degreeJ != other.degreeI)
                    return null;
                var result = new Matrix(this.degreeI, other.degreeJ);
                var temp = 0;
                for (var i = 0; i < this.degreeI; i++) {
                    for (var j = 0; j < other.degreeJ; j++) {
                        result.data[i][j] = this.row(i).dotProduct(other.column(j));
                    }
                }
                return result;
            }
            get a() { return this.data[0][0]; }
            get b() { return this.data[1][0]; }
            get c() { return this.data[0][1]; }
            get d() { return this.data[1][1]; }
            get tx() { return this.data[0][2]; }
            get ty() { return this.data[1][2]; }
            set a(value) { this.data[0][0] = value; }
            set b(value) { this.data[1][0] = value; }
            set c(value) { this.data[0][1] = value; }
            set d(value) { this.data[1][1] = value; }
            set tx(value) { this.data[0][2] = value; }
            set ty(value) { this.data[1][2] = value; }
            inverse() {
                var m = this;
                var a = m.a;
                var b = m.b;
                var c = m.c;
                var d = m.d;
                var tx = m.tx;
                var ty = m.ty;
                var determinant = a * d - b * c;
                var result = identityMatrix(3);
                if (determinant == 0) {
                    throw new Error("no invert");
                }
                determinant = 1 / determinant;
                var k = result.a = d * determinant;
                b = result.b = -b * determinant;
                c = result.c = -c * determinant;
                d = result.d = a * determinant;
                result.tx = -(k * tx + c * ty);
                result.ty = -(b * tx + d * ty);
                return result;
            }
        }
        MathUtil.Matrix = Matrix;
        function swap(a, b) {
            var temp = a;
            a = b;
            b = temp;
        }
        MathUtil.swap = swap;
        function identityMatrix(degree) {
            var result = new Matrix(degree, degree);
            for (var i = 0; i < degree; i++) {
                for (var j = 0; j < degree; j++) {
                    result.data[i][j] = (i == j ? 1 : 0);
                }
            }
            return result;
        }
        MathUtil.identityMatrix = identityMatrix;
        function move2Mat(x, y) {
            var result = identityMatrix(3);
            result.data[0][2] = x;
            result.data[1][2] = y;
            return result;
        }
        MathUtil.move2Mat = move2Mat;
        function rotate2Mat(eularDegree) {
            var result = identityMatrix(3);
            result.data[0][0] = Math.cos(eularDegree);
            result.data[1][0] = Math.sin(eularDegree);
            result.data[0][1] = -Math.sin(eularDegree);
            result.data[1][1] = Math.cos(eularDegree);
            return result;
        }
        MathUtil.rotate2Mat = rotate2Mat;
        function scale2Mat(x, y) {
            var result = identityMatrix(3);
            result.data[0][0] = x;
            result.data[1][1] = y;
            return result;
        }
        MathUtil.scale2Mat = scale2Mat;
        class Vector {
            constructor(num) {
                this.data = [];
                num.forEach((value) => { this.data.push(value); });
            }
            get degree() {
                return this.data.length;
            }
            dotProduct(other) {
                if (this.degree != other.degree) {
                    console.error("wrong degree,num1 degree:" + this.degree + ", num2 degree:" + other.degree);
                    return;
                }
                var result = 0;
                for (var i = 0; i < this.degree; i++)
                    result += this.data[i] * other.data[i];
                return result;
            }
        }
        MathUtil.Vector = Vector;
    })(MathUtil = engine.MathUtil || (engine.MathUtil = {}));
})(engine || (engine = {}));
var engine;
(function (engine) {
    engine.FPS = 60;
    function setTimeout(func, delayTime) {
        var ticker = Ticker.getInstance();
        var passedTime = 0;
        var delayFunc = (delta) => {
            passedTime += delta;
            if (passedTime >= delayTime) {
                func();
                ticker.unregister(key);
            }
        };
        var key = ticker.register(delayFunc);
        return key;
    }
    engine.setTimeout = setTimeout;
    /**注册一个每隔delayTime执行一次的ticker并返回它的key */
    function setInterval(func, delayTime) {
        var passedTime = 0;
        var ticker = Ticker.getInstance();
        var delayFunc = (delta) => {
            passedTime += delta;
            if (passedTime >= delayTime) {
                func(delta);
                passedTime -= delayTime;
            }
        };
        return ticker.register(delayFunc);
    }
    engine.setInterval = setInterval;
    function clearInterval(key) {
        Ticker.getInstance().unregister(key);
    }
    engine.clearInterval = clearInterval;
    class Ticker {
        static getInstance() {
            if (!Ticker.instance) {
                Ticker.instance = new Ticker();
                Ticker.instance.listeners = new Map();
            }
            return Ticker.instance;
        }
        register(listener) {
            var id = engine.IDs.TICKER_ID + Ticker.count;
            this.listeners.set(id, listener);
            Ticker.count++;
            return id;
        }
        unregister(key) {
            if (this.listeners.has(key)) {
                this.listeners.delete(key);
            }
        }
        notify(deltaTime) {
            for (let [key, listener] of this.listeners) {
                listener(deltaTime);
            }
        }
    }
    Ticker.count = 0;
    engine.Ticker = Ticker;
    /*export function startTick(func:Function){
       // Ticker.getInstance().s
}*/
})(engine || (engine = {}));
var engine;
(function (engine) {
    class Tween {
        constructor(target, properties) {
            this.moving = [];
            this.target = target;
            if (properties) {
                this.onChange = properties.onChange || null;
                this.onFinish = properties.onFinish || null;
            }
            Tween.getTweens().set(target, this);
        }
        static getTweens() {
            if (Tween.tweens == null)
                Tween.tweens = new Map();
            return Tween.tweens;
        }
        static removeTweens(target) {
            //delete Tween.getTweens().get(target);
            return Tween.getTweens().delete(target);
        }
        to(toTarget, time) {
            for (var attribute in toTarget) { //attribute: x, y, ...
                if (this.target[attribute] != undefined) { //if target has attribute
                    //check是否有在动
                    for (var i = 0; i < this.moving.length; i++) {
                        var current = this.moving[i];
                        if (current.attribute == attribute) {
                            engine.Ticker.getInstance().unregister(current.key);
                        }
                    }
                    //move
                    var key = this.move(attribute, toTarget, time);
                    //record
                    this.moving.push({ attribute: attribute, key: key });
                }
            }
        }
        move(attribute, toTarget, time) {
            var originValue = this.target[attribute];
            var targetValue = toTarget[attribute];
            var speed = (targetValue - originValue) / time;
            if (time == 0)
                speed = 0;
            //注册动画
            var key = engine.setInterval((deltaTime) => {
                originValue += (speed * deltaTime);
                this.target[attribute] = originValue;
                if (this.onChange)
                    this.onChange();
            }, 1000 / engine.FPS);
            //注册事件取消动画
            engine.setTimeout(() => {
                engine.Ticker.getInstance().unregister(key);
                this.target[attribute] = targetValue;
                if (this.onFinish)
                    this.onFinish();
            }, time);
            return key;
        }
    }
    engine.Tween = Tween;
})(engine || (engine = {}));
var engine;
(function (engine) {
})(engine || (engine = {}));
var engine;
(function (engine) {
    class DisplayObject {
        constructor(x, y, width, height) {
            this.dirty = true;
            this.touchEnabled = false;
            this.alpha = 1;
            this.color = "#000000";
            this.displayType = "DisplayObject";
            this._x = x;
            this._y = y;
            this._scaleX = 1;
            this._scaleY = 1;
            this._rotate = 0;
            this.width = width;
            this.height = height;
            this.localMat = engine.MathUtil.identityMatrix(3);
            this.globalMat = engine.MathUtil.identityMatrix(3);
            this.listeners = [];
        }
        calculateLocalMatrix() {
            var transMat = engine.MathUtil.move2Mat(this._x, this._y);
            var rotateMat = engine.MathUtil.rotate2Mat(this.rotate);
            var scaleMat = engine.MathUtil.scale2Mat(this._scaleX, this._scaleY);
            this.localMat = transMat.multiply(rotateMat).multiply(scaleMat)
                .multiply(engine.MathUtil.identityMatrix(3));
        }
        update(chain) {
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
        addEventListener(type, listener, capture, priority) {
            var event = new engine.TouchListener(type, listener, capture, priority);
            this.listeners.push(event); //todo check listeners
        }
        render() { }
        hitTest(event) {
            //矩阵逆变换
            var inverseMat = this.globalMat.inverse();
            var localClickMat = new engine.MathUtil.Matrix(3, 1);
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
        dispatchEvent(type, chain, event) {
            if (chain) {
                var transformedChain = chain.slice(0);
                if (type == "bubble") {
                    transformedChain.reverse();
                }
                for (var i = 0; i < transformedChain.length; i++) { //逆向遍历点击事件链的元素
                    var element = transformedChain[i];
                    element.listeners.forEach((value) => {
                        var t = (type == "capture") ? value.capture : !value.capture;
                        if (value.type == event.type && t) {
                            value.func(event);
                        }
                    });
                }
            }
            else
                console.log("no chain");
        }
        beginFill(color) {
            this.color = color;
        }
        endFill() { }
        get id() {
            return this._id;
        }
        get x() {
            return this._x;
        }
        get y() {
            return this._y;
        }
        get scaleX() {
            return this._scaleX;
        }
        get scaleY() {
            return this._scaleY;
        }
        get rotate() {
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
    }
    engine.DisplayObject = DisplayObject;
    class ShapeDisplayObject extends DisplayObject {
        update(chain) {
            super.update(chain);
            this.color = this.parent.color;
            return chain;
        }
    }
    engine.ShapeDisplayObject = ShapeDisplayObject;
    class Rectangle extends ShapeDisplayObject {
        constructor() {
            super(...arguments);
            this.displayType = "Rectangle";
        }
        render() {
            engine.context2D.fillRect(0, 0, this.width, this.height);
        }
    }
    engine.Rectangle = Rectangle;
    class Bitmap extends DisplayObject {
        constructor(texture) {
            super(0, 0, 0, 0);
            this.displayType = "Bitmap";
            this._texture = null;
            if (texture instanceof Texture) {
                this.texture = texture;
            }
            else if (texture)
                this.texture = engine.RES.getRes(texture);
            //generate ID
            this._id = engine.IDs.PICTURE_ID + Bitmap.count;
            Bitmap.count++;
        }
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
        render() {
            try {
                if (this.texture)
                    engine.context2D.drawImage(this.texture.data, 0, 0);
            }
            catch (e) { }
        }
    }
    Bitmap.count = 0;
    engine.Bitmap = Bitmap;
    class Texture extends DisplayObject {
        constructor() {
            super(0, 0, 0, 0);
        }
    }
    engine.Texture = Texture;
    class TextField extends DisplayObject {
        constructor() {
            super(0, 0, 0, 0);
            // size: number;
            //maxWidth: number;
            this.fontSize = 15;
            this.bold = false;
            this.displayType = "TextField";
            this._id = engine.IDs.TEXT_ID + TextField.count;
            this.height = 15; //todo
            TextField.count++;
        }
        get text() {
            return this._text;
        }
        set text(value) {
            this._text = value;
            this.width = value.length * 10;
        }
        render() {
            //  var font = this.context.font;
            engine.context2D.font = (this.bold ? "bold " : "") + this.fontSize + "px Verdana";
            engine.context2D.fillText(this.text, 0, 0);
            //  this.context.font = font;
        }
    }
    TextField.count = 0;
    engine.TextField = TextField;
    class DisplayObjectContainer extends DisplayObject {
        constructor() {
            super(0, 0, 0, 0);
            this.children = [];
            this.displayType = "DisplayObjectContainer";
            this.generateID();
        }
        generateID() {
            this._id = engine.IDs.CONTAINER_ID + DisplayObjectContainer.count;
            DisplayObjectContainer.count++;
        }
        addChild(drawable) {
            this.children.push(drawable);
            drawable.parent = this;
            if (drawable.x + drawable.width > this.width)
                this.width = drawable.x + drawable.width;
            if (drawable.y + drawable.height > this.height)
                this.height = drawable.y + drawable.height;
        }
        removeChild(child) {
            var index = this.children.indexOf(child);
            this.children.splice(index, 1);
        }
        removeChildren() {
            this.children.splice(0);
        }
        update(chain) {
            super.update(chain);
            this.children.forEach((value) => {
                value.update(chain);
            });
            return chain;
        }
        hitTest(event) {
            var result;
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
    DisplayObjectContainer.count = 0;
    engine.DisplayObjectContainer = DisplayObjectContainer;
    class Shape extends DisplayObjectContainer {
        constructor() {
            super(...arguments);
            this.displayType = "Shape";
        }
        generateID() {
            this._id = engine.IDs.SHAPE_ID + Shape.count;
            Shape.count++;
        }
        drawRect(x, y, width, height) {
            this.addChild(new Rectangle(x, y, width, height));
        }
    }
    engine.Shape = Shape;
})(engine || (engine = {}));
var engine;
(function (engine) {
    class Context {
        get font() {
            return "";
        }
        set font(value) {
            this.data.font = value;
        }
        drawImage(tex, x, y) {
            this.data.drawImage(tex.data, x, y);
        }
        fillRect(x, y, width, height) {
            this.data.fillRect(x, y, width, height);
        }
        setTransform(a, b, c, d, tx, ty) {
            this.data.setTransform(a, b, c, d, tx, ty);
        }
        fillText(str, x, y) {
            this.data.fillText(str, x, y);
        }
        clearRect(x, y, width, height) {
            this.data.clearRect(x, y, width, height);
        }
        draw(list) {
            list.forEach((value) => {
                //draw settings:matrix, color, alpha...
                var m = value.globalMat.data;
                this.setTransform(m[0][0], m[1][0], m[0][1], m[1][1], m[0][2], m[1][2]);
                var alpha = this.data.globalAlpha;
                this.data.globalAlpha = value.alpha * (value.parent ? value.parent.alpha : 1);
                var color = this.data.fillStyle;
                this.data.fillStyle = value.color;
                //render
                switch (value.displayType) {
                    case "TextField":
                        var text = value;
                        this.font = (text.bold ? "bold " : "") + text.fontSize + "px Verdana";
                        this.fillText(text.text, 0, text.height);
                        break;
                    case "Bitmap":
                        var bitmap = value;
                        try {
                            if (bitmap.texture)
                                this.drawImage(bitmap.texture, 0, 0);
                        }
                        catch (e) { }
                        break;
                    case "Rectangle":
                        var rect = value;
                        this.fillRect(0, 0, rect.width, rect.height);
                }
                engine.context2D.data.globalAlpha = alpha;
                engine.context2D.data.fillStyle = color;
            });
        }
    }
    engine.Context = Context;
    class Canvas {
        get width() {
            return this.data.width;
        }
        get height() {
            return this.data.height;
        }
        getContext(type) {
            var result = new Context();
            result.data = this.data.getContext('2d');
            return result;
        }
    }
    engine.Canvas = Canvas;
})(engine || (engine = {}));
var engine;
(function (engine) {
    class IDs {
    }
    IDs.SHAPE_ID = '01';
    IDs.PICTURE_ID = '02';
    IDs.TEXT_ID = '03';
    IDs.CONTAINER_ID = '04';
    IDs.TICKER_ID = '05';
    engine.IDs = IDs;
})(engine || (engine = {}));
var engine;
(function (engine) {
    class TouchListener {
        constructor(type, func, capture, priority) {
            this.capture = false;
            this.priority = 0;
            this.type = type;
            this.func = func;
            this.capture = capture || false;
            this.priority = priority || 0;
        }
    }
    engine.TouchListener = TouchListener;
    class TouchEvent {
        constructor(x, y, type) {
            this.stageX = x;
            this.stageY = y;
            this.type = type;
        }
    }
    TouchEvent.MOUSEDOWN = 0;
    TouchEvent.MOUSEUP = 1;
    TouchEvent.CLICK = 2;
    engine.TouchEvent = TouchEvent;
})(engine || (engine = {}));
//import Main from '././././test/src/Main'
var engine;
(function (engine) {
    var stage;
    function click(x, y) {
        var clickEvent = new engine.TouchEvent(x, y, engine.TouchEvent.CLICK);
        var clickChain = stage.hitTest(clickEvent);
        stage.dispatchEvent("capture", clickChain, clickEvent);
        stage.dispatchEvent("bubble", clickChain, clickEvent);
    }
    engine.click = click;
    engine.run = function (main) {
        // canvas = document.createElement("canvas") as Canvas;
        engine.canvas = new engine.Canvas();
        engine.canvas.data = document.getElementById('app');
        //var objBody = document.getElementsByTagName("body").item(0);
        // objBody.appendChild(canvas as HTMLCanvasElement);  
        //canvas = new Canvas();
        stage = main;
        stage.width = engine.canvas.width;
        stage.height = engine.canvas.height;
        //读取资源
        engine.RES.loadConfig(() => {
            //创建场景
            stage.createGameScene(engine.canvas);
            //获取上下文
            engine.context2D = engine.canvas.getContext('2d');
            let lastNow = Date.now();
            //进入主循环
            let frameHandler = () => {
                //时间
                let now = Date.now();
                let deltaTime = now - lastNow;
                engine.Ticker.getInstance().notify(deltaTime);
                //绘制
                engine.context2D.clearRect(0, 0, engine.canvas.width, engine.canvas.height);
                var drawChain = [];
                drawChain = stage.update(drawChain);
                engine.context2D.draw(drawChain);
                lastNow = now;
                window.requestAnimationFrame(frameHandler);
            };
            window.requestAnimationFrame(frameHandler);
        });
        //鼠标按下
        window.onmousedown = (down) => {
            var downEvent = new engine.TouchEvent(down.offsetX, down.offsetY, engine.TouchEvent.MOUSEDOWN);
            var downChain = stage.hitTest(downEvent);
            stage.dispatchEvent("capture", downChain, downEvent);
            stage.dispatchEvent("bubble", downChain, downEvent);
            //鼠标抬起
            window.onmouseup = (up) => {
                var upEvent = new engine.TouchEvent(down.offsetX, down.offsetY, engine.TouchEvent.MOUSEUP);
                var upChain = stage.hitTest(upEvent);
                stage.dispatchEvent("capture", upChain, upEvent);
                stage.dispatchEvent("bubble", upChain, upEvent);
                //比较鼠标是否点击同一物体
                try {
                    if (downChain[downChain.length - 1].id == upChain[upChain.length - 1].id) {
                        //鼠标点击
                        var clickEvent = new engine.TouchEvent(up.offsetX, up.offsetY, engine.TouchEvent.CLICK);
                        var clickChain = stage.hitTest(clickEvent);
                        stage.dispatchEvent("capture", clickChain, clickEvent);
                        stage.dispatchEvent("bubble", clickChain, clickEvent);
                    }
                }
                catch (e) { }
            };
            window.onmouseleave = (leave) => { };
        };
    };
})(engine || (engine = {}));
var engine;
(function (engine) {
    let RES;
    (function (RES) {
        var RESOURCE_PATH = "././Resources/";
        var preloadedResources;
        function loadTexture(path) {
            return new Promise(function (resolve, reject) {
                try {
                    var result = new Image();
                    result.src = RESOURCE_PATH + path;
                    console.log(RESOURCE_PATH + path);
                    result.onload = () => {
                        resolve(result);
                    };
                }
                catch (e) {
                    console.error(e);
                }
            });
        }
        function getResAsync(path) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield loadTexture(path);
            });
        }
        RES.getResAsync = getResAsync;
        function loadJSON(url, callback) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', url, true);
            xmlhttp.send();
            xmlhttp.onreadystatechange = function () {
                // 通信成功时，状态值为4
                if (xmlhttp.readyState === 4) {
                    if (xmlhttp.status === 200) {
                        //成功读取，生成obj
                        var obj = eval('(' + xmlhttp.responseText + ')');
                        callback(obj);
                    }
                    else {
                        console.error(xmlhttp.statusText);
                    }
                }
            };
            xmlhttp.onerror = function (e) {
                console.error(xmlhttp.statusText);
            };
        }
        RES.loadJSON = loadJSON;
        function getRes(path, onload) {
            var result = preloadedResources.get(path);
            if (!result) {
                console.log("wrong path of image: " + path);
                return null;
            }
            result.data = new Image();
            result.data.src = RESOURCE_PATH + path;
            if (onload)
                result.data.onload = onload;
            return result;
        }
        RES.getRes = getRes;
        function loadConfig(onCompleted) {
            loadJSON("././Resources/resources.json", (obj) => {
                var loadedObj = obj;
                var length = loadedObj.images.length;
                preloadedResources = new Map();
                var completed = 0;
                //按照json内容生成texture
                loadedObj.images.forEach((config) => {
                    //生成的texture只有宽高信息，没有data信息
                    var texture = new engine.Texture();
                    texture.width = config.width;
                    texture.height = config.height;
                    preloadedResources.set(config.name, texture);
                    //生成真实texture
                    /*getResAsync(config.name).then((value) => {
                        preloadedResources.set(config.name, value as Texture);
                        completed++;
                        if (completed == length)
                            onCompleted();
                    });*/
                });
                onCompleted();
            });
        }
        RES.loadConfig = loadConfig;
    })(RES = engine.RES || (engine.RES = {}));
})(engine || (engine = {}));
