//点击事件


window.onload = () => {
    var canvas = document.getElementById('canvasEl') as HTMLCanvasElement;
    var context = canvas.getContext("2d");

    //初始化舞台
    var stage = new DisplayObjectContainer(canvas);

    //点击事件
    window.onclick = (e) => {
        var x = e.offsetX;
        var y = e.offsetY;
        var event = new TouchEvents(x,y,TouchEvents.CLICK)
        var chain = stage.hitTest(event);
        stage.dispatchEvent("capture",chain,event);
        stage.dispatchEvent("bubble",chain,event);
    }
    /*window.onmousedown = (e)=>{
        console.log(e.target);
    }
    window.onmouseup = (e)=>{
        console.log("up")
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
    stage.addEventListener(TouchEvents.CLICK,()=>{console.log("stage")},true);
    container.addEventListener(TouchEvents.CLICK,()=>{console.log("container")});
    image.addEventListener(TouchEvents.CLICK,()=>{console.log("image")});
    rect.addEventListener(TouchEvents.CLICK,()=>{console.log("rect")});
    //绘制
    /*requestAnimationFrame(()=>{
        context.clearRect(0, 0, canvas.width, canvas.height);
        //context.fillStyle = "#FF0000";
        //context.fillRect(0, 0, canvas.width, canvas.height);
        stage.draw();
    });*/
    setInterval(()=>{
        context.clearRect(0, 0, canvas.width, canvas.height);
        //context.fillStyle = "#FF0000";
        //context.fillRect(0, 0, canvas.width, canvas.height);
        stage.draw();
    },16);
};

