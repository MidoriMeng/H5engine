const SIZE1 = 1;
const SIZE32 = 32;
const SIZE48 = 48;
class Vector2 {
    constructor(x = 0, y = 0) {
        this._x = 0;
        this._y = 0;
        this._x = x;
        this._y = y;
    }
    get x() {
        return this._x;
    }
    set x(x) {
        this._x = x;
    }
    get y() {
        return this._y;
    }
    set y(y) {
        this._y = y;
    }
}
//??? static
class Vector2_pixel extends Vector2 {
    /**传入的是index */
    constructor(ix, iy) {
        super(ix, iy);
        this._size = SIZE1;
        this.x = ix * this._size;
        this.y = iy * this._size;
    }
    get indexX() {
        return Math.floor(this.x / this._size);
    }
    set indexX(value) {
        this.x = value * this._size;
    }
    get indexY() {
        return Math.floor(this.y / this._size);
    }
    set indexY(value) {
        this.y = value * this._size;
    }
    get indexPosition() {
        return new Vector2(this.indexX, this.indexY);
    }
    set indexPosition(vec) {
        this.indexX = vec.x;
        this.indexY = vec.y;
    }
    get position() {
        return new Vector2(this.x, this.y);
    }
    set position(vec) {
        this.x = vec.x;
        this.y = vec.y;
    }
}
class Vector2_p32 extends Vector2_pixel {
    constructor(ix, iy) {
        super(ix, iy);
        this._size = SIZE32;
        this.x = ix * this._size;
        this.y = iy * this._size;
    }
}
class Vector2_p48 extends Vector2_pixel {
    /**输入的是索引 */
    constructor(ix, iy) {
        super(ix, iy);
        this._size = SIZE48;
        this._size = SIZE48;
        this.x = ix * this._size;
        this.y = iy * this._size;
    }
}
