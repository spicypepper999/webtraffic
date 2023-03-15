import { IntersectionRoadNode } from "./IntersectionRoadNode.js";
var TrafficMap = /** @class */ (function () {
    function TrafficMap(roads, intersections, cars, sources, collectors) {
        this._roads = roads;
        this._intersections = intersections;
        this._cars = cars;
    }
    Object.defineProperty(TrafficMap.prototype, "roads", {
        get: function () {
            return this._roads;
        },
        set: function (value) {
            this._roads = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TrafficMap.prototype, "intersections", {
        get: function () {
            return this._intersections;
        },
        set: function (value) {
            this._intersections = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TrafficMap.prototype, "cars", {
        get: function () {
            return this._cars;
        },
        set: function (value) {
            this._cars = value;
        },
        enumerable: false,
        configurable: true
    });
    TrafficMap.prototype.isObstacle = function (node, car) {
        if (node.ruleset[0] == "stop") {
            if (car.speed == 0 || node.currentCar == car) {
                node.currentCar = car;
                return false;
            }
            else {
                return true;
            }
        }
        if (node.ruleset[0] == "yield") {
            var yieldRoad = node.ruleset[1];
            var yieldDistance = node.ruleset[2];
            var blocked = false;
            if (car.road == yieldRoad) {
                return false;
            }
            else {
                for (var _i = 0, _a = this.cars; _i < _a.length; _i++) {
                    var car2 = _a[_i];
                    if (car2.road == yieldRoad && car2 != car) {
                        var carDistance = car2.position - yieldRoad.positionOfNode(node)[0];
                        //code above might break?
                        if (yieldDistance >= 0 && carDistance <= yieldDistance && carDistance >= 0) {
                            blocked = true;
                        }
                        if (yieldDistance < 0 && carDistance >= yieldDistance && carDistance <= 0) {
                            blocked = true;
                        }
                    }
                }
                if (node.currentCar == car) {
                    blocked = false;
                }
                return blocked;
            }
        }
        else {
            return false;
        }
    };
    TrafficMap.prototype.checkCarPath = function (car, distance) {
        var detected;
        for (var _i = 0, _a = this.cars; _i < _a.length; _i++) {
            var car2 = _a[_i];
            if ((car2 != car) && (car2.road == car.road)) {
                if (distance > 0 && (car2.position - car.position) <= distance && (car2.position - car.position) >= 0) {
                    detected = car;
                    return detected;
                }
                else if (distance < 0 && (car2.position - car.position) >= distance && (car2.position - car.position) <= 0) {
                    detected = car;
                    return detected;
                }
            }
        }
        for (var _b = 0, _c = car.road.nodes; _b < _c.length; _b++) {
            var node = _c[_b];
            var closestPosition = Number.MAX_VALUE;
            for (var _d = 0, _e = car.road.positionOfNode(node); _d < _e.length; _d++) {
                var position = _e[_d];
                if (Math.abs(position - car.position) < Math.abs(closestPosition)) {
                    closestPosition = position - car.position;
                }
            }
            if (distance > 0 && closestPosition <= distance && closestPosition >= 0 && node instanceof IntersectionRoadNode) {
                detected = node;
                return detected;
            }
            else if (distance < 0 && closestPosition >= distance && closestPosition <= 0 && node instanceof IntersectionRoadNode) {
                detected = node;
                return detected;
            }
        }
        return detected;
    };
    TrafficMap.prototype.updatePosition = function (car) {
        for (var i = 0; i < car.ruleset.length; i += 3) {
            var node = car.ruleset[i];
            var nextRoad = car.ruleset[i + 1];
            var direction = car.ruleset[i + 2];
            if (this.checkCarPath(car, car.speed * car.direction) == node) {
                car.road = nextRoad;
                car.direction = direction;
                car.position = nextRoad.positionOfNode(node)[0];
                //above line might break?
                node.queue.pop();
            }
        }
        car.position += (car.speed * car.direction);
        if (car.position > car.road.length() && car.road.roadEnd != null) {
            car.position -= car.road.roadEnd.length();
        }
    };
    return TrafficMap;
}());
export { TrafficMap };
