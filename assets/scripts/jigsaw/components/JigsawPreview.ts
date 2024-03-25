import BaseComponent from '@app/libs/component/BaseComponent';
import { Node, Sprite, _decorator } from 'cc';
import JigsawStore from '../stores/game.store';

const { ccclass, property } = _decorator;

@ccclass('JigsawPreview')
export default class JigsawPreview extends BaseComponent {
  @property(Sprite) previewThumbImage: Sprite = null;
  @property(Sprite) previewLargeImage: Sprite = null;

  protected onLoad(): void {
    this.previewThumbImage.node.on(Node.EventType.TOUCH_START, this.showPreview, this);
    this.previewThumbImage.node.on(Node.EventType.TOUCH_END, this.hidePreview, this);
  }

  protected start(): void {
    this.previewThumbImage.spriteFrame = JigsawStore.Instance.targetImage;
    this.previewLargeImage.spriteFrame = JigsawStore.Instance.targetImage;
  }

  private showPreview(): void {
    this.previewLargeImage.node.parent.active = true;
  }
  private hidePreview(): void {
    this.previewLargeImage.node.parent.active = false;
  }

  protected onDestroy(): void {
    this.previewThumbImage.node.off(Node.EventType.TOUCH_START);
    this.previewThumbImage.node.off(Node.EventType.TOUCH_END);
  }
}
