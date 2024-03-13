import { randomRangeInt } from "cc";

import { JigsawPieceType } from "../constants/jigsaw.constants";
import Cell from "../models/Cell";
import Tile from "../models/Tile";

export default class JigsawGenerator {
  public tiles: Tile[] = [];
  public grid: Cell[] = [];
  public DIM = 0;

  private static _instance: JigsawGenerator = null;

  constructor() {
    this.initialize();
  }

  public static get Instance(): JigsawGenerator {
    if (!this._instance) {
      this._instance = new JigsawGenerator();
    }
    return this._instance;
  }

  initialize(): void {
    this.tiles[0] = new Tile("c-1-tl", [0, 1, 1, 0]);
    this.tiles[1] = new Tile("c-1-tr", [0, 0, 1, 1]);
    this.tiles[2] = new Tile("c-1-bl", [1, 1, 0, 0]);
    this.tiles[3] = new Tile("c-1-br", [1, 0, 0, 1]);
    this.tiles[4] = new Tile("c-2-tl-1", [0, 2, 1, 0]);
    this.tiles[5] = new Tile("c-2-tr-1", [0, 0, 1, 2]);
    this.tiles[6] = new Tile("c-2-bl-1", [1, 2, 0, 0]);
    this.tiles[7] = new Tile("c-2-br-1", [1, 0, 0, 2]);
    this.tiles[8] = new Tile("c-2-tl-2", [0, 1, 2, 0]);
    this.tiles[9] = new Tile("c-2-tr-2", [0, 0, 2, 1]);
    this.tiles[10] = new Tile("c-2-bl-2", [2, 1, 0, 0]);
    this.tiles[11] = new Tile("c-2-br-2", [2, 0, 0, 1]);
    this.tiles[12] = new Tile("c-3-tl", [0, 2, 2, 0]);
    this.tiles[13] = new Tile("c-3-tr", [0, 0, 2, 2]);
    this.tiles[14] = new Tile("c-3-bl", [2, 2, 0, 0]);
    this.tiles[15] = new Tile("c-3-br", [2, 0, 0, 2]);
    this.tiles[16] = new Tile("e-1-t", [0, 1, 1, 1]);
    this.tiles[17] = new Tile("e-1-l", [1, 1, 1, 0]);
    this.tiles[18] = new Tile("e-1-r", [1, 0, 1, 1]);
    this.tiles[19] = new Tile("e-1-b", [1, 1, 1, 0]);
    this.tiles[20] = new Tile("e-2-t", [0, 1, 2, 1]);
    this.tiles[21] = new Tile("e-2-l", [1, 2, 1, 0]);
    this.tiles[22] = new Tile("e-2-r", [1, 0, 1, 2]);
    this.tiles[23] = new Tile("e-2-b", [2, 1, 0, 1]);
    this.tiles[24] = new Tile("e-3-t", [0, 2, 1, 2]);
    this.tiles[25] = new Tile("e-3-l", [2, 1, 2, 0]);
    this.tiles[26] = new Tile("e-3-r", [2, 0, 2, 1]);
    this.tiles[27] = new Tile("e-3-b", [1, 2, 0, 2]);
    this.tiles[28] = new Tile("m-1-t", [1, 1, 1, 1]);
    this.tiles[29] = new Tile("m-2-t", [2, 2, 2, 2]);
    this.tiles[30] = new Tile("m-3-t", [1, 2, 2, 2]);
    this.tiles[31] = new Tile("m-3-l", [2, 2, 2, 1]);
    this.tiles[32] = new Tile("m-3-r", [2, 1, 2, 2]);
    this.tiles[33] = new Tile("m-3-b", [2, 2, 1, 2]);
    this.tiles[34] = new Tile("m-4-t", [1, 2, 1, 2]);
    this.tiles[35] = new Tile("m-4-l", [2, 1, 2, 1]);
    this.tiles[36] = new Tile("m-5-tl", [1, 2, 2, 1]);
    this.tiles[37] = new Tile("m-5-tr", [1, 1, 2, 2]);
    this.tiles[38] = new Tile("m-5-bl", [2, 2, 1, 1]);
    this.tiles[39] = new Tile("m-5-br", [1, 1, 0, 2]);

    this.tiles[40] = new Tile("e-4-t", [0, 1, 2, 1]);
    this.tiles[41] = new Tile("e-4-l", [1, 2, 1, 0]);
    this.tiles[42] = new Tile("e-4-r", [1, 0, 1, 2]);
    this.tiles[43] = new Tile("e-4-b", [2, 1, 0, 1]);

    this.tiles[44] = new Tile("e-5-t-1", [0, 1, 2, 2]);
    this.tiles[45] = new Tile("e-5-t-2", [0, 2, 2, 1]);
    this.tiles[46] = new Tile("e-5-b-1", [2, 1, 0, 2]);
    this.tiles[47] = new Tile("e-5-b-2", [2, 2, 0, 1]);

    this.tiles[48] = new Tile("e-5-l-1", [1, 2, 2, 0]);
    this.tiles[49] = new Tile("e-5-l-2", [2, 2, 1, 0]);
    this.tiles[50] = new Tile("e-5-r-1", [1, 0, 2, 2]);
    this.tiles[51] = new Tile("e-5-r-2", [2, 0, 1, 2]);

    this.tiles[52] = new Tile("e-6-t-1", [0, 1, 1, 2]);
    this.tiles[53] = new Tile("e-6-t-2", [0, 2, 1, 1]);
    this.tiles[54] = new Tile("e-6-b-1", [1, 1, 0, 2]);
    this.tiles[55] = new Tile("e-6-b-2", [1, 2, 0, 1]);

    this.tiles[56] = new Tile("e-6-l-1", [1, 1, 2, 0]);
    this.tiles[57] = new Tile("e-6-l-2", [2, 1, 1, 0]);
    this.tiles[58] = new Tile("e-6-r-1", [1, 0, 2, 1]);
    this.tiles[59] = new Tile("e-6-r-2", [2, 0, 1, 1]);
  }

