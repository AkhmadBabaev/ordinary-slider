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
    const hasLength = isDefined(options.length);
    const hasShift = isDefined(options.shift);
    const hasRange = isDefined(options.range);
    const hasVertical = isDefined(options.vertical);

    hasIsEnabled && this.toggle();
    hasVertical && this.handleVertical();
    hasRange && this.handleRange();
    (hasLength || hasShift || hasVertical) && this.setWidth();
  }

  private handleVertical(): void {
    if (this.options.vertical) {
      this.element.style.width = '';
      this.element.style.left = '';
    } else {
      this.element.style.height = '';
      this.element.style.bottom = '';
    }
  }

  private setWidth(): void {
    const side = this.options.vertical ? 'bottom' : 'left';
    const dimension = this.options.vertical ? 'height' : 'width';

    this.options.isEnabled && requestAnimationFrame(() => {
      this.element.style[dimension] = this.options.length;
      this.options.range && (this.element.style[side] = this.options.shift as string);
    });
  }

  private handleRange(): void {
    const side = this.options.vertical ? 'bottom' : 'left';
    !this.options.range && (this.element.style[side] = '');
  }
}

export default Bar;
