import { RoadNode } from "./RoadNode.js"

export class Road {
  private _nodes: any;
  private _roadEnd: Road | null;
  private _roadStart: Road | null;
  private _speedLimit: number;
  private _color: string;

//make roadStart and roadEnd work when looping

  constructor(nodes: any, speedLimit: number, color: string) {
    this._nodes = nodes;
    this._speedLimit = speedLimit;
    this._color = color;
    this._roadEnd = null;
    this._roadStart = null;
  }
  set nodes(value) {
    this._nodes = value;
  }
  get nodes(): RoadNode[] {
    return this._nodes;
  }
  set roadEnd(value) {
    if (value instanceof Road) {
      this._roadEnd = value;
      if (value.roadStart == null) {
        value.roadStart = this;
      }
    }
  }
  get roadEnd(): Road | null {
    return this._roadEnd;
  }
  set roadStart(value: Road | null) {
    if (value instanceof Road) {
      this._roadStart = value;
      if (value.roadEnd == null) {
        value.roadEnd = this;
      }
    }
  }
  get roadStart(): Road | null {
    return this._roadStart;
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
  XYDirFromPosition(position: number): [RoadNode, number] {
    let node = new RoadNode(0, 0);
    let dir = 0;
    if (position < 0) {
      node.setXYNode(this.nodes[0]);
      dir = Math.atan2(this.nodes[1].y - this.nodes[0].y, this.nodes[1].x - this.nodes[0].x);
      return [node, dir];
    }
    if (position > this.length()) {
      if (this.roadEnd != null) {
        let XYDir = this.roadEnd.XYDirFromPosition(position - this.length());
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