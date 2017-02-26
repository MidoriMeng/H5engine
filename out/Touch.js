var TouchListener = (function () {
    function TouchListener(type, func, capture, priority) {
        this.capture = false;
        this.priority = 0;
        this.type = type;
        this.func = func;
        this.capture = capture || false;
        this.priority = priority || 0;
    }
    return TouchListener;
}());
var TouchEvents = (function () {
    function TouchEvents(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
    TouchEvents.MOUSEDOWN = 0;
    TouchEvents.MOUSEUP = 1;
    TouchEvents.CLICK = 2;
    return TouchEvents;
}());
//# sourceMappingURL=Touch.js.map