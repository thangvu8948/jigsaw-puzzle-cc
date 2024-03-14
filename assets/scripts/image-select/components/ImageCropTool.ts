import {
  _decorator,
  Component,
  EventTouch,
  Graphics,
  Node,
  Rect,
  Sprite,
  UITransform,
  Vec3,
} from "cc";

const { ccclass, property } = _decorator;

@ccclass("ImageCropTool")
export default class ImageCropTool extends Component {
  @property(Sprite) sourceSprite: Sprite = null;
  @property(Sprite) destSprite: Sprite = null;
  @property(Graphics) graphic: Graphics = null;
  @property([Node]) anchors: Node[] = [];

  private draggingAnchor: Node = null;
  private lastAnchorPositions: Vec3[];

  onLoad(): void {
    this.initEvents();
    this.lastAnchorPositions = this.anchors.map((x) => x.position.clone());
    this.drawRect();
    this.crop();
  }

  private initEvents(): void {
    this.anchors.forEach((anchor, i) => {
      anchor.on(
        Node.EventType.TOUCH_START,
        (e) => {
          this.handleDragStart(e, i);
        },
        this
      );

      anchor.on(
        Node.EventType.TOUCH_MOVE,
        (e) => {
          this.handleDragMove(e, i);
        },
        this
      );
    });
  }

  private handleDragStart(event: EventTouch, index): void {
    console.log("i", index);
    this.draggingAnchor = this.anchors[index];
  }

  private handleDragEnd(event: EventTouch): void {}

  private handleDragMove(event: EventTouch, index: number): void {
    if (this.anchors[index]) {
      console.log("i", index);
      // const { x, y } = event.getUILocation();
      // this.anchors[index].worldPosition = v3(x, y, 0);
      const { x, y } = event.getDelta();
      this.resizeSquare(index, x);
      this.drawRect();
      this.crop();
    }
  }

  resizeSquare(index: number, deltaX: number): void {
    this.anchors[1].position = this.anchors[1].position.add3f(deltaX, 0, 0);

    this.anchors[2].position = this.anchors[2].position.add3f(
      deltaX,
      -deltaX,
      0
    );
    this.anchors[3].position = this.anchors[3].position.add3f(0, -deltaX, 0);
  }

  drawRect(): void {
    const { x: x0, y: y0 } = this.anchors[0].getPosition();
    const { x: x1, y: y1 } = this.anchors[1].getPosition();
    const { x: x2, y: y2 } = this.anchors[2].getPosition();
    const { x: x3, y: y3 } = this.anchors[3].getPosition();

    this.graphic.lineWidth = 10;
    // this.graphic.fillColor.fromHEX("#ff0000");
    this.graphic.clear();
    this.graphic.fillColor.set(0, 0, 0, 60);
    this.graphic.moveTo(x0, y0);
    this.graphic.lineTo(x1, y1);
    this.graphic.lineTo(x2, y2);
    this.graphic.lineTo(x3, y3);
    this.graphic.close();
    // this.graphic.stroke();
    this.graphic.fill();
  }

  private crop(): void {
    const { width, height } =
      this.sourceSprite.getComponent(UITransform).contentSize;
    const scale = this.sourceSprite.node.getScale();
    const { x: x0, y: y0 } = this.anchors[0].getPosition();
    const { x: x1, y: y1 } = this.anchors[1].getPosition();
    const { x: x2, y: y2 } = this.anchors[2].getPosition();
    const { x: x3, y: y3 } = this.anchors[3].getPosition();
    const sf = this.sourceSprite.spriteFrame.clone();
    sf.rect = new Rect(300, 300, x1 - x0, x1 - x0);
    // sf.trimmedBorder.x = x0;
    // sf.trimmedBorder.y = y0;
    // sf.trimmedBorder.w = x1 - x0;
    // sf.trimmedBorder.z = y2 - y0;
    this.destSprite.spriteFrame = sf;
  }

  updateCrop() {}
}
