import { RoadNode } from "./RoadNode.js"
import { IntersectionRoadNode } from "./IntersectionRoadNode.js"
import { Car } from "./Car.js"
import { Lane } from "./Lane.js"
import { Road } from "./Road.js"

export class TrafficMap {
    private _lanes;
    private _intersections;
    private _cars;
    private _events;
    private _counter;

    constructor(lanes: Lane[], intersections: IntersectionRoadNode[], cars: Car[], events: any) {
        this._lanes = lanes;
        this._intersections = intersections;
        this._cars = cars;
        this._events = events;
        this._counter = 0;
    }
    set lanes(value) {
        this._lanes = value;
    }
    get lanes(): Lane[] {
        return this._lanes;
    }
    set intersections(value) {
        this._intersections = value;
    }
    get intersections(): IntersectionRoadNode[] {
        return this._intersections;
    }
    set cars(value) {
        this._cars = value;
    }
    get cars(): Car[] {
        return this._cars;
    }
    set events(value) {
        this._events = value;
    }
    get events(): any {
        return this._events;
    }
    set counter(value) {
        this._counter = value;
    }
    get counter(): number {
        return this._counter;
    }
    isObstacle(obstacle: IntersectionRoadNode | Car, car: Car): boolean {
        if (obstacle instanceof Car) {
            return true;
        }
        if (obstacle instanceof IntersectionRoadNode) {
            if (obstacle.ruleset[0] == "stop") {
                if ((car.speed == 0 && obstacle.currentCar == undefined) || obstacle.currentCar == car) {
                    obstacle.currentCar = car;
                    return false;
                } else {
                    return true;
                }
            }
            if (obstacle.ruleset[0] == "yield") {
                let yieldLane = obstacle.ruleset[1];
                let yieldDistance = obstacle.ruleset[2];
                if (car.lane == yieldLane) {
                    return false;
                } else {
                    if((this.checkPathForCars(yieldLane, yieldLane.positionOfNode(obstacle)[0], yieldDistance) == undefined && obstacle.currentCar == undefined) || obstacle.currentCar == car){
                        obstacle.currentCar = car;
                        return false;
                    }else{
                        return true;
                    }
                }
            } else {
                return false;
            }
        }
        return false;
    }
    checkCarPath(car: Car, distance: number): Car | IntersectionRoadNode | undefined {
        let detected;
        for (let car2 of car.lane.cars) {
            if ((car2 != car)) {
                if (distance > 0 && (car2.position - car.position) <= distance && (car2.position - car.position) >= 0) {
                    detected = car;
                    return detected;
                } else if (distance < 0 && (car2.position - car.position) >= distance && (car2.position - car.position) <= 0) {
                    detected = car;
                    return detected;
                }
            }
        }
        for (let node of car.lane.nodes) {
            let closestPosition = Number.MAX_VALUE;
            for (let position of car.lane.positionOfNode(node)) {
                if (Math.abs(position - car.position) < Math.abs(closestPosition)) {
                    closestPosition = position - car.position;
                }
            }
            if (distance > 0 && closestPosition <= distance && closestPosition >= 0 && node instanceof IntersectionRoadNode) {
                detected = node;
                return detected;
            } else if (distance < 0 && closestPosition >= distance && closestPosition <= 0 && node instanceof IntersectionRoadNode) {
                detected = node;
                return detected;
            }
        }
        if ((car.position + distance) > car.lane.length() && car.lane.laneEnd != null && detected == undefined) {
            detected = this.checkPath(car.lane.laneEnd, 0, (car.position + distance) % car.lane.length());
        }
        if ((car.position + distance) < 0 && car.lane.laneStart != null && detected == undefined) {
            detected = this.checkPath(car.lane.laneStart, car.lane.laneStart.length(), car.position + distance);
        }
        return detected;
    }
    checkPath(lane: Lane, position: number, distance: number): Car | IntersectionRoadNode | undefined {
        let detected;
        for (let car of lane.cars) {
            if (car.lane == lane) {
                if (distance > 0 && (car.position - position) <= distance && (car.position - position) >= 0) {
                    detected = car;
                    return detected;
                } else if (distance < 0 && (car.position - position) >= distance && (car.position - position) <= 0) {
                    detected = car;
                    return detected;
                }
            }
        }
        for (let node of lane.nodes) {
            let closestPosition = Number.MAX_VALUE;
            for (let position of lane.positionOfNode(node)) {
                if (Math.abs(position - position) < Math.abs(closestPosition)) {
                    closestPosition = position - position;
                }
            }
            if (distance > 0 && closestPosition <= distance && closestPosition >= 0 && node instanceof IntersectionRoadNode) {
                detected = node;
                return detected;
            } else if (distance < 0 && closestPosition >= distance && closestPosition <= 0 && node instanceof IntersectionRoadNode) {
                detected = node;
                return detected;
            }
        }
        if ((position + distance) > lane.length() && lane.laneEnd != null && detected == undefined) {
            detected = this.checkPath(lane.laneEnd, 0, (position + distance) % lane.length());
        }
        if ((position + distance) < 0 && lane.laneStart != null && detected == undefined) {
            detected = this.checkPath(lane.laneStart, lane.laneStart.length(), position + distance);
        }
        return detected;
    }
    checkPathForCars(lane: Lane, position: number, distance: number): Car | undefined {
        let detected;
        for (let car of lane.cars) {
            if (car.lane == lane) {
                if (distance > 0 && (car.position - position) <= distance && (car.position - position) >= 0) {
                    detected = car;
                    return detected;
                } else if (distance < 0 && (car.position - position) >= distance && (car.position - position) <= 0) {
                    detected = car;
                    return detected;
                }
            }
        }
        if ((position + distance) > lane.length() && lane.laneEnd != null && detected == undefined) {
            detected = this.checkPathForCars(lane.laneEnd, 0, (position + distance) % lane.length());
        }
        if ((position + distance) < 0 && lane.laneStart != null && detected == undefined) {
            detected = this.checkPathForCars(lane.laneStart, lane.laneStart.length(), position + distance);
        }
        return detected;
    }
    updatePosition(car: Car) {
        for (let i = 0; i < car.ruleset.length; i += 3) {
            let node = car.ruleset[i];
            let nextLane = car.ruleset[i + 1];
            let direction = car.ruleset[i + 2];
            if (this.checkCarPath(car, car.speed * car.direction) == node) {
                car.lane = nextLane;
                car.direction = direction;
                car.position = nextLane.positionOfNode(node)[0];
                //above line might break?
                node.currentCar = undefined;
            }
        }
        car.position += (car.speed * car.direction);
        if (car.position > car.lane.length() && car.lane.laneEnd != null) {
            car.position -= car.lane.laneEnd.length();
        }
    }
}