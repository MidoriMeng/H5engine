namespace engine {
    export var canvas;

    export class Texture implements ITexture {
        data: HTMLImageElement;
        width: number;
        height: number;
    }

    export class Context extends CanvasRenderingContext2D implements IContext {

        drawPicture(tex: Texture, x: number, y: number) {
            super.drawImage(tex.data, 0, 0);
        }
    }

    export class Canvas extends HTMLCanvasElement implements ICanvas{
        getContext2D():IContext{
            return super.getContext("2d") as Context;
        }
    }

}
