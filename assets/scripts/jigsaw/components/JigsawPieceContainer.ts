import { Component, Mat4, Node, Rect, ScrollView, UIOpacity, Vec3, _decorator, mat4, v3 } from 'cc';
import { IN_QUEUE_SCALE_FACTOR } from '../constants/jigsaw.constants';
import { JigsawPiece } from './JigsawPiece';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('JigsawPieceContainer')
@requireComponent(ScrollView)
export default class JigsawPieceContainer extends Component {
  public scrollView: ScrollView = null;
  private _viewBoundingBox: Rect = new Rect();
  private _viewLocalMat: Mat4 = mat4();
  private _contentPos: Vec3 = v3();

  protected onLoad(): void {
    this.scrollView = this.getComponent(ScrollView);
    const view = this.scrollView.view;
    // this.scrollView.node.on(ScrollView.EventType.SCROLLING, this.updateView, this);
    // this.scrollView.content.on(Node.EventType.CHILD_ADDED, this.updateView, this);
    // this.scrollView.content.on(Node.EventType.CHILD_REMOVED, this.updateView, this);

    this._updateLocalViewMat();
    this.node.on(Node.EventType.TRANSFORM_CHANGED, () => {
      this._updateLocalViewMat();
    });

    this._viewBoundingBox = view.getBoundingBox().transformMat4(this._viewLocalMat);
  }

  private _updateLocalViewMat() {
    Mat4.invert(this._viewLocalMat, this.scrollView.node.worldMatrix);
  }

  getPositionInView(item: Node): Vec3 {
    const viewPos = Vec3.ZERO;
    Vec3.transformMat4(viewPos, item.worldPosition, this._viewLocalMat);
    return viewPos;
  }

  protected update(dt: number): void {
    this.scrollView.content.getPosition(this._contentPos);
    for (let i = 0; i < this.scrollView.content.children.length; i++) {
      const child = this.scrollView.content.children[i];
      const p = this._contentPos.clone().add(child.position);
      if (
        p.x >= -this.scrollView.view.width / 2 - 155 * IN_QUEUE_SCALE_FACTOR &&
        p.x <= this.scrollView.view.width / 2 + 155 * IN_QUEUE_SCALE_FACTOR
      ) {
        child.getComponent(UIOpacity).opacity = child.getComponent(JigsawPiece).isFake ? 0 : 255;
      } else {
        child.getComponent(UIOpacity).opacity = 0;
      }
    }
  }
}
