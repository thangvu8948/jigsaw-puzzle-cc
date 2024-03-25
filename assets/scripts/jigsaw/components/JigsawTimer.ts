import BaseComponent from '@app/libs/component/BaseComponent';
import UITimer, { TimerType } from '@app/libs/component/UITimer';
import { DateFormat, DateFormatter } from '@app/libs/utils/date-formatter';
import { Label, _decorator } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('JigsawTimer')
export default class JigsawTimer extends BaseComponent {
  @property(UITimer) timer: UITimer = null;
  @property(Label) timerLabel: Label = null;
  protected onLoad(): void {
    this.startTimer();
  }

  startTimer(): void {
    this.timer.init(TimerType.Inc, 0);
    this.timer.setTickCallback((current) => {
      this.timerLabel.string = DateFormatter.formatSeconds(current, DateFormat.MM_SS);
    });
    this.timer.run();
  }

  stopTimer(): number {
    const time = this.timer.setEnded();
    return time;
  }
}
