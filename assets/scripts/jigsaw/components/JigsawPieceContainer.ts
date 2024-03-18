import { Component, Rect, ScrollView, _decorator, Node, UITransform, UIOpacity } from 'cc';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('JigsawPieceContainer')
@requireComponent(ScrollView)
export default class JigsawPieceContainer extends Component {
  private _scrollView: ScrollView = null;
  private _viewBoundingBox: Rect = new Rect();

  protected onLoad(): void {
    this._scrollView = this.getComponent(ScrollView);
    this._viewBoundingBox = this._scrollView.view.getBoundingBoxToWorld();
    console.log('_viewBoundingBox', this._viewBoundingBox);
    this._scrollView.node.on(ScrollView.EventType.SCROLLING, this.updateView, this);
    this._scrollView.content.on(Node.EventType.CHILD_ADDED, this.updateView, this);
    this._scrollView.content.on(Node.EventType.CHILD_REMOVED, this.updateView, this);
  }

  private updateView(): void {
    this._scrollView.content.children.forEach((child, i) => {
      const rect = child.getComponent(UITransform).getBoundingBoxToWorld();
      const isIntersected = this._viewBoundingBox.intersects(rect);
      console.log('rect', i, rect, isIntersected);
      if (this._viewBoundingBox.intersects(rect)) {
        child.getComponent(UIOpacity).opacity = 255;
        // console.log('visible: ', i);
      } else {
        child.getComponent(UIOpacity).opacity = 0;
        // console.log('non-visible: ', i);
      }
    });
  }

  protected update(dt: number): void {}
}
