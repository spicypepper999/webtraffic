import { RoadNode } from "./RoadNode.js"
import { IntersectionRoadNode } from "./IntersectionRoadNode.js"

export class Intersection extends RoadNode {

    private _ruleset: any;
    private _intersectionRoadNodes: IntersectionRoadNode[];

    constructor(x: number, y: number, ruleset: any) {
        super(x, y);
        this._ruleset = ruleset;
        this._intersectionRoadNodes = this.generateIntersectionNodes(ruleset);
    }
    set ruleset(value) {
        this._ruleset = value;
        this._intersectionRoadNodes = this.generateIntersectionNodes(value);
    }
    get ruleset(): any {
        return this._ruleset;
    }
    set intersectionRoadNodes(value) {
        this._intersectionRoadNodes = value;
    }
    get intersectionRoadNodes(): IntersectionRoadNode[] {
        return this._intersectionRoadNodes;
    }
    generateIntersectionNodes(ruleset): IntersectionRoadNode[] {
        const newNodes = [];

        return newNodes;
    }
}