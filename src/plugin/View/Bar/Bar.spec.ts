import Bar from './Bar';
import Toggler from '../Templates/Toggler/Toggler';

import { BarOptions } from './Interfaces';

import { hasChild, testHasInstance } from '../../helpers/helpers';

const options: BarOptions = {
  parent: document.body,
  isEnabled: true,
  vertical: false,
  range: false,
  length: '10%',
};

const bar = new Bar(options);

describe('Bar', () => {
  afterEach(() => bar.update(options));

  test('is an instance of class Toggler',
    () => testHasInstance(bar, Toggler));

  test('should be added to parent', () => {
    expect(hasChild(bar.getOptions().parent, bar.getElement())).toBe(true);
  });

  describe('Option length', () => {
    test('should be set as width if vertical is false', async () => {
      await new Promise((res) => requestAnimationFrame(() => res()));
      expect(bar.getElement().style.width).toBe('10%');
    });

    test('should be set as height if vertical is true', async () => {
      bar.update({ vertical: true });

      await new Promise((res) => requestAnimationFrame(() => res()));
      expect(bar.getElement().style.height).toBe('10%');
    });
  });

  describe('Option shift', () => {
    test('should be set as left if vertical is false', async () => {
      bar.update({ range: true, shift: '5%' });

      await new Promise((res) => requestAnimationFrame(() => res()));
      expect(bar.getElement().style.left).toBe('5%');
    });

    test('should be set as bottom if vertical is true', async () => {
      bar.update({ range: true, vertical: true, shift: '5%' });

      await new Promise((res) => requestAnimationFrame(() => res()));
      expect(bar.getElement().style.bottom).toBe('5%');
    });

    test('shouldn\'t be set if range is false', async () => {
      bar.update({ range: false });

      await new Promise((res) => requestAnimationFrame(() => res()));
      expect(bar.getElement().style.bottom).toBeFalsy();
      expect(bar.getElement().style.left).toBeFalsy();
    });
  });
});
