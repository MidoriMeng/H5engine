namespace engine {
    export class Context implements IContext {
        data: CanvasRenderingContext2D;
        get font(): string {
            return ""
        }
        set font(value) {
            this.data.font = value;
        }

        drawImage(tex: ITexture, x: number, y: number) {
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
            this.data.clearRect(x, y, width, height);
        }

        draw(list: DisplayObject[]) {
            list.forEach((value) => {
                //draw settings:matrix, color, alpha...
                var m = value.globalMat.data;
                this.setTransform(m[0][0], m[1][0], m[0][1], m[1][1], m[0][2], m[1][2]);
                var alpha = this.data.globalAlpha;
                this.data.globalAlpha = value.alpha * (value.parent ? value.parent.alpha : 1);
                var color = this.data.fillStyle;
                this.data.fillStyle = value.color;

                //render
                switch (value.displayType) {
                    case "TextField":
                        var text = value as TextField;
                        this.font = (text.bold ? "bold " : "") + text.fontSize + "px Verdana";
                        this.fillText(text.text, 0, 0);
                        break;
                    case "Bitmap":
                        var bitmap = value as Bitmap;
                        try {
                            if (bitmap.texture)
                                this.drawImage(bitmap.texture, 0, 0);
                        } catch (e) { }
                        break;
                    case "Rectangle":
                        var rect = value as Rectangle;
                        this.fillRect(0, 0, rect.width, rect.height);
                }

                context2D.data.globalAlpha = alpha;
                context2D.data.fillStyle = color;

            })
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
            var result = new Context();
            result.data = this.data.getContext('2d');
            return result;
        }
    }


}
