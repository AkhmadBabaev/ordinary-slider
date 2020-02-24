import Simple from '../Templates/Simple/Simple';
import Thumb from '../Thumb/Thumb';
import Bar from '../Bar/Bar';

import { TrackOptions } from './Interfaces';
import { ThumbOptions } from '../Thumb/Interfaces';
import { BarOptions } from '../Bar/Interfaces';

import { isDefined, propertyFilter, debounce } from '../../helpers/helpers';

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

    this.options.trackWidth = this.element.clientWidth;
    this.setRatio();

    window.addEventListener('resize', this.handleWindowResize);

    const thumbProps: string[] = ['min', 'max', 'position', 'tip', 'ratio'];
    const filteredThumbProps = propertyFilter(this.options, thumbProps);

    this.thumb = new Thumb({
      ...filteredThumbProps,
      parent: this.element,
    } as ThumbOptions);

    const {
      max, min, position, bar,
    } = this.options;

    this.bar = new Bar({
      isEnabled: bar,
      width: `${(100 / (max - min)) * (position - min)}%`,
      parent: this.element,
    } as BarOptions);
  }

  public update(options: Partial<TrackOptions>): void {
    super.update(options);

    const hasMin: boolean = isDefined(options.min);
    const hasMax: boolean = isDefined(options.max);
    const hasPosition: boolean = isDefined(options.position);
    const hasTip: boolean = isDefined(options.tip);
    const hasBar: boolean = isDefined(options.bar);

    const { max, min, position } = this.options;

    const isBoundariesUpdated: boolean = hasMin || hasMax;
    if (isBoundariesUpdated) {
      this.setRatio();

      const thumbProps: string[] = ['min', 'max', 'position', 'tip'];
      const filteredThumbProps = propertyFilter(options, thumbProps);

      this.thumb.update({
        ...filteredThumbProps,
        ratio: this.options.ratio,
      });

      this.bar.update({
        width: `${(100 / (max - min)) * (position - min)}%`,
      });
    }

    const isThumbUpdated: boolean = hasPosition || hasTip;
    if (isThumbUpdated && !isBoundariesUpdated) {
      const props: string[] = ['min', 'max', 'position', 'tip'];
      const filteredProps = propertyFilter(options, props);

      this.thumb.update(filteredProps);
    }

    const isBarUpdated = hasPosition || hasBar;
    if (isBarUpdated && !isBoundariesUpdated) {
      const props: string[] = ['bar:isEnabled'];
      const filteredProps = propertyFilter(options, props);
      filteredProps.width = `${(100 / (max - min)) * (position - min)}%`;
      this.bar.update(filteredProps);
    }
  }

  private setRatio(): void {
    const { min, max, trackWidth } = this.options;
    this.options.ratio = trackWidth / (max - min);
  }

  private handleWindowResize(): void {
    // track width was not changed
    if (this.options.trackWidth === this.element.clientWidth) return;

    this.options.trackWidth = this.element.clientWidth;
    this.setRatio();
    this.thumb.update({ ratio: this.options.ratio });
  }
}

export default Track;
