import { PopupActionType } from '@app/libs/popups/PopupActionType';
import { BlockInputEvents, Button, Node, UIOpacity, _decorator, easing, tween, v3 } from 'cc';
import BaseComponent from './BaseComponent';

const { ccclass, property, requireComponent } = _decorator;

export type PopupCallbackParams = {
  action: string;
  data?: any;
};

@ccclass('BasePopup')
@requireComponent(BlockInputEvents)
export default class BasePopup extends BaseComponent {
  @property(Button) closeButton: Button = null;
  @property(Node) container: Node = null;
  @property(UIOpacity) dimOpa: UIOpacity = null;

  private _callback: (params: PopupCallbackParams) => void;

  protected onLoad(): void {
    this.addEvents();
  }

  private addEvents(): void {
    this.closeButton && this.addButtonEvent(this.closeButton, this.hide, this);
  }

  public init(callback): void {
    this._callback = callback;
  }

  public setData(data): void {}

  public show(): Promise<any> {
    this.node.active = true;
    return new Promise((res, rej) => {
      tween(this.container)
        .set({ scale: v3(0, 0, 1), active: true })
        .to(0.1, { scale: v3(1.1, 1.1, 1) })
        .to(0.1, { scale: v3(1, 1, 1) }, { easing: easing.sineOut })
        .call(() => {
          this.onShowCompleted();
          res(true);
        })
        .start();

      tween(this.container.getComponent(UIOpacity)).set({ opacity: 0 }).to(0.2, { opacity: 255 }).start();
    });
  }

  protected onShowCompleted(): void {}

  public hide(): Promise<any> {
    return new Promise((res) => {
      tween(this.container)
        .to(0.1, { scale: v3(1.1, 1.1, 1) })
        .to(0.1, { scale: v3(0, 0, 1) })
        .call(() => {
          this.node.active = false;
          res(true);
        })
        .start();

      tween(this.dimOpa).to(0.2, { opacity: 0 }).start();

      tween(this.container.getComponent(UIOpacity))
        .to(0.2, { opacity: 0 })
        .delay(0.1)
        .call(() => {
          this.onClosed();
          this.node.destroy();
        })
        .start();
    });
  }

  onClosed(): void {
    this._callback?.({ action: PopupActionType.CLOSE });
  }
}
