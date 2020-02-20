import Tip from './Tip';

import { TipOptions } from './Interfaces';

document.body.innerHTML = '';

const options: TipOptions = {
  parent: document.body,
  isEnabled: true,
  text: 10,
};

const tip = new Tip(options);

describe('Tip', () => {
  test('should be added to DOM', () => {
    const isFounded = !!document.body.querySelector('.o-slider__tip');
    expect(isFounded).toBe(true);
  });

  test('should handle text value', () => {
    tip.update({ text: 5 });

    const element = document.body.querySelector('.o-slider__tip');
    expect((element as HTMLElement).textContent).toBe('5');
  });

  test('can be removed from DOM', () => {
    tip.update({ isEnabled: false });

    const isFounded = !!document.body.querySelector('.o-slider__tip');
    expect(isFounded).toBe(false);
  });
});
