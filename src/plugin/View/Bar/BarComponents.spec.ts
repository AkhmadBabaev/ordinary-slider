import { hasChild } from '../../helpers/helpers';
import Component from '../Component/Component';
import BarComponent from './BarComponent';
import { BarOptions } from './Interfaces';

document.body.innerHTML = '<div id="test"></div>';
const testElement = document.body.querySelector('#test') as HTMLElement;

const options: BarOptions = {
  className: 'o-slider',
  vertical: false,
  length: '10%',
  shift: '5%',
};

let bar: BarComponent;
let barElement: HTMLElement;

describe('Bar', () => {
  beforeEach(() => {
    bar = new BarComponent(options);
    testElement.innerHTML = bar.getElement();
    barElement = testElement.querySelector(`.${options.className}__bar`) as HTMLElement;
  });

  test('is an instance of class Component', () => expect(bar).toBeInstanceOf(Component));

  test('is valid HTML string', () => {
    expect(hasChild(testElement, barElement)).toBeTruthy();
  });

  describe('Option length', () => {
    test('should be set as width if vertical is false', () => {
      expect(barElement.style.width).toBe('10%');
    });

    test('should be set as height if vertical is true', () => {
      testElement.innerHTML = new BarComponent({ ...options, vertical: true }).getElement();
      barElement = testElement.querySelector(`.${options.className}__bar`) as HTMLElement;
      expect(barElement.style.height).toBe('10%');
    });
  });

  describe('Option shift', () => {
    test('should be set as left if vertical is false', () => {
      expect(barElement.style.left).toBe('5%');
    });

    test('should be set as bottom if vertical is true', () => {
      testElement.innerHTML = new BarComponent({ ...options, vertical: true }).getElement();
      barElement = testElement.querySelector(`.${options.className}__bar`) as HTMLElement;
      expect(barElement.style.bottom).toBe('5%');
    });
  });
});
