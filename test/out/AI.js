class Grid {
    constructor() {
        this._nodes = [[]];
    }
    /*constructor(data: { walkSpeed: number }[][]) {
        this._numCols = data.length;
        this._numRows = data[0].length;

        for (var i = 0; i < this._numCols; i++) {
            this._nodes[i] = [];
            for (var j = 0; j < this._numRows; j++) {
                this._nodes[i][j] = new TileNode(i, j);
                this._nodes[i][j].walkSpeed = data[i][j].walkSpeed;
            }
        }
    }*/
    setStartNode(x, y) {
        this._startNode = this._nodes[x][y];
    }
    setEndNode(x, y) {
        this._endNode = this._nodes[x][y];
    }
}
class TileNode {
    // bitmap: engine.Bitmap = null;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class AStarSearch {
    constructor(objGrid, creatureGrid) {
        this._openList = [];
        this._closedList = [];
        this._path = [];
        this._heuristic = this.diagonal;
        this._straightCost = 1.0;
        this._diagCost = 10;
        this._objGrid = objGrid;
        this._creatureGrid = creatureGrid;
        this._clickedAtUnwalkable = false;
    }
    setStartNode(x, y) {
        this._objGrid.setStartNode(x, y);
    }
    setEndNode(x, y) {
        this._objGrid.setEndNode(x, y);
        this._creatureGrid.setEndNode(x, y);
    }
    search() {
        //init
        this._openList = new Array();
        this._closedList = new Array();
        this._startNode = this._objGrid._startNode;
        this._endNode = this._objGrid._endNode;
        if (!this._endNode.walkSpeed) {
            this._clickedAtUnwalkable = true;
            this._endNode.walkSpeed = 1;
        }
        if (!this._creatureGrid._endNode.walkSpeed) {
            this._clickedAtUnwalkable = true;
        }
        this._startNode.g = 0;
        this._startNode.h = this._heuristic(this._startNode);
        this._startNode.f = this._startNode.g + this._startNode.h;
        //search
        var currentNode = this._startNode;
        while (currentNode != this._endNode) {
            var startX = Math.max(0, currentNode.x - 1);
            var endX = Math.min(this._objGrid._numCols - 1, currentNode.x + 1);
            var startY = Math.max(0, currentNode.y - 1);
            var endY = Math.min(this._objGrid._numRows - 1, currentNode.y + 1);
            for (var i = startX; i <= endX; i++) {
                for (var j = startY; j <= endY; j++) {
                    var test = this._objGrid._nodes[i][j];
                    if (test == currentNode || !test.walkSpeed ||
                        !this._objGrid._nodes[currentNode.x][test.y].walkSpeed ||
                        !this._objGrid._nodes[test.x][currentNode.y].walkSpeed) { //console.log("index:"+ i + " " +j +" !speed:"+ !test.walkSpeed);
                        continue;
                    }
                    var cost = this._straightCost;
                    if (!((currentNode.x == test.x) || (currentNode.y == test.y))) {
                        cost = this._diagCost;
                    }
                    var g = currentNode.g + cost;
                    var h = this._heuristic(test);
                    var f = g + h;
                    if (this.isOpen(test) || this.isClosed(test)) {
                        if (test.f > f) {
                            test.f = f;
                            test.g = g;
                            test.h = h;
                            test.parent = currentNode;
                        }
                    }
                    else {
                        test.f = f;
                        test.g = g;
                        test.h = h;
                        test.parent = currentNode;
                        this._openList.push(test);
                    }
                }
            }
            this._closedList.push(currentNode);
            if (this._openList.length == 0) {
                return false;
            }
            this._openList.sort(function (a, b) {
                return a.f - b.f;
            });
            currentNode = this._openList.shift();
        }
        this.buildPath();
        return true;
    }
    isOpen(node) {
        for (var i = 0; i < this._openList.length; i++) {
            if (this._openList[i] == node) {
                return true;
            }
        }
        return false;
        //return this._openList.indexOf(node) > 0 ? true : false;
    }
    isClosed(node) {
        for (var i = 0; i < this._closedList.length; i++) {
            if (this._closedList[i] == node) {
                return true;
            }
        }
        return false;
    }
    buildPath() {
        this._path = new Array();
        var node = this._endNode;
        this._path.push(node);
        //console.log("end at:"+node.x + " "+node.y);
        while (node != this._startNode) {
            node = node.parent;
            //console.log(node.x + " "+node.y);
            this._path.push(node); //结尾加入
        }
        if (this._clickedAtUnwalkable) {
            this._endNode.walkSpeed = 0;
            this._path.splice(0, 1);
            this._clickedAtUnwalkable = false;
        }
    }
    manhattan(node) {
        return Math.abs(this._endNode.x - node.x) * this._straightCost + Math.abs(this._endNode.y - node.y) * this._straightCost;
    }
    euclidian(node) {
        var dx = this._endNode.x - node.x;
        var dy = this._endNode.y - node.y;
        return Math.sqrt(dx * dx + dy * dy) * this._straightCost;
    }
    diagonal(node) {
        var dx = Math.abs(this._endNode.x - node.x);
        var dy = Math.abs(this._endNode.y - node.y);
        var diag = Math.min(dx, dy);
        var straight = dx + dy;
        return this._diagCost * diag + this._straightCost * (straight - 2 * diag);
    }
    visited() {
        return this._closedList.concat(this._openList);
    }
    validNode(node, currentNode) {
        if (currentNode == node || !node.walkSpeed)
            return false;
        if (!this._objGrid._nodes[currentNode.x][node.y].walkSpeed)
            return false;
        if (!this._objGrid._nodes[node.x][currentNode.y].walkSpeed)
            return false;
        return true;
    }
}
