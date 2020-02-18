import Tip from '../Tip/Tip';

import { ThumbOptions } from './Interfaces';
import { TipOptions } from '../Tip/Interfaces';

import { isDefined, propertyFilter } from '../../helpers/helpers';

class Thumb {
  private options: ThumbOptions;

  private thumb: HTMLElement;

  private tip: Tip;

  constructor(options: ThumbOptions) {
    this.options = options;

    this.handleMouseDown = this.handleMouseDown.bind(this);

    this.update = this.update.bind(this);
    this.init();
  }

  private init(): void {
    this.thumb = document.createElement('div');
    this.thumb.classList.add('o-slider__thumb');
    this.thumb.addEventListener('mousedown', this.handleMouseDown);

    const tipProps: string[] = ['position:text', 'tip:isEnabled'];
    const filteredTipProps: Partial<TipOptions> = (
      propertyFilter((this.options as Partial<TipOptions>), tipProps)
    );

    this.tip = new Tip({
      ...filteredTipProps,
      parent: this.thumb,
    } as TipOptions);

    this.options.parent.append(this.thumb);
  }

  public update(options: Partial<ThumbOptions>): void {
    this.options = { ...this.options, ...options };

    const hasPosition: boolean = isDefined(options.position);
    hasPosition && this.setPosition();

    const hasTip: boolean = isDefined(options.tip);
    hasTip && this.tip.update({ isEnabled: options.tip });
  }

  private setPosition(): void {
    const { position, min, max } = this.options;

    this.thumb.style.left = `${(100 / (max - min)) * (position - min)}%`;
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

    const handleMouseMove = (mouseMoveEvent: MouseEvent): void => {
      const pxPosition: number = mouseMoveEvent.clientX - parentX - shiftX;
      const position: number = pxPosition / ratio + min;

      notify({ position });
    };

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
