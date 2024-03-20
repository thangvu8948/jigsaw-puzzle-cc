import { Button, Component, EventTouch, Node, _decorator } from 'cc';

const { ccclass, property } = _decorator;

export default class BaseComponent extends Component {
  protected addButtonEvent(button: Button, callback: (e: EventTouch) => void, target?: any | undefined, useCapture?: boolean) {
    button.node.on(
      Node.EventType.TOUCH_END,
      (e: EventTouch) => {
        if (!button.interactable) {
          return;
        }

        callback.call(target, e);
      },
      target,
      useCapture
    );
  }
}
