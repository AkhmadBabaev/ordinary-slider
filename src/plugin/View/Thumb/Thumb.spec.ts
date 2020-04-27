import { hasChild } from '../../helpers/helpers';
import Component from '../Component/Component';
import Thumb from './Thumb';
import { ThumbOptions } from './Interfaces';

document.body.innerHTML = '<div id="test"></div>';
const testElement = document.body.querySelector('#test')!;

const thumb = (options: ThumbOptions): string => new Thumb(options).getElement();

const options: ThumbOptions = {
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
    testElement.innerHTML = thumb(options);
    thumbElement = testElement.querySelector(`.${options.className}__thumb`) as HTMLElement;
  });

  test('is an instance of class Component', () => expect(new Thumb(options)).toBeInstanceOf(Component));

  test('is valid HTML string', () => {
    expect(hasChild(testElement, thumbElement)).toBeTruthy();
  });

  describe('Options tip', () => {
    test('doesn\'t contain element tip if tip set as false', () => {
      const tipElement = thumbElement.querySelector(`.${options.className}__tip`)!;
      expect(hasChild(thumbElement, tipElement)).toBeFalsy();
    });

    test('contains element tip if tip set as true', () => {
      testElement.innerHTML = thumb({ ...options, tip: true });
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
      testElement.innerHTML = thumb({ ...options, vertical: true });
      thumbElement = testElement.querySelector(`.${options.className}__thumb`) as HTMLElement;

      expect(thumbElement.style.bottom).toBe('10%');
    });
  });

  test('option "value" should be placed inside tip element if tip set as true', () => {
    testElement.innerHTML = thumb({ ...options, tip: true });
    thumbElement = testElement.querySelector(`.${options.className}__thumb`) as HTMLElement;

    const tipElement = thumbElement.querySelector(`.${options.className}__tip`)!;
    expect(tipElement.textContent).toBe('5');
  });

  test('set option key as data-key value', () => {
    expect(thumbElement.dataset.key).toBe('0');
  });

  test('adds BEM modifier priority', () => {
    expect(thumbElement.classList.contains(`${options.className}__thumb_type_priority`)).toBeTruthy();
  });

  test('adds BEM modifier active', () => {
    expect(thumbElement.classList.contains(`${options.className}__thumb_type_active`)).toBeTruthy();
  });
});
