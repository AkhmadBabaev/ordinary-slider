import { hasChild } from '../../helpers/helpers';
import Simple from '../Templates/Simple/Simple';
import Bar from './Bar';
import { BarOptions } from './Interfaces';

const options: BarOptions = {
  parent: document.body,
  vertical: false,
  length: '10%',
  shift: '5%',
};

let bar: Bar;

describe('Bar', () => {
  beforeEach(() => { bar = new Bar(options); });

  test('is an instance of class Simple', () => expect(bar).toBeInstanceOf(Simple));

  test('should be added to parent', () => {
    expect(hasChild(bar.getOptions().parent, bar.getElement())).toBeTruthy();
  });

  describe('Option length', () => {
    test('should be set as width if vertical is false', () => {
      expect(bar.getElement().style.width).toBe('10%');
    });

    test('should be set as height if vertical is true', () => {
      bar.render({ ...bar.getOptions(), vertical: true });
      expect(bar.getElement().style.height).toBe('10%');
    });
  });

  describe('Option shift', () => {
    test('should be set as left if vertical is false', () => {
      expect(bar.getElement().style.left).toBe('5%');
    });

    test('should be set as bottom if vertical is true', () => {
      bar.render({ ...bar.getOptions(), vertical: true });
      expect(bar.getElement().style.bottom).toBe('5%');
    });
  });
});
