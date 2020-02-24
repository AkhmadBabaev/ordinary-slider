import Tip from './Tip';
import Toggler from '../Templates/Toggler/Toggler';

import { TipOptions } from './Interfaces';

import { hasChild, testHasInstance } from '../../helpers/helpers';

const options: TipOptions = {
  parent: document.body,
  isEnabled: true,
  text: 10,
};

const tip = new Tip(options);

describe('Tip', () => {
  test('is an instance of class Toggler',
    () => testHasInstance(tip, Toggler));

  test('should be added to parent', () => {
    expect(hasChild(tip.getOptions().parent, tip.getElement())).toBe(true);
  });

  test('handles text value', () => {
    tip.update({ text: 5 });
    expect(tip.getElement().textContent).toBe('5');
  });
});
