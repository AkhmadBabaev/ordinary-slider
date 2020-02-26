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

    // handle properties
    Object.keys(this.changedProps).forEach((prop) => { this.handleProp(prop); });

    // notify subscribers
    notify && this.notify(this.changedProps);

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

    const { max, step, position } = currentState;

    if (min > max) min = max - step;

    const isGreaterThanPosition: boolean = min > position;
    const gap: number = max - min;

    this.changedProps.min = softRounding(min);

    // update related properties
    const hasStep: boolean = isDefined(this.changedProps.step);
    if (!hasStep && step > gap) this.handleStep();

    const hasPosition: boolean = isDefined(this.changedProps.position);
    if (!hasPosition && isGreaterThanPosition) this.handlePosition();
  }

  private handleMax(): void {
    const currentState = { ...this.getState(), ...this.changedProps };

    let { max } = currentState;
    if (!Number.isFinite(max)) throw new Error('Max is Infinity');

    const { min, step, position } = currentState;

    if (max < min) max = min + step;

    const isLessThanPosition: boolean = max < position;
    const gap: number = max - min;

    this.changedProps.max = softRounding(max);

    // update related properties
    const hasStep: boolean = isDefined(this.changedProps.step);
    if (!hasStep && step > gap) this.handleStep();

    const hasPosition: boolean = isDefined(this.changedProps.position);
    if (!hasPosition && isLessThanPosition) this.handlePosition();
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
    const hasPosition: boolean = isDefined(this.changedProps.position);
    if (!hasPosition) this.handlePosition();
  }

  private handlePosition(): void {
    const currentState = { ...this.getState(), ...this.changedProps };

    let { position } = currentState;
    if (!Number.isFinite(position)) throw new Error('Position is Infinity');

    const { min, max, step } = currentState;

    const remainder: number = (position - min) % step;

    if (remainder !== 0) {
      const halfStep: number = step / 2;
      const belowPosition: number = position - remainder;
      const abovePosition: number = belowPosition + step;

      position = (halfStep > remainder) ? belowPosition : abovePosition;
    }

    if (position < min) position = min;
    if (position > max) position = max;

    this.changedProps.position = softRounding(position);
  }

  private validateProp(prop: string, value: unknown): void {
    let option: boolean | number;

    switch (prop) {
      case 'position':
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

    if (!this.isDuplicateValue(prop, option)) {
      this.changedProps = { ...this.changedProps, [prop]: option };
    }
  }

  private validateMultitudeProps(): void {
    const min = this.changedProps.min as number;
    const max = this.changedProps.max as number;
    const step = this.changedProps.step as number;
    const position = this.changedProps.position as number;

    const hasBoundaries = min && max;
    const gap = max - min;

    const isMinGreaterThanMax = min > max;
    const isStepGreaterThanGap = step > gap;
    const isPositionGreaterThanMax = position > max;
    const isPositionLessThanMin = position < min;

    if (hasBoundaries && isMinGreaterThanMax) {
      throw new Error('Min is greater than max');
    }

    if (step && hasBoundaries && isStepGreaterThanGap) {
      throw new Error('Step should not be greater than (max - min)');
    }

    if (position && max && isPositionGreaterThanMax) {
      throw new Error('Position is greater than max');
    }

    if (position && min && isPositionLessThanMin) {
      throw new Error('Position is less than min');
    }
  }

  private handleProp(prop: string): void {
    switch (prop) {
      case 'position': this.handlePosition(); break;
      case 'min': this.handleMin(); break;
      case 'max': this.handleMax(); break;
      case 'step': this.handleStep(); break;
      default: break;
    }
  }

  private isDuplicateValue(prop: string, value: number | boolean): boolean {
    return this.getState()[prop as keyof State] === value;
  }
}

export default Model;
