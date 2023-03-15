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
  get type() : string{
    return "intersection";
  }
}