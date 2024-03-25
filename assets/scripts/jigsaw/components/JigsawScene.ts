import JigsawTimer from '@app/jigsaw/components/JigsawTimer';
import jigsawEventTarget from '@app/jigsaw/event/JigsawEventTarget';
import BaseComponent from '@app/libs/component/BaseComponent';
import { PopupEventTarget } from '@app/libs/popups/PopupEventTarget';
import { Node, _decorator, director } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('JigsawScene')
export default class JigsawScene extends BaseComponent {
  @property(JigsawTimer) timer: JigsawTimer = null;
  @property(Node) victoryPopup: Node = null;
  protected onLoad(): void {
    jigsawEventTarget.on(jigsawEventTarget.COMPLETED, this.onGameCompleted, this);
  }

  private onGameCompleted(): void {
    const time = this.timer.stopTimer();
    PopupEventTarget.Instance.emit(PopupEventTarget.EventType.OPEN_STATIC_POPUP, this.victoryPopup, { time }, (data) => {
      console.log('data');
      director.loadScene('ImageSelection');
    });
  }

  protected onDestroy(): void {
    jigsawEventTarget.off(jigsawEventTarget.COMPLETED, this.onGameCompleted, this);
  }
}
