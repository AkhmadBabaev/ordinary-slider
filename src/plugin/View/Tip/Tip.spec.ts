import { hasChild } from '../../helpers/helpers';
import Simple from '../Templates/Simple/Simple';
import Tip from './Tip';
import { TipOptions } from './Interfaces';

const options: TipOptions = {
  parent: document.body,
  value: 10,
};

const tip = new Tip(options);

describe('Tip', () => {
  test('is an instance of class Simple', () => expect(tip).toBeInstanceOf(Simple));

  test('should be added to parent', () => {
    expect(hasChild(tip.getOptions().parent, tip.getElement())).toBeTruthy();
  });

  test('set option value as 10', () => {
    expect(tip.getElement().textContent).toBe('10');
  });
});
