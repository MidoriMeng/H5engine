namespace engine {

    export namespace MathUtil {
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

            get a(): number { return this.data[0][0]; }
            get b(): number { return this.data[1][0]; }
            get c(): number { return this.data[0][1]; }
            get d(): number { return this.data[1][1]; }
            get tx(): number { return this.data[0][2]; }
            get ty(): number { return this.data[1][2]; }
            set a(value: number) { this.data[0][0] = value; }
            set b(value: number) { this.data[1][0] = value; }
            set c(value: number) { this.data[0][1] = value; }
            set d(value: number) { this.data[1][1] = value; }
            set tx(value: number) { this.data[0][2] = value; }
            set ty(value: number) { this.data[1][2] = value; }

            inverse(): Matrix {
                var m = this;
                var a = m.a;
                var b = m.b;
                var c = m.c;
                var d = m.d;
                var tx = m.tx;
                var ty = m.ty;

                var determinant = a * d - b * c;
                var result = identityMatrix(3);
                if (determinant == 0) {
                    throw new Error("no invert");
                }

                determinant = 1 / determinant;
                var k = result.a = d * determinant;
                b = result.b = -b * determinant;
                c = result.c = -c * determinant;
                d = result.d = a * determinant;
                result.tx = -(k * tx + c * ty);
                result.ty = -(b * tx + d * ty);
                return result;

            }
            /* inverse(): Matrix {
                 var result = new Matrix(this.degreeI, this.degreeI);
                 var i_s = [0, 0, 0];
                 var j_s = [0, 0, 0];
                 var m = this.data;
                 var fDet = 1;
                 var f = 1;
                 for (var k = 0; k < this.degreeI; k++) {
                     // 第一步，全选主元
                     var fMax = 0;
                     for (var i = k; i < this.degreeI; i++) {
                         for (var j = k; j < this.degreeJ; j++) {
                             var f = Math.abs(m[i][j]);
                             if (f > fMax) {
                                 fMax = f;
                                 i_s[k] = i;
                                 j_s[k] = j;
                             }
                         }
                     }
                     if (Math.abs(fMax) < 0.0001)
                         return null;
                     if (i_s[k] != k) {
                         f = -f;
                         swap(m[k][0], m[i_s[k]][0]);
                         swap(m[k][1], m[i_s[k]][1]);
                         swap(m[k][2], m[i_s[k]][2]);
                     }
                     if (j_s[k] != k) {
                         f = -f;
                         swap(m[0][k], m[0][j_s[k]]);
                         swap(m[1][k], m[1][j_s[k]]);
                         swap(m[2][k], m[2][j_s[k]]);
                     }
                     //计算行列式
                     fDet *= m[k][k];
                     //计算逆矩阵
                     //step 2
                     m[k][k] = 1 / m[k][k];
                     //step 3
                     for (var i = 0; i < this.degreeI; i++){
                         if(i != k)
                         m[k][i] *= m[k][k];
                     }
                     //step 4
                     for(var i = 0;i < this.degreeI;i++){
                         if( i != k){
                             for(j = 0; j < 3; j++){
                                 if(j != k)
                                     m[i][j] = m[i][j] - m[i][k] * m[k][j];
                             }
                         }
                     }
                     //step 5
                     for(i = 0; i<this.degreeI;i++){
                         if(i != k)
                         m[i][k] *= (-m[k][k]);
                     }
                 }
                 for( k = this.degreeI -1;k>=0;k--){
                     if(j_s[k] != k){
                         swap(m[k][0],m[j_s[k]][0]);
                         swap(m[k][1],m[j_s[k]][1]);
                         swap(m[k][2],m[j_s[k]][2]);
                     }
                     if(i_s[k]!=k){
                         swap(m[0][k],m[0][i_s[k]]);
                         swap(m[1][k],m[1][i_s[k]]);
                         swap(m[2][k],m[2][i_s[k]]);
                     }
                 }
     
                 return result;
             }*/
        }

        export function swap(a, b) {
            var temp = a;
            a = b;
            b = temp;
        }
        export function identityMatrix(degree: number): Matrix {
            var result = new Matrix(degree, degree);
            for (var i = 0; i < degree; i++) {
                for (var j = 0; j < degree; j++) {
                    result.data[i][j] = (i == j ? 1 : 0);
                }
            }
            return result;
        }

        export function move2Mat(x: number, y: number): Matrix {
            var result = identityMatrix(3);
            result.data[0][2] = x;
            result.data[1][2] = y;
            return result;
        }

        export function rotate2Mat(eularDegree: number): Matrix {
            var result = identityMatrix(3);
            result.data[0][0] = Math.cos(eularDegree);
            result.data[1][0] = Math.sin(eularDegree);
            result.data[0][1] = -Math.sin(eularDegree);
            result.data[1][1] = Math.cos(eularDegree);
            return result;
        }

        export function scale2Mat(x: number, y: number): Matrix {
            var result = identityMatrix(3);
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
}