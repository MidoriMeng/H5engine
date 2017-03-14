let TIME = 0;
//stage
class Main extends engine.DisplayObjectContainer{

    createGameScene(): void {

        var text = new engine.TextField();
        text.text = "hello world";
        text.x = 200;
        text.y = 25;
        var bitmap = new engine.Bitmap("wander-icon.jpg")
        var shape = new engine.Shape();
        shape.drawRect(0,0,500,500);
        shape.color="#FFFF00";
        this.addChild(text);
        var tween = engine.Tween.get(bitmap);
        tween.to({x:200,y:400},5000);
        this.addChild(bitmap);
        //this.addChild(shape);
    }
}

engine.run(new Main()); 
