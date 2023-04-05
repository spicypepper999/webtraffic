import { RoadNode } from "./RoadNode.js"
import { Car } from "./Car.js"

export class Lane {
  private _nodes: any;
  private _laneEnd: Lane | null;
  private _laneStart: Lane | null;
  private _speedLimit: number;
  private _color: string;
  private _cars: Car[];

  constructor(nodes: any, speedLimit: number, color: string) {
    this._nodes = nodes;
    this._speedLimit = speedLimit;
    this._color = color;
    this._laneEnd = null;
    this._laneStart = null;
    this._cars = [];
  }
  set nodes(value) {
    this._nodes = value;
  }
  get nodes(): RoadNode[] {
    return this._nodes;
  }
  set laneEnd(value) {
    if (value instanceof Lane) {
      this._laneEnd = value;
      if (value.laneStart == null) {
        value.laneStart = this;
      }
    }
  }
  get laneEnd(): Lane | null {
    return this._laneEnd;
  }
  set laneStart(value: Lane | null) {
    if (value instanceof Lane) {
      this._laneStart = value;
      if (value.laneEnd == null) {
        value.laneEnd = this;
      }
    }
  }
  get laneStart(): Lane | null {
    return this._laneStart;
  }
  set speedLimit(value) {
    this._speedLimit = value;
  }
  get speedLimit(): number {
    return this._speedLimit;
  }
  set color(value) {
    this._color = value;
  }
  get color(): string {
    return this._color;
  }
  set cars(value) {
    this._cars = value;
  }
  get cars(): Car[] {
    return this._cars;
  }
  XYDirFromPosition(position: number): [RoadNode, number] {
    let node = new RoadNode(0, 0);
    let dir = 0;
    if (position < 0) {
      node.setXYNode(this.nodes[0]);
      dir = Math.atan2(this.nodes[1].y - this.nodes[0].y, this.nodes[1].x - this.nodes[0].x);
      return [node, dir];
    }
    if (position > this.length()) {
      if (this.laneEnd != null) {
        let XYDir = this.laneEnd.XYDirFromPosition(position - this.length());
        node.setXYNode(XYDir[0]);
        dir = XYDir[1];
        return [node, dir];
      } else {
        node.setXYNode(this.nodes[this.nodes.length - 1]);
        dir = Math.atan2(this.nodes[this.nodes.length - 1].y - this.nodes[this.nodes.length - 2].y, this.nodes[this.nodes.length - 1].x - this.nodes[this.nodes.length - 2].x);
        return [node, dir];
      }
    }
    let distanceLeft = position;
    node.setXYNode(this.nodes[0]);
    dir = Math.atan2(this.nodes[1].y - this.nodes[0].y, this.nodes[1].x - this.nodes[0].x);
    for (let i = 1; i < this.nodes.length && distanceLeft > 0; i++) {
      if (distanceLeft < node.distanceTo(this.nodes[i])) {
        let dx = (Math.cos(node.directionTo(this.nodes[i])) * distanceLeft);
        let dy = (Math.sin(node.directionTo(this.nodes[i])) * distanceLeft);
        dx = node.x - dx;
        dy = node.y - dy;
        node = new RoadNode(dx, dy);
        dir = Math.atan2(this.nodes[i].y - this.nodes[i-1].y, this.nodes[i].x - this.nodes[i-1].x);
        return [node, dir];
      }
      distanceLeft -= node.distanceTo(this.nodes[i]);
      node.setXYNode(this.nodes[i]);
      dir = Math.atan2(this.nodes[i].y - this.nodes[i-1].y, this.nodes[i].x - this.nodes[i-1].x);
    }
    return [node, dir];
  }
  length() {
    let length = 0;
    let nodeCompare = this.nodes[0];
    for (let node of this.nodes) {
      length += node.distanceTo(nodeCompare);
      nodeCompare = node;
    }
    return length;
  }
  //since i want to support road loops, there could be 2 separate position values for an intersection node
  positionOfNode(node: RoadNode) {
    let positions: number[] = [];
    let position = 0;
    let nodePrevious = this.nodes[0];
    for (let nodeCompare of this.nodes) {
      position += nodePrevious.distanceTo(nodeCompare);
      if (node == nodeCompare) {
        positions.push(position);
      }
      nodePrevious = nodeCompare;
    }
    return positions;
  }
}