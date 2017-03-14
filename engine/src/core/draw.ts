namespace engine {
    export let context2D:IContext;
    export let canvas: ICanvas;

    export interface IDrawable {
        x:number;
        y:number;
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
        data:any;
        globalAlpha:number;
        fillStyle:string;
        font:string;
        drawImage(tex:IBitmap,x:number,y:number);
        fillRect(x:number,y:number,width:number,height:number);
        setTransform(a,b,c,d,tx,ty);
        fillText(str:string, x:number, y:number);
        clearRect(x:number,y:number,width:number,height:number);
    }

    export interface ICanvas{
        data:any;
        width:number;
        height:number;
        getContext(type:string);
    }

    export interface IBitmap {
        texture:any;
        width: number;
        height: number;
    }
}