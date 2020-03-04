import Observable from '../Observable/Observable';
import Track from './Track/Track';

import { TrackOptions } from './Track/Interfaces';
import { State } from '../Model/Interfaces';

import {
  isDefined, isBooleanSpy,
  propertyFilter, setAttributesAsData,
} from '../helpers/helpers';

class View extends Observable {
  private options: State;

  private root: HTMLElement;

  private track: Track;

  private attributesObserver: { [k: string]: Function };

  constructor(rootElem: HTMLElement, options: State) {
    super();

    this.root = rootElem;
    this.options = options;
    this.applyState = this.applyState.bind(this);

    this.handlePositionChanged = this.handlePositionChanged.bind(this);
    this.init();
  }

  private init(): void {
    this.root.innerHTML = '';
    !this.root.classList.contains('o-slider') && this.root.classList.add('o-slider');
    this.root.addEventListener('positionChanged', this.handlePositionChanged as EventListener);

    setAttributesAsData(this.root, this.options);
    this.attributesObserver = this.createAttributesObserver();

    this.handleTrack();
  }

  public applyState(options: Partial<State>): void {
    this.options = { ...this.options, ...options };

    this.attributesObserver.unsubscribe();
    setAttributesAsData(this.root, options);
    this.attributesObserver.subscribe();

    const hasValue = isDefined(options.value);
    const hasMin = isDefined(options.min);
    const hasMax = isDefined(options.max);
    const hasTip = isDefined(options.tip);
    const hasBar = isDefined(options.bar);

    const isTrackUpdated = hasMin || hasMax || hasValue || hasTip || hasBar;
    isTrackUpdated && this.handleTrack(options, 'update');
  }

  private handlePositionChanged(event: CustomEvent): void {
    const { value } = event.detail;
    this.notify({ value });
  }

  private handleTrack(options?: {}, todo?: string): void {
    const storage = (options || this.options) as { [k: string]: unknown };
    const isInit = !isDefined(todo);
    const isUpdate = todo === 'update';

    const propsList: string[] = ['min', 'max', 'value', 'tip', 'bar'];
    const props: Partial<TrackOptions> = propertyFilter(storage, propsList);

    isInit
      && (props.parent = this.root)
      && (this.track = new Track(props as TrackOptions));

    isUpdate && this.track.update(props);
  }

  protected createAttributesObserver(): { [k: string]: Function } {
    const { root, notify } = this;

    function callback(options: any): void {
      Object.keys(options).forEach((record) => {
        const { attributeName, oldValue } = options[record];

        const property = attributeName.split('-')[1];
        let value: string | boolean = root.getAttribute(attributeName) as string;

        isBooleanSpy(oldValue) && (value = value === 'true');

        notify({ [property]: value });
      });
    }

    const observer = new MutationObserver(callback);

    const config = {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: Object.keys(this.options).map((key) => `data-${key}`),
    };

    observer.observe(root, config);

    return {
      subscribe: (): void => observer.observe(root, config),
      unsubscribe: (): void => observer.disconnect(),
    };
  }
}

export default View;
