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
        parent: IDrawable;
        update(chain:DisplayObject[]):DisplayObject[];
        alpha: number;
        color: string;
        displayType:string;
        touchEnabled:boolean;
    }

    export interface IContext{
        data:any;
        font:string;
        drawImage(tex:ITexture,x:number,y:number);
        fillRect(x:number,y:number,width:number,height:number);
        setTransform(a,b,c,d,tx,ty);
        fillText(str:string, x:number, y:number);
        clearRect(x:number,y:number,width:number,height:number);
        draw(list:DisplayObject[]);
    }

    export interface ICanvas{
        data:any;
        width:number;
        height:number;
        getContext(type:string);
    }

    export interface IBitmap {
        texture:ITexture;
    }

    export interface ITexture{
        data:any;
    }
}