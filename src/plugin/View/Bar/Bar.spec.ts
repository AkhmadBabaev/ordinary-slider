import { hasChild } from '../../helpers/helpers';
import Component from '../Component/Component';
import { Bar, barHTML as bar } from './Bar';
import { BarOptions } from './Interfaces';

document.body.innerHTML = '<div id="test"></div>';
const testElement = document.body.querySelector('#test')!;

const options: BarOptions = {
  className: 'o-slider',
  vertical: false,
  length: '10%',
  shift: '5%',
};

describe('Bar', () => {
  let barElement: HTMLElement;

  beforeEach(() => {
    testElement.innerHTML = bar(options);
    barElement = testElement.querySelector(`.${options.className}__bar`) as HTMLElement;
  });

  test('is an instance of class Component', () => expect(new Bar(options)).toBeInstanceOf(Component));

  test('is valid HTML string', () => {
    expect(hasChild(testElement, barElement)).toBeTruthy();
  });

  describe('Option length', () => {
    test('should be set as width if vertical is false', () => {
      expect(barElement.style.width).toBe('10%');
    });

    test('should be set as height if vertical is true', () => {
      testElement.innerHTML = bar({ ...options, vertical: true });
      barElement = testElement.querySelector(`.${options.className}__bar`) as HTMLElement;
      expect(barElement.style.height).toBe('10%');
    });
  });

  describe('Option shift', () => {
    test('should be set as left if vertical is false', () => {
      expect(barElement.style.left).toBe('5%');
    });

    test('should be set as bottom if vertical is true', () => {
      testElement.innerHTML = bar({ ...options, vertical: true });
      barElement = testElement.querySelector(`.${options.className}__bar`) as HTMLElement;
      expect(barElement.style.bottom).toBe('5%');
    });
  });
});
