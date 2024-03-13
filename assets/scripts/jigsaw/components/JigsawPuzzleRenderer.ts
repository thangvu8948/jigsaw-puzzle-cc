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
import JigsawGenerator from "../libs/jigsaw.generator";
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

    window.retry = () => {
      this.container.removeAllChildren();
      this.render();
    };
  }

  public render(): void {
    const dim = 10;
    JigsawGenerator.Instance.generate(dim);
    const matrix = JigsawGenerator.Instance.toArrayOfJigsawType();
    console.log("matrix", matrix);
    const width = dim;
    const startX = (-(dim - 1) * 155) / 2;
    const startY = 400;
    for (let y = 0; y < dim; y++) {
      for (let x = 0; x < dim; x++) {
        const node = instantiate(this.piecePrefab);
        const cpn = node.getComponent(JigsawPiece);
        const [key, index] = matrix[y * dim + x].split("-");
        const mask = this.frames[key]?.[+index - 1];
        const config: JigsawPieceConfig =
          JIGSAW_PIECE_CONFIGS[matrix[y * dim + x]];
        node.setParent(this.container);
        node.setPosition(startX + x * 155, startY - y * 155);
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
          type: matrix[y * dim + x] as JigsawPieceType,
          maskTexture: mask,
        });
      }
    }
  }
}
