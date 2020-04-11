import Simple from '../Templates/Simple/Simple';
import Thumb from '../Thumb/Thumb';
import Bar from '../Bar/Bar';

import { TrackOptions } from './Interfaces';
import { ThumbOptions, PThumbOptions } from '../Thumb/Interfaces';
import { BarOptions, PBarOptions } from '../Bar/Interfaces';

import {
  convertSliderUnitToPercent as convertToPercent,
  propertyFilter,
  isDefined,
} from '../../helpers/helpers';

import { EVENT_THUMBMOVE } from '../constants';

class Track extends Simple<TrackOptions> {
  public render(options: TrackOptions): void {
    this.options = options;

    this.createElement('div', { class: 'o-slider__track' });
    this.createThumbs();
    this.createBar();

    this.addListener();
    this.addToParent();
  }

  private createThumbs(): void {
    const propsList = ['tip', 'vertical', 'element:parent'];
    const props = propertyFilter({ ...this, ...this.options }, propsList);

    const {
      min,
      max,
      values,
      activeThumbIndex: active,
    } = this.options;

    values.forEach((value, index) => {
      const individualProps: PThumbOptions = {};
      const position = convertToPercent({ min, max, value });

      individualProps.key = String(index);
      individualProps.position = `${position}%`;
      individualProps.value = value;

      isDefined(active) && (active === index) && (individualProps.isActive = true);

      if (this.options.range && index === 0) {
        const distanceToMax = max - value;
        const distanceToMin = value - min;

        distanceToMax < distanceToMin && (individualProps.isPriority = true);
      }

      new Thumb({ ...props, ...individualProps } as ThumbOptions);
    });
  }

  private createBar(): void {
    if (!this.options.bar) return;

    const {
      min,
      max,
      values,
      range,
      vertical,
    } = this.options;

    const props: PBarOptions = { parent: this.element, vertical };
    let shift;

    const length = range
      ? (100 / (max - min)) * (values[1] - values[0])
      : convertToPercent({ min, max, value: values[0] });

    if (!length) return;

    range && (shift = convertToPercent({ min, max, value: values[0] }));

    props.length = `${length}%`;
    shift && (props.shift = `${shift}%`);

    new Bar(props as BarOptions);
  }

  private handleClick(event: MouseEvent): void {
    const client = this.options.vertical ? event.clientY : event.clientX;
    const bound = this.options.vertical
      ? this.element.getBoundingClientRect().y
      : this.element.getBoundingClientRect().x;

    const position = client - bound;

    this.element.dispatchEvent(new CustomEvent(EVENT_THUMBMOVE, {
      detail: { position, element: this.element },
      bubbles: true,
    }));
  }

  private addListener(): void {
    this.element.addEventListener('click', this.handleClick.bind(this));
  }

  private addToParent(): void {
    this.options.parent.append(this.element);
  }
}

export default Track;
