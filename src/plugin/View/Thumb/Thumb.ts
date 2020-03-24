import Simple from '../Templates/Simple/Simple';
import Tip from '../Tip/Tip';

import { ThumbOptions } from './Interfaces';

import { throttle } from '../../helpers/helpers';

import { EVENT_THUMBMOVE, EVENT_THUMBSTOP } from '../constants';

class Thumb extends Simple<ThumbOptions> {
  public render(options: ThumbOptions): void {
    this.options = options;

    this.createElement('div', { class: 'o-slider__thumb' });
    this.createTip();

    this.setPosition();
    this.setKey();
    this.handleActive();

    this.addListeners();
    this.addToParent();
  }

  private setPosition(): void {
    const side = this.options.vertical ? 'bottom' : 'left';
    this.element.style[side] = this.options.position;
  }

  private createTip(): void {
    if (!this.options.tip) return;
    new Tip({ value: this.options.value, parent: this.element });
  }

  private handleMouseDown(mouseDownEvent: MouseEvent): void {
    // if it isn't left click
    if (!(mouseDownEvent.which === 1)) return;

    const target = mouseDownEvent.target as HTMLElement;
    const { offsetX, offsetY } = mouseDownEvent;

    this.options.isActive = true;
    this.handleActive();
    document.body.classList.add('o-slider-grabbed');

    const { parent, vertical } = this.options;

    const targetLength = vertical ? target.clientHeight : target.clientWidth;
    const offset = vertical ? offsetY : offsetX;
    const shift = offset - (targetLength / 2);
    const parentBound = vertical
      ? parent.getBoundingClientRect().y
      : parent.getBoundingClientRect().x;

    const handleMouseMove = throttle((event: MouseEvent): void => {
      const client = vertical ? event.clientY : event.clientX;
      const position = client - parentBound - shift;

      this.element.dispatchEvent(new CustomEvent(EVENT_THUMBMOVE, {
        detail: { position, element: this.element, isActive: this.options.isActive },
        bubbles: true,
      }));
    }, 50);

    const handleMouseUp = (): void => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      document.body.classList.remove('o-slider-grabbed');

      delete this.options.isActive;
      this.element.dispatchEvent(new CustomEvent(EVENT_THUMBSTOP, { bubbles: true }));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    mouseDownEvent.preventDefault();
  }

  private setKey(): void {
    this.element.dataset.key = this.options.key;
  }

  private handleActive(): void {
    this.options.isActive && this.element.classList.add('o-slider__thumb_is_active');
  }

  private addListeners(): void {
    this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
  }

  private addToParent(): void {
    this.options.parent.append(this.element);
  }
}

export default Thumb;
