import {
  _decorator,
  Component,
  easing,
  instantiate,
  Node,
  Prefab,
  Texture2D,
  tween,
  UIOpacity,
  UITransform,
  v2,
  v3,
  Vec3
} from 'cc';
import { shuffle } from 'lodash-es';
import { JIGSAW_PIECE_CONFIGS, JigsawPieceConfig, JigsawPieceType } from '../constants/jigsaw.constants';
import jigsawEventTarget from '../event/JigsawEventTarget';
import JigsawGenerator from '../libs/jigsaw.generator';
import { convertLocalToWorld, convertWorldToLocal } from '../libs/xy';
import { JigsawPiece, JigsawPieceState } from './JigsawPiece';

const { ccclass, property } = _decorator;

@ccclass('JigsawPuzzleRenderer')
export default class JigsawPuzzleRenderer extends Component {
  @property(Node) container: Node = null;
  @property(Prefab) piecePrefab: Prefab = null;
  @property([Texture2D]) cornerSpriteFrames: Texture2D[] = [];
  @property([Texture2D]) edgeSpriteFrames: Texture2D[] = [];
  @property([Texture2D]) midSpriteFrames: Texture2D[] = [];

  private frames = {
    c: this.cornerSpriteFrames,
    e: this.edgeSpriteFrames,
    m: this.midSpriteFrames
  };

  private scaleRatio = 1;

  protected onLoad(): void {
    this.frames = {
      c: this.cornerSpriteFrames,
      e: this.edgeSpriteFrames,
      m: this.midSpriteFrames
    };

    globalThis.retry = () => {
      this.container.removeAllChildren();
      this.render();
    };

    jigsawEventTarget.on(jigsawEventTarget.PIECE_RETURN_CONTAINER, this.returnToContainer, this);
    this.render();
  }

  public render(): void {
    const dim = 3;
    JigsawGenerator.Instance.generate(dim);
    let matrix = JigsawGenerator.Instance.toArrayOfJigsawType();
    const width = dim;
    let pieces: Node[] = [];

    for (let y = 0; y < dim; y++) {
      for (let x = 0; x < dim; x++) {
        const node = instantiate(this.piecePrefab);
        const cpn = node.getComponent(JigsawPiece);
        const [key, index] = matrix[y * dim + x].split('-');
        const mask = this.frames[key]?.[+index - 1];
        const config: JigsawPieceConfig = JIGSAW_PIECE_CONFIGS[matrix[y * dim + x]];
        this.scaleRatio = 720 / dim / 155;
        node.setScale(v3(this.scaleRatio, this.scaleRatio, 1));
        cpn.init({
          angle: config?.angle,
          xAxis: {
            start: x / width - (config?.overflow?.left ? ((188 - 155) * (1 / width)) / 155 : 0),
            end: (x + 1) / width + (config?.overflow?.right ? ((188 - 155) * (1 / width)) / 155 : 0)
          },
          yAxis: {
            start: (y * 1) / width - (config?.overflow?.top ? ((188 - 155) * (1 / width)) / 155 : 0),
            end: ((y + 1) * 1) / width + (config?.overflow?.bottom ? ((188 - 155) * (1 / width)) / 155 : 0)
          },
          type: matrix[y * dim + x] as JigsawPieceType,
          maskTexture: mask,
          isPreview: false
        });
        pieces.push(node);
      }
    }

    pieces = shuffle(pieces);
    pieces.forEach((piece, index) => {
      piece.setParent(this.container);
      const cpn = piece.getComponent(JigsawPiece);
      cpn.index = index;
      cpn.state = JigsawPieceState.IN_QUEUE;
      cpn.render(cpn.data.type);
    });
  }

  returnToContainer(piece: JigsawPiece): void {
    const view = this.container.parent;
    const worldMiddle = view.worldPosition.clone().add(v3(view.getComponent(UITransform).width / 2, 0, 0));
    const local = convertWorldToLocal(v2(worldMiddle.x, worldMiddle.y), this.container);
    const middleIndex = Math.floor((local.x - 100) / (100 + 155 * this.scaleRatio));
    const newP = (middleIndex + 1) * 100 + middleIndex * 155 * this.scaleRatio;
    const newWorldP = convertLocalToWorld(v3(newP, 0, 0), this.container);
    const temp = instantiate(piece.node);
    this.container.addChild(temp);
    temp.position = Vec3.ZERO;
    temp.setSiblingIndex(middleIndex);
    temp.getComponent(UIOpacity).opacity = 0;
    tween(piece.node)
      .to(
        0.25,
        {
          worldPosition: newWorldP
        },
        { easing: easing.sineOut }
      )
      .call(() => {
        this.container.addChild(piece.node);
        piece.node.setSiblingIndex(middleIndex);
        piece.node.position = Vec3.ZERO;
        temp.destroy();
      })
      .start();
  }
}
