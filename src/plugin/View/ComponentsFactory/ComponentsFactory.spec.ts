import { factory } from './ComponentsFactory';

describe('Factory', () => {
  test('method create - returns a HTML as string', () => {
    const barOptions = {
      className: 'hello',
      vertical: false,
      length: '20',
      shift: '30',
    };

    expect(typeof factory.create('bar', barOptions) === 'string').toBeTruthy();
  });
});
