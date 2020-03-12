import Track from './Track';
import Simple from '../Templates/Simple/Simple';

import { TrackOptions } from './Interfaces';

import { hasChild, testHasInstance } from '../../helpers/helpers';

const options: TrackOptions = {
  parent: document.body,
  min: 0,
  max: 100,
  from: 0,
  trackWidth: 300,
  ratio: 3,
  tip: true,
  bar: true,
};

const track = new Track(options as TrackOptions);

describe('Track', () => {
  test('is an instance of class Simple',
    () => testHasInstance(track, Simple));

  test('should be added to parent', () => {
    expect(hasChild(track.getOptions().parent, track.getElement())).toBe(true);
  });

  test('contains element thumb', () => {
    const isFounded = !!track.getElement().querySelector('.o-slider__thumb');
    expect(isFounded).toBe(true);
  });

  test('contains element bar', () => {
    const isFounded = !!track.getElement().querySelector('.o-slider__bar');
    expect(isFounded).toBe(true);
  });
});
