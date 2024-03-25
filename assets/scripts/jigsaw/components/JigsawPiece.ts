import {
  _decorator,
  CCFloat,
  CCInteger,
  Component,
  EventTouch,
  find,
  Label,
  Material,
  Node,
  Sprite,
  Texture2D,
  UITransform,
  v2,
  v3,
  Vec3,
  Widget
} from 'cc';

import { DEBUG } from '../constants/jigsaw.configs';
import { JIGSAW_PIECE_CONFIGS, JigsawPieceType } from '../constants/jigsaw.constants';
import jigsawEventTarget from '../event/JigsawEventTarget';
import JigsawStore from '../stores/game.store';

const { ccclass, property, executeInEditMode } = _decorator;

export type TJigsawPieceData = {
  xAxis: { start: number; end: number };
  yAxis: { start: number; end: number };
  type: JigsawPieceType;
  maskTexture: Texture2D;
  angle: number;
  isPreview: boolean;
};

export enum JigsawPieceState {
  IN_QUEUE,
  IN_BOARD
}
const LONG_TOUCH_DURATION = 0.1;
@ccclass('JigsawPiece')
@executeInEditMode(true)
export class JigsawPiece extends Component {
  @property(Sprite) resultSprite: Sprite = null;
  @property(CCInteger) xIdx: number = 0;
  @property(CCFloat) yIdx: number = 0;

  public state: JigsawPieceState = JigsawPieceState.IN_QUEUE;
  public index = 0;
  public isFake = false;

  private _mat: Material = null;
  private _widget: Widget = null;
  private _maskTexture: Texture2D = null;
  private _data: TJigsawPieceData = null;
  private _isTouching = false;
  private _isMoving = false;
  private _touchTime = 0;
  private _movingSpace: Node = null;
  private _containerSpace: Node = null;

  public get data(): TJigsawPieceData {
    return this._data;
  }

  onLoad(): void {
    this._movingSpace = find('Canvas/piece-moving-space');
    this._containerSpace = find('Canvas/ScrollView/view/content');
    this.addEvents();
  }

  addEvents(): void {
    jigsawEventTarget.on(jigsawEventTarget.COMPLETED, this.removeEvents, this);
    this.node.on(Node.EventType.TOUCH_START, this.handleTouchStart, this);
    this.node.on(Node.EventType.TOUCH_END, this.handleTouchEnd, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this.handleTouchMove, this);
    this.node.on(Node.EventType.TOUCH_CANCEL, this.handleTouchCancel, this);
  }

  init(data: TJigsawPieceData): void {
    if (data.type === '') {
      this.resultSprite.node.active = false;
      return;
    }
    this._data = data;
    this.resultSprite.spriteFrame = JigsawStore.Instance.targetImage;
  }

  reset(): void {
    this.setWidget(false, 'top', 'isAlignTop');
    this.setWidget(false, 'bottom', 'isAlignBottom');
    this.setWidget(false, 'left', 'isAlignLeft');
    this.setWidget(false, 'right', 'isAlignRight');
    this.resultSprite.node.position = Vec3.ZERO;
  }

  render(pieceType: JigsawPieceType = null): void {
    const type = pieceType || this._data.type;
    this._maskTexture = this._data.maskTexture;
    const material = this.resultSprite.getMaterialInstance(0);
    this._mat = material;
    this._widget = this.resultSprite.getComponent(Widget);

    this.node.getChildByName('label').active = DEBUG;
    if (DEBUG) {
      this.node.getChildByName('label').getComponent(Label).string = this._data.type;
    }

    this.renderCommon(type);
  }

