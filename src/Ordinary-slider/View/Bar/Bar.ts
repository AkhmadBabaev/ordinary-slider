import Toggler from '../Templates/Toggler/Toggler';

import { BarOptions } from './Interfaces';

import { isDefined } from '../../helpers/helpers';

class Bar extends Toggler<BarOptions> {
  constructor(options: BarOptions) {
    super(options);
    this.init();
  }

  protected init(): void {
    this.createElement('div', { class: 'o-slider__bar' });
    this.setWidth();

    this.options.parent.prepend(this.element);
  }

  public update(options: Partial<BarOptions>): void {
    super.update(options);

    const hasIsEnabled: boolean = isDefined(options.isEnabled);
    hasIsEnabled && this.toggle();

    const hasWidth: boolean = isDefined(options.width);
    hasWidth && this.options.isEnabled && this.setWidth();
  }

  private setWidth(): void {
    this.element.style.width = this.options.width;
  }
}

export default Bar;
