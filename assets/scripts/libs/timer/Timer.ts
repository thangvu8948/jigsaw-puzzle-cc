import BaseComponent from '../component/BaseComponent';

export enum TimerType {
  Inc = 1,
  Dec = -1
}
export default class Timer {
  private static timers: Timer[] = [];

  private readonly id: string = '';
  private readonly type: TimerType = TimerType.Dec;
  public current: number = 0;

  public static createTimer(id: string, type: TimerType): Timer {
    const timer = new Timer(id, type);
    return timer;
  }

  public static getTimer(id: string): Timer {
    return this.timers.find((x) => x.id === id);
  }

  constructor(id: string, type: TimerType) {
    this.id = id;
    this.type = type;
  }

  attach(component: BaseComponent) {
    component.schedule(this.callback);
  }

  private callback(): void {
    this.current += this.type;
  }
}
