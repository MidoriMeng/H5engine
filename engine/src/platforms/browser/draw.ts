namespace engine {
    export class Context implements IContext {
        data: CanvasRenderingContext2D;
        globalAlpha: number;
        fillStyle: string;
        get font(): string {
            return ""
        }
        set font(value) {
            this.data.font = value;
        }

        drawImage(tex: IBitmap, x: number, y: number) {
            this.data.drawImage(tex.texture.data, x, y);
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
        get width(): number {
            return this.data.width;
        }
        get height(): number {
            return this.data.height;
        }
        getContext(type: string) {
            return this.data.getContext('2d');
        }
    }

    
}
