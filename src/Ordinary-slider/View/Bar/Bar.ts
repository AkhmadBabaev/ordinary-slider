import Simple from '../Templates/Simple/Simple';

import { BarOptions } from './Interfaces';

import { isDefined } from '../../helpers/helpers';

class Bar extends Simple<BarOptions> {
  constructor(options: BarOptions) {
    super(options);
    this.init();
  }

  private init(): void {
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

  getOptions(): BarOptions {
    return this.options;
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

  private setWidth(): void {
    this.element.style.width = this.options.width;
  }
}

export default Bar;
