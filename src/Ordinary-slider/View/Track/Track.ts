import Thumb from '../Thumb/Thumb';

import { TrackOptions } from './Interfaces';
import { ThumbOptions } from '../Thumb/Interfaces';

import { isDefined, propertyFilter } from '../../helpers/helpers';

class Track {
  private options: TrackOptions;

  private track: HTMLElement;

  private thumb: Thumb;

  constructor(options: TrackOptions) {
    this.options = options;

    this.handleWindowResize = this.handleWindowResize.bind(this);

    this.update = this.update.bind(this);
    this.init();
  }

  private init(): void {
    this.track = document.createElement('div');
    this.track.classList.add('o-slider__track');
    this.options.parent.append(this.track);

    this.options.trackWidth = this.track.clientWidth;
    this.setRatio();

    window.addEventListener('resize', this.handleWindowResize);

    const thumbProps: string[] = ['min', 'max', 'position', 'tip', 'ratio', 'notify'];
    const filteredThumbProps: Partial<ThumbOptions> = (
      propertyFilter(this.options as Partial<ThumbOptions>, thumbProps)
    );

    this.thumb = new Thumb({
      ...filteredThumbProps,
      parent: this.track,
    } as ThumbOptions);
  }

  public update(options: Partial<TrackOptions>): void {
    this.options = { ...this.options, ...options };

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
    if (this.options.trackWidth === this.track.clientWidth) return;

    this.options.trackWidth = this.track.clientWidth;
    this.setRatio();
    this.thumb.update({ ratio: this.options.ratio });
  }
}

export default Track;
