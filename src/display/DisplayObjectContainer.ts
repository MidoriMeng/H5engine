class DisplayObjectContainer extends DisplayObject {
    children: DisplayObject[] = [];
    private canvas: HTMLCanvasElement;


    constructor(canvas: HTMLCanvasElement) {
        super(0, 0, canvas.width, canvas.height);
        this.canvas = canvas;
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
        this.children.forEach((value) => {//forEach无法return中断遍历[笑cry]
            result = value.hitTest(event);
            if (result) {
                result.unshift(this);
            }
        });
        return result;
    }
}