  private startOver() {
    // Create cell for each spot on the grid
    for (let y = 0; y < this.DIM; y++) {
      for (let x = 0; x < this.DIM; x++) {
        // check corner and edge
        const options = this.getOptionsAt(x, y);
        this.grid[y * this.DIM + x] = new Cell(options);
      }
    }
  }

  private getOptionsAt(x: number, y: number): JigsawPieceType[] {
    const isTL = y === 0 && x === 0;
    const isTR = x === this.DIM - 1 && y === 0;
    const isBL = x === 0 && y === this.DIM - 1;
    const isBR = x === this.DIM - 1 && y === this.DIM - 1;
    const isEdgeTop = y === 0;
    const isEdgeBottom = y === this.DIM - 1;
    const isEdgeLeft = x === 0;
    const isEdgeRight = x === this.DIM - 1;
    const allTypes = Object.values(JigsawPieceType).filter((x) => x !== "");
    let options = [];
    if (isTL) {
      options = allTypes.filter((x) => x.includes("c") && x.includes("tl"));
    } else if (isTR) {
      options = allTypes.filter((x) => x.includes("c") && x.includes("tr"));
    } else if (isBL) {
      options = allTypes.filter((x) => x.includes("c") && x.includes("bl"));
    } else if (isBR) {
      options = allTypes.filter((x) => x.includes("c") && x.includes("br"));
    } else if (isEdgeTop) {
      options = allTypes.filter((x) => x.includes("e") && x.includes("t"));
    } else if (isEdgeLeft) {
      options = allTypes.filter((x) => x.includes("e") && x.includes("l"));
    } else if (isEdgeRight) {
      options = allTypes.filter((x) => x.includes("e") && x.includes("r"));
    } else if (isEdgeBottom) {
      options = allTypes.filter((x) => x.includes("e") && x.includes("b"));
    } else {
      options = allTypes.filter((x) => x.includes("m"));
    }
    return options;
  }

