import Simple from '../Templates/Simple/Simple';
import Tip from '../Tip/Tip';

import { ThumbOptions } from './Interfaces';
import { TipOptions } from '../Tip/Interfaces';

import {
  isDefined, convertPositionUnitToPercent, throttle,
} from '../../helpers/helpers';

class Thumb extends Simple<ThumbOptions> {
  private tip: Tip;

  constructor(options: ThumbOptions) {
    super(options);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.init();
  }

  protected init(): void {
    this.createElement('div', { class: 'o-slider__thumb' });
    this.element.addEventListener('mousedown', this.handleMouseDown);

    this.handleTip();
    this.setPosition();

    this.options.parent.append(this.element);
  }

  public update(options: Partial<ThumbOptions>): void {
    super.update(options);

    const hasPosition: boolean = isDefined(options.position);
    const hasTip: boolean = isDefined(options.tip);

    hasPosition && this.setPosition();

    const isTipUpdated = hasPosition || hasTip;
    isTipUpdated && this.handleTip(options, 'update');
  }

  private setPosition(): void {
    const { position, min, max } = this.options;
    const left = convertPositionUnitToPercent({ min, max, position });

    requestAnimationFrame(() => {
      this.element.style.left = left;
    });
  }

  private handleMouseDown(mouseDownEvent: MouseEvent): void {
    const currentTarget = mouseDownEvent.currentTarget as HTMLElement;
    const target = mouseDownEvent.target as HTMLElement;
    const { offsetX, which } = mouseDownEvent;

    const isLeftClick: boolean = which === 1;
    if (!isLeftClick) return;

    currentTarget.classList.add('o-slider__thumb_active');
    document.body.classList.add('o-slider_grabbed');

    const { min, ratio, parent } = this.options;

    const width: number = target.clientWidth;
    const shiftX: number = offsetX - (width / 2);
    const parentX: number = parent.getBoundingClientRect().x;

    let handleMouseMove = ({ clientX }: MouseEvent): void => {
      const pxPosition: number = clientX - parentX - shiftX;
      const position: number = pxPosition / ratio + min;

      this.element.dispatchEvent(new CustomEvent('positionChanged', {
        bubbles: true,
        detail: { position },
      }));
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

  private handleTip(options?: {}, todo?: string): void {
    const storage = (options || this.options) as { [k: string]: unknown };
    const props: Partial<TipOptions> = {};
    const isInit = !isDefined(todo);
    const isUpdate = todo === 'update';

    isDefined(storage.tip) && (props.isEnabled = storage.tip as boolean);
    isDefined(storage.position) && (props.text = storage.position as string);

    isInit
      && (props.parent = this.element)
      && (this.tip = new Tip(props as TipOptions));

    isUpdate && this.tip.update(props);
  }
}

export default Thumb;
