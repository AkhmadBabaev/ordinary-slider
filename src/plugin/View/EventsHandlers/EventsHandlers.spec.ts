import defaultState from '../../Model/default-state';
import View from '../View';

document.body.innerHTML = '<div id="test"></div>';
const sliderElement = document.body.querySelector('#test')!;
const view = new View(sliderElement as HTMLElement, { ...defaultState, scale: true });

describe('View Events', () => {
  test('should notify subscribers when track element have been clicked', () => {
    const spy = jest.spyOn(view, 'notify');

    const trackElement = sliderElement.querySelector('.js-o-slider__track')!;
    trackElement.dispatchEvent(new Event('click', { bubbles: true }));

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  test('should notify subscribers when scale element have been clicked', () => {
    const spy = jest.spyOn(view, 'notify');

    const scaleElement = sliderElement.querySelector('.js-scale__item')!;
    scaleElement.dispatchEvent(new Event('click', { bubbles: true }));

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
