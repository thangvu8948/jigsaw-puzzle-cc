import { JigsawPieceType } from "../constants/jigsaw.constants";

export default class Cell {
  public collapsed = false;
  public options: JigsawPieceType[] = [];
  constructor(value) {
    this.collapsed = false;

    if (value instanceof Array) {
      this.options = value;
    } else {
      this.options = [];
      for (let i = 0; i < value; i++) {
        this.options[i] = value[i] as JigsawPieceType;
      }
    }
  }
}
