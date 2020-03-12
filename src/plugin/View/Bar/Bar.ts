import Toggler from '../Templates/Toggler/Toggler';

import { BarOptions, PBarOptions } from './Interfaces';

import { isDefined } from '../../helpers/helpers';

class Bar extends Toggler<BarOptions> {
  protected init(): void {
    this.createElement('div', { class: 'o-slider__bar' });
    this.setWidth();

    this.options.parent.prepend(this.element);
  }

  public update(options: PBarOptions): void {
    super.update(options);

    const hasIsEnabled = isDefined(options.isEnabled);
    const hasWidth = isDefined(options.width);
    const hasShift = isDefined(options.shift);
    const hasRange = isDefined(options.range);

    hasIsEnabled && this.toggle();
    hasRange && this.handleRange();
    (hasWidth || hasShift) && this.setWidth();
  }

  private setWidth(): void {
    this.options.isEnabled && requestAnimationFrame(() => {
      this.element.style.width = this.options.width;
      this.options.range && (this.element.style.left = this.options.shift as string);
    });
  }

  private handleRange(): void {
    !this.options.range && (this.element.style.left = '');
  }
}

export default Bar;
