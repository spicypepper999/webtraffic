var RoadNode = /** @class */ (function () {
    function RoadNode(x, y) {
        this._x = x;
        this._y = y;
    }
    Object.defineProperty(RoadNode.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RoadNode.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
        },
        enumerable: false,
        configurable: true
    });
    RoadNode.prototype.distanceXTo = function (node) {
        var distanceX = this.x - node.x;
        return distanceX;
    };
    RoadNode.prototype.distanceYTo = function (node) {
        var distanceY = this.y - node.y;
        return distanceY;
    };
    RoadNode.prototype.distanceTo = function (node) {
        var distanceX = this.distanceXTo(node);
        var distanceY = this.distanceYTo(node);
        var distance = Math.sqrt((Math.pow(distanceX, 2)) + (Math.pow(distanceY, 2)));
        return distance;
    };
    RoadNode.prototype.directionTo = function (node) {
        var direction = Math.atan2(this.distanceYTo(node), this.distanceXTo(node));
        return direction;
    };
    RoadNode.prototype.setXY = function (x, y) {
        this.x = x;
        this.y = y;
    };
    RoadNode.prototype.setXYNode = function (node) {
        this.x = node.x;
        this.y = node.y;
    };
    RoadNode.prototype.isObstacle = function (car) {
        return false;
    };
    return RoadNode;
}());
export { RoadNode };
