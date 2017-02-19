var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer(canvas) {
        _super.call(this, 0, 0, canvas.width, canvas.height);
        this.children = [];
        this.canvas = canvas;
    }
    DisplayObjectContainer.prototype.addChild = function (drawable) {
        this.children.push(drawable);
        drawable.father = this;
    };
    DisplayObjectContainer.prototype.draw = function () {
        _super.prototype.draw.call(this, this.canvas.getContext("2d"));
    };
    DisplayObjectContainer.prototype.render = function () {
        var self = this;
        this.children.forEach(function (value) {
            value.draw(self.canvas.getContext("2d"));
        });
    };
    return DisplayObjectContainer;
}(DisplayObject));
//# sourceMappingURL=DisplayObjectContainer.js.map