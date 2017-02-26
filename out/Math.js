var MathUtil;
(function (MathUtil) {
    var Matrix = (function () {
        function Matrix(degreeI, degreeJ) {
            this.data = [];
            for (var i = 0; i < degreeI; i++) {
                this.data.push([]);
                for (var j = 0; j < degreeJ; j++) {
                    this.data[i].push(0);
                }
            }
        }
        Object.defineProperty(Matrix.prototype, "degreeI", {
            get: function () {
                return this.data.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix.prototype, "degreeJ", {
            get: function () {
                return this.data[0].length;
            },
            enumerable: true,
            configurable: true
        });
        Matrix.prototype.row = function (r) {
            if (this.data[r]) {
                return new Vector(this.data[r]);
            }
            else {
                console.error("wrong row");
                return null;
            }
        };
        Matrix.prototype.column = function (c) {
            if (this.degreeJ <= c) {
                console.error("wrong column");
                return null;
            }
            var ctemp = [];
            this.data.forEach(function (value) {
                ctemp.push(value[c]);
            });
            return new Vector(ctemp);
        };
        /**a.multiply(b) == a*b  */
        Matrix.prototype.multiply = function (other) {
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
        };
        Object.defineProperty(Matrix.prototype, "a", {
            get: function () { return this.data[0][0]; },
            set: function (value) { this.data[0][0] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix.prototype, "b", {
            get: function () { return this.data[1][0]; },
            set: function (value) { this.data[1][0] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix.prototype, "c", {
            get: function () { return this.data[0][1]; },
            set: function (value) { this.data[0][1] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix.prototype, "d", {
            get: function () { return this.data[1][1]; },
            set: function (value) { this.data[1][1] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix.prototype, "tx", {
            get: function () { return this.data[0][2]; },
            set: function (value) { this.data[0][2] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Matrix.prototype, "ty", {
            get: function () { return this.data[1][2]; },
            set: function (value) { this.data[1][2] = value; },
            enumerable: true,
            configurable: true
        });
        Matrix.prototype.inverse = function () {
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
        };
        return Matrix;
    }());
    MathUtil.Matrix = Matrix;
    function swap(a, b) {
        var temp = a;
        a = b;
        b = temp;
    }
    MathUtil.swap = swap;
    function identityMatrix(degree) {
        var result = new Matrix(degree, degree);
        for (var i = 0; i < degree; i++) {
            for (var j = 0; j < degree; j++) {
                result.data[i][j] = (i == j ? 1 : 0);
            }
        }
        return result;
    }
    MathUtil.identityMatrix = identityMatrix;
    function move2Mat(x, y) {
        var result = identityMatrix(3);
        result.data[0][2] = x;
        result.data[1][2] = y;
        return result;
    }
    MathUtil.move2Mat = move2Mat;
    function rotate2Mat(eularDegree) {
        var result = identityMatrix(3);
        result.data[0][0] = Math.cos(eularDegree);
        result.data[1][0] = Math.sin(eularDegree);
        result.data[0][1] = -Math.sin(eularDegree);
        result.data[1][1] = Math.cos(eularDegree);
        return result;
    }
    MathUtil.rotate2Mat = rotate2Mat;
    function scale2Mat(x, y) {
        var result = identityMatrix(3);
        result.data[0][0] = x;
        result.data[1][1] = y;
        return result;
    }
    MathUtil.scale2Mat = scale2Mat;
    var Vector = (function () {
        function Vector(num) {
            var _this = this;
            this.data = [];
            num.forEach(function (value) { _this.data.push(value); });
        }
        Object.defineProperty(Vector.prototype, "degree", {
            get: function () {
                return this.data.length;
            },
            enumerable: true,
            configurable: true
        });
        Vector.prototype.dotProduct = function (other) {
            if (this.degree != other.degree) {
                console.error("wrong degree,num1 degree:" + this.degree + ", num2 degree:" + other.degree);
                return;
            }
            var result = 0;
            for (var i = 0; i < this.degree; i++)
                result += this.data[i] * other.data[i];
            return result;
        };
        return Vector;
    }());
    MathUtil.Vector = Vector;
})(MathUtil || (MathUtil = {}));
//# sourceMappingURL=Math.js.map