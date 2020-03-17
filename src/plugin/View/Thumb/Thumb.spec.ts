import Thumb from './Thumb';
import Toggler from '../Templates/Toggler/Toggler';

import { ThumbOptions } from './Interfaces';

import { hasChild } from '../../helpers/helpers';

const options: ThumbOptions = {
  parent: document.body,
  isEnabled: true,
  vertical: false,
  tip: false,
  min: 0,
  max: 100,
  value: 0,
  ratio: 3,
};

const thumb = new Thumb(options);

describe('Thumb', () => {
  test('is an instance of class Toggler', () => expect(thumb).toBeInstanceOf(Toggler));

  test('should be added to parent', () => {
    expect(hasChild(thumb.getOptions().parent, thumb.getElement())).toBeTruthy();
  });

  test('shouldn\'t contain element tip if tip set as false', () => {
    const tip = thumb.getElement().querySelector('.o-slider__tip') as HTMLElement;
    expect(hasChild(thumb.getElement(), tip)).toBeFalsy();
  });

  test('contains element tip if tip set as true', () => {
    thumb.update({ tip: true });

    const tip = thumb.getElement().querySelector('.o-slider__tip') as HTMLElement;
    expect(hasChild(thumb.getElement(), tip)).toBeTruthy();
  });

  describe('Position', () => {
    test('should be set as left if vertical is false', async () => {
      thumb.update({ value: 5 });

      await new Promise((res) => requestAnimationFrame(() => res()));
      expect(thumb.getElement().style.left).toBe('5%');
    });

    test('should be set as bottom if vertical is false', async () => {
      thumb.update({ vertical: true, value: 5 });

      await new Promise((res) => requestAnimationFrame(() => res()));
      expect(thumb.getElement().style.bottom).toBe('5%');
    });
  });
});
