import Observable from '../Observable/Observable';
import Track from './Track/Track';

import { TrackOptions } from './Track/Interfaces';
import { State } from '../Model/Interfaces';

import {
  isObject, isDefined, isElement,
  propertyFilter,
} from '../helpers/helpers';

class View extends Observable {
  private options: State;

  private root: HTMLElement;

  private track: Track;

  constructor(rootElem: HTMLElement, options: State) {
    super();

    if (!isDefined(rootElem)) throw new ReferenceError('Root element is not defined');
    if (!isElement(rootElem)) throw new TypeError('Root should be an HTML element');
    this.root = rootElem;

    if (!isDefined(options)) throw new ReferenceError('View options is not defined');
    if (!isObject(options)) throw new TypeError('View options should be an object');
    this.options = options;

    this.applyState = this.applyState.bind(this);

    this.init();
  }

  private init(): void {
    this.root.innerHTML = '';
    this.root.classList.add('o-slider');

    const trackProps: string[] = ['min', 'max', 'position', 'tip'];
    const filteredTrackProps: Partial<TrackOptions> = (
      propertyFilter(this.options as Partial<TrackOptions>, trackProps)
    );

    this.track = new Track({
      ...filteredTrackProps,
      parent: this.root,
      notify: this.notify,
    } as TrackOptions);
  }

  public applyState(options: Partial<State>): void {
    this.options = { ...this.options, ...options };

    const hasMin: boolean = isDefined(options.min);
    const hasMax: boolean = isDefined(options.max);
    const hasPosition: boolean = isDefined(options.position);
    const hasTip: boolean = isDefined(options.tip);

    const isTrackUpdated: boolean = hasMin || hasMax || hasPosition || hasTip;
    if (isTrackUpdated) {
      const props: string[] = ['min', 'max', 'position', 'tip'];
      const filteredProps: Partial<TrackOptions> = (
        propertyFilter(options as Partial<TrackOptions>, props)
      );

      this.track.update(filteredProps);
    }
  }
}

export default View;
