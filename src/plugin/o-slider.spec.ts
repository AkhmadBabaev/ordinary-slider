import defaultState from './Model/default-state';
import Presenter from './Presenter/Presenter';
import './o-slider';

document.body.innerHTML = '<div id="test"></div>';
const testElement = document.body.querySelector('#test')!;

describe('oSlider', () => {
  beforeEach(() => {
    testElement.innerHTML = '';
    testElement.insertAdjacentHTML('afterbegin', '<div class="o-slider"></div>');
  });

  test('save instance of Presenter to element data', () => {
    const $slider = $('.o-slider').oSlider();
    expect($($slider).data('oSlider') instanceof Presenter).toBeTruthy();
  });

  test('initialization with options allow to set options to state', () => {
    const $slider = $('.o-slider').oSlider({ from: 10 }) as JQuery<object>;
    // console.log($slider.oSlider('settings'))
    expect($slider.oSlider('settings')).toEqual({ ...defaultState, from: 10 });
  });

  describe('Method settings', () => {
    test('returns current state of the slider', () => {
      const $slider = $('.o-slider').oSlider() as JQuery<object>;
      expect($slider.oSlider('settings')).toEqual(defaultState);
    });

    test('sets option \'from\' as 10', () => {
      const $slider = $('.o-slider').oSlider() as JQuery<object>;
      $slider.oSlider('settings', { from: 10 });
      expect($slider.oSlider('settings')).toEqual({ ...defaultState, from: 10 });
    });
  });

  test('method subscribe should notify about updates', () => {
    const $slider = $('.o-slider').oSlider() as JQuery<object>;
    const callback = jest.fn();

    $slider.oSlider('subscribe', callback);
    $slider.oSlider('settings', { from: 10 });

    expect(callback).toHaveBeenCalled();
  });

  test('method unsubscribe stops notifications about updates', () => {
    const $slider = $('.o-slider').oSlider() as JQuery<object>;
    const callback = jest.fn();

    $slider.oSlider('subscribe', callback);
    $slider.oSlider('unsubscribe', callback);
    $slider.oSlider('settings', { from: 10 });

    expect(callback).not.toHaveBeenCalled();
  });
});
