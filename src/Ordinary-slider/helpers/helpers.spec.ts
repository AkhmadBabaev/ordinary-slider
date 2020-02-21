import {
  isNumber, propertyFilter,
  throttle, debounce,
} from './helpers';

describe('isNumber', () => {
  describe('Values that should be a number', () => {
    test('1', () => {
      expect(isNumber(1)).toBe(true);
    });

    test('0', () => {
      expect(isNumber(0)).toBe(true);
    });

    test('-1', () => {
      expect(isNumber(-1)).toBe(true);
    });

    test('\'1\'', () => {
      expect(isNumber('1')).toBe(true);
    });

    test('Infinity', () => {
      expect(isNumber(Infinity)).toBe(true);
    });
  });

  describe('Values that shouldn\'t be a number', () => {
    test('1px', () => {
      expect(isNumber('1px')).toBe(false);
    });

    test('NaN', () => {
      expect(isNumber(NaN)).toBe(false);
    });

    test('False', () => {
      expect(isNumber(false)).toBe(false);
    });

    test('empty string', () => {
      expect(isNumber('')).toBe(false);
    });
  });
});

describe('propertyFilter', () => {
  test('returns selected properties', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const properties = ['a', 'b'];

    const filteredProps = propertyFilter(obj, properties);
    expect(filteredProps).toEqual({ a: 1, b: 2 });
  });

  test('changes properties name', () => {
    const obj = { day: true };
    const properties = ['day:night'];

    const filteredProps = propertyFilter(obj, properties);
    expect(filteredProps).toEqual({ night: true });
  });
});

describe('throttle', () => {
  let log: number;

  let fn = function wrapper(value: number): void {
    log = value;
  };

  beforeAll(() => {
    fn = throttle(fn, 1000);
    jest.useFakeTimers();
  });

  test('the first call should start immediately', () => {
    fn(1);
    expect(log).toBe(1);
  });

  test('ignores calls for 1000ms from the first call', () => {
    fn(2);
    fn(3);

    expect(log).toBe(1);

    jest.advanceTimersByTime(1000);

    expect(log).toBe(3);
  });

  test('the third call should waiting for 1000ms from the second one', () => {
    jest.advanceTimersByTime(100);
    fn(4);

    jest.advanceTimersByTime(200);
    fn(5);

    jest.advanceTimersByTime(300);
    fn(6);

    jest.advanceTimersByTime(400);

    expect(log).toBe(6);
  });
});

describe('debounce', () => {
  class Fake {
    something = 2;

    constructor() {
      this.doSomething = this.doSomething.bind(this);
    }

    doSomething(): void {
      this.something *= 2;
    }
  }

  const fake = new Fake();
  let fn = fake.doSomething;

  test('should be called after 1000ms from the last call', () => {
    fn = debounce(fn, 1000);
    jest.useFakeTimers();

    fn();
    expect(fake.something).toBe(2);

    jest.advanceTimersByTime(500);

    fn();
    expect(fake.something).toBe(2);

    jest.advanceTimersByTime(1000);

    expect(fake.something).toBe(4);
  });
});
