import Observable from '../Observable/Observable';
import Track from './Track/Track';

import { State, PState } from '../Model/Interfaces';
import { TrackOptions } from './Track/Interfaces';

import {
  propertyFilter,
  isBooleanSpy,
  debounce,
  isDefined,
  asyncRender,
} from '../helpers/helpers';

import { EVENT_THUMBMOVE, EVENT_THUMBSTOP } from './constants';

class View extends Observable {
  private element: HTMLElement;

  private fragment: HTMLElement;

  private options: State;

  private updates: PState;

  private ratio: number;

  private activeThumbIndex: number;

  private sliderLength: number;

  constructor(rootElem: HTMLElement, options: State) {
    super();

    this.element = rootElem;
    this.getOptions = this.getOptions.bind(this);
    this.handleThumbMove = this.handleThumbMove.bind(this);
    this.handleThumbStop = this.handleThumbStop.bind(this);
    this.handleWindowResize = debounce(this.handleWindowResize.bind(this), 150);
    this.render = asyncRender(this.render.bind(this));

    this.setComponentClass();
    this.addOtherListeners();
    this.render(options);
  }

  public async render(options: PState): Promise<void> {
    this.options = { ...this.options, ...options };
    this.updates = options;

    this.createFragment();
    this.createTrack();

    await this.reflow();

    this.updateElement();

    this.setSliderLength();
    this.setRatio();

    this.addElementListeners();
    this.addAttributesWatcher();

    delete this.updates;
  }

  public getOptions(): State {
    return this.options;
  }

  private updateElement(): void {
    this.element = this.fragment;
    delete this.fragment;
  }

  private setComponentClass(): void {
    this.element.classList.add('o-slider');
  }

  private getValues(): number[] {
    const { from, to, range } = this.options;
    const values = range ? [from, to] : [from];

    return values as number[];
  }

  private async reflow(): Promise<void> {
    await new Promise((resolve) => requestAnimationFrame(() => {
      this.element.replaceWith(this.fragment);
      resolve();
    }));
  }

  private createFragment(): void {
    this.fragment = this.element.cloneNode() as HTMLElement;

    this.handleVerticalParameter();
    this.setDataAttributes();
  }

  private createTrack(): void {
    const propsList: string[] = [
      'activeThumbIndex',
      'fragment:parent',
      'vertical',
      'range',
      'tip',
      'bar',
      'min',
      'max',
    ];

    const props = propertyFilter({ ...this, ...this.options }, propsList);
    const values = this.getValues();

    new Track({ ...props, values } as TrackOptions);
  }

  private getSliderLength(): number {
    return this.options.vertical ? this.element.clientHeight : this.element.clientWidth;
  }

  private setSliderLength(): void {
    if (!isDefined(this.options.vertical)) return;
    this.sliderLength = this.getSliderLength();
  }

  private setRatio(): void {
    const { min, max } = this.options;
    this.ratio = this.sliderLength / (max - min);
  }

  private handleVerticalParameter(): void {
    if (!isDefined(this.updates.vertical)) return;

    if (this.options.vertical) {
      this.fragment.classList.add('o-slider_is_vertical');
      this.fragment.classList.remove('o-slider_is_horizontal');
    } else {
      this.fragment.classList.add('o-slider_is_horizontal');
      this.fragment.classList.remove('o-slider_is_vertical');
    }
  }

  private setDataAttributes(): void {
    const attrs = this.updates as { [k: string]: string };
    Object.keys(attrs).forEach((key) => this.fragment.setAttribute(`data-${key}`, attrs[key]));
  }

  private handleThumbMove(event: CustomEvent): void {
    const { position, element } = event.detail;
    const { min, max, vertical } = this.options;

    const value = vertical
      ? max - position / this.ratio
      : position / this.ratio + min;

    const isTrack = element.dataset.name === 'track';
    const isThumb = element.dataset.name === 'thumb';
    let data: { [k: string]: unknown } = {};

    isTrack && (data = this.handleThumbMoveFromTrack(value));
    isThumb && (data = this.handleThumbMoveFromThumbs(element, value));

    this.notify(data);
    event.stopPropagation();
  }

  private handleThumbMoveFromTrack(value: number): { [k: string]: number } {
    const data: { [k: string]: number } = {};
    const [first, second] = this.getValues();

    if (!this.options.range) return { from: value };

    const distanceToFirst = value - first;
    const distanceToSecond = second - value;

    distanceToFirst >= distanceToSecond
      ? data.to = value
      : data.from = value;

    return data;
  }

  private handleThumbMoveFromThumbs(thumb: HTMLElement, value: number): { [k: string]: number } {
    const { key, active: isActive } = thumb.dataset;
    const data: { [k: string]: number } = {};

    key === '0' && (data.from = value);
    key === '1' && (data.to = value);

    isActive && this.handleActiveThumbIndex(key as string);
    return data;
  }

  private handleActiveThumbIndex(key: string): void {
    this.activeThumbIndex = 0;
    this.options.range && (this.activeThumbIndex = (key === '0') ? 0 : 1);
  }

  private handleThumbStop(event: CustomEvent): void {
    const thumbSelector = '[data-name="thumb"][data-active="true"]';
    setTimeout(() => this.element.querySelector(thumbSelector)?.removeAttribute('data-active'), 0);

    delete this.activeThumbIndex;
    event.stopPropagation();
  }

  private handleWindowResize(): void {
    // if length was not changed
    if (this.sliderLength === this.getSliderLength()) return;

    this.sliderLength = this.getSliderLength();
    this.setRatio();
  }

  private addAttributesWatcher(): void {
    const { notify, element } = this;

    function callback(options: any): void {
      Object.keys(options).forEach((record) => {
        const { attributeName, oldValue } = options[record];
        const property = attributeName.split('-')[1];
        let value: string | boolean = element.getAttribute(attributeName) as string;

        isBooleanSpy(oldValue) && (value = value === 'true');
        notify({ [property]: value });
      });
    }

    new MutationObserver(callback).observe(element, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: Object.keys(this.options).map((key) => `data-${key}`),
    });
  }

  private addElementListeners(): void {
    this.element.addEventListener(EVENT_THUMBMOVE, this.handleThumbMove as EventListener);
    this.element.addEventListener(EVENT_THUMBSTOP, this.handleThumbStop as EventListener);
  }

  private addOtherListeners(): void {
    window.addEventListener('resize', this.handleWindowResize);
  }
}

export default View;
