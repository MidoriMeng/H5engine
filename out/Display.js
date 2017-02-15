var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DisplayObject = (function () {
    function DisplayObject(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.transMat = MathUtil.Matrix.identity(3);
    }
    DisplayObject.prototype.draw = function () {
        this.context = Stage.getInstance().getContext();
        var data = this.context.getImageData(0, 0, this.width, this.height);
        data.data;
    };
    //rotateEular(degree: number) {    }
    DisplayObject.prototype.transform = function (x, y) {
        this.transMat[0][2] += x;
        this.transMat[1][2] += y;
    };
    return DisplayObject;
}());
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(x, y, width, height) {
        _super.call(this, x, y, width, height);
    }
    Rectangle.prototype.draw = function () {
        _super.prototype.draw.call(this);
        this.context.fillRect(this.x, this.y, this.width, this.height);
    };
    return Rectangle;
}(DisplayObject));
var ImageField = (function (_super) {
    __extends(ImageField, _super);
    function ImageField(x, y, img, width, height) {
        var image = new Image();
        image.src = img;
        _super.call(this, x, y, image.width, image.height);
        this.image = image;
    }
    ImageField.prototype.draw = function () {
        _super.prototype.draw.call(this);
        this.context.drawImage(this.image, this.x, this.y);
        /*this.image.onload = () => {
            this.context.drawImage(this.image, this.x, this.y);
        }*/
    };
    return ImageField;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField(x, y, str) {
        _super.call(this, x, y);
        this.str = str;
        //  this.size = size;
    }
    TextField.prototype.draw = function () {
        _super.prototype.draw.call(this);
        //  var font = this.context.font;
        // this.context.font = this.size + "px Verdana";
        this.context.fillText(this.str, this.x, this.y);
        //  this.context.font = font;
    };
    return TextField;
}(DisplayObject));
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        _super.apply(this, arguments);
        this.drawList = [];
    }
    DisplayObjectContainer.prototype.addChild = function (drawable) {
        this.drawList.push(drawable);
    };
    DisplayObjectContainer.prototype.draw = function () {
        this.drawList.forEach(function (value) {
            value.draw();
        });
    };
    return DisplayObjectContainer;
}(DisplayObject));
var Stage = (function () {
    function Stage() {
        this.drawList = [];
    }
    Stage.prototype.addChild = function (drawable) {
        this.drawList.push(drawable);
    };
    Stage.prototype.draw = function () {
        this.drawList.forEach(function (value) { value.draw(); });
    };
    Stage.getInstance = function () {
        if (Stage.instance)
            return Stage.instance;
        else
            Stage.instance = new Stage();
    };
    Stage.prototype.setContext = function (context) {
        console.log("set context");
        console.log(MathUtil.Matrix.identity(3));
        this.context = context;
    };
    Stage.prototype.getContext = function () {
        if (this.context)
            return this.context;
        console.error("please set CanvasRenderingContext2D context");
    };
    Stage.instance = new Stage();
    return Stage;
}());
//# sourceMappingURL=Display.js.map