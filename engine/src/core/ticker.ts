namespace engine {

    export type Ticker_Listener_Type = (deltaTime?: number) => void;
    export let FPS = 60;

    export function setTimeout(func: Function, delayTime: number): string {
        var ticker = Ticker.getInstance();
        var passedTime = 0;
        var delayFunc = (delta) => {
            passedTime += delta;
            if (passedTime >= delayTime) {
                func();
                ticker.unregister(key);
            }

        }
        var key = ticker.register(delayFunc);
        return key;
    }

    /**注册一个每隔delayTime执行一次的ticker并返回它的key */
    export function setInterval(func: Function, delayTime: number): string {
        var passedTime = 0;
        var ticker = Ticker.getInstance();
        var delayFunc = (delta) => {
            passedTime += delta;
            if (passedTime >= delayTime) {
                func(delta);
                passedTime -= delayTime;
            }

        }
        return ticker.register(delayFunc);
    }

    export function clearInterval(key: string) {
        Ticker.getInstance().unregister(key);
    }

    export class Ticker {
        listeners: Map<string, Ticker_Listener_Type>;
        private static instance: Ticker;
        private static count = 0;

        static getInstance() {
            if (!Ticker.instance) {
                Ticker.instance = new Ticker();
                Ticker.instance.listeners = new Map<string, Ticker_Listener_Type>();
            }
            return Ticker.instance;
        }


        register(listener: Ticker_Listener_Type): string {
            var id = IDs.TICKER_ID + Ticker.count;
            this.listeners.set(id, listener);
            Ticker.count++;
            return id;
        }

        unregister(key: string) {
            if(this.listeners.has(key)){
                this.listeners.delete(key);
            }
        }

        notify(deltaTime: number) {
            for (let [key,listener] of this.listeners) {
                listener(deltaTime);
            }
        }
    }

    /*export function startTick(func:Function){
       // Ticker.getInstance().s
}*/

}