import Observable from '../Observable/Observable';
import Track from './Track/Track';

import { TrackOptions } from './Track/Interfaces';
import { State } from '../Model/Interfaces';

import { isDefined, propertyFilter } from '../helpers/helpers';

class View extends Observable {
  private options: State;

  private root: HTMLElement;

  private track: Track;

  constructor(rootElem: HTMLElement, options: State) {
    super();

    this.root = rootElem;
    this.options = options;

    this.applyState = this.applyState.bind(this);

    this.init();
  }

  private init(): void {
    this.root.innerHTML = '';
    this.root.classList.add('o-slider');

    const trackProps: string[] = ['min', 'max', 'position', 'tip'];
    const filteredTrackProps = propertyFilter(this.options, trackProps);

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
      const filteredProps = propertyFilter(options, props);

      this.track.update(filteredProps);
    }
  }
}

export default View;
