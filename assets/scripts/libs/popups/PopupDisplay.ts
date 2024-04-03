import BaseComponent from '@app/libs//component/BaseComponent';
import { Node, _decorator, instantiate, screen, v3 } from 'cc';
import BasePopup from '../component/BasePopup';
import { PopupEventTarget } from './PopupEventTarget';
const { ccclass, property } = _decorator;

@ccclass('PopupDisplay')
export default class PopupDisplay extends BaseComponent {
  protected onLoad(): void {
    PopupEventTarget.Instance.on(PopupEventTarget.EventType.OPEN_STATIC_POPUP, this.openStaticPopup, this);
    this.node.position = v3(screen.windowSize.width / 2, screen.windowSize.height / 2);
  }

  private openStaticPopup(popupNode: Node, data, cb): void {
    if (!popupNode || !popupNode.isValid) {
      return;
    }
    const { createNew = true } = data;
    let popup = popupNode.getComponent(BasePopup);
    if (createNew) {
      const node = instantiate(popupNode);
      node.setParent(this.node);
      popup = node.getComponent(BasePopup);
    }

    popup.init(cb);
    popup.setData(data);
    popup.show();
  }
}
