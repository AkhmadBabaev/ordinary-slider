import Toggler from '../Templates/Toggler/Toggler';
import Tip from '../Tip/Tip';

import { ThumbOptions, PThumbOptions } from './Interfaces';
import { TipOptions, PTipOptions } from '../Tip/Interfaces';

import {
  propertyFilter, convertSliderUnitToPercent, throttle,
} from '../../helpers/helpers';

class Thumb extends Toggler<ThumbOptions> {
  private tip: Tip;

  public update(options: PThumbOptions): void {
    super.update(options);

    const updates = new Map(Object.entries(options));

    updates.has('isEnabled') && this.toggle();
    if (!this.options.isEnabled) return;

    const isPositionUpdated = updates.has('value') || updates.has('ratio') || updates.has('vertical');
    const isTipUpdated = updates.has('value') || updates.has('tip');

    updates.has('vertical') && this.handleVertical();
    isPositionUpdated && this.setPosition();
    isTipUpdated && this.tip.update(this.handleTip(options, 'update') as PTipOptions);
  }

  protected init(): void {
    this.createElement('div', { class: 'o-slider__thumb' });
    this.setPosition();
    this.bindEventHandlers();

    this.tip = this.handleTip({ ...this.options }) as Tip;
    this.element.addEventListener('mousedown', this.handleMouseDown);
    this.options.parent.append(this.element);
  }

  private handleVertical(): void {
    this.options.vertical ? this.element.style.left = '' : this.element.style.bottom = '';
  }

  private setPosition(): void {
    const {
      value, min, max, vertical,
    } = this.options;

    const position = convertSliderUnitToPercent({ min, max, value });
    const side = vertical ? 'bottom' : 'left';

    requestAnimationFrame(() => { this.element.style[side] = `${position}%`; });
  }

  private handleMouseDown(mouseDownEvent: MouseEvent): void {
    const currentTarget = mouseDownEvent.currentTarget as HTMLElement;
    const target = mouseDownEvent.target as HTMLElement;
    const { offsetX, offsetY, which } = mouseDownEvent;

    // if it isn't left click
    if (!(which === 1)) return;

    currentTarget.classList.add('o-slider__thumb_is_active');
    document.body.classList.add('o-slider-grabbed');

    const {
      min, max, ratio, parent, vertical,
    } = this.options;

    const size = vertical ? target.clientHeight : target.clientWidth;
    const offset = vertical ? offsetY : offsetX;
    const shift = offset - (size / 2);
    const parentBound = vertical
      ? parent.getBoundingClientRect().y
      : parent.getBoundingClientRect().x;

    let handleMouseMove = ({ clientX, clientY }: MouseEvent): void => {
      const client = vertical ? clientY : clientX;
      const position = client - parentBound - shift;
      const value = vertical
        ? max - position / ratio
        : position / ratio + min;

      this.element.dispatchEvent(new CustomEvent('thumbmove', {
        detail: { value, key: this.options.key },
        bubbles: true,
      }));
    };

    handleMouseMove = throttle(handleMouseMove, 50);

    const handleMouseUp = (): void => {
      currentTarget.classList.remove('o-slider__thumb_is_active');
      document.body.classList.remove('o-slider-grabbed');

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    mouseDownEvent.preventDefault();
  }

  private handleTip(
    options: { [k: string]: unknown },
    todo: 'init' | 'update' = 'init',
  ): Tip | PTipOptions {
    const isUpdate = todo === 'update';

    const propsList: string[] = ['tip:isEnabled', 'value:text'];
    const props: PTipOptions = propertyFilter(options, propsList);

    if (isUpdate) return props;

    props.parent = this.element;
    return new Tip(props as TipOptions);
  }

  private bindEventHandlers(): void {
    this.handleMouseDown = this.handleMouseDown.bind(this);
  }
}

export default Thumb;
