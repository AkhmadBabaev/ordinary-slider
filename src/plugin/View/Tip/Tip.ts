import Simple from '../Templates/Simple/Simple';
import { TipOptions } from './Interfaces';

class Tip extends Simple<TipOptions> {
  public render(options: TipOptions): void {
    this.options = options;

    this.createElement('div', { class: 'o-slider__tip' });
    this.setValue();

    this.addToParent();
  }

  private setValue(): void {
    this.element.textContent = String(this.options.value);
  }

  private addToParent(): void {
    this.options.parent.append(this.element);
  }
}

export default Tip;
