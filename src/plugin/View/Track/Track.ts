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
    this.handleWindowResize = debounce(this.handleWindowResize, 800);
    this.init();
  }

  protected init(): void {
    this.createElement('div', { class: 'o-slider__track' });
    this.options.parent.append(this.element);

    this.setRatio('init');
    this.initThumbs();
    this.bar = this.handleBar({ ...this.options }) as Bar;

    window.addEventListener('resize', this.handleWindowResize);
    this.element.addEventListener('thumbmove', this.handleThumbMove as EventListener);
  }

  public update(options: PTrackOptions): void {
    super.update(options);

    const hasFrom = isDefined(options.from);
    const hasTo = isDefined(options.to);
    const hasMin = isDefined(options.min);
    const hasMax = isDefined(options.max);
    const hasTip = isDefined(options.tip);
    const hasBar = isDefined(options.bar);
    const hasRange = isDefined(options.range);

    const isBoundariesUpdated = hasMin || hasMax;
    const isValuesUpdated = hasFrom || hasTo;
    const isThumbsUpdated = isBoundariesUpdated || isValuesUpdated || hasTip || hasRange;
    const isBarUpdated = isBoundariesUpdated || isValuesUpdated || hasBar || hasRange;

    isBoundariesUpdated && this.setRatio();
    isThumbsUpdated && this.updateThumbs(options);
    isBarUpdated && this.bar.update(this.handleBar(options, 'update') as PBarOptions);
  }

  private initThumbs(): void {
    const { options } = this;
    const values = [options.from, options.to];

    values.forEach((value, i) => {
      const data = { ...options } as PThumbOptions;

      data.value = value;
      data.key = `thumb:${i}`;
      data.isEnabled = (i === 0) ? true : options.range;

      this.thumbs.push(this.handleThumb(data) as Thumb);
    });
  }

  private updateThumbs(options: { [k: string]: unknown }): void {
    const values = [options.from, options.to];
    const { range } = this.options;

    this.thumbs.forEach((thumb, i) => {
      let data = { ...options };

      isDefined(values[i]) ? (data.value = values[i]) : delete data.value;
      if (!range && i > 0) data = {};

      isDefined(options.range) && (i > 0) && (data.isEnabled = options.range);

      if (!Object.keys(data).length) return;
      thumb.update(this.handleThumb(data, 'update') as PThumbOptions);
    });
  }

  private setRatio(todo?: string): void {
    (todo === 'init') && (this.options.trackWidth = this.element.clientWidth);

    const { min, max, trackWidth } = this.options;
    this.options.ratio = trackWidth / (max - min);
  }

  private handleWindowResize(): void {
    // track width was not changed
    if (this.options.trackWidth === this.element.clientWidth) return;

    this.setRatio('init');
    this.handleThumb({ ratio: this.options.ratio }, 'update');
  }

  private handleThumb(
    options: { [k: string]: unknown },
    todo: 'init' | 'update' = 'init',
  ): Thumb | PThumbOptions {
    const isUpdate = todo === 'update';

    const isBoundariesUpdated = isDefined(options.min) || isDefined(options.max);
    const isRatioUpdated = isBoundariesUpdated || isDefined(options.ratio);

    const propsList: string[] = ['min', 'max', 'value', 'key', 'tip', 'isEnabled'];
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
    const props: PBarOptions = {};
    const isUpdate = todo === 'update';
    const {
      min, max, from, to, range,
    } = this.options;

    const isBoundariesUpdated = isDefined(options.min) || isDefined(options.max);
    const isValuesUpdated = isDefined(options.from) || isDefined(options.to);
    const isWidthUpdated = isBoundariesUpdated || isValuesUpdated || isDefined(options.range);

    const width = range
      ? `${(100 / (max - min)) * ((to as number) - from)}%`
      : convertSliderUnitToPercent({ min, max, value: from });

    isDefined(options.bar) && (props.isEnabled = options.bar as boolean);
    isDefined(options.range) && (props.range = options.range as boolean);

    range && (props.shift = convertSliderUnitToPercent({ min, max, value: from }));
    isWidthUpdated && (props.width = width);

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
