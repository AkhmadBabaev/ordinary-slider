import Tip from './Tip';
import ViewComponent from '../ViewComponent/ViewComponent';

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

  test('is an instance of class ViewComponent',
    () => testHasInstance(tip, ViewComponent));

  test('should be added to parent',
    () => testHasElement(document.body, tip.getElement()));

  test('should be removed from parent', () => {
    tip.update({ isEnabled: false });

    const isFounded = document.body.contains(tip.getElement());
    expect(isFounded).toBe(false);
  });

  test('handles text value', () => {
    tip.update({ text: 5 });

    expect(tip.getElement().textContent).toBe('5');
  });
});
