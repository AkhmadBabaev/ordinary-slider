import Observable from '../Observable/Observable';
import Track from './Track/Track';

import { TrackOptions, PTrackOptions } from './Track/Interfaces';
import { State, PState } from '../Model/Interfaces';

import {
  isBooleanSpy, propertyFilter, setAttributesAsData,
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
    this.handleThumbMove = this.handleThumbMove.bind(this);
    this.init();
  }

  public applyState(options: PState): void {
    this.options = { ...this.options, ...options };

    this.attributesObserver.unsubscribe();
    setAttributesAsData(this.root, options);
    this.attributesObserver.subscribe();

    const updates = new Map(Object.entries(options));

    const isBoundariesUpdated = updates.has('min') || updates.has('max') || updates.has('vertical');
    const isValuesUpdated = updates.has('from') || updates.has('to');

    const isTrackUpdated = isBoundariesUpdated || isValuesUpdated
      || updates.has('tip')
      || updates.has('bar')
      || updates.has('range');

    updates.has('vertical') && this.handleVertical();
    isTrackUpdated && this.track.update(this.handleTrack(options, 'update') as PTrackOptions);
  }

  private init(): void {
    this.root.innerHTML = '';
    this.root.addEventListener('thumbmove', this.handleThumbMove as EventListener);
    !this.root.classList.contains('o-slider') && this.root.classList.add('o-slider');

    setAttributesAsData(this.root, this.options);
    this.handleVertical();

    this.attributesObserver = this.createAttributesObserver();
    this.track = this.handleTrack({ ...this.options }) as Track;
  }

  protected handleVertical(): void {
    if (this.options.vertical) {
      this.root.classList.add('o-slider_is_vertical');
      this.root.classList.remove('o-slider_is_horizontal');
    } else {
      this.root.classList.add('o-slider_is_horizontal');
      this.root.classList.remove('o-slider_is_vertical');
    }
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

  private handleThumbMove(event: CustomEvent): void {
    const { value, key } = event.detail;
    const data: { [k: string]: unknown } = {};

    key === 'thumb:0' && (data.from = value);
    key === 'thumb:1' && (data.to = value);

    this.notify(data);
    event.stopPropagation();
  }

  private handleTrack(
    options: { [k: string]: unknown },
    todo: 'init' | 'update' = 'init',
  ): Track | PTrackOptions {
    const isUpdate = todo === 'update';

    const propsList: string[] = ['min', 'max', 'from', 'to', 'tip', 'bar', 'range', 'vertical'];
    const props: PTrackOptions = propertyFilter(options, propsList);

    if (isUpdate) return props;

    props.parent = this.root;
    return new Track(props as TrackOptions);
  }
}

export default View;
