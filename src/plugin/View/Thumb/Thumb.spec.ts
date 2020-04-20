import { hasChild } from '../../helpers/helpers';
import { Thumb } from './Thumb';
import Component from '../Component/Component';
import { ThumbOptions } from './Interfaces';

document.body.innerHTML = '<div id="test"></div>';
const testElement = document.body.querySelector('#test') as HTMLElement;

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

let thumb: Thumb;
let thumbElement: HTMLElement;

describe('Thumb', () => {
  beforeEach(() => {
    thumb = new Thumb(options);
    testElement.innerHTML = thumb.getElement();
    thumbElement = testElement.querySelector(`.${options.className}__thumb`) as HTMLElement;
  });

  test('is an instance of class Component', () => expect(thumb).toBeInstanceOf(Component));

  test('is valid HTML string', () => {
    expect(hasChild(testElement, thumbElement)).toBeTruthy();
  });

  describe('Options tip', () => {
    test('doesn\'t contain element tip if tip set as false', () => {
      const tipElement = thumbElement.querySelector(`.${options.className}__tip`) as HTMLElement;
      expect(hasChild(thumbElement, tipElement)).toBeFalsy();
    });

    test('contains element tip if tip set as true', () => {
      testElement.innerHTML = new Thumb({ ...options, tip: true }).getElement();
      thumbElement = testElement.querySelector(`.${options.className}__thumb`) as HTMLElement;

      const tipElement = thumbElement.querySelector(`.${options.className}__tip`) as HTMLElement;
      expect(hasChild(thumbElement, tipElement)).toBeTruthy();
    });
  });

  describe('Options position', () => {
    test('should be set as left if vertical is false', () => {
      expect(thumbElement.style.left).toBe('10%');
    });

    test('should be set as bottom if vertical is true', () => {
      testElement.innerHTML = new Thumb({ ...options, vertical: true }).getElement();
      thumbElement = testElement.querySelector(`.${options.className}__thumb`) as HTMLElement;

      expect(thumbElement.style.bottom).toBe('10%');
    });
  });

  test('option "value" should be placed inside tip element if tip set as true', () => {
    testElement.innerHTML = new Thumb({ ...options, tip: true }).getElement();
    thumbElement = testElement.querySelector(`.${options.className}__thumb`) as HTMLElement;

    const tipElement = thumbElement.querySelector(`.${options.className}__tip`) as HTMLElement;
    expect(tipElement.textContent).toBe('5');
  });

  test('set option key as data-key value', () => {
    expect(thumbElement.dataset.key).toBe('0');
  });

  test('adds BEM modifier priority', () => {
    expect(thumbElement.classList.contains(`${options.className}__thumb_is_priority`)).toBeTruthy();
  });

  test('adds BEM modifier active', () => {
    expect(thumbElement.classList.contains(`${options.className}__thumb_is_active`)).toBeTruthy();
  });
});
