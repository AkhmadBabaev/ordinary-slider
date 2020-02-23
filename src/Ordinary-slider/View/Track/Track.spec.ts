import Track from './Track';
import ViewComponent from '../ViewComponent/ViewComponent';

import { TrackOptions } from './Interfaces';

import { testHasElement, testHasInstance } from '../../helpers/helpers';

const options: Partial<TrackOptions> = {
  parent: document.body,
  min: 0,
  max: 100,
  position: 0,
  tip: true,
};

const track = new Track(options as TrackOptions);

describe('Track', () => {
  test('is an instance of class ViewComponent',
    () => testHasInstance(track, ViewComponent));

  test('should be added to parent',
    () => testHasElement(document.body, track.getElement()));

  test('contains element thumb', () => {
    const isFounded = !!track.getElement().querySelector('.o-slider__thumb');
    expect(isFounded).toBe(true);
  });
});
