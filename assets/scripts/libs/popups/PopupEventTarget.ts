import { EventTarget } from 'cc';

export class PopupEventTarget extends EventTarget {
  static NAME = 'PopupEvent';
  public static EventType = {
    OPEN_STATIC_POPUP: `${this.NAME}_OpenStaticPopup`
  };

  private static _instance: PopupEventTarget = null;

  public static get Instance(): PopupEventTarget {
    if (!this._instance) {
      this._instance = new PopupEventTarget();
    }
    return this._instance;
  }
}
