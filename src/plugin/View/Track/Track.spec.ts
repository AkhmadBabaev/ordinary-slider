import Track from './Track';
import Simple from '../Templates/Simple/Simple';

import { TrackOptions } from './Interfaces';

import { hasChild } from '../../helpers/helpers';

const options: TrackOptions = {
  parent: document.body,
  vertical: false,
  range: false,
  tip: false,
  bar: false,
  min: 0,
  max: 100,
  from: 0,
  ratio: 3,
  length: 300,
};

const track = new Track(options as TrackOptions);

describe('Track', () => {
  test('is an instance of class Simple', () => expect(track).toBeInstanceOf(Simple));

  test('should be added to parent', () => {
    expect(hasChild(track.getOptions().parent, track.getElement())).toBeTruthy();
  });

  test('contains element thumb', () => {
    const thumb = track.getElement().querySelector('.o-slider__thumb') as HTMLElement;
    expect(hasChild(track.getElement(), thumb)).toBeTruthy();
  });

  test('shouldn\'t contain element bar if bar set as false', () => {
    const bar = track.getElement().querySelector('.o-slider__bar') as HTMLElement;
    expect(hasChild(track.getElement(), bar)).toBeFalsy();
  });

  test('contains element bar if bar set as true', () => {
    track.update({ bar: true });

    const bar = track.getElement().querySelector('.o-slider__bar') as HTMLElement;
    expect(hasChild(track.getElement(), bar)).toBeTruthy();
  });

  test('if range set as true should contain 2 thumbs', () => {
    const thumbs = track.getElement().querySelectorAll('.o-slider__thumb');
    thumbs.forEach((thumb) => {
      expect(hasChild(track.getElement(), thumb as HTMLElement)).toBeTruthy();
    });
  });
});
