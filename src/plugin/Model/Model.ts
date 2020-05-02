import { boundMethod } from 'autobind-decorator';

import Observable from '../Observable/Observable';
import {
  isObject, isBoolean, isNumber,
  isDefined, softRounding, objectReflection,
} from '../helpers/helpers';
import defaultState from './default-state';
import { IState, IPState } from './Interfaces';

class Model extends Observable {
  private state: IState = defaultState;

  private temporaryState: IState;

  private changes: IPState;

  constructor(options: IPState = {}) {
    super();
    Object.keys(options).length && this.setState(options, false);
  }

  @boundMethod
  public setState(properties: IPState, notify = true): void {
    // no arguments
    if (!arguments.length) throw new Error('setState has not arguments');

    // wrong type of the first argument
    if (!isObject(properties)) throw new TypeError('The first setState argument is not an object');

    // no properties for change
    if (!Object.keys(properties).length) throw new Error('seState got an empty object');

    // wrong the second argument
    if (!isBoolean(notify)) throw new TypeError('The second setState argument is not a boolean');

    // storage of changed properties
    this.changes = objectReflection(this.getState(), properties);

    // check and correct types of changes properties
    this.validateChanges();

    // temporary storage contained old state and current changes
    this.temporaryState = { ...this.getState(), ...this.changes } as IState;

    // handle gotten properties
    Object.keys(this.changes).forEach((key) => this.handleProperty(key));

    // correct from and to values
    this.correctFromTo();

    // set as state
    this.state = this.temporaryState;

    // notify subscribers about state changes
    Object.keys(this.changes).length && notify && this.notify(this.changes);

    // this is no longer necessary
    delete this.temporaryState;
    delete this.changes;
  }

  public getState(): IState {
    return this.state;
  }

  private handleMin(): void {
    let { min } = this.temporaryState;
    const { max, step } = this.temporaryState;
    const gap = max - min;

    min >= max && (min = max - 1);
    min = softRounding(min);

    this.changes.min = min;
    this.temporaryState.min = min;

    // update related properties
    !isDefined(this.changes.step) && (step > gap) && this.handleStep();
    !isDefined(this.changes.from) && this.handleFrom();
    !isDefined(this.changes.to) && this.handleTo();
  }

  private handleMax(): void {
    let { max } = this.temporaryState;
    const { min, step } = this.temporaryState;
    const gap = max - min;

    max <= min && (max = min + 1);
    max = softRounding(max);

    this.changes.max = max;
    this.temporaryState.max = max;

    // update related properties
    !isDefined(this.changes.step) && (step > gap) && this.handleStep();
    !isDefined(this.changes.from) && this.handleFrom();
    !isDefined(this.changes.to) && this.handleTo();
  }

  private handleStep(): void {
    let { step } = this.temporaryState;
    const { min, max } = this.temporaryState;
    const gap = max - min;

    step <= 0 && (step = 0.5);
    step > gap && (step = gap);
    step = softRounding(step);

    this.changes.step = step;
    this.temporaryState.step = step;

    // update related property
    !isDefined(this.changes.from) && this.handleFrom();
    !isDefined(this.changes.to) && this.handleTo();
  }

  private handleValue(param: number): number {
    let value = param;
    let { step } = this.temporaryState;
    const { min, max } = this.temporaryState;
    const remainder = (value - min) % step;

    if (remainder !== 0) {
      const lowerStepBound = value - remainder;
      const upperStepBound = lowerStepBound + step;

      upperStepBound > max && (step = max - lowerStepBound);
      value = (step / 2 > remainder) ? lowerStepBound : upperStepBound;
    }

    value < min && (value = min);
    value > max && (value = max);
    return softRounding(value);
  }

  private handleFrom(): void {
    const from = this.handleValue(this.temporaryState.from);

    this.changes.from = from;
    this.temporaryState.from = from;
  }

  private handleTo(): void {
    if (!this.temporaryState.range || !this.temporaryState.to) return;
    const to = this.handleValue(this.temporaryState.to as number);

    this.changes.to = to;
    this.temporaryState.to = to;
  }

  private validateChanges(): void {
    Object.keys(this.changes).forEach((prop) => {
      const value = this.changes[prop as keyof IState];

      switch (prop) {
        case 'from':
        case 'to':
        case 'step':
        case 'min':
        case 'max':
          if (!isNumber(value)) throw new TypeError(`${prop} is not number`);
          if (!Number.isFinite(Number(value))) throw new Error(`${prop} is Infinity`);
          this.changes[prop] = Number(value);
          break;

        case 'tip':
        case 'bar':
        case 'range':
        case 'vertical':
          if (!isBoolean(value)) throw new TypeError(`${prop} is not a boolean`);
          break;

        default: throw new Error(`${prop} is non existed property`);
      }
    });
  }

  private handleProperty(property: string): void {
    switch (property) {
      case 'from': this.handleFrom(); break;
      case 'to': this.handleTo(); break;
      case 'min': this.handleMin(); break;
      case 'max': this.handleMax(); break;
      case 'step': this.handleStep(); break;
      default: break;
    }
  }

  correctFromTo(): void {
    let { from, to } = this.temporaryState;
    const isFromLessThanTo = from < (to as number);

    if (!this.temporaryState.range || isFromLessThanTo) return;

    const { min, max, step } = this.temporaryState;
    const isFromUpdated = isDefined(this.changes.from);
    const isSecondUpdated = isDefined(this.changes.to);
    const isOnlyFromUpdated = isFromUpdated && !isSecondUpdated;
    const isOnlyToUpdated = isSecondUpdated && !isFromUpdated;

    if (isDefined(to) && isOnlyFromUpdated) {
      const reminder = ((to as number) - min) % step;
      from = reminder === 0 ? (to as number) - step : (to as number) - reminder;
    }

    if (isDefined(to) && isOnlyToUpdated) {
      to = (from + step < max) ? from + step : max;
    }

    const shouldInitializeTo = !isDefined(to) || from >= (to as number);
    if (shouldInitializeTo) {
      this.initializeTo();
      return;
    }

    [this.changes.from, this.changes.to] = [from, to];
    this.temporaryState = { ...this.temporaryState, ...this.changes };
  }

  private initializeTo(): void {
    let { from, to } = this.temporaryState;
    const { min, max, step } = this.temporaryState;

    const distanceToMin = from - min;
    const distanceToMax = max - from;

    if (distanceToMin > distanceToMax) {
      const reminder = (from - min) % step;
      to = from;
      from = reminder === 0
        ? from - step
        : from - reminder;
    } else to = from + step;

    [this.changes.from, this.changes.to] = [from, to];
    this.temporaryState = { ...this.temporaryState, ...this.changes };
  }
}

export default Model;
