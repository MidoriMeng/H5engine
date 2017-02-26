//点击事件
window.onload = function () {
    var canvas = document.getElementById('canvasEl');
    var context = canvas.getContext("2d");
    //初始化舞台
    var stage = new DisplayObjectContainer(canvas);
    //点击事件
    /*window.onclick = (e) => {
        var x = e.offsetX;
        var y = e.offsetY;
        var event = new TouchEvents(x,y,TouchEvents.CLICK)
        var chain = stage.hitTest(event);
        stage.dispatchEvent("capture",chain,event);
        stage.dispatchEvent("bubble",chain,event);
    }*/
    //创建绘制对象
    context.fillStyle = "#FFFF00";
    stage.transform(100, 0);
    var rect = new Rectangle(0, 0, 100, 100);
    rect.rotate(Math.PI / 4);
    var container = new DisplayObjectContainer(canvas);
    container.scale(2, 1);
    var text = new TextField(80, 80, "hello world");
    text.scale(1, 5);
    var image = new Picture(100, 100, "/src/test.jpg");
    container.addChild(text);
    container.addChild(image);
    stage.addChild(rect);
    stage.addChild(container);
    //点击事件
    stage.addEventListener(TouchEvents.CLICK, function () { console.log("stage"); }, true);
    container.addEventListener(TouchEvents.CLICK, function () { console.log("container"); });
    image.addEventListener(TouchEvents.CLICK, function () { console.log("image"); });
    rect.addEventListener(TouchEvents.CLICK, function () { console.log("rect click"); });
    rect.addEventListener(TouchEvents.MOUSEDOWN, function () { console.log("rect down"); });
    //绘制
    /*requestAnimationFrame(()=>{
        context.clearRect(0, 0, canvas.width, canvas.height);
        //context.fillStyle = "#FF0000";
        //context.fillRect(0, 0, canvas.width, canvas.height);
        stage.draw();
    });*/
    setInterval(function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        //context.fillStyle = "#FF0000";
        //context.fillRect(0, 0, canvas.width, canvas.height);
        stage.draw();
    }, 16);
    //鼠标按下
    window.onmousedown = function (down) {
        var downEvent = new TouchEvents(down.offsetX, down.offsetY, TouchEvents.MOUSEDOWN);
        var downChain = stage.hitTest(downEvent);
        stage.dispatchEvent("capture", downChain, downEvent);
        stage.dispatchEvent("bubble", downChain, downEvent);
        //鼠标抬起
        window.onmouseup = function (up) {
            var upEvent = new TouchEvents(down.offsetX, down.offsetY, TouchEvents.MOUSEUP);
            var upChain = stage.hitTest(upEvent);
            stage.dispatchEvent("capture", upChain, upEvent);
            stage.dispatchEvent("bubble", upChain, upEvent);
            //比较鼠标是否点击同一物体
            try {
                if (downChain[downChain.length - 1].id == upChain[upChain.length - 1].id) {
                    //鼠标点击
                    var clickEvent = new TouchEvents(up.offsetX, up.offsetY, TouchEvents.CLICK);
                    var clickChain = stage.hitTest(clickEvent);
                    stage.dispatchEvent("capture", clickChain, clickEvent);
                    stage.dispatchEvent("bubble", clickChain, clickEvent);
                }
            }
            catch (e) { }
        };
        window.onmouseleave = function (leave) { };
        //stage.dispatchEvent("capture",chain,event);
        //stage.dispatchEvent("bubble",chain,event);
    };
    /*window.onmousedown = (e)=>{
        console.log(e.target);
    }
    window.onmouseup = (e)=>{
        console.log("up")
    }*/
};
//# sourceMappingURL=main.js.map