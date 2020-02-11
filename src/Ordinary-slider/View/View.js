import Observable from '../Observable/Observable';

import Track from './Track';

import {
  isObject, isDefined, isElement,
  propertyFilter,
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

    this.init();
  }

  init() {
    this.root.innerHTML = '';
    this.root.classList.add('o-slider');

    const trackProps = ['min', 'max', 'position', 'tip'];
    const filteredTrackProps = propertyFilter(this.options, trackProps);

    this.track = new Track({
      ...filteredTrackProps,
      parent: this.root,
      notify: this.notify,
    });
  }

  applyState(options) {
    this.options = { ...this.options, ...options };

    const hasMin = isDefined(options.min);
    const hasMax = isDefined(options.max);
    const hasPosition = isDefined(options.position);
    const hasTip = isDefined(options.tip);

    const isTrackUpdated = hasMin || hasMax || hasPosition || hasTip;
    if (isTrackUpdated) {
      const props = ['min', 'max', 'position', 'tip'];
      const filteredProps = propertyFilter(options, props);

      this.track.update(filteredProps);
    }
  }
}

export default View;
