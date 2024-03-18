import { _decorator, Component, instantiate, Node, v2 } from 'cc';

import { JigsawPieceType } from '../constants/jigsaw.constants';
import jigsawEventTarget from '../event/JigsawEventTarget';
import { convertWorldToLocal } from '../libs/xy';
import { JigsawPiece, JigsawPieceState } from './JigsawPiece';

const { ccclass, property } = _decorator;

@ccclass('JigsawBoard')
export default class JigsawBoard extends Component {
  private DIM = 6;
  private startX = 0;
  private startY = 0;
  private scaleRatio = 1;
  private previewPiece: JigsawPiece = null;
  private matrix: JigsawPieceType[] = [];
  private _lastIndex = -1;

  onLoad(): void {
    this.initEvents();
    this.init(3);
    this.initPreview();
  }

  private initEvents(): void {
    jigsawEventTarget.on(jigsawEventTarget.PIECE_HINT, this.hintPiece, this);
    jigsawEventTarget.on(jigsawEventTarget.PIECE_DROP, this.dropPiece, this);
    jigsawEventTarget.on(jigsawEventTarget.PIECE_PICK, this.pickPiece, this);
  }

  private initPreview(): void {}

  public init(dim: number) {
    this.DIM = dim;
    this.scaleRatio = 720 / dim / 155;
    this.startX = -360;
    this.startY = 360;
  }

  private pickPiece(args) {
    const { index, piece } = args;
    this.matrix[index] = null;
  }

  private hintPiece(args) {
    const { cx, cy, piece } = args;
    if (!this.previewPiece) {
      const node: Node = instantiate(piece.node);
      this.previewPiece = node.getComponent(JigsawPiece);
      node.setParent(this.node);
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
    } else {
      const { index } = piece;
      const [x_, y_] = [index % this.DIM, Math.floor(index / this.DIM)];
      this.forceDrop(x_, y_, piece);
    }
    this._lastIndex = -1;
  }

  private forceDrop(x, y, piece: JigsawPiece): void {
    piece.node.setParent(this.node);
    piece.node.setPosition(this.startX + (x + 0.5) * 155 * this.scaleRatio, this.startY - (y + 0.5) * 155 * this.scaleRatio);
    this.previewPiece.node.active = false;
    this.matrix[x + y * this.DIM] = piece.data.type;
    piece.state = JigsawPieceState.IN_BOARD;
    piece.index = x + y * this.DIM;
  }

  private isValidDrop(x: number, y: number) {
    console.log('valid', x, y, this.matrix[x + y * this.DIM]);
    return x >= 0 && x < this.DIM && y >= 0 && y < this.DIM && !this.matrix[x + y * this.DIM];
  }

  protected onDestroy(): void {}
}
