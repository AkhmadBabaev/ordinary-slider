import Toggler from '../Templates/Toggler/Toggler';

import { TipOptions } from './Interfaces';

import { isDefined } from '../../helpers/helpers';

class Tip extends Toggler<TipOptions> {
  protected init(): void {
    this.createElement('div', { class: 'o-slider__tip' });

    this.setText();
    this.options.parent.append(this.element);
  }

  public update(options: Partial<TipOptions>): void {
    super.update(options);

    const hasIsEnabled = isDefined(options.isEnabled);
    const hasText = isDefined(options.text);

    hasIsEnabled && this.toggle();
    hasText && this.setText();
  }

  private setText(): void {
    this.options.isEnabled && requestAnimationFrame(() => {
      this.element.textContent = this.options.text;
    });
  }
}

export default Tip;
