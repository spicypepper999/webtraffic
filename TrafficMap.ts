import { RoadNode } from "./RoadNode.js"
import { IntersectionRoadNode } from "./IntersectionRoadNode.js"
import { Car } from "./Car.js"
import { Road } from "./Road.js"

export class TrafficMap {
    private _roads;
    private _intersections;
    private _cars;
    private _events;
    private _counter;

    constructor(roads: Road[], intersections: IntersectionRoadNode[], cars: Car[], events: any) {
        this._roads = roads;
        this._intersections = intersections;
        this._cars = cars;
        this._events = events;
        this._counter = 0;
    }
    set roads(value) {
        this._roads = value;
    }
    get roads(): Road[] {
        return this._roads;
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
                let yieldRoad = obstacle.ruleset[1];
                let yieldDistance = obstacle.ruleset[2];
                let blocked = false;
                if (car.road == yieldRoad) {
                    return false;
                } else {
                    if((this.checkPathForCars(yieldRoad, yieldRoad.positionOfNode(obstacle)[0], yieldDistance) == undefined && obstacle.currentCar == undefined) || obstacle.currentCar == car){
                        obstacle.currentCar = car;
                        return false;
                    }else{
                        return true;
                    }
                   // return blocked;
                }
            } else {
                return false;
            }
        }
    }
    checkCarPath(car: Car, distance: number): Car | IntersectionRoadNode | undefined {
        let detected;
        for (let car2 of this.cars) {
            if ((car2 != car) && (car2.road == car.road)) {
                if (distance > 0 && (car2.position - car.position) <= distance && (car2.position - car.position) >= 0) {
                    detected = car;
                    return detected;
                } else if (distance < 0 && (car2.position - car.position) >= distance && (car2.position - car.position) <= 0) {
                    detected = car;
                    return detected;
                }
            }
        }
        for (let node of car.road.nodes) {
            let closestPosition = Number.MAX_VALUE;
            for (let position of car.road.positionOfNode(node)) {
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
        if ((car.position + distance) > car.road.length() && car.road.roadEnd != null && detected == undefined) {
            detected = this.checkPath(car.road.roadEnd, 0, (car.position + distance) % car.road.length());
        }
        if ((car.position + distance) < 0 && car.road.roadStart != null && detected == undefined) {
            detected = this.checkPath(car.road.roadStart, car.road.roadStart.length(), car.position + distance);
        }
        return detected;
    }
    checkPath(road: Road, position: number, distance: number): Car | IntersectionRoadNode | undefined {
        let detected;
        for (let car of this.cars) {
            if (car.road == road) {
                if (distance > 0 && (car.position - position) <= distance && (car.position - position) >= 0) {
                    detected = car;
                    return detected;
                } else if (distance < 0 && (car.position - position) >= distance && (car.position - position) <= 0) {
                    detected = car;
                    return detected;
                }
            }
        }
        for (let node of road.nodes) {
            let closestPosition = Number.MAX_VALUE;
            for (let position of road.positionOfNode(node)) {
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
        if ((position + distance) > road.length() && road.roadEnd != null && detected == undefined) {
            detected = this.checkPath(road.roadEnd, 0, (position + distance) % road.length());
        }
        if ((position + distance) < 0 && road.roadStart != null && detected == undefined) {
            detected = this.checkPath(road.roadStart, road.roadStart.length(), position + distance);
        }
        return detected;
    }
    checkPathForCars(road: Road, position: number, distance: number): Car | undefined {
        let detected;
        for (let car of this.cars) {
            if (car.road == road) {
                if (distance > 0 && (car.position - position) <= distance && (car.position - position) >= 0) {
                    detected = car;
                    return detected;
                } else if (distance < 0 && (car.position - position) >= distance && (car.position - position) <= 0) {
                    detected = car;
                    return detected;
                }
            }
        }
        if ((position + distance) > road.length() && road.roadEnd != null && detected == undefined) {
            detected = this.checkPathForCars(road.roadEnd, 0, (position + distance) % road.length());
        }
        if ((position + distance) < 0 && road.roadStart != null && detected == undefined) {
            detected = this.checkPathForCars(road.roadStart, road.roadStart.length(), position + distance);
        }
        return detected;
    }
    updatePosition(car: Car) {
        for (let i = 0; i < car.ruleset.length; i += 3) {
            let node = car.ruleset[i];
            let nextRoad = car.ruleset[i + 1];
            let direction = car.ruleset[i + 2];
            if (this.checkCarPath(car, car.speed * car.direction) == node) {
                car.road = nextRoad;
                car.direction = direction;
                car.position = nextRoad.positionOfNode(node)[0];
                //above line might break?

//                node.queue.pop();
                node.currentCar = undefined;

            }
        }
        car.position += (car.speed * car.direction);
        if (car.position > car.road.length() && car.road.roadEnd != null) {
            car.position -= car.road.roadEnd.length();
        }
    }
}