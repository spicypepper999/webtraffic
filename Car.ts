import { Road } from "./Road.js"

export class Car {
  private _position: number;
  private _road: Road;
  private _direction: number;
  private _speed: number;
  private _power: number;
  private _size: number;
  private _ruleset: any;

  constructor(position: number, road: Road, direction: number, speed: number, power: number, size: number, ruleset: any) {
    this._position = position;
    this._road = road;
    this._direction = direction;
    this._speed = speed;
    this._power = power;
    this._size = size;
    this._ruleset = ruleset;
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
  set road(value) {
    this._road = value;
  }
  get road(): Road {
    return this._road;
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
  getXY() {
    let node = this.road.XYFromPosition(this.position);
    return node;
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
    if (this.speed < this.road.speedLimit) {
      this.speed += this.power;
    }
  }
  isObstacle(car: Car): boolean {
    return true;
  }
}