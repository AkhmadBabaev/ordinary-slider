import { isDefined } from '../../helpers/helpers';
import Simple from '../Templates/Simple/Simple';
import { BarOptions } from './Interfaces';

class Bar extends Simple<BarOptions> {
  public render(options: BarOptions): void {
    this.options = options;

    this.createElement('div', { class: 'o-slider__bar' });
    this.setLength();
    this.setShift();

    this.addToParent();
  }

  private setLength(): void {
    const dimension = this.options.vertical ? 'height' : 'width';
    this.element.style[dimension] = this.options.length;
  }

  private setShift(): void {
    if (!isDefined(this.options.shift)) return;

    const side = this.options.vertical ? 'bottom' : 'left';
    this.element.style[side] = this.options.shift as string;
  }

  private addToParent(): void {
    this.options.parent.prepend(this.element);
  }
}

export default Bar;
