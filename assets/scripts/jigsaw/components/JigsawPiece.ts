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
  Widget,
} from "cc";

import { DEBUG } from "../constants/jigsaw.configs";
import {
  JIGSAW_PIECE_CONFIGS,
  JigsawPieceType,
} from "../constants/jigsaw.constants";

const { ccclass, property, executeInEditMode } = _decorator;

export type TJigsawPieceData = {
  xAxis: { start: number; end: number };
  yAxis: { start: number; end: number };
  type: JigsawPieceType;
  maskTexture: Texture2D;
  angle: number;
};
const LONG_TOUCH_DURATION = 0.15;
@ccclass("JigsawPiece")
@executeInEditMode(true)
export class JigsawPiece extends Component {
  @property(Sprite) resultSprite: Sprite = null;
  @property(CCInteger) xIdx: number = 0;
  @property(CCFloat) yIdx: number = 0;

  private _mat: Material = null;
  private _widget: Widget = null;
  private _maskTexture: Texture2D = null;
  private _data: TJigsawPieceData = null;
  private _isTouching = false;
  private _isMoving = false;
  private _touchTime = 0;
  private _movingSpace: Node = null;

  onLoad(): void {
    this._movingSpace = find("Canvas/piece-moving-space");
    this.node.on(Node.EventType.TOUCH_START, this.handleTouchStart, this);
    this.node.on(Node.EventType.TOUCH_END, this.handleTouchEnd, this);
    this.node.on(Node.EventType.TOUCH_MOVE, this.handleTouchMove, this);
  }

  init(data: TJigsawPieceData): void {
    if (data.type === "") {
      this.resultSprite.node.active = false;
      return;
    }
    this._data = data;
    this._maskTexture = data.maskTexture;
    const material = this.resultSprite.getMaterialInstance(0);
    this._mat = material;
    this._widget = this.resultSprite.getComponent(Widget);
    this.render(data.type);

    this.node.getChildByName("label").active = DEBUG;
    if (DEBUG) {
      this.node.getChildByName("label").getComponent(Label).string = data.type;
    }
  }

  render(pieceType: JigsawPieceType): void {
    const [key, index, pos] = pieceType.split("-");
    this.renderCommon(pieceType);
    // this.renderByKeyFnMap[key](index, pos);
  }

  renderCommon(pieceType: JigsawPieceType): void {
    const { xAxis, yAxis, angle = 0 } = this._data;
    this._mat.setProperty("startX", xAxis.start);
    this._mat.setProperty("endX", xAxis.end);
    this._mat.setProperty("startY", yAxis.start);
    this._mat.setProperty("endY", yAxis.end);
    this._mat.setProperty("rotation", angle);
    this._mat.setProperty("maskTexture", this._maskTexture);

    const isRotote90 = angle === 90 || angle === -90;
    const spriteWidth = isRotote90
      ? this._maskTexture.height
      : this._maskTexture.width;
    const spriteHeight = isRotote90
      ? this._maskTexture.width
      : this._maskTexture.height;

    this.resultSprite
      .getComponent(UITransform)
      .setContentSize(spriteWidth, spriteHeight);
    this.node.getComponent(UITransform).width = spriteWidth;

    const config = JIGSAW_PIECE_CONFIGS[pieceType];
    const widgetConfig = config.widgets;
    this._mat.setProperty("scale", v2(config.scale.x, config.scale.y));
    this.setWidget(widgetConfig.top, "top", "isAlignTop");
    this.setWidget(widgetConfig.bottom, "bottom", "isAlignBottom");
    this.setWidget(widgetConfig.left, "left", "isAlignLeft");
    this.setWidget(widgetConfig.right, "right", "isAlignRight");
  }

  setWidget(flag: boolean, keyValueComponent = "", keyFlagComponent = "") {
    this._widget[keyFlagComponent] = flag;
    if (flag) {
      this._widget[keyValueComponent] = 0;
    }
  }

  private handleTouchStart(e: EventTouch): void {
    this._isTouching = true;
  }

  private handleTouchEnd(): void {
    this._isTouching = false;
    this._touchTime = 0;
    this._isMoving = false;
  }

  private handleTouchMove(e: EventTouch): void {
    if (this._isMoving) {
      console.log("pos", e.getUILocation().x, e.getUILocation().y);
      this.node.setWorldPosition(
        v3(e.getUILocation().x, e.getUILocation().y, 0)
      );
    }
  }

  private changeContainer(): void {
    if (this.node.parent.name !== "content") {
      return;
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
        this.changeContainer();
      }
    }
  }

  protected onDestroy(): void {
    this._data = null;
  }
}
