import Model from './Model';
import defaultState from './default-state';
import { IState } from './Interfaces';

const testeeState: IState = {
  min: 0,
  max: 100,
  step: 1,
  from: 0,
  tip: false,
  bar: false,
  scale: false,
  range: false,
  vertical: false,
};

const model = new Model(testeeState);

describe('Model', () => {
  test('if options isn\'t found the state is equal to default state', () => {
    const anotherModel = new Model();
    expect(anotherModel.getState()).toEqual(defaultState);
  });

  test('getState should return current state', () => expect(model.getState()).toEqual(testeeState));

  describe('setState', () => {
    test('throws error if called without arguments', () => {
      const errorMessage = 'setState has not arguments';

      // @ts-ignore
      expect(() => model.setState()).toThrowError(new Error(errorMessage));
    });

    test('throws error if the first setState argument isn\'t an object', () => {
      // @ts-ignore
      expect(() => model.setState('string')).toThrowError();
    });

    test('throws error if the second setState argument isn\'t a boolean', () => {
      // @ts-ignore
      expect(() => model.setState(testeeState, 10)).toThrowError();
    });

    test('throws error if called with empty object', () => {
      expect(() => model.setState({})).toThrowError();
    });
  });

  describe('State options', () => {
    afterEach(() => model.setState(testeeState));

    describe('Min', () => {
      test('shouldn\'t be greater than max', () => {
        model.setState({ min: 101 });
        expect(model.getState().min).toBe(99);
      });
    });

    describe('Max', () => {
      test('shouldn\'t be less than min', () => {
        model.setState({ max: -1 });
        expect(model.getState().max).toBe(1);
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
    });

    describe('From', () => {
      afterEach(() => model.setState(testeeState));

      test('should be greater than or equal to min', () => {
        model.setState({ from: -1 });
        expect(model.getState().from).toBeGreaterThanOrEqual(model.getState().min);

        model.setState({ min: model.getState().from + 1 });
        expect(model.getState().from).toBeGreaterThanOrEqual(model.getState().min);
      });

      test('should be less than or equal to max', () => {
        model.setState({ from: 101 });
        expect(model.getState().from).toBeLessThanOrEqual(model.getState().max);

        model.setState({ max: model.getState().from - 1 });
        expect(model.getState().from).toBeLessThanOrEqual(model.getState().max);
      });

      test('should adapt to step values', () => {
        model.setState({ step: 30 });

        model.setState({ from: 30 });
        expect(model.getState().from).toBe(30);

        model.setState({ from: 20 });
        expect(model.getState().from).toBe(30);

        model.setState({ from: 10 });
        expect(model.getState().from).toBe(0);

        model.setState({ from: 96 });
        expect(model.getState().from).toBe(100);

        model.setState({ from: 94 });
        expect(model.getState().from).toBe(90);
      });

      test('should be less than property to', () => {
        model.setState({ range: true, from: 10, to: 5 });
        expect(model.getState().from).toBeLessThan(model.getState().to as number);

        model.setState({ to: 100, step: 40 });
        model.setState({ from: 120 });
        expect(model.getState().from).toBeLessThan(model.getState().to as number);

        model.setState({ from: 100, to: 80 });
        expect(model.getState().from).toBeLessThan(model.getState().to as number);

        model.setState({ from: 60, to: 60 });
        expect(model.getState().from).toBeLessThan(model.getState().to as number);
      });
    });

    describe('To', () => {
      beforeEach(() => model.setState({ ...testeeState, range: true }));

      test('should be greater than min', () => {
        model.setState({ to: -1 });
        expect(model.getState().to).toBeGreaterThan(model.getState().min);
      });

      test('should be less than or equal to max', () => {
        model.setState({ to: 101 });
        expect(model.getState().to).toBeLessThanOrEqual(model.getState().max);
      });

      test('should adapt to step values', () => {
        model.setState({ step: 30, from: 0 });

        model.setState({ to: 60 });
        expect(model.getState().to).toBe(60);

        model.setState({ to: 50 });
        expect(model.getState().to).toBe(60);

        model.setState({ to: 40 });
        expect(model.getState().to).toBe(30);

        model.setState({ to: 96 });
        expect(model.getState().to).toBe(100);

        model.setState({ to: 94 });
        expect(model.getState().to).toBe(90);
      });

      test('should be greater than property from', () => {
        model.setState({ to: 5 });
        model.setState({ from: 10 });
        expect(model.getState().to).toBeGreaterThan(model.getState().from);

        model.setState({ range: false, from: 80, step: 40 });
        model.setState({ range: true, to: 80 });
        expect(model.getState().to).toBeGreaterThan(model.getState().from);
      });
    });
  });
});
