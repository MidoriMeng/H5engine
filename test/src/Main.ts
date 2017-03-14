let TIME = 0;
//stage
class Main extends engine.DisplayObjectContainer{

    createGameScene(): void {

        var text = new engine.TextField();
        text.text = "hello world";
        text.x = 200;
        text.y = 25;
        var shape = new engine.Shape();
        shape.drawRect(0,0,500,500);
        shape.color="#FFFF00";
        this.addChild(text);
        var bitmap = new engine.Bitmap("wander-icon.jpg")
        var tween = new engine.Tween(bitmap);
        tween.to({x:200},5000);
        tween.to({y:400},5000);
        engine.setTimeout(()=>{tween.to({x:0},1000)},4000);
        this.addChild(bitmap);

        var bitmap2 = new engine.Bitmap("wander-icon.jpg")
        var tween = new engine.Tween(bitmap2);
        tween.to({x:200},5000);
        tween.to({y:400},5000);
        this.addChild(bitmap2);
        //this.addChild(shape);
    }
}

engine.run(new Main()); 
