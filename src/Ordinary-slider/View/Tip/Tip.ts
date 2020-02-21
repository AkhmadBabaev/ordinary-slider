import ViewComponent from '../ViewComponent/ViewComponent';

import { TipOptions } from './Interfaces';

import { isDefined } from '../../helpers/helpers';

class Tip extends ViewComponent<TipOptions> {
  constructor(options: TipOptions) {
    super(options);
    this.init();
  }

  private init(): void {
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

  private enable(): void {
    this.init();
  }

  private disable(): void {
    this.element.remove();
  }

  private toggle(): void {
    this.options.isEnabled ? this.enable() : this.disable();
  }

  private setText(): void {
    this.element.textContent = String(this.options.text);
  }
}

export default Tip;
