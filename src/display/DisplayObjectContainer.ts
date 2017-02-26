class DisplayObjectContainer extends DisplayObject {
    children: DisplayObject[] = [];
    private canvas: HTMLCanvasElement;
    private static count = 0;

    constructor(canvas: HTMLCanvasElement) {
        super(0, 0, canvas.width, canvas.height);
        this.canvas = canvas;
        this._id = IDs.CONTAINER_ID+DisplayObjectContainer.count;
        DisplayObjectContainer.count++;
    }

    addChild(drawable: DisplayObject) {
        this.children.push(drawable);
        drawable.father = this;
    }

    draw() {
        super.draw(this.canvas.getContext("2d"));
    }

    render() {
        var self = this;
        this.children.forEach((value) => {
            value.draw(self.canvas.getContext("2d"));
        });
    }

    hitTest(event: TouchEvents): DisplayObject[] {
        var result:DisplayObject[];
        //执行孩子的检测，储存最后一个（…）碰到的物体
        for(var i = 0; i <this.children.length;i++){
            result = this.children[i].hitTest(event);
            if(result){
                result.unshift(this);
                return result;
            }
        }
        return result;
    }
}