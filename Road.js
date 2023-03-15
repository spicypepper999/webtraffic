import { RoadNode } from "./RoadNode.js";
var Road = /** @class */ (function () {
    function Road(nodes, speedLimit, color) {
        this._nodes = nodes;
        this._speedLimit = speedLimit;
        this._color = color;
        this._roadEnd = null;
    }
    Object.defineProperty(Road.prototype, "nodes", {
        get: function () {
            return this._nodes;
        },
        set: function (value) {
            this._nodes = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Road.prototype, "roadEnd", {
        get: function () {
            return this._roadEnd;
        },
        set: function (value) {
            this._roadEnd = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Road.prototype, "speedLimit", {
        get: function () {
            return this._speedLimit;
        },
        set: function (value) {
            this._speedLimit = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Road.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._color = value;
        },
        enumerable: false,
        configurable: true
    });
    Road.prototype.XYFromPosition = function (position) {
        var node = new RoadNode(0, 0);
        if (position < 0) {
            node.setXYNode(this.nodes[0]);
            return node;
        }
        if (position > this.length()) {
            if (this.roadEnd != null) {
                node.setXYNode(this.roadEnd.XYFromPosition(position - this.length()));
                return node;
            }
            else {
                node.setXYNode(this.nodes[this.nodes.length - 1]);
                return node;
            }
        }
        var distanceLeft = position;
        node.setXYNode(this.nodes[0]);
        for (var i = 1; i < this.nodes.length && distanceLeft > 0; i++) {
            if (distanceLeft < node.distanceTo(this.nodes[i])) {
                var dx = (Math.cos(node.directionTo(this.nodes[i])) * distanceLeft);
                var dy = (Math.sin(node.directionTo(this.nodes[i])) * distanceLeft);
                dx = node.x - dx;
                dy = node.y - dy;
                node = new RoadNode(dx, dy);
                return node;
            }
            distanceLeft -= node.distanceTo(this.nodes[i]);
            node.setXYNode(this.nodes[i]);
        }
        return node;
    };
    Road.prototype.length = function () {
        var length = 0;
        var nodeCompare = this.nodes[0];
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            length += node.distanceTo(nodeCompare);
            nodeCompare = node;
        }
        return length;
    };
    //since i want to support road loops, there could be 2 separate position values for an intersection node
    Road.prototype.positionOfNode = function (node) {
        var positions = [];
        var position = 0;
        var nodePrevious = this.nodes[0];
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var nodeCompare = _a[_i];
            position += nodePrevious.distanceTo(nodeCompare);
            if (node == nodeCompare) {
                positions.push(position);
            }
            nodePrevious = nodeCompare;
        }
        return positions;
    };
    return Road;
}());
export { Road };
