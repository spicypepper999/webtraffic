import { Lane } from "./Lane.js"
import { RoadNode } from "./RoadNode.js"

export class Road {
    private _lanes: Lane[];
    private _speedLimit: number;
    private _color: string;
    private _laneWidth: number;

    constructor(nodes: RoadNode[], lanes: number, laneWidth: number, speedLimit: number, color: string) {
        this._speedLimit = speedLimit;
        this._color = color;
        this._laneWidth = laneWidth;
        this._lanes = this.generateLanes(nodes, lanes, laneWidth);
    }
    set lanes(value) {
        this._lanes = value;
    }
    get lanes(): Lane[] {
        return this._lanes;
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
    set laneWidth(value) {
        this._laneWidth = value;
    }
    get laneWidth(): number {
        return this._laneWidth;
    }
    generateLanes(nodes: RoadNode[], lanes: number, laneWidth: number): Lane[] {
        const newLanes = [];

        for (let i = 0; i < lanes; i++) {
            let offset = (i - (lanes / 2 - 0.5)) * laneWidth;
            const newLane = new Lane([], this._speedLimit, this._color);
            for (let j = 0; j < nodes.length; j++) {
                const prevNode = nodes[j - 1];
                const node = nodes[j];
                const nextNode = nodes[j + 1];

                const bisectorAngle = this.calculateBisectorAngle(prevNode, node, nextNode);

                const angle1 = prevNode == undefined ? 0 : Math.atan2(node.y - prevNode.y, node.x - prevNode.x);
                const angle2 = nextNode == undefined ? 0 : Math.atan2(nextNode.y - node.y, nextNode.x - node.x);
                const angleDiff = angle2 - angle1;

                // Normalize angleDiff to [-PI, PI]
                const normalizedAngleDiff = angleDiff - Math.PI * 2 * Math.floor((angleDiff + Math.PI) / (Math.PI * 2));

                const adjustedOffset = nextNode == undefined ? offset : offset / Math.cos(normalizedAngleDiff / 2);

                const dx = (Math.cos(bisectorAngle + Math.PI / 2) * adjustedOffset);
                const dy = (Math.sin(bisectorAngle + Math.PI / 2) * adjustedOffset);

                const newNode = new RoadNode(node.x + dx, node.y + dy);
                newLane.nodes.push(newNode);
            }
            newLanes.push(newLane);
        }
        return newLanes;
    }

    calculateBisectorAngle(prevNode: RoadNode | undefined, node: RoadNode, nextNode: RoadNode | undefined): number {
        if (prevNode == undefined) {
            return Math.atan2(nextNode.y - node.y, nextNode.x - node.x);
        } else if (nextNode == undefined) {
            return Math.atan2(node.y - prevNode.y, node.x - prevNode.x);
        } else {
            const angle1 = Math.atan2(node.y - prevNode.y, node.x - prevNode.x);
            const angle2 = Math.atan2(nextNode.y - node.y, nextNode.x - node.x);
            const angleDiff = angle2 - angle1;

            // Normalize angleDiff to [-PI, PI]
            const normalizedAngleDiff = angleDiff - Math.PI * 2 * Math.floor((angleDiff + Math.PI) / (Math.PI * 2));
            return angle1 + normalizedAngleDiff / 2;
        }
    }
}