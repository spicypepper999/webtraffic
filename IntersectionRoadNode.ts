import { RoadNode } from "./RoadNode.js"
import { Car } from "./Car.js"

export class IntersectionRoadNode extends RoadNode {

  private _ruleset: any;
  private _queue: Car[];
  private _currentCar: Car | null;

  constructor(x: number, y: number, ruleset: any) {
    super(x, y);
    this._ruleset = ruleset;
    this._queue = [];
    this._currentCar = null;
  }
  set ruleset(value) {
    this._ruleset = value;
  }
  get ruleset(): any {
    return this._ruleset;
  }
  set queue(value) {
    this._queue = value;
  }
  get queue(): Car[] {
    return this._queue;
  }
  set currentCar(value) {
    this._currentCar = value;
  }
  get currentCar(): Car | null {
    return this._currentCar;
  }
  // isObstacle(car: Car) : boolean{
  //   if (this.ruleset[0] == "stop") {
  //     if (car.speed == 0 || this.currentCar == car) {
  //       this.currentCar = car;
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }
  //   if (this.ruleset[0] == "yield") {
  //     let yieldRoad = this.ruleset[1];
  //     let yieldDistance = this.ruleset[2];
  //     let blocked = false;
  //     if (car.road == yieldRoad) {
  //       return false;
  //     } else {
  //       for (let car2 of map.cars) {
  //         if (car2.road == yieldRoad && car2 != car) {
  //           let carDistance = car2.position - yieldRoad.positionOfNode(this)[0];
  //           //code above might break?
  //           if (yieldDistance >= 0 && carDistance <= yieldDistance && carDistance >= 0) {
  //             blocked = true;
  //           }
  //           if (yieldDistance < 0 && carDistance >= yieldDistance && carDistance <= 0) {
  //             blocked = true;
  //           }
  //         }
  //       }
  //       if (this.currentCar == car) {
  //         blocked = false;
  //       }
  //       return blocked;
  //     }
  //   } else {
  //     return false;
  //   }
  // }
}