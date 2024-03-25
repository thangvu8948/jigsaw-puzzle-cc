import BaseComponent from '@app/libs/component/BaseComponent';
import { _decorator } from 'cc';

const { ccclass, property } = _decorator;

export enum TimerType {
  Inc = 1,
  Dec = -1
}

@ccclass('UITimer')
export default class UITimer extends BaseComponent {
  private _timerType: TimerType;
  private _current = 0;
  private _isRunning = false;
  private _isEnded = false;
  private _tickCb: (current: number) => void;
  private _endCb: () => void;

  get isRunning(): boolean {
    return this._isRunning;
  }

  get isEnded(): boolean {
    return this._timerType === TimerType.Dec ? this._current <= 0 : this._isEnded;
  }

  get current(): number {
    return Math.ceil(this._current);
  }

  init(type: TimerType, initialValue: number) {
    this._timerType = type;
    this._current = initialValue;
  }

  setTickCallback(cb: (current: number) => void): void {
    this._tickCb = cb;
  }

  setCompleteCallback(cb: () => void): void {
    this._tickCb = cb;
  }

  setEnded(): number {
    const value = this.current;
    this._isEnded = true;
    this._endCb?.();
    return this.current;
  }

  run(): void {
    this._isRunning = true;
  }

  pause(): void {
    this._isRunning = false;
  }

  stop(): void {
    this._current = 0;
    this._isRunning = false;
  }

  update(dt: number): void {
    if (this._isRunning) {
      this.updateCurrentValue(dt);
    }
  }

  private onEnded(): void {
    this._isEnded = true;
    this._endCb?.();
    this.stop();
  }

  updateCurrentValue(dt): void {
    const newValue = this._current + dt * this._timerType;
    if (Math.ceil(newValue) !== this.current) {
      this._tickCb?.(Math.ceil(newValue));
      this.isEnded && this.onEnded();
    }
    this._current = newValue;
  }
}
