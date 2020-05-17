import defaultState from '../../Model/default-state';
import { hasChild } from '../../helpers/helpers';
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

  test('should notify subscribers when thumb element have been moved using MouseEvents', () => {
    const spy = jest.spyOn(view, 'notify');
    const thumbElement = sliderElement.querySelector('.js-o-slider__thumb')!;

    thumbElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    document.dispatchEvent(new MouseEvent('mousemove'));

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();

    document.dispatchEvent(new MouseEvent('mouseup'));
  });

  test('should notify subscribers when thumb element have been moved using TouchEvents', () => {
    const spy = jest.spyOn(view, 'notify');
    const thumbElement = sliderElement.querySelector('.js-o-slider__thumb')!;

    Object.defineProperty(TouchEvent.prototype, 'touches', {
      get: () => ({ 0: { clientX: '100px' }, length: 2 }),
    });

    thumbElement.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
    thumbElement.dispatchEvent(new TouchEvent('touchmove', { bubbles: true }));

    expect(spy).not.toHaveBeenCalled();

    Object.defineProperty(TouchEvent.prototype, 'touches', {
      get: () => ({ 0: { clientX: '100px' }, length: 1 }),
    });

    thumbElement.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
    thumbElement.dispatchEvent(new TouchEvent('touchmove', { bubbles: true }));

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();

    thumbElement.dispatchEvent(new TouchEvent('touchend', { bubbles: true }));
  });

  test('should add BEM modifier "type_active" to a thumb element when the element get mousedown event', () => {
    const thumbElement = sliderElement.querySelector('.js-o-slider__thumb')!;
    thumbElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(thumbElement.classList.contains('o-slider__thumb_type_active')).toBeTruthy();
    document.dispatchEvent(new MouseEvent('mouseup'));
  });

  describe('window cover element', () => {
    const thumbElement = sliderElement.querySelector('.js-o-slider__thumb')!;
    thumbElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    const coverElement = document.body.querySelector('.o-slider__window-cover') as HTMLElement;

    test('should be created when a thumb get mousedown event', () => {
      expect(!!coverElement).toBeTruthy();
    });

    test('should be a child of body tag', () => {
      expect(hasChild(document.body, coverElement)).toBeTruthy();
    });

    test('add display none after mouseup event', () => {
      document.dispatchEvent(new MouseEvent('mouseup'));
      expect(coverElement.style.display).toBe('none');
    });
  });
});
