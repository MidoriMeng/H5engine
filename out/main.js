window.onload = function () {
    var canvas = document.getElementById('canvasEl');
    var context = canvas.getContext("2d");
    context.fillStyle = "#FF0000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.rotate(20 * Math.PI / 180);
    //初始化舞台
    var stage = Stage.getInstance();
    stage.setContext(context);
    //创建绘制对象
    context.fillStyle = "#FFFF00";
    var rect = new Rectangle(20, 20, 50, 60);
    var text = new TextField(80, 80, "hello world");
    var img = new Image();
    img.src = "/src/test.jpg";
    var image = new ImageField(100, 100, "/src/test.jpg");
    stage.addChild(rect);
    stage.addChild(text);
    stage.addChild(image);
    //绘制
    setInterval(function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        stage.draw();
    }, 16);
    /*var img = new Image()
    img.src = "/src/test.jpg";
    img.onload = ()=> {
        context.drawImage(img, 0, 0);
    }*/
};
//# sourceMappingURL=main.js.map