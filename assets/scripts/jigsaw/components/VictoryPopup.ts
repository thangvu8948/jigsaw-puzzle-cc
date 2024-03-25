import BasePopup from '@app/libs/component/BasePopup';
import { DateFormat, DateFormatter } from '@app/libs/utils/date-formatter';
import { Label, _decorator } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('VictoryPopup')
export default class VictoryPopup extends BasePopup {
  @property(Label) completeTimeLabel: Label = null;

  public setData(data: any): void {
    const { time } = data;
    this.completeTimeLabel.string = DateFormatter.formatSeconds(time, DateFormat.MM_SS);
  }
}
