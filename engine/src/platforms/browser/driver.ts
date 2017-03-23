//import Main from '././././test/src/Main'
namespace engine {
    var stage;
    export function click(x: number, y: number) {
        var clickEvent = new TouchEvent(x, y, TouchEvent.CLICK)
        var clickChain = stage.hitTest(clickEvent);
        stage.dispatchEvent("capture", clickChain, clickEvent);
        stage.dispatchEvent("bubble", clickChain, clickEvent);
    }

    export let run = function (main) {

        // canvas = document.createElement("canvas") as Canvas;
        canvas = new Canvas();
        canvas.data = document.getElementById('app');
        //var objBody = document.getElementsByTagName("body").item(0);
        // objBody.appendChild(canvas as HTMLCanvasElement);  

        //canvas = new Canvas();
        stage = main;
        stage.width = canvas.width;
        stage.height = canvas.height;

        //读取资源
        RES.loadConfig(() => {
            //创建场景
            stage.createGameScene(canvas);
            //获取上下文
            context2D = canvas.getContext('2d');
            let lastNow = Date.now();
            //进入主循环
            let frameHandler = () => {
                //时间
                let now = Date.now();
                let deltaTime = now - lastNow;
                Ticker.getInstance().notify(deltaTime);

                //绘制
                context2D.clearRect(0, 0, canvas.width, canvas.height);
                var drawChain: DisplayObject[] = [];
                drawChain = stage.update(drawChain);
                context2D.draw(drawChain);


                lastNow = now;
                window.requestAnimationFrame(frameHandler);
            }
            window.requestAnimationFrame(frameHandler);


        });


        //鼠标按下
        window.onmousedown = (down) => {
            var downEvent = new TouchEvent(down.offsetX, down.offsetY, TouchEvent.MOUSEDOWN)
            var downChain = stage.hitTest(downEvent);
            stage.dispatchEvent("capture", downChain, downEvent);
            stage.dispatchEvent("bubble", downChain, downEvent);
            //鼠标抬起
            window.onmouseup = (up) => {
                var upEvent = new TouchEvent(down.offsetX, down.offsetY, TouchEvent.MOUSEUP)
                var upChain = stage.hitTest(upEvent);
                stage.dispatchEvent("capture", upChain, upEvent);
                stage.dispatchEvent("bubble", upChain, upEvent);
                //比较鼠标是否点击同一物体
                try {
                    if (downChain[downChain.length - 1].id == upChain[upChain.length - 1].id) {
                        //鼠标点击
                        var clickEvent = new TouchEvent(up.offsetX, up.offsetY, TouchEvent.CLICK)
                        var clickChain = stage.hitTest(clickEvent);
                        stage.dispatchEvent("capture", clickChain, clickEvent);
                        stage.dispatchEvent("bubble", clickChain, clickEvent);
                    }
                } catch (e) { }
            }
            window.onmouseleave = (leave) => { }
        }


    }

}
