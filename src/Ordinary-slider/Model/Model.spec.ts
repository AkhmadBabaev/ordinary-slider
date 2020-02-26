import Model from './Model';

import { State } from './Interfaces';

const testeeState: State = {
  min: 0,
  max: 100,
  step: 1,
  position: 0,
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
      const errorName = 'setState has not arguments';

      // @ts-ignore
      expect(() => model.setState()).toThrowError(new Error(errorName));
    });

    test('throws error if called with empty object', () => {
      expect(() => model.setState({})).toThrowError();
    });

    test('throw console.warn if arguments is more than 2', () => {
      console.warn = jest.fn();

      // @ts-ignore
      model.setState(testeeState, false, 'fakeArg');
      expect(console.warn).toHaveBeenCalled();
    });

    test('throws error if called with unknowns properties', () => {
      // @ts-ignore
      expect(() => model.setState({ fake: 'property' })).toThrowError();
    });

    test('throws error if called with multitude options that contradict each other', () => {
      expect(() => model.setState({ min: 10, max: 5 })).toThrowError();
      expect(() => model.setState({ min: 10, position: 5 })).toThrowError();
      expect(() => model.setState({ position: 10, max: 5 })).toThrowError();
      expect(() => model.setState({ min: 5, max: 10, step: 15 })).toThrowError();
    });

    test('shouldn\'t sending repeated values', () => {
      class Fake {
        something: Partial<State>;

        constructor() {
          this.doSomething = this.doSomething.bind(this);
        }

        doSomething(value: Partial<State>): void {
          this.something = value;
        }
      }

      const fake = new Fake();

      model.subscribe(fake.doSomething);

      model.setState({
        min: 0, // the same
        position: 10, // new
      });

      expect(fake.something).toEqual({ position: 10 });

      // clear changes
      model.unsubscribe(fake.doSomething);
      model.setState({ position: testeeState.position });
    });
  });

  describe('State options', () => {
    afterEach(() => { model.setState(testeeState); });

    describe('Min', () => {
      test('shouldn\'t be greater than max', () => {
        model.setState({ min: 101 });
        expect(model.getState().min).toBe(99);
      });

      test('shouldn\'t be Infinity', () => {
        expect(() => model.setState({ min: Infinity })).toThrowError();
      });
    });

    describe('Max', () => {
      test('shouldn\'t be less than min', () => {
        model.setState({ max: -1 });
        expect(model.getState().max).toBe(1);
      });

      test('shouldn\'t be Infinity', () => {
        expect(() => model.setState({ max: Infinity })).toThrowError();
      });
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

      test('shouldn\'t be Infinity', () => {
        expect(() => model.setState({ step: Infinity })).toThrowError();
      });
    });

    describe('Position', () => {
      test('should be less than min', () => {
        model.setState({ position: -1 });
        expect(model.getState().position).toBe(0);
      });

      test('should be greater than max', () => {
        model.setState({ position: 101 });
        expect(model.getState().position).toBe(100);
      });

      test('should adapt to step values', () => {
        model.setState({ step: 10 });

        model.setState({ position: 8 });
        expect(model.getState().position).toBe(10);

        model.setState({ position: 2 });
        expect(model.getState().position).toBe(0);
      });

      test('shouldn\'t be Infinity', () => {
        expect(() => model.setState({ position: Infinity })).toThrowError();
      });
    });
  });
});
