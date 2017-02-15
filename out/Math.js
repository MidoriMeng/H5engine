var MathUtil;
(function (MathUtil) {
    var Matrix = (function () {
        function Matrix() {
            this.data = [];
            this.data = [];
        }
        Matrix.identity = function (degree) {
            var result = [];
            for (var i = 0; i < degree; i++) {
                result.push([]);
                for (var j = 0; j < degree; j++) {
                    result[i].push(i == j ? 1 : 0);
                }
            }
            return result;
        };
        return Matrix;
    }());
    MathUtil.Matrix = Matrix;
})(MathUtil || (MathUtil = {}));
//# sourceMappingURL=Math.js.map