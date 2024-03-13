import { JigsawPieceType } from "../constants/jigsaw.constants";

const TOP = 0;
const RIGHT = 1;
const BOTTOM = 2;
const LEFT = 3;
export default class Tile {
  public type: JigsawPieceType;
  public edges: number[] = [];
  public up: JigsawPieceType[] = [];
  public right: JigsawPieceType[] = [];
  public down: JigsawPieceType[] = [];
  public left: JigsawPieceType[] = [];

  constructor(type: JigsawPieceType | string, edges: number[]) {
    this.type = type as JigsawPieceType;
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
        
      } else {
        this.compareEdge(tile.edges[BOTTOM], this.edges[TOP]) && this.up.push(tile.type);
      }

      // RIGHT
      if (this.edges[RIGHT] === 0) {
      } else {
        this.compareEdge(tile.edges[LEFT], this.edges[RIGHT]) && this.right.push(tile.type);
      }

      // BOTTOM
      if (this.edges[BOTTOM] === 0) {
      } else {
        this.compareEdge(tile.edges[TOP], this.edges[BOTTOM]) && this.down.push(tile.type);
      }

      // LEFT
      if (this.edges[LEFT] === 0) {
      } else {
        this.compareEdge(tile.edges[RIGHT], this.edges[LEFT]) && this.left.push(tile.type);
      }
    }
  }
}