  private checkValid(arr, valid) {
    for (let i = arr.length - 1; i >= 0; i--) {
      let element = arr[i];
      if (!valid.includes(element)) {
        arr.splice(i, 1);
      }
    }
  }

  generate(dim): JigsawGenerator {
    this.DIM = dim;
    // Generate the adjacency rules based on edges
    for (let i = 0; i < this.tiles.length; i++) {
      const tile = this.tiles[i];
      tile.analyze(this.tiles);
    }

    this.startOver();

    while (true) {
      let gridCopy = this.grid.slice();
      gridCopy = gridCopy.filter((a) => !a.collapsed);

      // console.log("debug", gridCopy?.[0].collapsed, ...gridCopy?.[0].options);

      if (gridCopy.length === 0) {
        console.log("res", JSON.parse(JSON.stringify(this.grid)));
        return;
      }

      gridCopy.sort((a, b) => {
        return a.options.length - b.options.length;
      });

      let len = gridCopy[0].options.length;
      let stopIndex = 0;

      for (let i = 1; i < gridCopy.length; i++) {
        if (gridCopy[i].options.length > len) {
          stopIndex = i;
          break;
        }
      }

      if (stopIndex > 0) {
        gridCopy.splice(stopIndex);
      }

      // collapse a cell
      const randomInGrid = randomRangeInt(0, gridCopy.length);

      const cell = gridCopy[randomInGrid];
      cell.collapsed = true;
      const randomInOptions = randomRangeInt(0, cell.options.length);
      const pick = cell.options[randomInOptions];
      if (!pick) {
        console.log(
          "something went wrong",
          [...this.grid],
          cell,
          randomInGrid,
          randomInOptions,
          stopIndex
        );
        this.generate(dim);
        return this;
      }
      cell.options = [this.tiles.find((x) => x.type === pick).type];

      // calculate entropy
      const nextGrid = [];
      for (let j = 0; j < this.DIM; j++) {
        for (let i = 0; i < this.DIM; i++) {
          let index = i + j * this.DIM;
          if (this.grid[index].collapsed) {
            nextGrid[index] = this.grid[index];
          } else {
            const options0 = this.getOptionsAt(i, j);
            let options = options0.slice();
            // Look up
            if (j > 0) {
              let up = this.grid[i + (j - 1) * this.DIM];
              let validOptions = [];
              for (let option of up.options) {
                let valid = this.tiles.find((x) => x.type === option).down;
                validOptions = validOptions.concat(valid);
              }
              this.checkValid(options, validOptions);
            }
            // Look right
            if (i < this.DIM - 1) {
              let right = this.grid[i + 1 + j * this.DIM];
              let validOptions = [];
              for (let option of right.options) {
                let valid = this.tiles.find((x) => x.type === option).left;
                validOptions = validOptions.concat(valid);
              }
              this.checkValid(options, validOptions);
            }
            // Look down
            if (j < this.DIM - 1) {
              let down = this.grid[i + (j + 1) * this.DIM];
              let validOptions = [];
              for (let option of down.options) {
                let valid = this.tiles.find((x) => x.type === option).up;
                validOptions = validOptions.concat(valid);
              }
              this.checkValid(options, validOptions);
            }
            // Look left
            if (i > 0) {
              let left = this.grid[i - 1 + j * this.DIM];
              let validOptions = [];
              for (let option of left.options) {
                let valid = this.tiles.find((x) => x.type === option).right;
                validOptions = validOptions.concat(valid);
              }
              this.checkValid(options, validOptions);
            }

            // I could immediately collapse if only one option left?
            if (options.length === 0) {
              // console.log("[bug] here", i, j);
              // const t = this.getOptionsAt(i, j);
              // console.log("[bug] after", [...t]);
            }
            nextGrid[index] = new Cell(options);
          }
        }
      }
      this.grid = nextGrid;
    }
  }

  toArrayOfJigsawType(): JigsawPieceType[] {
    return this.grid.map((x) => x.options[0]);
  }
}
