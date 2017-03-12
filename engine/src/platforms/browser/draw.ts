namespace engine {
    export class Context implements IContext {
        data: CanvasRenderingContext2D;
        globalAlpha: number;
        fillStyle: string;
        drawImage(tex: IBitmap, x: number, y: number) {
            this.data.drawImage(tex.data, x, y);
        }

        fillRect(x: number, y: number, width: number, height: number) {
            this.data.fillRect(x, y, width, height);
        }
        setTransform(a, b, c, d, tx, ty) {
            this.data.setTransform(a, b, c, d, tx, ty);
        }
        fillText(str: string, x: number, y: number) {
            this.data.fillText(str, x, y);
        }
        clearRect(x: number, y: number, width: number, height: number) {
            this.clearRect(x, y, width, height);
        }
    }

    export class Canvas implements ICanvas {
        data: HTMLCanvasElement;
        width: number;
        height: number;
        getContext(type: string) {
            return this.data.getContext('2d');
        }
    }

    export namespace RES {
        var RESOURCE_PATH = "././Resources/";

        export function getRes(path: string) {
            return new Promise(function (resolve, reject) {
                var result = new Image();
                result.src = RESOURCE_PATH + path;
                result.onload = () => {
                    resolve(result);
                }
            });
        }
        /*function loadTexture(path: string) {
            return new Promise(resolve => {
                var result = new Image(); 
                result.src = RESOURCE_PATH + path;
                result.onload = () => {
                    resolve(result);
                } 
            });
    }*/


        /*export async function getRes(path: string) {
            return await loadTexture(path);
            //return new engine.Texture();
    }*/
    }

}
