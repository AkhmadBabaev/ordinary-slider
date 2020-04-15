import { boundMethod } from 'autobind-decorator';

import Observable from '../Observable/Observable';
import { State, PState } from '../Model/Interfaces';
import {
  propertyFilter,
  isBooleanSpy,
  debounce,
  isDefined,
  asyncRender,
  throttle,
} from '../helpers/helpers';
import Track from './Track/Track';
import { TrackOptions } from './Track/Interfaces';

class View extends Observable {
  private element: HTMLElement;

  private fragment: HTMLElement;

  private options: State;

  private updates: PState;

  private ratio: number;

  private activeThumbIndex: number;

  private sliderLength: number;

  private isGrabbed: boolean;

  constructor(rootElem: HTMLElement, options: State) {
    super();

    this.element = rootElem;
    this.render = asyncRender(this.render.bind(this));

    this.setComponentClass();
    this.addConstantListeners();
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

    this.addListeners();
    this.addAttributesWatcher();

    delete this.updates;
  }

  @boundMethod
  public getOptions(): State {
    return this.options;
  }

  private updateElement(): void {
    this.element = this.fragment;
    delete this.fragment;
  }

  private setComponentClass(): void {
    !this.element.classList.contains('o-slider') && this.element.classList.add('o-slider');
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
    const propsList = [
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

  private setActiveThumbIndex(key: string): void {
    this.activeThumbIndex = 0;
    this.options.range && (this.activeThumbIndex = (key === '0') ? 0 : 1);
  }

  private deleteActiveThumbMod(): void {
    const activeClass = 'o-slider__thumb_is_active';
    setTimeout(() => this.element.querySelector(`.${activeClass}`)?.classList.remove(activeClass), 5);
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

  private calculateValue(position: number): number {
    return this.options.vertical
      ? this.options.max - position / this.ratio
      : position / this.ratio + this.options.min;
  }

  @boundMethod
  private handleTrackClick(event: MouseEvent): void {
    const { vertical, range } = this.options;
    const target = event.target as HTMLElement;
    const track = target.closest('.o-slider__track') as HTMLElement;

    const client = vertical ? event.clientY : event.clientX;
    const trackBound = vertical
      ? track.getBoundingClientRect().y
      : track.getBoundingClientRect().x;

    const position = client - trackBound;
    const value = this.calculateValue(position);

    if (!range) {
      this.notify({ from: value });
      return;
    }

    const [first, second] = this.getValues();
    const distanceToFirst = value - first;
    const distanceToSecond = second - value;

    distanceToFirst >= distanceToSecond
      ? this.notify({ to: value })
      : this.notify({ from: value });

    event.preventDefault();
  }

  @boundMethod
  private handleThumbMouseDown(mouseDownEvent: MouseEvent): void {
    // if it isn't left click
    if (!(mouseDownEvent.which === 1)) return;

    const target = mouseDownEvent.target as HTMLElement;
    const thumb = target.closest('.o-slider__thumb') as HTMLElement;
    const { offsetX, offsetY } = mouseDownEvent;

    if (!thumb) return;

    thumb.classList.add('o-slider__thumb_is_active');
    this.coverElement('on');
    this.isGrabbed = true;

    const { vertical } = this.options;
    const slider = this.element;

    const targetLength = vertical ? target.clientHeight : target.clientWidth;
    const offset = vertical ? offsetY : offsetX;
    const shift = offset - (targetLength / 2);
    const sliderBound = vertical
      ? slider.getBoundingClientRect().y
      : slider.getBoundingClientRect().x;

    const handleDocumentMouseMove = throttle((event: MouseEvent): void => {
      const client = vertical ? event.clientY : event.clientX;
      const position = client - sliderBound - shift;
      const value = this.calculateValue(position);
      const data: { [k: string]: number } = {};

      thumb.dataset.key === '0' ? (data.from = value) : (data.to = value);

      this.isGrabbed
        ? this.setActiveThumbIndex(thumb.dataset.key as string)
        : delete this.activeThumbIndex;

      this.notify(data);
    }, 40);

    const handleDocumentMouseUp = (): void => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);

      this.deleteActiveThumbMod();
      this.coverElement('off');
      delete this.isGrabbed;
    };

    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleDocumentMouseUp);
    mouseDownEvent.preventDefault();
  }

  private coverElement(value: 'on' | 'off'): void {
    const { body } = document;
    const coverClass = 'o-slider__window-cover';
    const cover = body.querySelector(`.${coverClass}`) as HTMLElement;

    if (value === 'on') {
      cover
        ? cover.removeAttribute('style')
        : body.insertAdjacentHTML('afterbegin', `<div class=${coverClass}></div>`);
    } else cover.style.display = 'none';
  }

  private addListeners(): void {
    this.element.addEventListener('click', this.handleTrackClick);
    this.element.addEventListener('mousedown', this.handleThumbMouseDown);
  }

  private addConstantListeners(): void {
    window.addEventListener('resize', debounce(this.handleWindowResize.bind(this), 150));
  }
}

export default View;
