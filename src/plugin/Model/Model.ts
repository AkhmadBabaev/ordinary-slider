import Observable from '../Observable/Observable';
import defaultState from './defaultState';

import { State } from './Interfaces';

import {
  isObject, isBoolean, isNumber,
  isDefined, softRounding,
} from '../helpers/helpers';

class Model extends Observable {
  private state: State = defaultState;

  private changedProps: Partial<State>;

  constructor(options: Partial<State> = {}) {
    super();

    this.setState = this.setState.bind(this);
    Object.keys(options).length && this.setState(options, false);
  }

  public setState(properties: Partial<State>, notify = true): void {
    // no arguments
    if (!arguments.length) throw new Error('setState has not arguments');

    // wrong type of the first argument
    if (!isObject(properties)) throw new TypeError('The first setState argument is not an object');

    // no properties for change
    if (!Object.keys(properties).length) throw new Error('seState got an empty object');

    // wrong the second argument
    if (!isBoolean(notify)) throw new TypeError('The second setState argument is not a boolean');

    // notify about unnecessary arguments
    if (arguments.length > 2) {
      console.warn(`
        setState should contain no more than 2 arguments, remove unnecessary arguments
      `);
    }

    // temporary storage for changed properties
    this.changedProps = {};

    // validate properties
    Object.keys(properties).forEach((prop) => {
      this.validateProp(prop, properties[prop as keyof State]);
    });

    // when received more than one property
    if (Object.keys(properties).length > 1) this.validateMultitudeProps();

    // Delete duplicated values from changed props
    Object.keys(this.changedProps).forEach((prop: string) => {
      const value = this.changedProps[prop as keyof State];
      if (this.isDuplicateValue(prop, value as number | boolean)) {
        delete this.changedProps[prop as keyof State];
      }
    });

    // handle properties
    Object.keys(this.changedProps).forEach((prop) => { this.handleProp(prop); });

    // notify subscribers if changedProps has properties
    Object.keys(this.changedProps).length && notify && this.notify(this.changedProps);

    // set state
    this.state = { ...this.getState(), ...this.changedProps };

    // this is no longer necessary
    delete this.changedProps;
  }

  public getState(): State {
    return this.state;
  }

  private handleMin(): void {
    const currentState = { ...this.getState(), ...this.changedProps };

    let { min } = currentState;
    if (!Number.isFinite(min)) throw new Error('Min is Infinity');

    const { max, step, value } = currentState;

    if (min >= max) min = max - step;

    const isGreaterThanValue: boolean = min > value;
    const gap: number = max - min;

    this.changedProps.min = softRounding(min);

    // update related properties
    const hasStep: boolean = isDefined(this.changedProps.step);
    if (!hasStep && step > gap) this.handleStep();

    const hasValue: boolean = isDefined(this.changedProps.value);
    if (!hasValue && isGreaterThanValue) this.handleValue();
  }

  private handleMax(): void {
    const currentState = { ...this.getState(), ...this.changedProps };

    let { max } = currentState;
    if (!Number.isFinite(max)) throw new Error('Max is Infinity');

    const { min, step, value } = currentState;

    if (max <= min) max = min + step;

    const isLessThanValue: boolean = max < value;
    const gap: number = max - min;

    this.changedProps.max = softRounding(max);

    // update related properties
    const hasStep: boolean = isDefined(this.changedProps.step);
    if (!hasStep && step > gap) this.handleStep();

    const hasValue: boolean = isDefined(this.changedProps.value);
    if (!hasValue && isLessThanValue) this.handleValue();
  }

  private handleStep(): void {
    const currentState = { ...this.getState(), ...this.changedProps };

    let { step } = currentState;
    if (!Number.isFinite(step)) throw new Error('Step is Infinity');

    const { min, max } = currentState;

    if (step <= 0) step = 0.5;

    const gap: number = max - min;
    if (step > gap) step = gap;

    this.changedProps.step = softRounding(step);

    // update related properties
    const hasValue: boolean = isDefined(this.changedProps.value);
    if (!hasValue) this.handleValue();
  }

  private handleValue(): void {
    const currentState = { ...this.getState(), ...this.changedProps };

    let { value } = currentState;
    if (!Number.isFinite(value)) throw new Error('Value is Infinity');

    const { min, max, step } = currentState;

    const remainder: number = (value - min) % step;

    if (remainder !== 0) {
      const halfStep: number = step / 2;
      const belowValue: number = value - remainder;
      const aboveValue: number = belowValue + step;

      value = (halfStep > remainder) ? belowValue : aboveValue;
    }

    if (value < min) value = min;
    if (value > max) value = max;

    this.changedProps.value = softRounding(value);
  }

  private validateProp(prop: string, value: unknown): void {
    let option: boolean | number;

    switch (prop) {
      case 'value':
      case 'min':
      case 'max':
      case 'step':
        if (!isNumber(value)) throw new TypeError(`${prop} is not number`);
        option = Number(value); break;

      case 'tip':
      case 'bar':
        if (!isBoolean(value)) throw new TypeError(`${prop} is not a boolean`);
        option = value as boolean; break;

      default: throw new Error(`${prop} is non existed property`);
    }

    this.changedProps = { ...this.changedProps, [prop]: option };
  }

  private validateMultitudeProps(): void {
    const hasMin = isDefined(this.changedProps.min);
    const hasMax = isDefined(this.changedProps.max);
    const hasStep = isDefined(this.changedProps.step);
    const hasValue = isDefined(this.changedProps.value);

    const min = this.changedProps.min as number;
    const max = this.changedProps.max as number;
    const step = this.changedProps.step as number;
    const value = this.changedProps.value as number;

    const hasBoundaries = hasMin && hasMax;
    const gap = hasBoundaries && (max - min);

    const isMinLessThanMax = min < max;
    const isStepGreaterThanGap = step > gap;
    const isStepGreaterThanZero = step > 0;
    const isValueGreaterThanMax = value > max;
    const isValueLessThanMin = value < min;

    if (hasBoundaries && !isMinLessThanMax) {
      throw new Error('Min should be less than max');
    }

    if (hasStep && hasBoundaries && isStepGreaterThanGap) {
      throw new Error('Step shouldn\'t be greater than (max - min)');
    }

    if (hasStep && !isStepGreaterThanZero) {
      throw new Error('Step should be greater than 0');
    }

    if (hasValue && hasMax && isValueGreaterThanMax) {
      throw new Error('Value shouldn\'t be greater than max');
    }

    if (hasValue && hasMin && isValueLessThanMin) {
      throw new Error('Value shouldn\'t be less than min');
    }
  }

  private handleProp(prop: string): void {
    switch (prop) {
      case 'value': this.handleValue(); break;
      case 'min': this.handleMin(); break;
      case 'max': this.handleMax(); break;
      case 'step': this.handleStep(); break;
      default: break;
    }
  }

  private isDuplicateValue(prop: string, value: number | boolean): boolean {
    return this.getState()[prop as keyof State] === value;
  }

  public reset(): void {
    this.setState(defaultState);
  }
}

export default Model;
