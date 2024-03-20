import { _decorator, Component, easing, find, instantiate, Node, Sprite, tween, UIOpacity, v2 } from 'cc';

import { JigsawPieceType } from '../constants/jigsaw.constants';
import jigsawEventTarget from '../event/JigsawEventTarget';
import { convertWorldToLocal } from '../libs/xy';
import JigsawStore from '../stores/game.store';
import { JigsawPiece, JigsawPieceState } from './JigsawPiece';
import JigsawPieceContainer from './JigsawPieceContainer';

const { ccclass, property } = _decorator;

@ccclass('JigsawBoard')
export default class JigsawBoard extends Component {
  @property(JigsawPieceContainer) queueContainer: JigsawPieceContainer = null;
  @property(Node) boardContainer: Node = null;
  @property(Node) hintContainer: Node = null;
  @property(Sprite) resultSprite: Sprite = null;

  private DIM = 6;
  private startX = 0;
  private startY = 0;
  private scaleRatio = 1;
  private previewPiece: JigsawPiece = null;
  private matrix: JigsawPieceType[] = [];
  private _lastIndex = -1;

  onLoad(): void {
    this.initEvents();
    this.init(JigsawStore.Instance.DIM);
  }

  private initEvents(): void {
    jigsawEventTarget.on(jigsawEventTarget.PIECE_HINT, this.hintPiece, this);
    jigsawEventTarget.on(jigsawEventTarget.PIECE_DROP, this.dropPiece, this);
    jigsawEventTarget.on(jigsawEventTarget.PIECE_PICK, this.pickPiece, this);
  }

  public init(dim: number) {
    this.DIM = dim;
    this.scaleRatio = 720 / dim / 155;
    this.startX = -360;
    this.startY = 360;

    this.resultSprite.spriteFrame = JigsawStore.Instance.targetImage;
    this.resultSprite.node.active = false;
  }

  private pickPiece(args) {
    const { index, piece } = args;
    this.matrix[index] = null;
  }

  private hintPiece(args) {
    const { cx, cy, piece } = args;
    if (!this.previewPiece) {
      const node: Node = instantiate(piece.node);
      node.name = 'hint';
      this.previewPiece = node.getComponent(JigsawPiece);
      node.setParent(this.hintContainer);
    }
    const [x, y] = this.convertWorldToBoard(cx, cy);
    if (x + y * this.DIM === this._lastIndex) {
      return;
    }
    this._lastIndex = x + y * this.DIM;
    if (this.isValidDrop(x, y)) {
      this.previewPiece.node.active = true;
      const data = { ...(piece as JigsawPiece).data, isPreview: true };
      this.previewPiece.reset();
      this.previewPiece.init(data);
      this.previewPiece.render(data.type);
      this.previewPiece.node.setPosition(
        this.startX + (x + 0.5) * 155 * this.scaleRatio,
        this.startY - (y + 0.5) * 155 * this.scaleRatio
      );
    } else {
      this.previewPiece.node.active = false;
    }
  }

  private convertWorldToBoard(x: number, y: number): number[] {
    const output = [];
    const local = convertWorldToLocal(v2(x, y), this.node);
    output[0] = Math.floor(local.x / (155 * this.scaleRatio) + this.DIM / 2);
    output[1] = Math.floor(this.DIM / 2 - local.y / (155 * this.scaleRatio));
    return output;
  }

  private dropPiece(args) {
    const { cx, cy, piece }: { cx: number; cy: number; piece: JigsawPiece } = args;
    const [x, y] = this.convertWorldToBoard(cx, cy);
    if (this.isValidDrop(x, y)) {
      this.forceDrop(x, y, piece);
    } else if (piece.state === JigsawPieceState.IN_QUEUE) {
      jigsawEventTarget.emit(jigsawEventTarget.PIECE_RETURN_CONTAINER, piece);
    } else if (this.checkDropInContainer(cx, cy)) {
      this.matrix[x + y * this.DIM] = null;
      jigsawEventTarget.emit(jigsawEventTarget.PIECE_RETURN_CONTAINER, piece);
    } else {
      const { index } = piece;
      const [x_, y_] = [index % this.DIM, Math.floor(index / this.DIM)];
      this.forceDrop(x_, y_, piece);
    }

    this._lastIndex = -1;
  }

  private checkDropInContainer(cx: number, cy: number): boolean {
    const local = convertWorldToLocal(v2(cx, cy), this.queueContainer.scrollView.view.node);
    return this.queueContainer.scrollView.view.getBoundingBox().contains(v2(local.x, local.y));
  }

  private forceDrop(x, y, piece: JigsawPiece): void {
    piece.node.setParent(this.boardContainer);
    piece.node.setPosition(this.startX + (x + 0.5) * 155 * this.scaleRatio, this.startY - (y + 0.5) * 155 * this.scaleRatio);
    this.previewPiece.node.active = false;
    this.matrix[x + y * this.DIM] = piece.data.type;
    piece.state = JigsawPieceState.IN_BOARD;
    piece.index = x + y * this.DIM;

    this.onDropSuccess();
  }

  private isValidDrop(x: number, y: number) {
    return x >= 0 && x < this.DIM && y >= 0 && y < this.DIM && !this.matrix[x + y * this.DIM];
  }

  private onDropSuccess(): void {
    console.log('isCompleted', this.isCompleted());
    if (this.isCompleted()) {
      this.showCompleted();
    }
  }

  private isCompleted(): boolean {
    const target = JigsawStore.Instance.targetMatrix;
    for (let i = 0; i < target.length; i++) {
      if (target[i].type === this.matrix[i]) {
        continue;
      }
      return false;
    }
    return true;
  }

  private showCompleted(): void {
    this.resultSprite.node.active = true;
    find('Canvas/victory').active = true;
    this.previewPiece.destroy();
    this.previewPiece = null;
    const allPieces = this.boardContainer.getComponentsInChildren(JigsawPiece);
    this.scheduleOnce(() => {
      allPieces.forEach((p) => {
        tween(p.getComponent(UIOpacity))
          .to(
            1,
            { opacity: 0 },
            {
              easing: easing.sineOut,
              progress: (start, end, current, ratio) => {
                p.getComponent(JigsawPiece).setOpacity(1 - ratio);
                return current;
              }
            }
          )
          .start();
      });
    }, 0.25);
  }

  protected onDestroy(): void {}
}
