import BaseComponent from '@app/libs/component/BaseComponent';
import { Button, Node, _decorator } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('JigsawHome')
export default class JigsawHome extends BaseComponent {
  @property(Button) levelModeButton: Button = null;
  @property(Node) selectLevelPopupNode: Node = null;

  protected onLoad(): void {
    this.addButtonEvent(this.levelModeButton, this.onSelectLevelMode, this);
  }

  private onSelectLevelMode(): void {
    // PopupEventTarget.Instance.emit(PopupEventTarget.EventType.OPEN_STATIC_POPUP, this.selectLevelPopupNode, this);
  }
}
