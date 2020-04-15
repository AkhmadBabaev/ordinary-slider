import Simple from '../Templates/Simple/Simple';
import Tip from '../Tip/Tip';
import { ThumbOptions } from './Interfaces';

class Thumb extends Simple<ThumbOptions> {
  public render(options: ThumbOptions): void {
    this.options = options;

    this.createElement('div', { class: 'o-slider__thumb' });
    this.createTip();

    this.setPosition();
    this.setKey();
    this.setActive();
    this.setPriority();
    this.addToParent();
  }

  private setPosition(): void {
    const side = this.options.vertical ? 'bottom' : 'left';
    this.element.style[side] = this.options.position;
  }

  private setPriority(): void {
    if (!this.options.isPriority) return;
    this.element.classList.add('o-slider__thumb_is_priority');
  }

  private createTip(): void {
    if (!this.options.tip) return;
    new Tip({ value: this.options.value, parent: this.element });
  }

  private setKey(): void {
    this.element.dataset.key = this.options.key;
  }

  private setActive(): void {
    this.options.isActive && this.element.classList.add('o-slider__thumb_is_active');
  }

  private addToParent(): void {
    this.options.parent.append(this.element);
  }
}

export default Thumb;
