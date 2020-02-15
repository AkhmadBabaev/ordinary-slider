import { TipOptions } from './Interfaces';

import { isDefined } from '../../helpers';

class Tip {
  private options: TipOptions;

  private tip: HTMLElement;

  constructor(options: TipOptions) {
    this.options = options;

    this.update = this.update.bind(this);
    this.init();
  }

  private init(): void {
    this.tip = document.createElement('div');
    this.tip.classList.add('o-slider__tip');

    this.setText();
    this.options.parent.append(this.tip);
  }

  public update(options: Partial<TipOptions>): void {
    this.options = { ...this.options, ...options };

    const hasIsEnabled: boolean = isDefined(options.isEnabled);
    hasIsEnabled && this.toggle();

    const hasText: boolean = isDefined(options.text);
    hasText && this.options.isEnabled && this.setText();
  }

  private enable(): void {
    this.init();
  }

  private disable(): void {
    this.tip.remove();
  }

  private toggle(): void {
    this.options.isEnabled ? this.enable() : this.disable();
  }

  private setText(): void {
    this.tip.textContent = String(this.options.text);
  }
}

export default Tip;
