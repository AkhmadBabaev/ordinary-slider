import Simple from '../Templates/Simple/Simple';
import Thumb from '../Thumb/Thumb';
import Bar from '../Bar/Bar';

import { TrackOptions, PTrackOptions } from './Interfaces';
import { ThumbOptions, PThumbOptions } from '../Thumb/Interfaces';
import { BarOptions, PBarOptions } from '../Bar/Interfaces';

import {
  isDefined, convertValueUnitToPercent, debounce,
} from '../../helpers/helpers';

class Track extends Simple<TrackOptions> {
  private thumb: Thumb;

  private bar: Bar;

  constructor(options: TrackOptions) {
    super(options);
    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleWindowResize = debounce(this.handleWindowResize, 800);
    this.init();
  }

  protected init(): void {
    this.createElement('div', { class: 'o-slider__track' });
    this.options.parent.append(this.element);

    this.setRatio('init');
    this.thumb = this.handleThumb({ ...this.options }) as Thumb;
    this.bar = this.handleBar({ ...this.options }) as Bar;

    window.addEventListener('resize', this.handleWindowResize);
  }

  public update(options: PTrackOptions): void {
    super.update(options);

    const hasValue = isDefined(options.value);
    const hasMin = isDefined(options.min);
    const hasMax = isDefined(options.max);
    const hasTip = isDefined(options.tip);
    const hasBar = isDefined(options.bar);

    const isBoundariesUpdated = hasMin || hasMax;
    const isThumbUpdated = isBoundariesUpdated || hasValue || hasTip;
    const isBarUpdated = isBoundariesUpdated || hasValue || hasBar;

    isBoundariesUpdated && this.setRatio();
    isThumbUpdated && this.thumb.update(this.handleThumb(options, 'update') as PThumbOptions);
    isBarUpdated && this.bar.update(this.handleBar(options, 'update') as PBarOptions);
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
    const props: PThumbOptions = {};
    const isUpdate = todo === 'update';

    const isRatioUpdated = isDefined(options.ratio)
      || isDefined(options.min)
      || isDefined(options.max);

    isDefined(options.value) && (props.value = options.value as number);
    isDefined(options.min) && (props.min = options.min as number);
    isDefined(options.max) && (props.max = options.max as number);
    isDefined(options.tip) && (props.tip = options.tip as boolean);
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

    const isWidthUpdated = isDefined(options.value)
      || isDefined(options.min)
      || isDefined(options.max);

    const { min, max, value } = this.options;
    const width = convertValueUnitToPercent({ min, max, value });

    isDefined(options.bar) && (props.isEnabled = options.bar as boolean);
    isWidthUpdated && (props.width = width);

    if (isUpdate) return props;

    props.parent = this.element;
    return new Bar(props as BarOptions);
  }
}

export default Track;
