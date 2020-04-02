import Thumb from './Thumb';
import Simple from '../Templates/Simple/Simple';

import { ThumbOptions } from './Interfaces';

import { hasChild } from '../../helpers/helpers';

const options: ThumbOptions = {
  parent: document.body,
  vertical: false,
  isActive: true,
  isPriority: true,
  tip: true,
  key: '0',
  position: '10%',
  value: 0,
};

let thumb: Thumb;

describe('Thumb', () => {
  beforeEach(() => { thumb = new Thumb(options); });

  test('is an instance of class Simple', () => expect(thumb).toBeInstanceOf(Simple));

  test('should be added to parent', () => {
    expect(hasChild(thumb.getOptions().parent, thumb.getElement())).toBeTruthy();
  });

  describe('Options tip', () => {
    test('contains element tip if tip set as true', () => {
      const tip = thumb.getElement().querySelector('.o-slider__tip') as HTMLElement;
      expect(hasChild(thumb.getElement(), tip)).toBeTruthy();
    });

    test('doesn\'t contain element tip if tip set as false', () => {
      thumb.render({ ...thumb.getOptions(), tip: false });

      const tip = thumb.getElement().querySelector('.o-slider__tip') as HTMLElement;
      expect(hasChild(thumb.getElement(), tip)).toBeFalsy();
    });
  });

  describe('Options position', () => {
    test('should be set as left if vertical is false', () => {
      expect(thumb.getElement().style.left).toBe('10%');
    });

    test('should be set as bottom if vertical is true', () => {
      thumb.render({ ...thumb.getOptions(), vertical: true });
      expect(thumb.getElement().style.bottom).toBe('10%');
    });
  });

  test('set option key as data-key value', () => {
    expect(thumb.getElement().dataset.key).toBe('0');
  });

  test('adds BEM modifier priority', () => {
    expect(thumb.getElement().classList.contains('o-slider__thumb_is_priority')).toBeTruthy();
  });

  test('adds BEM modifier active', () => {
    expect(thumb.getElement().classList.contains('o-slider__thumb_is_active')).toBeTruthy();
  });
});
