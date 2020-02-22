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
});
