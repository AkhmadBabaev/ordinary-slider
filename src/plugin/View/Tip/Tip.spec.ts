import Tip from './Tip';
import Toggler from '../Templates/Toggler/Toggler';

import { TipOptions } from './Interfaces';

import { hasChild } from '../../helpers/helpers';

const options: TipOptions = {
  parent: document.body,
  isEnabled: true,
  text: '10',
};

const tip = new Tip(options);

describe('Tip', () => {
  test('is an instance of class Toggler', () => expect(tip).toBeInstanceOf(Toggler));

  test('should be added to parent', () => {
    expect(hasChild(tip.getOptions().parent, tip.getElement())).toBeTruthy();
  });

  test('handles text value', async () => {
    tip.update({ text: '5' });

    await new Promise((res) => requestAnimationFrame(() => res()));
    expect(tip.getElement().textContent).toBe('5');
  });
});
