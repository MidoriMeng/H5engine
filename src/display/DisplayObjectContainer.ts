class DisplayObjectContainer extends DisplayObject {
    children: IDrawable[] = [];
    private canvas:HTMLCanvasElement;

    constructor(canvas:HTMLCanvasElement){
        super(0,0,canvas.width,canvas.height);
        this.canvas = canvas;
    }

    addChild(drawable: IDrawable) {
        this.children.push(drawable);
        drawable.father = this;
    }

    draw(){
        super.draw(this.canvas.getContext("2d"));
    }

    render() {
        var self = this;
        this.children.forEach((value) => {
            value.draw(self.canvas.getContext("2d"));
        });
    }
}