import Toggler from './Toggler';
import Simple from '../Simple/Simple';

import { isDefined, testHasInstance, hasChild } from '../../../helpers/helpers';

interface Options {
  parent: HTMLElement;
  isEnabled: boolean;
}

const testeeOptions: Options = {
  parent: document.body,
  isEnabled: false,
};

class Testee extends Toggler<Options> {
  constructor(options: Options) {
    super(options);
    this.init();
  }

  update(options: Partial<Options>): void {
    super.update(options);
    isDefined(options.isEnabled) && this.toggle();
  }

  init(): void {
    this.createElement('div');
    this.options.parent.append(this.element);
  }
}

const testee = new Testee(testeeOptions);

describe('Toggler ', () => {
  test('is an instance of class Simple',
    () => testHasInstance(testee, Simple));

  test('should be added to parent', () => {
    testee.update({ isEnabled: true });
    expect(hasChild(testee.getOptions().parent, testee.getElement())).toBe(true);
  });

  test('should be removed from parent', () => {
    testee.update({ isEnabled: false });
    expect(hasChild(testee.getOptions().parent, testee.getElement())).toBe(false);
  });
});