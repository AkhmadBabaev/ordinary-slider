import Toggler from '../Templates/Toggler/Toggler';

import { TipOptions, PTipOptions } from './Interfaces';

class Tip extends Toggler<TipOptions> {
  protected init(): void {
    this.createElement('div', { class: 'o-slider__tip' });
    this.setText();

    this.options.parent.append(this.element);
  }

  public update(options: PTipOptions): void {
    super.update(options);

    const updates = new Map(Object.entries(options));

    updates.has('isEnabled') && this.toggle();
    if (!this.options.isEnabled) return;

    updates.has('text') && this.setText();
  }

  private setText(): void {
    this.options.isEnabled && requestAnimationFrame(() => {
      this.element.textContent = this.options.text;
    });
  }
}

export default Tip;
