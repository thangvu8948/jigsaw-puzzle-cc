import {
  _decorator,
  Component,
  instantiate,
  Node,
  Prefab,
  Texture2D,
} from "cc";

import {
  JIGSAW_PIECE_CONFIGS,
  JigsawPieceConfig,
  JigsawPieceType,
} from "../constants/jigsaw.constants";
import { JigsawPiece } from "./JigsawPiece";

const { ccclass, property } = _decorator;

@ccclass("JigsawPuzzleRenderer")
export default class JigsawPuzzleRenderer extends Component {
  @property(Node) container: Node = null;
  @property(Prefab) piecePrefab: Prefab = null;
  @property([Texture2D]) cornerSpriteFrames: Texture2D[] = [];
  @property([Texture2D]) edgeSpriteFrames: Texture2D[] = [];
  @property([Texture2D]) midSpriteFrames: Texture2D[] = [];

  private frames = {
    c: this.cornerSpriteFrames,
    e: this.edgeSpriteFrames,
    m: this.midSpriteFrames,
  };

  protected onLoad(): void {
    this.frames = {
      c: this.cornerSpriteFrames,
      e: this.edgeSpriteFrames,
      m: this.midSpriteFrames,
    };
    this.render();
  }

  public render(): void {
    const width = 6,
      height = 2;
    const matrix = [
      ["c-2-tl-1", "e-1-t", "e-3-t", "e-1-t", "e-3-t", "c-2-tr-2"],
      ["e-3-l", "m-2-t", "m-3-l", "c-2-br-1", "c-1-tr", "e-1-r"],
      ["e-2-l", "m-1-t", "c-1-br", "", "c-1-tr", "e-3-r"],
      ["e-3-l", "c-2-tl-1", "", "m-5-br", "", "e-1-r"],
      ["e-2-l", "c-2-tl-1", "c-1-br", "", "c-1-tr", "e-3-r"],
      ["c-3-bl", "e-3-b", "c-1-br", "c-2-br-1", "c-1-tr", "c-1-br"],
    ];

    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[0].length; x++) {
        const node = instantiate(this.piecePrefab);
        const cpn = node.getComponent(JigsawPiece);
        const [key, index] = matrix[y][x].split("-");
        const mask = this.frames[key]?.[+index - 1];
        const config: JigsawPieceConfig = JIGSAW_PIECE_CONFIGS[matrix[y][x]];
        node.setParent(this.container);
        // node.setPosition(-500 + x * 155, 0);
        cpn.init({
          angle: config?.angle,
          xAxis: {
            start:
              x / width -
              (config?.overflow?.left ? ((188 - 155) * (1 / width)) / 155 : 0),
            end:
              (x + 1) / width +
              (config?.overflow?.right ? ((188 - 155) * (1 / width)) / 155 : 0),
          },
          yAxis: {
            start:
              (y * 1) / width -
              (config?.overflow?.top ? ((188 - 155) * (1 / width)) / 155 : 0),
            end:
              ((y + 1) * 1) / width +
              (config?.overflow?.bottom
                ? ((188 - 155) * (1 / width)) / 155
                : 0),
          },
          type: matrix[y][x] as JigsawPieceType,
          maskTexture: mask,
        });
      }
    }
  }
}
