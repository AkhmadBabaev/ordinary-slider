import Observable from '../Observable/Observable';
import defaultState from '../Model/defaultState';
import { hasChild } from '../helpers/helpers';
import View from './View';

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

  test('adds BEM modifier is_vertical if vertical set as true', async () => {
    view.render({ ...view.getOptions(), vertical: true });
    await new Promise((res) => requestAnimationFrame(() => res()));
    expect(document.body.classList.contains('o-slider_is_vertical')).toBeTruthy();
  });

  test('adds BEM modifier is_horizontal if vertical set as false', async () => {
    view.render({ ...view.getOptions(), vertical: false });
    await new Promise((res) => requestAnimationFrame(() => res()));
    expect(document.body.classList.contains('o-slider_is_horizontal')).toBeTruthy();
  });
});
