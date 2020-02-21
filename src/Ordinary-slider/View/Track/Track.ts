import ViewComponent from '../ViewComponent/ViewComponent';
import Thumb from '../Thumb/Thumb';

import { TrackOptions } from './Interfaces';
import { ThumbOptions } from '../Thumb/Interfaces';

import { isDefined, propertyFilter, debounce } from '../../helpers/helpers';

class Track extends ViewComponent<TrackOptions> {
  private thumb: Thumb;

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

    const thumbProps: string[] = ['min', 'max', 'position', 'tip', 'ratio', 'notify'];
    const filteredThumbProps: Partial<ThumbOptions> = propertyFilter(this.options, thumbProps);

    this.thumb = new Thumb({
      ...filteredThumbProps,
      parent: this.element,
    } as ThumbOptions);
  }

  public update(options: Partial<TrackOptions>): void {
    super.update(options);

    const hasMin: boolean = isDefined(options.min);
    const hasMax: boolean = isDefined(options.max);
    const hasPosition: boolean = isDefined(options.position);
    const hasTip: boolean = isDefined(options.tip);

    const isBoundariesUpdated: boolean = hasMin || hasMax;
    if (isBoundariesUpdated) {
      this.setRatio();

      const thumbProps: string[] = ['min', 'max', 'position', 'tip'];
      const filteredThumbProps: Partial<ThumbOptions> = propertyFilter(options, thumbProps);

      this.thumb.update({
        ...filteredThumbProps,
        ratio: this.options.ratio,
      });
    }

    const isThumbUpdated: boolean = hasPosition || hasTip;
    if (isThumbUpdated && !isBoundariesUpdated) {
      const props: string[] = ['min', 'max', 'position', 'tip'];
      const filteredProps: Partial<ThumbOptions> = propertyFilter(options, props);

      this.thumb.update(filteredProps);
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
