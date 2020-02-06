import Observable from '../Observable/Observable';
import defaultState from './defaultState';

import {
  isObject, isBoolean, isNumber,
  isDefined, softRounding,
} from '../helpers';

class Model extends Observable {
  constructor(options = {}) {
    super();

    this.getState = this.getState.bind(this);
    this.setState = this.setState.bind(this);

    this.isDuplicateValue = this.isDuplicateValue.bind(this);

    this.validateProp = this.validateProp.bind(this);
    this.handleMin = this.handleMin.bind(this);
    this.handleMax = this.handleMax.bind(this);
    this.handleStep = this.handleStep.bind(this);
    this.handlePosition = this.handlePosition.bind(this);
    this.handleProp = this.handleProp.bind(this);

    this.setState({ ...defaultState, ...options }, false);
  }

  setState(properties, notify = true) {
    // no arguments
    if (!arguments.length) throw new Error('setState has not arguments');

    // wrong type of the first argument
    if (!isObject(properties)) throw new TypeError('The first setState argument is not an object');

    // no properties for change
    if (!Object.keys(properties).length) throw new Error('seState got an empty object');

    // wrong the second argument
    if (!isBoolean(notify)) throw new TypeError('The second setState argument is not a boolean');

    // unnecessary arguments
    if (arguments.length > 2) {
      console.error(`
        setState should contain no more than 2 arguments,
        remove unnecessary arguments
      `);
    }

    // temporary storage for changed properties
    this.changedProps = {};

    // validate properties
    Object.keys(properties).forEach((prop) => {
      this.validateProp(prop, properties[prop]);
    });

    // handle properties
    Object.keys(this.changedProps).forEach((prop) => { this.handleProp(prop); });

    // notify subscribers
    notify && this.notify(this.changedProps);

    // set state
    this.state = { ...this.getState(), ...this.changedProps };

    // this is no longer necessary
    delete this.changedProps;
  }

  getState() {
    return this.state || {};
  }

  handleMin() {
    const currentState = { ...this.getState(), ...this.changedProps };

    let { min } = currentState;
    if (!Number.isFinite(min)) throw new Error('Min is Infinity');

    const { max, step, position } = currentState;

    if (min > max) min = max - step;

    const isGreaterThanPosition = min > position;
    const gap = max - min;

    this.changedProps.min = softRounding(min);

    // update related properties
    const hasStep = isDefined(this.changedProps.step);
    if (!hasStep && step > gap) this.handleStep();

    const hasPosition = isDefined(this.changedProps.position);
    if (!hasPosition && isGreaterThanPosition) this.handlePosition();
  }

  handleMax() {
    const currentState = { ...this.getState(), ...this.changedProps };

    let { max } = currentState;
    if (!Number.isFinite(max)) throw new Error('Max is Infinity');

    const { min, step, position } = currentState;

    if (max < min) max = min + step;

    const isLessThanPosition = max < position;
    const gap = max - min;

    this.changedProps.max = softRounding(max);

    // update related properties
    const hasStep = isDefined(this.changedProps.step);
    if (!hasStep && step > gap) this.handleStep();

    const hasPosition = isDefined(this.changedProps.position);
    if (!hasPosition && isLessThanPosition) this.handlePosition();
  }

  handleStep() {
    const currentState = { ...this.getState(), ...this.changedProps };

    let { step } = currentState;
    if (!Number.isFinite(step)) throw new Error('Step is Infinity');

    const { min, max } = currentState;

    if (step <= 0) step = 0.5;

    const gap = max - min;
    if (step > gap) step = gap;

    this.changedProps.step = softRounding(step);

    // update related properties
    const hasPosition = isDefined(this.changedProps.position);
    if (!hasPosition) this.handlePosition();
  }

  handlePosition() {
    const currentState = { ...this.getState(), ...this.changedProps };

    let { position } = currentState;
    if (!Number.isFinite(position)) throw new Error('Position is Infinity');

    const { min, max, step } = currentState;

    const remainder = (position - min) % step;

    if (remainder !== 0) {
      const halfStep = step / 2;
      const belowPosition = position - remainder;
      const abovePosition = belowPosition + step;

      position = (halfStep > remainder) ? belowPosition : abovePosition;
    }

    if (position < min) position = min;
    if (position > max) position = max;

    this.changedProps.position = softRounding(position);
  }

  validateProp(prop, value) {
    if (this.isDuplicateValue(prop, value)) return;

    switch (prop) {
      case 'position': case 'min': case 'max': case 'step':
        if (!isNumber(value)) throw new TypeError(`${prop} is not number`);
        this.changedProps[prop] = Number(value);
        break;

      case 'tip':
        if (!isBoolean(value)) throw new TypeError(`${prop} is not a boolean`);
        this.changedProps[prop] = value;
        break;

      default: throw new Error(`${prop} is non existed property`);
    }
  }

  handleProp(prop) {
    switch (prop) {
      case 'position': this.handlePosition(); break;
      case 'min': this.handleMin(); break;
      case 'max': this.handleMax(); break;
      case 'step': this.handleStep(); break;

      default: break;
    }
  }

  isDuplicateValue(prop, value) {
    return this.getState()[prop] === value;
  }
}

export default Model;
