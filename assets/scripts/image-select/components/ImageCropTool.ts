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
        this,
      );

      anchor.on(
        Node.EventType.TOUCH_MOVE,
        (e) => {
          this.handleDragMove(e, i);
        },
        this,
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
      const { x, y } = event.getDelta();
      const minLen = Math.min(Math.abs(x), Math.abs(y));
      const deltaX = (minLen * (y / Math.abs(x))) || 0;
      const deltaY = (minLen * (y / Math.abs(y))) || 0;

      if (index === 0 || index === 2) {
        if (x * y < 0) {
          this.resizeSquare(index, deltaX, deltaY);
          this.drawRect();
          this.crop();
        }
      } else if (x * y > 0) {
        this.resizeSquare(index, deltaX, deltaY);
        this.drawRect();
        this.crop();
      }
    }
  }

  private isSameXAxis(a: number, b: number): boolean {
    const sameXAxisPairs: Set<string> = new Set(["01", "10", "23", "32"]);
    return sameXAxisPairs.has(`${a}${b}`) || sameXAxisPairs.has(`${b}${a}`);
  }

  private isSameYAxis(a: number, b: number): boolean {
    const sameXAxisPairs: Set<string> = new Set(["03", "30", "12", "21"]);
    return sameXAxisPairs.has(`${a}${b}`) || sameXAxisPairs.has(`${b}${a}`);
  }

  resizeSquare(index: number, deltaX: number, deltaY: number): void {
    console.log("dx", deltaX, "dy", deltaY);
    const fixedIndex = (index + 2) % 4;
    const ps: Vec3[] = [];
    for (let i = 0; i < 4; i++) {
      if (i === fixedIndex) {
        ps[i] = this.anchors[i].position;
      } else if (i === index) {
        ps[i] = this.anchors[i].position.add3f(deltaX, deltaY, 0);
      } else if (this.isSameXAxis(i, index)) {
        ps[i] = this.anchors[i].position.add3f(0, deltaY, 0);
      } else if (this.isSameYAxis(i, index)) {
        ps[i] = this.anchors[i].position.add3f(deltaX, 0, 0);
      }
    }
    if (this.checkValid(ps)) {
      this.anchors.forEach((anchor, i) => {
        anchor.position = ps[i];
      });
    }
  }

  checkValid(ps: Vec3[]): boolean {
    const { width, height } =
      this.sourceSprite.getComponent(UITransform).contentSize;

    for (let p of ps) {
      const { x, y } = p;
      if (x < -width / 2 || x > width / 2) return false;
      if (x < -height / 2 || y > height / 2) return false;
    }
    return true;
  }

  drawRect(): void {
    const { x: x0, y: y0 } = this.anchors[0].getPosition();
    const { x: x1, y: y1 } = this.anchors[1].getPosition();
    const { x: x2, y: y2 } = this.anchors[2].getPosition();
    const { x: x3, y: y3 } = this.anchors[3].getPosition();

    this.graphic.lineWidth = 10;
    this.graphic.clear();
    this.graphic.fillColor.set(0, 0, 0, 60);
    this.graphic.moveTo(x0, y0);
    this.graphic.lineTo(x1, y1);
    this.graphic.lineTo(x2, y2);
    this.graphic.lineTo(x3, y3);
    this.graphic.close();
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
    sf.rect = new Rect(width / 2 + x0, height / 2 - y0, x1 - x0, x1 - x0);
    this.destSprite.spriteFrame = sf;
  }

  updateCrop() {}
}
