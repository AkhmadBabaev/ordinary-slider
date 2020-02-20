import Thumb from './Thumb';

import { ThumbOptions } from './Interfaces';

document.body.innerHTML = '';

const options: ThumbOptions = {
  parent: document.body,
  notify: () => true,
  min: 0,
  max: 100,
  position: 0,
  ratio: 360 / 100,
  tip: true,
};

const thumb = new Thumb(options);

describe('Thumb', () => {
  test('should be added to DOM', () => {
    const isFounded = !!document.body.querySelector('.o-slider__thumb');
    expect(isFounded).toBe(true);
  });

  test('should handle position value', () => {
    thumb.update({ position: 5 });

    const element = document.body.querySelector('.o-slider__thumb');
    const left: number = parseFloat((element as HTMLElement).style.left);
    expect(left).toBeGreaterThan(0);
  });
});
