import { hasChild } from '../../helpers/helpers';
import Component from '../Component/Component';
import Scale from './Scale';
import { IScaleOptions } from './Interfaces';

document.body.innerHTML = '<div id="test"></div>';
const testElement = document.body.querySelector('#test')!;

const scale = (options: IScaleOptions): string => new Scale(options).getElement();

const options: IScaleOptions = {
  className: 'o-slider',
  vertical: false,
  min: 0,
  max: 100,
  step: 8,
  symbolLength: 10,
  scaleLength: 100,
};

describe('Scale', () => {
  let scaleElement: HTMLElement;

  beforeEach(() => {
    testElement.innerHTML = scale(options);
    scaleElement = testElement.querySelector('.scale') as HTMLElement;
  });

  test('is an instance of class Component', () => expect(new Scale(options)).toBeInstanceOf(Component));

  test('is valid HTML string', () => {
    expect(hasChild(testElement, scaleElement)).toBeTruthy();
  });

  test('contains scale item', () => {
    const scaleItem = scaleElement.querySelector('.js-scale__item')!;
    expect(hasChild(scaleElement, scaleItem)).toBeTruthy();
  });

  test('should contains 4 scale items', () => {
    testElement.innerHTML = scale({ ...options, scaleLength: 400, step: 40 });
    scaleElement = testElement.querySelector('.scale') as HTMLElement;
    const scaleItemsList = scaleElement.querySelectorAll('.js-scale__item');
    expect(scaleItemsList.length).toBe(4);
  });

  test('should contains 11 scale items', () => {
    testElement.innerHTML = scale({ ...options, scaleLength: 400, step: 10 });
    scaleElement = testElement.querySelector('.scale') as HTMLElement;
    const scaleItemsList = scaleElement.querySelectorAll('.js-scale__item');
    expect(scaleItemsList.length).toBe(11);
  });

  describe('Option vertical', () => {
    test('if set as false should contain BEM modifier direction_horizontal', () => {
      expect(scaleElement.classList.contains('scale_direction_horizontal')).toBeTruthy();
    });

    test('if set as false should be arranged on the horizontal axis', () => {
      const scaleItem = scaleElement.querySelector('.js-scale__item') as HTMLElement;
      expect(scaleItem.style.left).toBe('0%');
    });

    test('if set as true should contain BEM modifier direction_vertical', () => {
      testElement.innerHTML = scale({ ...options, vertical: true });
      scaleElement = testElement.querySelector('.scale') as HTMLElement;
      expect(scaleElement.classList.contains('scale_direction_vertical')).toBeTruthy();
    });

    test('if set as true should be arranged on the vertical axis', () => {
      testElement.innerHTML = scale({ ...options, vertical: true });
      scaleElement = testElement.querySelector('.scale') as HTMLElement;
      const scaleItem = scaleElement.querySelector('.js-scale__item') as HTMLElement;
      expect(scaleItem.style.bottom).toBe('0%');
    });
  });
});