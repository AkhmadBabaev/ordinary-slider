import View from './View';
import Observable from '../Observable/Observable';

import defaultState from '../Model/defaultState';

import { testHasInstance } from '../helpers/helpers';

const view = new View(document.body, defaultState);

describe('View', () => {
  test('is an instance of class Observable',
    () => testHasInstance(view, Observable));

  test('should be merged into parent', () => {
    document.body.classList.contains('o-slider');
  });

  test('contains element track', () => {
    const isFounded = !!document.body.querySelector('.o-slider__track');
    expect(isFounded).toBe(true);
  });

  test('should react to custom event *thumbmove', () => {
    const thumbElem: HTMLElement | null = document.body.querySelector('.o-slider__thumb');
    view.notify = jest.fn();

    (thumbElem as HTMLElement).dispatchEvent(new CustomEvent('thumbmove', {
      detail: { value: 5 },
      bubbles: true,
    }));

    expect(view.notify).toHaveBeenCalled();
  });

  test('contains data attributes', () => {
    Object.keys(defaultState).forEach((attr) => {
      expect(document.body.hasAttribute(`data-${attr}`)).toBeTruthy();
    });
  });
});
