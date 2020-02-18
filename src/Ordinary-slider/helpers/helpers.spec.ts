import { isNumber, propertyFilter } from './helpers';

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
