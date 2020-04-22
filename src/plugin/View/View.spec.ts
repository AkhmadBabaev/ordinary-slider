import Observable from '../Observable/Observable';
import defaultState from '../Model/default-state';
import { hasChild } from '../helpers/helpers';
import View from './View';

document.body.innerHTML = '<div id="test"></div>';
const testElement = document.body.querySelector('#test')!;
const view = new View(testElement as HTMLElement, defaultState);

describe('View', () => {
  test('is an instance of class Observable', () => expect(view).toBeInstanceOf(Observable));

  test('should be merged into parent', () => {
    expect(testElement.classList.contains('o-slider')).toBeTruthy();
  });

  test('contains element track', () => {
    const track = testElement.querySelector('.o-slider__track')!;
    expect(hasChild(testElement, track)).toBeTruthy();
  });

  test('contains data attributes', () => {
    Object.keys(defaultState).forEach((attr) => {
      expect(testElement.hasAttribute(`data-${attr}`)).toBeTruthy();
    });
  });

  test('adds BEM modifier is_vertical if vertical set as true', () => {
    view.applyState({ ...view.getOptions(), vertical: true });
    expect(testElement.classList.contains('o-slider_is_vertical')).toBeTruthy();
  });

  test('adds BEM modifier is_horizontal if vertical set as false', () => {
    view.applyState({ ...view.getOptions(), vertical: false });
    expect(testElement.classList.contains('o-slider_is_horizontal')).toBeTruthy();
  });
});
