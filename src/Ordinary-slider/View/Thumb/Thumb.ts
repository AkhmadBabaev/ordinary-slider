import ViewComponent from '../ViewComponent/ViewComponent';
import Tip from '../Tip/Tip';

import { ThumbOptions } from './Interfaces';
import { TipOptions } from '../Tip/Interfaces';

import { isDefined, propertyFilter, throttle } from '../../helpers/helpers';

class Thumb extends ViewComponent<ThumbOptions> {
  private tip: Tip;

  constructor(options: ThumbOptions) {
    super(options);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.init();
  }

  private init(): void {
    this.createElement('div', { class: 'o-slider__thumb' });

    this.element.addEventListener('mousedown', this.handleMouseDown);

    const tipProps: string[] = ['position:text', 'tip:isEnabled'];
    const filteredTipProps = propertyFilter(this.options, tipProps);

    this.tip = new Tip({
      ...filteredTipProps,
      parent: this.element,
    } as TipOptions);

    this.setPosition();

    this.options.parent.append(this.element);
  }

  public update(options: Partial<ThumbOptions>): void {
    super.update(options);

    const hasPosition: boolean = isDefined(options.position);
    hasPosition && this.setPosition();

    const hasTip: boolean = isDefined(options.tip);
    hasTip && this.tip.update({ isEnabled: options.tip });
  }

  private setPosition(): void {
    const { position, min, max } = this.options;

    this.element.style.left = `${(100 / (max - min)) * (position - min)}%`;
    this.tip.update({ text: position });
  }

  private handleMouseDown(mouseDownEvent: MouseEvent): void {
    const currentTarget = mouseDownEvent.currentTarget as HTMLElement;
    const target = mouseDownEvent.target as HTMLElement;
    const { offsetX, which } = mouseDownEvent;

    const isLeftClick: boolean = which === 1;
    if (!isLeftClick) return;

    currentTarget.classList.add('o-slider__thumb_active');
    document.body.classList.add('o-slider_grabbed');

    const {
      min, ratio, parent, notify,
    } = this.options;

    const width: number = target.clientWidth;
    const shiftX: number = offsetX - (width / 2);
    const parentX: number = parent.getBoundingClientRect().x;

    let handleMouseMove = ({ clientX }: MouseEvent): void => {
      const pxPosition: number = clientX - parentX - shiftX;
      const position: number = pxPosition / ratio + min;

      notify({ position });
    };

    handleMouseMove = throttle(handleMouseMove, 40);

    const handleMouseUp = (): void => {
      currentTarget.classList.remove('o-slider__thumb_active');
      document.body.classList.remove('o-slider_grabbed');

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    mouseDownEvent.preventDefault();
  }
}

export default Thumb;
