import { hasChild } from '../../helpers/helpers';
import Component from '../Component/Component';
import { Track, trackHTML as track } from './Track';
import { TrackOptions } from './Interfaces';

document.body.innerHTML = '<div id="test"></div>';
const testElement = document.body.querySelector('#test') as HTMLElement;

const options: TrackOptions = {
  activeThumbIndex: 0,
  vertical: false,
  range: false,
  tip: false,
  bar: false,
  values: [70, 90],
  min: 0,
  max: 100,
};

describe('Track', () => {
  let trackElement: HTMLElement;

  beforeEach(() => {
    testElement.innerHTML = track(options);
    trackElement = testElement.querySelector(`.${options.className}__track`) as HTMLElement;
  });

  test('is an instance of class Component', () => expect(new Track(options)).toBeInstanceOf(Component));

  test('is valid HTML string', () => {
    expect(hasChild(testElement, trackElement)).toBeTruthy();
  });

  test('contains a thumb element if range set as false', () => {
    const thumb = trackElement.querySelector(`.${options.className}__thumb`)!;
    expect(hasChild(trackElement, thumb)).toBeTruthy();
  });

  test('contains 2 thumbs elements if range set as true', () => {
    testElement.innerHTML = track({ ...options, range: true });
    trackElement = testElement.querySelector(`.${options.className}__track`) as HTMLElement;

    const thumbs = trackElement.querySelectorAll(`.${options.className}__thumb`);
    thumbs.forEach((thumb) => expect(hasChild(trackElement, thumb)).toBeTruthy());
  });

  test('shouldn\'t contain element bar if bar set as false', () => {
    const isBarFounded = !!trackElement.querySelector(`.${options.className}__bar`);
    expect(isBarFounded).toBeFalsy();
  });

  test('contains element bar if bar set as true', () => {
    testElement.innerHTML = track({ ...options, bar: true });
    trackElement = testElement.querySelector(`.${options.className}__track`) as HTMLElement;

    const barElement = trackElement.querySelector(`.${options.className}__bar`)!;
    expect(hasChild(trackElement, barElement)).toBeTruthy();
  });
});
