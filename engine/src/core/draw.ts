namespace engine {
    export interface IDrawable {
        width: number;
        height: number;
        localMat: MathUtil.Matrix;
        globalMat: MathUtil.Matrix;
        father: IDrawable;
        draw(context: Context);
        transform(x: number, y: number);
        rotate(eularDegree: number);
        scale(x: number, y: number);
        alpha: number;
        color: string;
    }

    export interface IContext{
        globalAlpha;
        fillStyle;
        drawPicture(tex:ITexture,x:number,y:number);
        fillRect(x:number,y:number,width:number,height:number);
        setTransform(a,b,c,d,tx,ty);
        fillText(str:string, x:number, y:number);
    }

    export interface ICanvas{
        getContext2D():IContext;
    }

    export interface ITexture{
        data: any;
        width: number;
        height: number;
    }
}