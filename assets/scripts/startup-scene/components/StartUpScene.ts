import BaseComponent from '@app/libs/component/BaseComponent';
import PopupDisplay from '@app/libs/popups/PopupDisplay';
import { _decorator, director } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('StartUpScene')
export default class StartUpScene extends BaseComponent {
  @property(PopupDisplay) popupDisplay: PopupDisplay = null;

  protected onLoad(): void {
    director.addPersistRootNode(this.popupDisplay.node);
  }

  protected start(): void {
    director.loadScene('ImageSelection', (err, scene) => {});
  }
}
