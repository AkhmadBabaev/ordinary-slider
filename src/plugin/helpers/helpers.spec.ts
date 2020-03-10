import {
  isNumber, propertyFilter, hasChild,
  throttle, debounce, convertValueUnitToPercent,
  setAttributesAsData, isBooleanSpy, objectReflection,
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

describe('hasChild', () => {
  const elem = document.createElement('div');
  document.body.append(elem);

  test('should return true with existed child', () => {
    expect(hasChild(document.body, elem)).toBe(true);
  });

  test('should returns false with non-existed child', () => {
    elem.remove();
    expect(hasChild(document.body, elem)).toBe(false);
  });
});

test('convertValueUnitToPercent should convert value unit into percent', () => {
  const [min, max, value] = [50, 100, 60];
  expect(convertValueUnitToPercent({ min, max, value })).toBe('20%');
});

test('setDataAttributes should set attributes to element', () => {
  document.body.innerHTML = '';
  setAttributesAsData(document.body, { value: 50, min: 10 });

  expect(document.body.getAttribute('data-value')).toBe('50');
  expect(document.body.getAttribute('data-min')).toBe('10');
});

test('isBooleanSpy should check is value a boolean that looks like a string', () => {
  expect(isBooleanSpy('false')).toBeTruthy();
  expect(isBooleanSpy('true')).toBeTruthy();
  expect(isBooleanSpy('hello')).toBeFalsy();
});

test('objectReflection make props order of object B like A', () => {
  const a = { day: 'sunny', weather: 'warm', birds: true };
  const b = { weather: 'cold', day: 'windy' };
  const result = { day: 'windy', weather: 'cold' };
  expect(objectReflection(a, b)).toEqual(result);
});
