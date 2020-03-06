import Thumb from './Thumb';
import Simple from '../Templates/Simple/Simple';

import { ThumbOptions } from './Interfaces';

import { hasChild, testHasInstance } from '../../helpers/helpers';

const options: ThumbOptions = {
  parent: document.body,
  min: 0,
  max: 100,
  value: 0,
  ratio: 3,
  tip: true,
};

const thumb = new Thumb(options);

describe('Thumb', () => {
  test('is an instance of class Simple',
    () => testHasInstance(thumb, Simple));

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
