import Track from './Track';
import Simple from '../Templates/Simple/Simple';

import { TrackOptions } from './Interfaces';

import { hasChild, testHasInstance } from '../../helpers/helpers';

const options: TrackOptions = {
  parent: document.body,
  vertical: false,
  range: false,
  tip: true,
  bar: true,
  min: 0,
  max: 100,
  from: 0,
  ratio: 3,
  length: 300,
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

  test('if range set as true should contain 2 thumbs', () => {
    const thumbs = track.getElement().querySelectorAll('.o-slider__thumb');

    thumbs.forEach((thumb) => {
      expect(hasChild(track.getElement(), thumb as HTMLElement)).toBeTruthy();
    });
  });
});
