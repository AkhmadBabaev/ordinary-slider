import Bar from './Bar';
import Toggler from '../Templates/Toggler/Toggler';

import { BarOptions } from './Interfaces';

import { testHasElement, testHasInstance } from '../../helpers/helpers';

const options: BarOptions = {
  parent: document.body,
  isEnabled: true,
  width: '5%',
};

const bar = new Bar(options);

describe('Bar', () => {
  test('is an instance of class Toggler',
    () => testHasInstance(bar, Toggler));

  test('should be added to parent',
    () => testHasElement(bar.getOptions().parent, bar.getElement()));

  test('handles width value', () => {
    bar.update({ width: '10%' });
    expect(bar.getElement().style.width).toBe('10%');
  });
});
