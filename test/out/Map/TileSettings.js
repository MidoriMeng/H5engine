var MAP;
(function (MAP) {
    /**图块的数据结构
     * @param passSpeed
    */
    class Tile extends engine.Bitmap {
        constructor(data, position) {
            super();
            if (position) {
                this.x = position.x;
                this.y = position.y;
            }
            this.texture = engine.RES.getRes(data.texture);
            this.passSpeed = data.speed;
        }
        set ix(ix) {
            var vec = new Vector2_p48(ix, 0);
            this.x = vec.x;
        }
        set iy(iy) {
            var vec = new Vector2_p48(0, iy);
            this.y = vec.y;
        }
        set iPosition(vec) {
            this.ix = vec.indexX;
            this.iy = vec.indexY;
        }
        get ix() {
            return this.x / SIZE48;
        }
        get iy() {
            return this.y / SIZE48;
        }
    }
    MAP.Tile = Tile;
    var error = { texture: "error.png", speed: 0 };
    /**生成特定图块 */
    function generateTile(sceneType, type, index) {
        if (index == -1)
            return new Tile(error);
        var prefab = MAP.tileJson[sceneType][type][index];
        var result = new Tile(prefab);
        if (result)
            return result;
        else
            return new Tile(error);
    }
    MAP.generateTile = generateTile;
})(MAP || (MAP = {}));
