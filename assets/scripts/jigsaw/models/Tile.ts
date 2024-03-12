import { JigsawPieceType } from "../constants/jigsaw.constants";

const TOP = 0;
const RIGHT = 1;
const BOTTOM = 2;
const LEFT = 3;
export default class Tile {
  public type: JigsawPieceType;
  public edges: number[] = [];
  public up: number[] = [];
  public right: number[] = [];
  public down: number[] = [];
  public left: number[] = [];

  constructor(type: JigsawPieceType, edges: number[]) {
    this.type = type;
    this.edges = edges;
    this.up = [];
    this.right = [];
    this.down = [];
    this.left = [];
  }

  compareEdge(edge1, edge2) {
    return (edge1 === 1 && edge2 === 2) || (edge1 === 2 && edge2 === 1);
  }

  analyze(tiles: Tile[]): void {
    for (let i = 0; i < tiles.length; i++) {
      let tile = tiles[i];

      // UP
      if (this.edges[TOP] === 0) {
        this.up = [];
      } else {
        this.compareEdge(tile[BOTTOM], this.edges[TOP]) && this.up.push(i);
      }

      // RIGHT
      if (this.edges[RIGHT] === 0) {
        this.right = [];
      } else {
        this.compareEdge(tile[LEFT], this.edges[RIGHT]) && this.right.push(i);
      }

      // BOTTOM
      if (this.edges[BOTTOM] === 0) {
        this.down = [];
      } else {
        this.compareEdge(tile[TOP], this.edges[BOTTOM]) && this.down.push(i);
      }

      // LEFT
      if (this.edges[LEFT] === 0) {
        this.right = [];
      } else {
        this.compareEdge(tile[RIGHT], this.edges[LEFT]) && this.left.push(i);
      }
    }
  }
}
