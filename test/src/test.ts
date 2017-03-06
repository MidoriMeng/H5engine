
window.onload = () => {
    engine.canvas = document.getElementById("app") as HTMLCanvasElement;
    var stage = engine.run(canvas);

    var main = new Main(stage);
    main.createGameScene(canvas);

    /*stage.transform(100, 0);
    var rect = new engine.Rectangle(0, 0, 100, 100);
    rect.rotate(Math.PI / 4);
    var container = new engine.DisplayObjectContainer(canvas);
    container.scale(2, 1);
    var text = new engine.TextField(80, 80, "hello world");
    text.scale(1, 5);
    var image = new engine.Bitmap(100, 100, "wander-icon.jpg");
    container.addChild(text);
    container.addChild(image);

    stage.addChild(rect);
    stage.addChild(container);

    stage.addEventListener(engine.TouchEvents.CLICK, () => { console.log("stage") }, true);
    container.addEventListener(engine.TouchEvents.CLICK, () => { console.log("container") });
    image.addEventListener(engine.TouchEvents.CLICK, () => { console.log("image") });
    rect.addEventListener(engine.TouchEvents.CLICK, () => { console.log("rect click") });
    rect.addEventListener(engine.TouchEvents.MOUSEDOWN, () => { console.log("rect down") });

    engine.Ticker.getInstance().register((deltaTime) => {
        image.x += 1;
    });*/


}


