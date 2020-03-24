import Track from './Track';
import Simple from '../Templates/Simple/Simple';

import { TrackOptions } from './Interfaces';

import { hasChild } from '../../helpers/helpers';

const options: TrackOptions = {
  parent: document.body,
  activeThumbIndex: 0,
  vertical: false,
  range: false,
  tip: false,
  bar: true,
  values: [10, 50],
  min: 0,
  max: 100,
};

let track: Track;

describe('Track', () => {
  beforeEach(() => { track = new Track(options as TrackOptions); });

  test('is an instance of class Simple', () => expect(track).toBeInstanceOf(Simple));

  test('should be added to parent', () => {
    expect(hasChild(track.getOptions().parent, track.getElement())).toBeTruthy();
  });

  test('contains a thumb element if range set as false', () => {
    const thumb = track.getElement().querySelector('.o-slider__thumb') as HTMLElement;
    expect(hasChild(track.getElement(), thumb)).toBeTruthy();
  });

  test('contains 2 thumbs elements if range set as true', () => {
    track.render({ ...track.getOptions(), range: true });

    const thumbs = track.getElement().querySelectorAll('.o-slider__thumb');
    thumbs.forEach((thumb) => {
      expect(hasChild(track.getElement(), thumb as HTMLElement)).toBeTruthy();
    });
  });

  test('contains element bar if bar set as true', () => {
    const bar = track.getElement().querySelector('.o-slider__bar') as HTMLElement;
    expect(hasChild(track.getElement(), bar)).toBeTruthy();
  });

  test('shouldn\'t contain element bar if bar set as false', () => {
    track.render({ ...track.getOptions(), bar: false });

    const bar = track.getElement().querySelector('.o-slider__bar') as HTMLElement;
    expect(hasChild(track.getElement(), bar)).toBeFalsy();
  });
});
