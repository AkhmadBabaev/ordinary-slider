import Thumb from './Thumb';
import Toggler from '../Templates/Toggler/Toggler';

import { ThumbOptions } from './Interfaces';

import { hasChild, testHasInstance } from '../../helpers/helpers';

const options: ThumbOptions = {
  parent: document.body,
  isEnabled: true,
  min: 0,
  max: 100,
  value: 0,
  ratio: 3,
  tip: true,
};

const thumb = new Thumb(options);

describe('Thumb', () => {
  test('is an instance of class Toggler',
    () => testHasInstance(thumb, Toggler));

  test('should be added to parent', () => {
    expect(hasChild(thumb.getOptions().parent, thumb.getElement())).toBe(true);
  });

  test('handles position of value', async () => {
    thumb.update({ value: 5 });

    await new Promise((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    expect(thumb.getElement().style.left).toBe('5%');
  });

  test('contains element tip', () => {
    const isFounded = !!thumb.getElement().querySelector('.o-slider__tip');
    expect(isFounded).toBe(true);
  });
});
