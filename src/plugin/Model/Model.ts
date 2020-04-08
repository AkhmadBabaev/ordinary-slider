import Observable from '../Observable/Observable';
import defaultState from './defaultState';

import { State, PState } from './Interfaces';

import {
  isObject, isBoolean, isNumber,
  isDefined, softRounding, objectReflection,
} from '../helpers/helpers';

class Model extends Observable {
  private state: State = defaultState;

  private temporaryState: State;

  private changes: PState;

  constructor(options: PState = {}) {
    super();

    this.setState = this.setState.bind(this);
    Object.keys(options).length && this.setState(options, false);
  }

  public setState(properties: PState, notify = true): void {
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
    this.temporaryState = { ...this.getState(), ...this.changes } as State;

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

  public getState(): State {
    return this.state;
  }

  private handleMin(): void {
    let { min } = this.temporaryState;
    const {
      max, step, from, to,
    } = this.temporaryState;

    const isGreaterThanFrom = min > from;
    const isGreaterThanTo = min > (to as number);
    const gap = max - min;

    min >= max && (min = max - 1);
    min = softRounding(min);

    this.changes.min = min;
    this.temporaryState.min = min;

    // update related properties
    const isStepUpdated = isDefined(this.changes.step);
    const isFromUpdated = isDefined(this.changes.from);
    const isToUpdated = isDefined(this.changes.from);

    !isStepUpdated && (step > gap) && this.handleStep();
    !isFromUpdated && isGreaterThanFrom && this.handleFrom();
    !isToUpdated && isGreaterThanTo && this.handleTo();
  }

  private handleMax(): void {
    let { max } = this.temporaryState;
    const {
      min, step, from, to,
    } = this.temporaryState;

    const isLessThanFrom = max < from;
    const isLessThanTo = max < (to as number);
    const gap = max - min;

    max <= min && (max = min + 1);
    max = softRounding(max);

    this.changes.max = max;
    this.temporaryState.max = max;

    // update related properties
    const isStepUpdated = isDefined(this.changes.step);
    const isFromUpdated = isDefined(this.changes.from);
    const isToUpdated = isDefined(this.changes.to);

    !isStepUpdated && (step > gap) && this.handleStep();
    !isFromUpdated && isLessThanFrom && this.handleFrom();
    !isToUpdated && isLessThanTo && this.handleTo();
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
    const isFromUpdated = isDefined(this.changes.from);
    const isToUpdated = isDefined(this.changes.to);

    !isFromUpdated && this.handleFrom();
    !isToUpdated && this.handleTo();
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

      const halfStep = step / 2;
      value = (halfStep > remainder) ? lowerStepBound : upperStepBound;
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
    if (!this.temporaryState.range) return;
    const to = this.handleValue(this.temporaryState.to as number);

    this.changes.to = to;
    this.temporaryState.to = to;
  }

  private validateChanges(): void {
    Object.keys(this.changes).forEach((prop) => {
      const value = this.changes[prop as keyof State];

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
    if (!this.temporaryState.range) return;
    if (this.temporaryState.from < (this.temporaryState.to as number)) return;

    let { from, to } = this.temporaryState;
    const { max, step } = this.temporaryState;

    const isInitializedTo = isDefined(to);
    const isFromUpdated = isDefined(this.changes.from);
    const isSecondUpdated = isDefined(this.changes.to);

    isInitializedTo && isFromUpdated && !isSecondUpdated && (from = (to as number) - step);
    isInitializedTo && isSecondUpdated && !isFromUpdated && (to = from + step);

    if (!isInitializedTo || from === to) {
      this.initializeTo();
      return;
    }

    if (from > (to as number)) {
      from < max && (to = from + step);
      from >= max && (from = max - step) && (to = max);
    }

    [this.changes.from, this.changes.to] = [from, to];
    this.temporaryState = { ...this.temporaryState, ...this.changes };
  }

  private initializeTo(): void {
    const { min, max, step } = this.temporaryState;
    let { from, to } = this.temporaryState;

    const distanceToMin = from - min;
    const distanceToMax = max - from;

    distanceToMin > distanceToMax
      && (to = from)
      && (from -= step);

    distanceToMin <= distanceToMax && (to = from + step);

    [this.changes.from, this.changes.to] = [from, to];
    this.temporaryState = { ...this.temporaryState, ...this.changes };
  }
}

export default Model;
