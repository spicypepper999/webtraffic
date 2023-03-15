var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { RoadNode } from "./RoadNode.js";
var IntersectionRoadNode = /** @class */ (function (_super) {
    __extends(IntersectionRoadNode, _super);
    function IntersectionRoadNode(x, y, ruleset) {
        var _this = _super.call(this, x, y) || this;
        _this._ruleset = ruleset;
        _this._queue = [];
        _this._currentCar = null;
        return _this;
    }
    Object.defineProperty(IntersectionRoadNode.prototype, "ruleset", {
        get: function () {
            return this._ruleset;
        },
        set: function (value) {
            this._ruleset = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IntersectionRoadNode.prototype, "queue", {
        get: function () {
            return this._queue;
        },
        set: function (value) {
            this._queue = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IntersectionRoadNode.prototype, "currentCar", {
        get: function () {
            return this._currentCar;
        },
        set: function (value) {
            this._currentCar = value;
        },
        enumerable: false,
        configurable: true
    });
    return IntersectionRoadNode;
}(RoadNode));
export { IntersectionRoadNode };
