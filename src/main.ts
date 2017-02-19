
window.onload = () => {
    var canvas = document.getElementById('canvasEl') as HTMLCanvasElement;
    var context = canvas.getContext("2d");
    //context.fillStyle = "#FF0000";
    //context.fillRect(0, 0, canvas.width, canvas.height);

    //初始化舞台
    var stage = new DisplayObjectContainer(canvas);

    //创建绘制对象
    context.fillStyle = "#FFFF00";
    stage.transform(100,0);
    var rect = new Rectangle(0, 0, 50, 50);
    rect.rotate(Math.PI/6);
    var container = new DisplayObjectContainer(canvas);
    container.scale(2,1);
    var text = new TextField(80, 80, "hello world");
    text.scale(1,5);
    var image = new Picture(100, 100, "/src/test.jpg");
    container.addChild(text);
    container.addChild(image);

    stage.addChild(rect);
    stage.addChild(container);
    //绘制
    //stage.draw();
    setInterval(() => {
        context.clearRect(0,0,canvas.width, canvas.height);
        stage.draw();
    }, 16);

    /*var img = new Image()
    img.src = "/src/test.jpg";
    img.onload = ()=> {
        context.drawImage(img, 0, 0);
    }*/

};

