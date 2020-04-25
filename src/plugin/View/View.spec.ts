import Observable from '../Observable/Observable';
import defaultState from '../Model/default-state';
import { hasChild } from '../helpers/helpers';
import View from './View';

document.body.innerHTML = '<div id="test" class="o-slider"></div>';
const sliderElement = document.body.querySelector('#test')!;
const view = new View(sliderElement as HTMLElement, defaultState);

describe('View', () => {
  test('is an instance of class Observable', () => expect(view).toBeInstanceOf(Observable));

  test('should be merged into parent', () => {
    expect(sliderElement.classList.contains('o-slider')).toBeTruthy();
  });

  test('contains element track', () => {
    const trackElement = sliderElement.querySelector('.o-slider__track')!;
    expect(hasChild(sliderElement, trackElement)).toBeTruthy();
  });

  test('contains data attributes', () => {
    Object.keys(defaultState).forEach((attr) => {
      expect(sliderElement.hasAttribute(`data-${attr}`)).toBeTruthy();
    });
  });

  test('adds BEM modifier is_vertical if vertical set as true', () => {
    view.applyState({ vertical: true });
    expect(sliderElement.classList.contains('o-slider_direction_vertical')).toBeTruthy();
  });

  test('adds BEM modifier is_horizontal if vertical set as false', () => {
    view.applyState({ vertical: false });
    expect(sliderElement.classList.contains('o-slider_direction_horizontal')).toBeTruthy();
  });

  test('getOptions returns current options', () => {
    expect(view.getOptions()).toEqual(defaultState);
  });

  test('should react to click on the track element', () => {
    view.notify = jest.fn();

    const trackElement = sliderElement.querySelector('.o-slider__track')!;
    trackElement.dispatchEvent(new Event('click', {
      bubbles: true,
    }));

    expect(view.notify).toHaveBeenCalled();
  });
});
