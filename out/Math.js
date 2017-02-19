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
        return Matrix;
    }());
    MathUtil.Matrix = Matrix;
    function identity(degree) {
        var result = new Matrix(degree, degree);
        for (var i = 0; i < degree; i++) {
            for (var j = 0; j < degree; j++) {
                result.data[i][j] = (i == j ? 1 : 0);
            }
        }
        return result;
    }
    MathUtil.identity = identity;
    function move2Mat(x, y) {
        var result = identity(3);
        result.data[0][2] = x;
        result.data[1][2] = y;
        return result;
    }
    MathUtil.move2Mat = move2Mat;
    function rotate2Mat(eularDegree) {
        var result = identity(3);
        result.data[0][0] = Math.cos(eularDegree);
        result.data[1][0] = Math.sin(eularDegree);
        result.data[0][1] = -Math.sin(eularDegree);
        result.data[1][1] = Math.cos(eularDegree);
        return result;
    }
    MathUtil.rotate2Mat = rotate2Mat;
    function scale2Mat(x, y) {
        var result = identity(3);
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