import Toggler from '../Templates/Toggler/Toggler';

import { BarOptions } from './Interfaces';

import { isDefined } from '../../helpers/helpers';

class Bar extends Toggler<BarOptions> {
  protected init(): void {
    this.createElement('div', { class: 'o-slider__bar' });
    this.setWidth();

    this.options.parent.prepend(this.element);
  }

  public update(options: Partial<BarOptions>): void {
    super.update(options);

    const hasIsEnabled = isDefined(options.isEnabled);
    hasIsEnabled && this.toggle();

    const hasWidth = isDefined(options.width);
    hasWidth && this.options.isEnabled && this.setWidth();
  }

  private setWidth(): void {
    requestAnimationFrame(() => {
      this.element.style.width = this.options.width;
    });
  }
}

export default Bar;
