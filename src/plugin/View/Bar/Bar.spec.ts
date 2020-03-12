import Bar from './Bar';
import Toggler from '../Templates/Toggler/Toggler';

import { BarOptions } from './Interfaces';

import { hasChild, testHasInstance } from '../../helpers/helpers';

const options: BarOptions = {
  parent: document.body,
  isEnabled: true,
  range: false,
  width: '5%',
};

const bar = new Bar(options);

describe('Bar', () => {
  test('is an instance of class Toggler',
    () => testHasInstance(bar, Toggler));

  test('should be added to parent', () => {
    expect(hasChild(bar.getOptions().parent, bar.getElement())).toBe(true);
  });

  test('handles value of property width', async () => {
    bar.update({ width: '10%' });

    await new Promise((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    expect(bar.getElement().style.width).toBe('10%');
  });

  test('shift should be handled if range set as true', async () => {
    bar.update({ shift: '5%' });

    await new Promise((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    expect(bar.getElement().style.left).toBeFalsy();

    bar.update({ range: true, shift: '5%' });

    await new Promise((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    expect(bar.getElement().style.left).toBe('5%');
  });
});
