import Thumb from './Thumb';

import { isDefined, propertyFilter } from '../helpers';

class Track {
  constructor(options) {
    this.options = options;

    this.setRatio = this.setRatio.bind(this);

    this.handleWindowResize = this.handleWindowResize.bind(this);

    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
    this.init();
  }

  init() {
    this.track = document.createElement('div');
    this.track.classList.add('o-slider__track');
    this.options.parent.append(this.track);

    this.options.trackWidth = this.track.clientWidth;
    this.setRatio();

    window.addEventListener('resize', this.handleWindowResize);

    const thumbProps = ['min', 'max', 'position', 'tip', 'ratio', 'notify'];
    const filteredThumbProps = propertyFilter(this.options, thumbProps);

    this.thumb = new Thumb({
      ...filteredThumbProps,
      parent: this.track,
    });
  }

  update(options) {
    this.options = { ...this.options, ...options };

    const hasMin = isDefined(options.min);
    const hasMax = isDefined(options.max);
    const hasPosition = isDefined(options.position);
    const hasTip = isDefined(options.tip);

    const isBoundariesUpdated = hasMin || hasMax;
    if (isBoundariesUpdated) {
      this.setRatio();

      const thumbProps = ['min', 'max', 'position', 'tip'];
      const filteredThumbProps = propertyFilter(options, thumbProps);

      this.thumb.update({
        ...filteredThumbProps,
        ratio: this.options.ratio,
      });
    }

    const isThumbUpdated = hasPosition || hasTip;
    if (isThumbUpdated && !isBoundariesUpdated) {
      const props = ['min', 'max', 'position', 'tip'];
      const filteredProps = propertyFilter(options, props);

      this.thumb.update(filteredProps);
    }
  }

  setRatio() {
    const { min, max, trackWidth } = this.options;
    this.options.ratio = trackWidth / (max - min);
  }

  handleWindowResize() {
    // track width was not changed
    if (this.options.trackWidth === this.track.clientWidth) return;

    this.options.trackWidth = this.track.clientWidth;
    this.setRatio();
    this.thumb.update({ ratio: this.options.ratio });
  }
}

export default Track;
