import Simple from '../Templates/Simple/Simple';
import Thumb from '../Thumb/Thumb';
import Bar from '../Bar/Bar';

import { TrackOptions } from './Interfaces';
import { ThumbOptions } from '../Thumb/Interfaces';
import { BarOptions } from '../Bar/Interfaces';

import {
  isDefined, convertPositionUnitToPercent, debounce,
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

  private init(): void {
    this.createElement('div', { class: 'o-slider__track' });
    this.options.parent.append(this.element);

    this.setRatio('init');

    window.addEventListener('resize', this.handleWindowResize);

    this.handleThumb();
    this.handleBar();
  }

  public update(options: Partial<TrackOptions>): void {
    super.update(options);

    const hasPosition: boolean = isDefined(options.position);
    const hasMin: boolean = isDefined(options.min);
    const hasMax: boolean = isDefined(options.max);
    const hasTip: boolean = isDefined(options.tip);
    const hasBar: boolean = isDefined(options.bar);

    const isBoundariesUpdated: boolean = hasMin || hasMax;
    isBoundariesUpdated && this.setRatio();

    const isThumbUpdated: boolean = isBoundariesUpdated || hasPosition || hasTip;
    isThumbUpdated && this.handleThumb(options, 'update');

    const isBarUpdated = isBoundariesUpdated || hasPosition || hasBar;
    isBarUpdated && this.handleBar(options, 'update');
  }

  private setRatio(todo?: string): void {
    (todo === 'init')
      && (this.options.trackWidth = this.element.clientWidth);

    const { min, max, trackWidth } = this.options;
    this.options.ratio = trackWidth / (max - min);
  }

  private handleWindowResize(): void {
    // track width was not changed
    if (this.options.trackWidth === this.element.clientWidth) return;

    this.setRatio('init');
    this.handleThumb({ ratio: this.options.ratio }, 'update');
  }

  private handleThumb(options?: {}, todo?: string): void {
    const storage = (options || this.options) as { [x: string]: unknown };
    const props: Partial<ThumbOptions> = {};
    const isInit = !isDefined(todo);
    const isUpdate = todo === 'update';

    const isBoundariesUpdated = isDefined(storage.min) || isDefined(storage.max);
    isBoundariesUpdated && (props.ratio = this.options.ratio);

    isDefined(storage.position) && (props.position = storage.position as number);
    isDefined(storage.min) && (props.min = storage.min as number);
    isDefined(storage.max) && (props.max = storage.max as number);
    isDefined(storage.tip) && (props.tip = storage.tip as boolean);

    isInit
      && (props.parent = this.element)
      && (this.thumb = new Thumb(props as ThumbOptions));

    isUpdate && this.thumb.update(props);
  }

  private handleBar(options?: {}, todo?: string): void {
    const storage = (options || this.options) as { [x: string]: unknown };
    const props: Partial<BarOptions> = {};
    const isInit = !isDefined(todo);
    const isUpdate = todo === 'update';

    const { min, max, position } = this.options;
    const width = convertPositionUnitToPercent({ min, max, position });

    isDefined(storage.bar) && (props.isEnabled = storage.bar as boolean);
    isDefined(storage.position) && (props.width = width);

    isInit
      && (props.parent = this.element)
      && (this.bar = new Bar(props as BarOptions));

    isUpdate && this.bar.update(props);
  }
}

export default Track;
