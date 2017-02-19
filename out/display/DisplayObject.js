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
        this.localMat = MathUtil.identity(3);
        this.globalMat = MathUtil.identity(3);
    }
    DisplayObject.prototype.draw = function (context) {
        if (this.father)
            this.globalMat = this.localMat.multiply(this.father.globalMat);
        else
            this.globalMat = this.localMat;
        var m = this.globalMat.data;
        context.setTransform(m[0][0], m[1][0], m[0][1], m[1][1], m[0][2], m[1][2]);
        this.render(context);
    };
    DisplayObject.prototype.render = function (context) { };
    DisplayObject.prototype.rotate = function (eularDegree) {
        var mat = MathUtil.rotate2Mat(eularDegree);
        this.localMat = mat.multiply(this.localMat);
    };
    DisplayObject.prototype.transform = function (x, y) {
        var mat = MathUtil.move2Mat(x, y);
        this.localMat = mat.multiply(this.localMat);
    };
    DisplayObject.prototype.scale = function (x, y) {
        var mat = MathUtil.scale2Mat(x, y);
        this.localMat = mat.multiply(this.localMat);
    };
    return DisplayObject;
}());
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(x, y, width, height) {
        _super.call(this, x, y, width, height);
    }
    Rectangle.prototype.render = function (context) {
        context.fillRect(this.x, this.y, this.width, this.height);
    };
    return Rectangle;
}(DisplayObject));
var Picture = (function (_super) {
    __extends(Picture, _super);
    function Picture(x, y, img, width, height) {
        var image = new Image();
        image.src = img;
        _super.call(this, x, y, image.width, image.height);
        this.image = image;
    }
    Picture.prototype.render = function (context) {
        context.drawImage(this.image, this.x, this.y);
        /*this.image.onload = () => {
            this.context.drawImage(this.image, this.x, this.y);
        }*/
    };
    return Picture;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField(x, y, str) {
        _super.call(this, x, y, 100, 20);
        this.str = str;
        //  this.size = size;
    }
    TextField.prototype.render = function (context) {
        //  var font = this.context.font;
        // this.context.font = this.size + "px Verdana";
        context.fillText(this.str, this.x, this.y);
        //  this.context.font = font;
    };
    return TextField;
}(DisplayObject));
//# sourceMappingURL=DisplayObject.js.map