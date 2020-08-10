import { hasChild } from '../../helpers/helpers';
import Scale from './Scale';
import { IScaleOptions } from './Interfaces';

document.body.innerHTML = '<div id="test"></div>';
const testElement = document.body.querySelector('#test')!;

const options: IScaleOptions = {
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
    testElement.innerHTML = `${new Scale(options)}`;
    scaleElement = testElement.querySelector('.scale') as HTMLElement;
  });

  test('is valid HTML', () => {
    expect(hasChild(testElement, scaleElement)).toBeTruthy();
  });

  test('contains scale item', () => {
    const scaleItem = scaleElement.querySelector('.js-scale__item')!;
    expect(hasChild(scaleElement, scaleItem)).toBeTruthy();
  });

  test('should contains 4 scale items', () => {
    testElement.innerHTML = `${new Scale({ ...options, scaleLength: 400, step: 40 })}`;
    scaleElement = testElement.querySelector('.scale') as HTMLElement;
    const scaleItemsList = scaleElement.querySelectorAll('.js-scale__item');
    expect(scaleItemsList.length).toBe(4);
  });

  test('should contains 11 scale items', () => {
    testElement.innerHTML = `${new Scale({ ...options, scaleLength: 400, step: 10 })}`;
    scaleElement = testElement.querySelector('.scale') as HTMLElement;
    const scaleItemsList = scaleElement.querySelectorAll('.js-scale__item');
    expect(scaleItemsList.length).toBe(11);
  });

  describe('Option vertical', () => {
    test('if set as false should not contain BEM modifier is_vertical', () => {
      expect(scaleElement.classList.contains('scale_is_vertical')).toBeFalsy();
    });

    test('if set as false should be arranged on the horizontal axis', () => {
      const scaleItem = scaleElement.querySelector('.js-scale__item') as HTMLElement;
      expect(scaleItem.style.left).toBe('0%');
    });

    test('if set as true should contain BEM modifier is_vertical', () => {
      testElement.innerHTML = `${new Scale({ ...options, vertical: true })}`;
      scaleElement = testElement.querySelector('.scale') as HTMLElement;
      expect(scaleElement.classList.contains('scale_is_vertical')).toBeTruthy();
    });

    test('if set as true should be arranged on the vertical axis', () => {
      testElement.innerHTML = `${new Scale({ ...options, vertical: true })}`;
      scaleElement = testElement.querySelector('.scale') as HTMLElement;
      const scaleItem = scaleElement.querySelector('.js-scale__item') as HTMLElement;
      expect(scaleItem.style.bottom).toBe('0%');
    });
  });
});
