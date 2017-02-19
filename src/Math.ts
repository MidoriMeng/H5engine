namespace MathUtil {
    export class Matrix {
        data: number[][];

        get degreeI(): number {
            return this.data.length;
        }

        get degreeJ(): number {
            return this.data[0].length;
        }

        row(r: number): Vector {
            if (this.data[r]) {
                return new Vector(this.data[r]);
            }
            else {
                console.error("wrong row");
                return null;
            }
        }

        column(c: number): Vector {
            if (this.degreeJ <= c) {
                console.error("wrong column");
                return null;
            }
            var ctemp = [];
            this.data.forEach((value) => {
                ctemp.push(value[c]);
            })
            return new Vector(ctemp);
        }

        constructor(degreeI: number, degreeJ: number) {
            this.data = [];
            for (var i = 0; i < degreeI; i++) {
                this.data.push([]);
                for (var j = 0; j < degreeJ; j++) {
                    this.data[i].push(0);
                }
            }
        }

        /**a.multiply(b) == a*b  */
        multiply(other: Matrix): Matrix {
            if (this.degreeJ != other.degreeI)
                return null;
            var result = new Matrix(this.degreeI, other.degreeJ);
            var temp = 0;
            for (var i = 0; i < this.degreeI; i++) {
                for (var j = 0; j < other.degreeJ; j++) {
                    result.data[i][j] = this.row(i).dotProduct(other.column(j));
                }
            }
            return result;
        }
    }

    export function identity(degree: number): Matrix {
        var result = new Matrix(degree, degree);
        for (var i = 0; i < degree; i++) {
            for (var j = 0; j < degree; j++) {
                result.data[i][j] = (i == j ? 1 : 0);
            }
        }
        return result;
    }

    export function move2Mat(x: number, y: number): Matrix {
        var result = identity(3);
        result.data[0][2] = x;
        result.data[1][2] = y;
        return result;
    }

    export function rotate2Mat(eularDegree: number): Matrix {
        var result = identity(3);
        result.data[0][0] = Math.cos(eularDegree);
        result.data[1][0] = Math.sin(eularDegree);
        result.data[0][1] = -Math.sin(eularDegree);
        result.data[1][1] = Math.cos(eularDegree);
        return result;
    }

    export function scale2Mat(x: number, y: number): Matrix {
        var result = identity(3);
        result.data[0][0] = x;
        result.data[1][1] = y;
        return result;
    }

    export class Vector {
        data: number[] = [];

        get degree(): number {
            return this.data.length;
        }

        constructor(num: number[]) {
            num.forEach((value) => { this.data.push(value) });
        }

        dotProduct(other: Vector): number {
            if (this.degree != other.degree) {
                console.error("wrong degree,num1 degree:" + this.degree + ", num2 degree:" + other.degree);
                return;
            }
            var result = 0;
            for (var i = 0; i < this.degree; i++)
                result += this.data[i] * other.data[i];
            return result;
        }
    }
}