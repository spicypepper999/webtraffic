import { RoadNode } from "./RoadNode.js"

export class Road {
  private _nodes: any;
  private _roadEnd: Road | null;
  private _speedLimit: number;
  private _color: string;

  constructor(nodes: any, speedLimit: number, color: string) {
    this._nodes = nodes;
    this._speedLimit = speedLimit;
    this._color = color;
    this._roadEnd = null;
  }
  set nodes(value) {
    this._nodes = value;
  }
  get nodes(): RoadNode[] {
    return this._nodes;
  }
  set roadEnd(value) {
    this._roadEnd = value;
  }
  get roadEnd(): Road | null {
    return this._roadEnd;
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
  XYFromPosition(position: number) {
    let node = new RoadNode(0, 0);
    if (position < 0) {
      node.setXYNode(this.nodes[0]);
      return node;
    }
    if (position > this.length()) {
      if (this.roadEnd != null) {
        node.setXYNode(this.roadEnd.XYFromPosition(position - this.length()));
        return node;
      } else {
        node.setXYNode(this.nodes[this.nodes.length - 1]);
        return node;
      }
    }
    let distanceLeft = position;
    node.setXYNode(this.nodes[0]);
    for (let i = 1; i < this.nodes.length && distanceLeft > 0; i++) {
      if (distanceLeft < node.distanceTo(this.nodes[i])) {
        let dx = (Math.cos(node.directionTo(this.nodes[i])) * distanceLeft);
        let dy = (Math.sin(node.directionTo(this.nodes[i])) * distanceLeft);
        dx = node.x - dx;
        dy = node.y - dy;
        node = new RoadNode(dx, dy);
        return node;
      }
      distanceLeft -= node.distanceTo(this.nodes[i]);
      node.setXYNode(this.nodes[i]);
    }
    return node;
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