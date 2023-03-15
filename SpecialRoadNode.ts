import { RoadNode } from "./RoadNode.js"
import { Car } from "./Car.js"

export class SpecialRoadNode extends RoadNode {

  private _type: string;
  private _ruleset: any;

  constructor(x: number, y: number, type: string, ruleset: any) {
    super(x, y);
    this._type = type;
    this._ruleset = ruleset;
  }
  set type(value) {
    this._type = value;
  }
  get type(): string {
    return this._type;
  }
  set ruleset(value) {
    this._ruleset = value;
  }
  get ruleset(): any {
    return this._ruleset;
  }
}