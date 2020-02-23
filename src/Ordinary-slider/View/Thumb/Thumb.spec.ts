import Thumb from './Thumb';
import ViewComponent from '../ViewComponent/ViewComponent';

import { ThumbOptions } from './Interfaces';

import { testHasElement, testHasInstance } from '../../helpers/helpers';

const options: ThumbOptions = {
  parent: document.body,
  min: 0,
  max: 100,
  position: 0,
  ratio: 3,
  tip: true,
};

const thumb = new Thumb(options);

describe('Thumb', () => {
  test('is an instance of class ViewComponent',
    () => testHasInstance(thumb, ViewComponent));

  test('should be added to parent',
    () => testHasElement(document.body, thumb.getElement()));

  test('handles position value', () => {
    thumb.update({ position: 5 });

    expect(thumb.getElement().style.left).toBe('5%');
  });

  test('contains element tip', () => {
    const isFounded = !!thumb.getElement().querySelector('.o-slider__tip');
    expect(isFounded).toBe(true);
  });
});
