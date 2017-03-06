namespace engine {

    export type Ticker_Listener_Type = (deltaTime?: number) => void;

    export function setTimeout(func: Function, delayTime: number) {
        var ticker = Ticker.getInstance();
        var passedTime = 0;
        var delayFunc = (delta) => {
            passedTime += delta;
            if (passedTime >= delayTime) {
                func();
                ticker.unregister(delayFunc);
            }

        }
        ticker.register(delayFunc);
    }

    export function setInterval(func: Function, delayTime: number): number {
        var passedTime = 0;
        var ticker = Ticker.getInstance();
        var delayFunc = (delta) => {
            passedTime += delta;
            if (passedTime >= delayTime) {
                func();
                passedTime -= delayTime;
            }

        }
        return ticker.register(delayFunc);
    }

    export function clearInterval(key: number) {
        Ticker.getInstance().unregister(key);
    }

    export class Ticker {

        private static instance: Ticker;

        static getInstance() {
            if (!Ticker.instance) {
                Ticker.instance = new Ticker();
            }
            return Ticker.instance;
        }

        listeners: Ticker_Listener_Type[] = [];

        register(listener: Ticker_Listener_Type): number {
            this.listeners.push(listener);
            return this.listeners.indexOf(listener);
        }

        unregister(input: Ticker_Listener_Type | number) {
            if (input instanceof Number) {
                this.listeners.splice(input, 1);
            } else {
                var index = this.listeners.indexOf(input);
                this.listeners.splice(index, 1);
            }
        }

        notify(deltaTime: number) {
            for (let listener of this.listeners) {
                listener(deltaTime);
            }
        }
    }

    /*export function startTick(func:Function){
       // Ticker.getInstance().s
}*/

}