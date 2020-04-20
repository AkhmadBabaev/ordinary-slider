import { hasChild } from '../../helpers/helpers';
import Component from '../Component/Component';
import { Track } from './Track';
import { TrackOptions } from './Interfaces';

document.body.innerHTML = '<div id="test"></div>';
const testElement = document.body.querySelector('#test') as HTMLElement;

const options: TrackOptions = {
  activeThumbIndex: 0,
  vertical: false,
  range: false,
  tip: false,
  bar: false,
  values: [10, 50],
  min: 0,
  max: 100,
};

let track: Track;
let trackElement: HTMLElement;

describe('Track', () => {
  beforeEach(() => {
    track = new Track(options);
    testElement.innerHTML = track.getElement();
    trackElement = testElement.querySelector(`.${options.className}__track`) as HTMLElement;
  });

  test('is an instance of class Component', () => expect(track).toBeInstanceOf(Component));

  test('is valid HTML string', () => {
    expect(hasChild(testElement, trackElement)).toBeTruthy();
  });

  test('contains a thumb element if range set as false', () => {
    const thumb = trackElement.querySelector(`.${options.className}__thumb`) as HTMLElement;
    expect(hasChild(trackElement, thumb)).toBeTruthy();
  });

  test('contains 2 thumbs elements if range set as true', () => {
    testElement.innerHTML = new Track({ ...options, range: true }).getElement();
    trackElement = testElement.querySelector(`.${options.className}__track`) as HTMLElement;

    const thumbs = trackElement.querySelectorAll(`.${options.className}__thumb`);
    thumbs.forEach((thumb) => {
      expect(hasChild(trackElement, thumb as HTMLElement)).toBeTruthy();
    });
  });

  test('shouldn\'t contain element bar if bar set as false', () => {
    const isBarFounded = !!trackElement.querySelector(`.${options.className}__bar`);
    expect(isBarFounded).toBeFalsy();
  });

  test('contains element bar if bar set as true', () => {
    testElement.innerHTML = new Track({ ...options, bar: true }).getElement();
    trackElement = testElement.querySelector(`.${options.className}__track`) as HTMLElement;

    const barElement = trackElement.querySelector(`.${options.className}__bar`) as HTMLElement;
    expect(hasChild(trackElement, barElement)).toBeTruthy();
  });
});
