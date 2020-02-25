import Bar from './Bar';
import Toggler from '../Templates/Toggler/Toggler';

import { BarOptions } from './Interfaces';

import { hasChild, testHasInstance } from '../../helpers/helpers';

const options: BarOptions = {
  parent: document.body,
  isEnabled: true,
  width: '5%',
};

const bar = new Bar(options);

describe('Bar', () => {
  test('is an instance of class Toggler',
    () => testHasInstance(bar, Toggler));

  test('should be added to parent', () => {
    expect(hasChild(bar.getOptions().parent, bar.getElement())).toBe(true);
  });

  test('handles width value', async () => {
    bar.update({ width: '10%' });

    await new Promise((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    expect(bar.getElement().style.width).toBe('10%');
  });
});
