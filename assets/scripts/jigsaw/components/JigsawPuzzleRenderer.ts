import { _decorator, Component, easing, instantiate, Node, Prefab, Texture2D, tween, UIOpacity, v2, v3, Vec3 } from 'cc';
import { shuffle } from 'lodash-es';
import {
  IN_QUEUE_SCALE_FACTOR,
  IN_QUEUE_SPACING,
  JIGSAW_PIECE_CONFIGS,
  JigsawPieceConfig
} from '../constants/jigsaw.constants';
import jigsawEventTarget from '../event/JigsawEventTarget';
import JigsawGenerator from '../libs/jigsaw.generator';
import { convertLocalToWorld, convertWorldToLocal } from '../libs/xy';
import JigsawStore from '../stores/game.store';
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

  private scaleRatio = 1.0;

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
    const dim = JigsawStore.Instance.DIM;
    JigsawGenerator.Instance.generate(dim);
    let matrix = JigsawGenerator.Instance.toArrayOfJigsawType();
    JigsawStore.Instance.targetMatrix = matrix;

    const width = dim;
    let pieces: Node[] = [];

    for (let y = 0; y < dim; y++) {
      for (let x = 0; x < dim; x++) {
        const node = instantiate(this.piecePrefab);
        const cpn = node.getComponent(JigsawPiece);
        const [key, index] = matrix[y * dim + x].type.split('-');
        const mask = this.frames[key]?.[+index - 1];
        const config: JigsawPieceConfig = JIGSAW_PIECE_CONFIGS[matrix[y * dim + x].type];
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
          type: matrix[y * dim + x].type,
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
      piece.scale.multiplyScalar(IN_QUEUE_SCALE_FACTOR / this.scaleRatio);
    });
  }

  returnToContainer(piece: JigsawPiece): void {
    let middleIndex = piece.state === JigsawPieceState.IN_QUEUE ? piece.index : -1;
    const width = 155 * IN_QUEUE_SCALE_FACTOR;
    if (middleIndex < 0) {
      const view = this.container.parent;
      const worldMiddle = view.worldPosition.clone();
      const local = convertWorldToLocal(v2(worldMiddle.x, worldMiddle.y), this.container);
      middleIndex = Math.floor((local.x - width / 2 - 40) / (width + IN_QUEUE_SPACING));
    }
    const newP = 40 + middleIndex * (width + IN_QUEUE_SPACING) + width / 2;
    const newWorldP = convertLocalToWorld(v3(newP, 0, 0), this.container);
    piece.node.scale = piece.node.scale.multiplyScalar(IN_QUEUE_SCALE_FACTOR / (720 / JigsawStore.Instance.DIM / 155));
    const temp = instantiate(piece.node);
    this.container.addChild(temp);
    temp.position = Vec3.ZERO;
    temp.getComponent(UIOpacity).opacity = 0;
    temp.getComponent(JigsawPiece).isFake = true;
    temp.setSiblingIndex(middleIndex);
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
