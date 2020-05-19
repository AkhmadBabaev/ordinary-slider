import { hasChild } from '../../helpers/helpers';
import Thumb from './Thumb';
import { IThumbOptions } from './Interfaces';

document.body.innerHTML = '<div id="test"></div>';
const testElement = document.body.querySelector('#test')!;

const options: IThumbOptions = {
  className: 'o-slider',
  vertical: false,
  isActive: true,
  isPriority: true,
  tip: false,
  key: 0,
  position: '10%',
  value: 5,
};

describe('Thumb', () => {
  let thumbElement: HTMLElement;

  beforeEach(() => {
    testElement.innerHTML = `${new Thumb(options)}`;
    thumbElement = testElement.querySelector(`.${options.className}__thumb`) as HTMLElement;
  });

  test('is valid HTML', () => {
    expect(hasChild(testElement, thumbElement)).toBeTruthy();
  });

  describe('Options tip', () => {
    test('doesn\'t contain element tip if tip set as false', () => {
      const tipElement = thumbElement.querySelector(`.${options.className}__tip`)!;
      expect(hasChild(thumbElement, tipElement)).toBeFalsy();
    });

    test('contains element tip if tip set as true', () => {
      testElement.innerHTML = `${new Thumb({ ...options, tip: true })}`;
      thumbElement = testElement.querySelector(`.${options.className}__thumb`) as HTMLElement;

      const tipElement = thumbElement.querySelector(`.${options.className}__tip`)!;
      expect(hasChild(thumbElement, tipElement)).toBeTruthy();
    });
  });

  describe('Options position', () => {
    test('should be set as left if vertical is false', () => {
      expect(thumbElement.style.left).toBe('10%');
    });

    test('should be set as bottom if vertical is true', () => {
      testElement.innerHTML = `${new Thumb({ ...options, vertical: true })}`;
      thumbElement = testElement.querySelector(`.${options.className}__thumb`) as HTMLElement;

      expect(thumbElement.style.bottom).toBe('10%');
    });
  });

  test('option "value" should be placed inside tip element if tip set as true', () => {
    testElement.innerHTML = `${new Thumb({ ...options, tip: true })}`;
    thumbElement = testElement.querySelector(`.${options.className}__thumb`) as HTMLElement;

    const tipElement = thumbElement.querySelector(`.${options.className}__tip`)!;
    expect(tipElement.textContent).toBe('5');
  });

  test('set option key as data-key value', () => {
    expect(thumbElement.dataset.key).toBe('0');
  });

  test('adds BEM modifier priority', () => {
    expect(thumbElement.classList.contains(`${options.className}__thumb_priority`)).toBeTruthy();
  });

  test('adds BEM modifier activated', () => {
    expect(thumbElement.classList.contains(`${options.className}__thumb_activated`)).toBeTruthy();
  });
});
