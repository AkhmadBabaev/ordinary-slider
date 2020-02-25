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

    const hasIsEnabled: boolean = isDefined(options.isEnabled);
    hasIsEnabled && this.toggle();

    const hasText: boolean = isDefined(options.text);
    hasText && this.options.isEnabled && this.setText();
  }

  private setText(): void {
    this.element.textContent = this.options.text;
  }
}

export default Tip;
