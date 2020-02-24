import Bar from './Bar';
import Simple from '../Templates/Simple/Simple';

import { BarOptions } from './Interfaces';

import { testHasElement, testHasInstance } from '../../helpers/helpers';

const options: BarOptions = {
  parent: document.body,
  isEnabled: true,
  width: '5%',
};

const bar = new Bar(options);

describe('Bar', () => {
  afterEach(() => bar.update(options));

  test('is an instance of class Simple',
    () => testHasInstance(bar, Simple));

  test('should be added to parent',
    () => testHasElement(bar.getOptions().parent, bar.getElement()));

  test('should be removed from parent', () => {
    bar.update({ isEnabled: false });

    const isFounded = bar.getOptions().parent.contains(bar.getElement());
    expect(isFounded).toBe(false);
  });

  test('handles width value', () => {
    bar.update({ width: '10%' });

    expect(bar.getElement().style.width).toBe('10%');
  });
});
