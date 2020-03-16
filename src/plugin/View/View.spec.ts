import View from './View';
import Observable from '../Observable/Observable';

import defaultState from '../Model/defaultState';

import { hasChild } from '../helpers/helpers';

const view = new View(document.body, defaultState);

describe('View', () => {
  test('is an instance of class Observable', () => expect(view).toBeInstanceOf(Observable));

  test('should be merged into parent', () => {
    expect(document.body.classList.contains('o-slider')).toBeTruthy();
  });

  test('contains element track', () => {
    const track = document.body.querySelector('.o-slider__track') as HTMLElement;
    expect(hasChild(document.body, track)).toBeTruthy();
  });

  test('should react to custom event *thumbmove', () => {
    const thumb: HTMLElement | null = document.body.querySelector('.o-slider__thumb');
    view.notify = jest.fn();

    (thumb as HTMLElement).dispatchEvent(new CustomEvent('thumbmove', {
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
