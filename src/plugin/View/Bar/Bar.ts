import Toggler from '../Templates/Toggler/Toggler';

import { BarOptions, PBarOptions } from './Interfaces';

class Bar extends Toggler<BarOptions> {
  public update(options: PBarOptions): void {
    super.update(options);

    const updates = new Map(Object.entries(options));

    updates.has('isEnabled') && this.toggle();
    if (!this.options.isEnabled) return;

    updates.has('vertical') && this.handleVertical();
    updates.has('range') && this.handleRange();
    (updates.has('length') || updates.has('shift') || updates.has('vertical')) && this.setLength();
  }

  protected init(): void {
    this.createElement('div', { class: 'o-slider__bar' });
    this.setLength();

    this.options.parent.prepend(this.element);
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

  private setLength(): void {
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