  renderCommon(pieceType: JigsawPieceType): void {
    const { xAxis, yAxis, angle = 0, isPreview } = this._data;
    this._mat.setProperty('startX', xAxis.start);
    this._mat.setProperty('endX', xAxis.end);
    this._mat.setProperty('startY', yAxis.start);
    this._mat.setProperty('endY', yAxis.end);
    this._mat.setProperty('rotation', angle);
    this._mat.setProperty('maskTexture', this._maskTexture);

    const isRotote90 = angle === 90 || angle === -90;
    const spriteWidth = isRotote90 ? this._maskTexture.height : this._maskTexture.width;
    const spriteHeight = isRotote90 ? this._maskTexture.width : this._maskTexture.height;

    this.resultSprite.getComponent(UITransform).setContentSize(spriteWidth, spriteHeight);

    const config = JIGSAW_PIECE_CONFIGS[pieceType];
    const widgetConfig = config.widgets;
    this._mat.setProperty('scale', v2(config.scale.x, config.scale.y));
    this.setWidget(widgetConfig.top, 'top', 'isAlignTop');
    this.setWidget(widgetConfig.bottom, 'bottom', 'isAlignBottom');
    this.setWidget(widgetConfig.left, 'left', 'isAlignLeft');
    this.setWidget(widgetConfig.right, 'right', 'isAlignRight');

    if (isPreview) {
      this._mat.setProperty('alphaThreshold', 0.5);
      this._mat.recompileShaders({ USE_TEXTURE: false });
    }

    this._widget.updateAlignment();
  }

  setOpacity(opa: number): void {
    this._mat.setProperty('alphaThreshold', opa);
  }

  setWidget(flag: boolean, keyValueComponent = '', keyFlagComponent = '') {
    if (!this._widget) return;
    this._widget[keyFlagComponent] = flag;
    if (flag) {
      this._widget[keyValueComponent] = 0;
    }
  }

  private handleTouchStart(e: EventTouch): void {
    e.propagationImmediateStopped = true;
    this._isTouching = true;
  }

  private handleTouchEnd(e): void {
    console.log(e);
    this._isTouching = false;
    this._touchTime = 0;
    if (this._isMoving) {
      const { x, y } = e.getUILocation();
      jigsawEventTarget.emit(jigsawEventTarget.PIECE_DROP, { cx: x, cy: y, piece: this });
    }
    this._isMoving = false;
  }

  private handleTouchCancel(): void {
    this._isTouching = false;
    this._touchTime = 0;
    this._isMoving = false;
  }

  private handleTouchMove(e: EventTouch): void {
    e.propagationStopped = true;
    if (this._isMoving) {
      const { x, y } = e.getUILocation();
      this.node.setWorldPosition(v3(e.getUILocation().x, e.getUILocation().y, 0));
      jigsawEventTarget.emit(jigsawEventTarget.PIECE_HINT, { cx: x, cy: y, piece: this });
    }
  }

  private changeContainer(): void {
    if (this.node.parent.name === 'content') {
      this.node.scale.multiplyScalar(720 / JigsawStore.Instance.DIM / 155 / 0.8);
    }
    const worldPos = this.node.getWorldPosition().clone();
    this.node.setParent(this._movingSpace);
    this.node.setWorldPosition(worldPos);
  }

  update(dt: number) {
    if (this._isTouching && this._touchTime < LONG_TOUCH_DURATION) {
      this._touchTime += dt;
      if (this._touchTime >= LONG_TOUCH_DURATION) {
        this._isMoving = true;
        if (this.state === JigsawPieceState.IN_BOARD) {
          jigsawEventTarget.emit(jigsawEventTarget.PIECE_PICK, { index: this.index, piece: this });
        }
        this.changeContainer();
      }
    }
  }

  removeEvents(): void {
    this.node.off(Node.EventType.TOUCH_START, this.handleTouchStart, this);
    this.node.off(Node.EventType.TOUCH_END, this.handleTouchEnd, this);
    this.node.off(Node.EventType.TOUCH_MOVE, this.handleTouchMove, this);
    this.node.off(Node.EventType.TOUCH_CANCEL, this.handleTouchCancel, this);
    jigsawEventTarget.off(jigsawEventTarget.COMPLETED);
  }

  protected onDestroy(): void {
    this.removeEvents();
  }
}
