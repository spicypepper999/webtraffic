import { Lane } from "./Lane.js"

export class Car {
  private _position: number;
  private _lane: Lane;
  private _direction: number;
  private _speed: number;
  private _power: number;
  private _size: number;
  private _ruleset: any;

  constructor(position: number, lane: Lane, direction: number, speed: number, power: number, size: number, ruleset: any) {
    this._position = position;
    this._lane = lane;
    this._direction = direction;
    this._speed = speed;
    this._power = power;
    this._size = size;
    this._ruleset = ruleset;
    this._lane.cars.push(this);
  }
  set position(value) {
    this._position = value;
  }
  get position(): number {
    return this._position;
  }
  set size(value) {
    this._size = value;
  }
  get size(): number {
    return this._size;
  }
  set lane(value) {
    if (this._lane.cars.indexOf(this) != -1 && this._lane != value) {
      this._lane.cars.splice(this._lane.cars.indexOf(this), 1);
    }
    this._lane = value;
    if (this._lane.cars.indexOf(this) == -1)
      this._lane.cars.push(this);
  }
  get lane(): Lane {
    return this._lane;
  }
  set direction(value) {
    this._direction = value;
  }
  get direction(): number {
    return this._direction;
  }
  set speed(value) {
    this._speed = value;
  }
  get speed(): number {
    return this._speed;
  }
  set power(value) {
    this._power = value;
  }
  get power(): number {
    return this._power;
  }
  set ruleset(value) {
    this._ruleset = value;
  }
  get ruleset(): any {
    return this._ruleset;
  }
  getXYDir() {
    let XYDir = this.lane.XYDirFromPosition(this.position);
    if (this._direction == 1) {
      XYDir[1] = XYDir[1] - Math.PI;
    }
    return XYDir;
  }
  calculateStoppingDistance() {
    let distance = 0;
    distance = (this.speed ** 2) / (this.power * 2);
    return distance;
  }
  calculateStoppingDistanceToCar(car: Car) {
    let distance = 0;
    distance = ((this.speed - car.speed) ** 2) / (this.power * 2);
    return distance;
  }
  brake() {
    if (this.speed > 0) {
      this.speed -= this.power;
    }
    if (this.speed <= 0) {
      this.speed = 0;
    }
  }
  accelerate() {
    if (this.speed < this.lane.speedLimit) {
      this.speed += this.power;
    }
  }
  isObstacle(car: Car): boolean {
    return true;
  }
  get type() {
    return "car";
  }
}