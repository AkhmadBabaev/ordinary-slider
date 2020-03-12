import Model from './Model';

import { State, PState } from './Interfaces';
import defaultState from './defaultState';

const testeeState: State = {
  min: 0,
  max: 100,
  step: 1,
  from: 0,
  tip: true,
  bar: true,
};

const model = new Model(testeeState);

describe('Model', () => {
  test('getState should return current state', () => {
    expect(model.getState()).toEqual(testeeState);
  });

  describe('setState', () => {
    test('throws error if called without arguments', () => {
      const errorMessage = 'setState has not arguments';

      // @ts-ignore
      expect(() => model.setState()).toThrowError(new Error(errorMessage));
    });

    test('throws error if called with empty object', () => {
      expect(() => model.setState({})).toThrowError();
    });

    test('throws console.warn if arguments is more than 2', () => {
      console.warn = jest.fn();

      // @ts-ignore
      model.setState(testeeState, false, 'fakeArg');
      expect(console.warn).toHaveBeenCalled();
    });

    test('throws error if called with unknowns properties', () => {
      // @ts-ignore
      expect(() => model.setState({ fake: 'property' })).toThrowError();
    });

    test('shouldn\'t send repeated values', () => {
      class Fake {
        something: PState;

        constructor() {
          this.doSomething = this.doSomething.bind(this);
        }

        doSomething(value: PState): void {
          this.something = value;
        }
      }

      const fake = new Fake();

      model.subscribe(fake.doSomething);

      model.setState({
        min: 0, // the same
        from: 10, // new
      });

      expect(fake.something).toEqual({ from: 10 });

      // clear changes
      model.unsubscribe(fake.doSomething);
      model.setState({ from: testeeState.from });
    });
  });

  describe('State options', () => {
    afterEach(() => { model.setState(testeeState); });

    test('Min shouldn\'t be greater than max', () => {
      model.setState({ min: 101 });
      expect(model.getState().min).toBe(99);
    });

    test('Max shouldn\'t be less than min', () => {
      model.setState({ max: -1 });
      expect(model.getState().max).toBe(1);
    });

    describe('Step', () => {
      test('shouldn\'t be less than or equal to 0', () => {
        model.setState({ step: 0 });
        expect(model.getState().step).toBe(0.5);

        model.setState({ step: -1 });
        expect(model.getState().step).toBe(0.5);
      });

      test('shouldn\'t be greater than (max - min)', () => {
        model.setState({ step: 101 });
        expect(model.getState().step).toBe(100);
      });
    });

    describe('From', () => {
      test('should be less than min', () => {
        model.setState({ from: -1 });
        expect(model.getState().from).toBe(0);
      });

      test('should be greater than max', () => {
        model.setState({ from: 101 });
        expect(model.getState().from).toBe(100);
      });

      test('should adapt to step values', () => {
        model.setState({ step: 10 });

        model.setState({ from: 8 });
        expect(model.getState().from).toBe(10);

        model.setState({ from: 2 });
        expect(model.getState().from).toBe(0);
      });
    });

    test('reset should return state to default values', () => {
      model.setState({ min: 10, max: 20 });
      model.reset();
      expect(model.getState()).toEqual(defaultState);
    });
  });
});
