import View from './View';
import Observable from '../Observable/Observable';

import defaultState from '../Model/defaultState';

import { hasChild } from '../helpers/helpers';

import { EVENT_THUMBMOVE } from './constants';

const view = new View(document.body, defaultState);

describe('View', () => {
  test('is an instance of class Observable', () => expect(view).toBeInstanceOf(Observable));

  test('should be merged into parent', async () => {
    await new Promise((res) => requestAnimationFrame(() => res()));
    expect(document.body.classList.contains('o-slider')).toBeTruthy();
  });

  test('contains element track', () => {
    const track = document.body.querySelector('.o-slider__track') as HTMLElement;
    expect(hasChild(document.body, track)).toBeTruthy();
  });

  test('contains data attributes', () => {
    Object.keys(defaultState).forEach((attr) => {
      expect(document.body.hasAttribute(`data-${attr}`)).toBeTruthy();
    });
  });

  test(`should subscribe to custom event ${EVENT_THUMBMOVE}`, () => {
    const thumb: HTMLElement | null = document.body.querySelector('.o-slider__thumb');
    view.notify = jest.fn();

    (thumb as HTMLElement).dispatchEvent(new CustomEvent(EVENT_THUMBMOVE, {
      detail: { position: 50, element: thumb, isActive: false },
      bubbles: true,
    }));

    expect(view.notify).toHaveBeenCalled();
  });
});
