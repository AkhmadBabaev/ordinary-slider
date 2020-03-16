import Simple from '../Templates/Simple/Simple';
import Thumb from '../Thumb/Thumb';
import Bar from '../Bar/Bar';

import { TrackOptions, PTrackOptions } from './Interfaces';
import { ThumbOptions, PThumbOptions } from '../Thumb/Interfaces';
import { BarOptions, PBarOptions } from '../Bar/Interfaces';

import {
  isDefined, convertSliderUnitToPercent, debounce,
  propertyFilter,
} from '../../helpers/helpers';

class Track extends Simple<TrackOptions> {
  private thumbs: Thumb[] = [];

  private bar: Bar;

  constructor(options: TrackOptions) {
    super(options);
    this.handleThumbMove = this.handleThumbMove.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleWindowResize = debounce(this.handleWindowResize, 500);
    this.init();
  }

  public update(options: PTrackOptions): void {
    super.update(options);

    const updates = new Map(Object.entries(options));

    const isBoundariesUpdated = updates.has('min') || updates.has('max');
    const isValuesUpdated = updates.has('from') || updates.has('to');

    const isThumbsUpdated = isBoundariesUpdated || isValuesUpdated
      || updates.has('tip')
      || updates.has('range')
      || updates.has('vertical');

    const isBarUpdated = isBoundariesUpdated || isValuesUpdated
      || updates.has('bar')
      || updates.has('range')
      || updates.has('vertical');

    updates.has('vertical') && this.setRatio('init');
    isBoundariesUpdated && this.setRatio();
    isThumbsUpdated && this.updateThumbs(options);
    isBarUpdated && this.bar.update(this.handleBar(options, 'update') as PBarOptions);
  }

  protected init(): void {
    this.createElement('div', { class: 'o-slider__track' });
    this.options.parent.append(this.element);

    this.setRatio('init');
    this.initThumbs();

    this.bar = this.handleBar({ ...this.options }) as Bar;
    this.element.addEventListener('thumbmove', this.handleThumbMove as EventListener);

    window.addEventListener('resize', this.handleWindowResize);
  }

  private initThumbs(): void {
    const { options } = this;
    const values = [options.from, options.to];

    values.forEach((value, i) => {
      const data = { ...options } as PThumbOptions;

      data.value = value;
      data.key = `thumb:${i}`;
      data.isEnabled = (i === 0) || options.range;

      this.thumbs.push(this.handleThumb(data) as Thumb);
    });
  }

  private updateThumbs(options: { [k: string]: unknown }): void {
    const values = [options.from, options.to];

    this.thumbs.forEach((thumb, i) => {
      const data = { ...options };

      isDefined(values[i]) ? (data.value = values[i]) : delete data.value;
      isDefined(options.range) && (i > 0) && (data.isEnabled = options.range);

      if (!Object.keys(data).length) return;
      thumb.update(this.handleThumb(data, 'update') as PThumbOptions);
    });
  }

  private setRatio(todo?: string): void {
    if (todo === 'init') {
      this.options.length = this.options.vertical
        ? this.element.clientHeight
        : this.element.clientWidth;
    }

    const { min, max, length } = this.options;
    this.options.ratio = length / (max - min);
  }

  private handleWindowResize(): void {
    // track width was not changed
    const length = this.options.vertical
      ? this.element.clientHeight
      : this.element.clientWidth;

    if (this.options.length === length) return;

    this.setRatio('init');
    this.handleThumb({ ratio: this.options.ratio }, 'update');
  }

  private handleThumb(
    options: { [k: string]: unknown },
    todo: 'init' | 'update' = 'init',
  ): Thumb | PThumbOptions {
    const isUpdate = todo === 'update';

    const isBoundariesUpdated = isDefined(options.min) || isDefined(options.max);
    const isRatioUpdated = isBoundariesUpdated
      || isDefined(options.ratio)
      || isDefined(options.vertical);

    const propsList: string[] = ['min', 'max', 'value', 'key', 'tip', 'isEnabled', 'vertical'];
    const props: PThumbOptions = propertyFilter(options, propsList);

    isRatioUpdated && (props.ratio = this.options.ratio as number);

    if (isUpdate) return props;

    props.parent = this.element;
    return new Thumb(props as ThumbOptions);
  }

  private handleBar(
    options: { [k: string]: unknown },
    todo: 'init' | 'update' = 'init',
  ): Bar | PBarOptions {
    const isUpdate = todo === 'update';
    const {
      min, max, from, to, range,
    } = this.options;

    const propsList: string[] = ['bar:isEnabled', 'range', 'vertical'];
    const props: PBarOptions = propertyFilter(options, propsList);

    const isBoundariesUpdated = isDefined(options.min) || isDefined(options.max);
    const isValuesUpdated = isDefined(options.from) || isDefined(options.to);
    const isLengthUpdated = isBoundariesUpdated || isValuesUpdated || isDefined(options.range);

    const length = range
      ? (100 / (max - min)) * ((to as number) - from)
      : convertSliderUnitToPercent({ min, max, value: from });

    range && (props.shift = `${convertSliderUnitToPercent({ min, max, value: from })}%`);
    isLengthUpdated && (props.length = `${length}%`);

    if (isUpdate) return props;

    props.parent = this.element;
    return new Bar(props as BarOptions);
  }

  private handleThumbMove(event: CustomEvent): void {
    if (!this.options.range) return;

    const { value, key } = event.detail;
    const { min, max } = this.options;
    const values = this.thumbs.map((thumb) => thumb.getOptions().value);

    const isFirstEqualToMin = values[0] === min;
    const isSecondEqualToMax = values[1] === max;

    const isFirstThumb = key === 'thumb:0';
    const isSecondThumb = key === 'thumb:1';

    const isGreaterThanSecondValue = value > values[1];
    const isLessThanFirstValue = value < values[0];

    const isFirstThumbBecomeSecond = isFirstThumb
      && isGreaterThanSecondValue && !isSecondEqualToMax;

    const isSecondThumbBecomeFirst = isSecondThumb
      && isLessThanFirstValue && !isFirstEqualToMin;

    this.element.lastElementChild !== event.target
      && this.element.append(event.target as HTMLElement);

    if (isFirstThumbBecomeSecond || isSecondThumbBecomeFirst) {
      this.thumbs.reverse();
      this.thumbs.forEach((thumb, i) => thumb.update({ key: `thumb:${i}` }));
    }
  }
}

export default Track;
