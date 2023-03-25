export class RoadNode {
    private _x: number;
    private _y: number;
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }
    set x(value) {
        this._x = value;
    }
    get x(): number {
        return this._x;
    }
    set y(value) {
        this._y = value;
    }
    get y(): number {
        return this._y;
    }
    distanceXTo(node: RoadNode) {
        let distanceX = this.x - node.x;
        return distanceX;
    }
    distanceYTo(node: RoadNode) {
        let distanceY = this.y - node.y;
        return distanceY;
    }
    distanceTo(node: RoadNode) {
        let distanceX = this.distanceXTo(node);
        let distanceY = this.distanceYTo(node);
        let distance = Math.sqrt((distanceX ** 2) + (distanceY ** 2));
        return distance;
    }
    directionTo(node: RoadNode) {
        let direction = Math.atan2(this.distanceYTo(node), this.distanceXTo(node));
        return direction;
    }
    setXY(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    setXYNode(node: RoadNode) {
        this.x = node.x;
        this.y = node.y;
    }
    isObstacle(car: any): boolean {
        return false;
    }
    get type() : string | null{
        return null;
    }
}