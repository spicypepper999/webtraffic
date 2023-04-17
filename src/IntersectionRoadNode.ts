import { RoadNode } from "./RoadNode.js"
import { Car } from "./Car.js"

export class IntersectionRoadNode extends RoadNode {

  private _ruleset: any;
  private _currentCar: Car | undefined;

  constructor(x: number, y: number, ruleset: any) {
    super(x, y);
    this._ruleset = ruleset;
    this._currentCar = undefined;
  }
  set ruleset(value) {
    this._ruleset = value;
  }
  get ruleset(): any {
    return this._ruleset;
  }
  set currentCar(value) {
    this._currentCar = value;
  }
  get currentCar(): Car | undefined {
    return this._currentCar;
  }
  get type() : string{
    return "intersection";
  }
}