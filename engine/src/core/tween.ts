namespace engine {
    export class Tween {
        target: IDrawable;
        onChange: Function;
        constructor(target: IDrawable) {
            this.target = target;
        }
        static get(target: IDrawable, properties?: { onChange?: Function }) {
            if (properties) {

            }
            return new Tween(target);//todo
        }
        to(toTarget: any, time: number) {
            for (var attribute in toTarget) {//attribute: x, y, ...
                if (this.target[attribute] != undefined) {//if target has attribute
                    //here
                    this.move(attribute, toTarget, time);
                }
            }
        }

        private move(attribute: string, toTarget: any, time: number) {
            var originValue = this.target[attribute];
            var targetValue = toTarget[attribute];
            var speed = (targetValue - originValue) / time;
            var key = setInterval((deltaTime) => {
                originValue += (speed * deltaTime);
                this.target[attribute] = originValue;
            }, 1000 / FPS);
            setTimeout(() => {
                Ticker.getInstance().unregister(key);
            }, time);
        }
    }
}