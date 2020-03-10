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

    // notify about unnecessary arguments
    if (arguments.length > 2) console.warn('setState should contain no more than 2 arguments');

    // storage of changed properties
    this.changes = objectReflection(this.getState(), properties);

    // check and correct types of changes properties
    this.validateChanges();

    // Delete duplicated values from changes properties
    this.deleteDuplicates();

    // temporary storage contained old state and current changes
    this.temporaryState = { ...this.getState(), ...this.changes } as State;

    // handle gotten properties
    Object.keys(this.changes).forEach((key) => this.handleProperty(key));

    // notify subscribers about state changes
    Object.keys(this.changes).length && notify && this.notify(this.changes);

    // set as state
    this.state = this.temporaryState;

    // this is no longer necessary
    delete this.temporaryState;
    delete this.changes;
  }

  public getState(): State {
    return this.state;
  }

  public reset(): void {
    this.setState(defaultState);
  }

  private handleMin(): void {
    let { min } = this.temporaryState;
    const { max, step, value } = this.temporaryState;
    const isGreaterThanValue = min > value;
    const gap = max - min;

    min >= max && (min = max - 1);
    min = softRounding(min);

    this.changes.min = min;
    this.temporaryState.min = min;

    // update related properties
    const isStepUpdated = isDefined(this.changes.step);
    !isStepUpdated && (step > gap) && this.handleStep();

    const isValueUpdated = isDefined(this.changes.value);
    !isValueUpdated && isGreaterThanValue && this.handleValue();
  }

  private handleMax(): void {
    let { max } = this.temporaryState;
    const { min, step, value } = this.temporaryState;
    const isLessThanValue = max < value;
    const gap = max - min;

    max <= min && (max = min + 1);
    max = softRounding(max);

    this.changes.max = max;
    this.temporaryState.max = max;

    // update related properties
    const isStepUpdated = isDefined(this.changes.step);
    !isStepUpdated && (step > gap) && this.handleStep();

    const isValueUpdated = isDefined(this.changes.value);
    !isValueUpdated && isLessThanValue && this.handleValue();
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
    const isValueUpdated = isDefined(this.changes.value);
    !isValueUpdated && this.handleValue();
  }

  private handleValue(): void {
    let { value } = this.temporaryState;
    const { min, max, step } = this.temporaryState;
    const remainder = (value - min) % step;

    if (remainder !== 0) {
      const halfStep = step / 2;
      value = (halfStep > remainder)
        ? value - remainder // below point
        : value - remainder + step; // above point
    }

    value < min && (value = min);
    value > max && (value = max);
    value = softRounding(value);

    this.changes.value = value;
    this.temporaryState.value = value;
  }

  private validateChanges(): void {
    Object.keys(this.changes).forEach((prop) => {
      const value = this.changes[prop as keyof State];

      switch (prop) {
        case 'value':
        case 'step':
        case 'min':
        case 'max':
          if (!isNumber(value)) throw new TypeError(`${prop} is not number`);
          if (!Number.isFinite(value as number)) throw new Error(`${prop} is Infinity`);
          this.changes[prop] = Number(value);
          break;

        case 'tip':
        case 'bar':
          if (!isBoolean(value)) throw new TypeError(`${prop} is not a boolean`); break;

        default: throw new Error(`${prop} is non existed property`);
      }
    });
  }

  private handleProperty(property: string): void {
    switch (property) {
      case 'value': this.handleValue(); break;
      case 'min': this.handleMin(); break;
      case 'max': this.handleMax(); break;
      case 'step': this.handleStep(); break;
      default: break;
    }
  }

  private deleteDuplicates(): void {
    Object.keys(this.changes).forEach((key) => {
      const value = this.changes[key as keyof State];
      this.getState()[key as keyof State] === value && delete this.changes[key as keyof State];
    });
  }
}

export default Model;
