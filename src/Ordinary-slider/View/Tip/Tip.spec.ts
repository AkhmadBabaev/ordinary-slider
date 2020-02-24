import Tip from './Tip';
import Simple from '../Templates/Simple/Simple';

import { TipOptions } from './Interfaces';

import { testHasElement, testHasInstance } from '../../helpers/helpers';

const options: TipOptions = {
  parent: document.body,
  isEnabled: true,
  text: 10,
};

const tip = new Tip(options);

describe('Tip', () => {
  afterEach(() => tip.update(options));

  test('is an instance of class Simple',
    () => testHasInstance(tip, Simple));

  test('should be added to parent',
    () => testHasElement(tip.getOptions().parent, tip.getElement()));

  test('should be removed from parent', () => {
    tip.update({ isEnabled: false });

    const isFounded = tip.getOptions().parent.contains(tip.getElement());
    expect(isFounded).toBe(false);
  });

  test('handles text value', () => {
    tip.update({ text: 5 });

    expect(tip.getElement().textContent).toBe('5');
  });
});
