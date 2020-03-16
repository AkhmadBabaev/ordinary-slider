import Toggler from './Toggler';
import Simple from '../Simple/Simple';

import { isDefined, hasChild } from '../../../helpers/helpers';

interface Options {
  parent: HTMLElement;
  isEnabled: boolean;
}

const testeeOptions: Options = {
  parent: document.body,
  isEnabled: false,
};

class Testee extends Toggler<Options> {
  init(): void {
    this.createElement('div');
    this.options.parent.append(this.element);
  }

  update(options: Partial<Options>): void {
    super.update(options);
    isDefined(options.isEnabled) && this.toggle();
  }
}

const testee = new Testee(testeeOptions);

describe('Toggler', () => {
  test('is an instance of class Simple', () => expect(testee).toBeInstanceOf(Simple));

  describe('initialization', () => {
    test('should be added to parent', () => {
      const fake = new Testee({ ...testeeOptions, isEnabled: true });
      expect(hasChild(fake.getOptions().parent, fake.getElement())).toBeTruthy();
    });

    test('shouldn\'t be added to parent', () => {
      const fake = new Testee({ ...testeeOptions, isEnabled: false });
      expect(hasChild(fake.getOptions().parent, fake.getElement())).toBeFalsy();
    });
  });

  describe('update', () => {
    test('should be added to parent', () => {
      testee.update({ isEnabled: true });
      expect(hasChild(testee.getOptions().parent, testee.getElement())).toBeTruthy();
    });

    test('should be removed from parent', () => {
      testee.update({ isEnabled: false });
      expect(hasChild(testee.getOptions().parent, testee.getElement())).toBeFalsy();
    });
  });
});
