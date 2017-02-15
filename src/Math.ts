namespace MathUtil {
    export class Matrix {
        data: number[][] = [];
        constructor() {
            this.data = [];
        }

        static identity(degree: number): number[][] {
            var result: number[][] = [];
            for (var i = 0; i < degree; i++) {
                result.push([]);
                for (var j = 0; j < degree; j++) {
                    result[i].push(i == j ? 1 : 0);
                }
            }
            return result;
        }
    }
}