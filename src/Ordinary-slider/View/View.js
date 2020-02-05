import Observable from '../Observable/Observable';

import {
  isObject, isDefined, isElement,
} from '../helpers';

class View extends Observable {
  constructor(rootElem, options) {
    super();

    if (!isDefined(rootElem)) throw new ReferenceError('Root element is not defined');
    if (!isElement(rootElem)) throw new TypeError('Root should be an HTML element');
    this.root = rootElem;

    if (!isDefined(options)) throw new ReferenceError('View options is not defined');
    if (!isObject(options)) throw new TypeError('View options should be an object');
    this.options = options;

    this.init = this.init.bind(this);

    this.applyState = this.applyState.bind(this);
    this.updateBoundaries = this.updateBoundaries.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.setRatio = this.setRatio.bind(this);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);

    this.init();
  }

  init() {
    this.root.innerHTML = '';

    this.slider = document.createElement('div');
    this.slider.classList.add('o-slider');

    this.track = document.createElement('div');
    this.track.classList.add('o-slider__track');

    this.thumb = document.createElement('div');
    this.thumb.classList.add('o-slider__thumb');
    this.updatePosition();

    this.thumb.addEventListener('mousedown', this.handleMouseDown);

    this.track.append(this.thumb);
    this.slider.append(this.track);
    this.root.append(this.slider);

    this.trackWidth = this.track.clientWidth;
    this.setRatio();

    window.addEventListener('resize', this.handleWindowResize);
  }

  applyState(properties) {
    if (!isDefined(properties)) throw new TypeError('applyState argument is not defined');
    if (!isObject(properties)) throw new TypeError('applyState argument should be an object');
    this.options = { ...this.options, ...properties };

    const hasBoundaries = isDefined(properties.min) || isDefined(properties.max);
    const hasPosition = isDefined(properties.position);

    hasBoundaries && this.updateBoundaries(hasPosition);
    hasPosition && this.updatePosition();
  }

  updateBoundaries(hasPosition) {
    this.setRatio();
    !hasPosition && this.updatePosition();
  }

  updatePosition() {
    const { position, min, max } = this.options;
    const gap = max - min;

    this.thumb.style.left = `${(100 / gap) * (position - min)}%`;
  }

  handleMouseDown(e) {
    const isLeftClick = e.which === 1;
    if (!isLeftClick) return;

    const { ratio } = this;
    const { min } = this.options;
    const parentX = this.track.getBoundingClientRect().x;

    document.body.classList.add('Cursor');

    const handleMouseMove = (evt) => {
      const pxPosition = evt.clientX - parentX;
      const position = pxPosition / ratio + min;

      this.notify({ position });
    };

    const handleMouseUp = () => {
      document.body.classList.remove('Cursor');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    e.preventDefault();
  }

  handleWindowResize() {
    // track width was not changed
    if (this.trackWidth === this.track.clientWidth) return;

    this.trackWidth = this.track.clientWidth;
    this.updateBoundaries(true);
  }

  setRatio() {
    const { min, max } = this.options;
    const trackWidth = this.trackWidth || this.track.clientWidth;
    const gap = max - min;

    this.ratio = trackWidth / gap;
  }
}

export default View;
