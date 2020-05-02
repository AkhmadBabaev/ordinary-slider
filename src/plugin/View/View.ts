import { boundMethod } from 'autobind-decorator';

import Observable from '../Observable/Observable';
import { IState, IPState } from '../Model/Interfaces';
import {
  propertyFilter,
  isDefined,
  throttle,
  debounce,
  isBooleanSpy,
} from '../helpers/helpers';
import { create } from './ComponentsFactory/ComponentsFactory';
import { ITrackOptions, IPTrackOptions } from './Track/Interfaces';

class View extends Observable {
  private readonly root: HTMLElement;

  private options: IState;

  private updates: IPState;

  private ratio: number;

  private sliderLength: number;

  private activeThumbIndex: number;

  private isGrabbed: boolean;

  private attributesObserver: { [k: string]: Function };

  private readonly className = 'o-slider';

  constructor(rootElem: HTMLElement, options: IState) {
    super();

    this.root = rootElem;
    this.options = options;

    this.createAttributesObserver();
    this.setComponentClass();
    this.applyState(options);
    this.addListeners();
  }

  @boundMethod
  public applyState(options: IPState): void {
    this.options = { ...this.options, ...options };
    this.updates = options;

    const { min, max, vertical } = this.updates;
    const isDirectionUpdated = isDefined(vertical);
    const isRatioUpdated = isDirectionUpdated || isDefined(min) || isDefined(max);

    isDirectionUpdated && this.handleOptionVertical();

    this.setDataAttributes();
    this.createTrack();

    isDirectionUpdated && this.setSliderLength();
    isRatioUpdated && this.setRatio();

    delete this.updates;
  }

  @boundMethod
  public getOptions(): IState {
    return this.options;
  }

  private createTrack(): void {
    this.root.innerHTML = create('track', this.generateTrackOptions());
  }

  private handleOptionVertical(): void {
    if (this.options.vertical) {
      this.root.classList.add(`${this.className}_direction_vertical`);
      this.root.classList.remove(`${this.className}_direction_horizontal`);
    } else {
      this.root.classList.add(`${this.className}_direction_horizontal`);
      this.root.classList.remove(`${this.className}_direction_vertical`);
    }
  }

  private setDataAttributes(): void {
    this.attributesObserver.unsubscribe();
    const attrs = this.updates as { [k: string]: string };
    Object.keys(attrs).forEach((key) => this.root.setAttribute(`data-${key}`, attrs[key]));
    this.attributesObserver.subscribe();
  }

  private setComponentClass(): void {
    !this.root.classList.contains(this.className) && this.root.classList.add(this.className);
  }

  private generateTrackOptions(): ITrackOptions {
    const values = this.getValues();
    const trackOptionsList = ['vertical', 'range', 'bar', 'tip', 'min', 'max', 'className', 'activeThumbIndex'];
    const trackOptions: IPTrackOptions = propertyFilter({
      ...this,
      ...this.options,
    }, trackOptionsList);

    trackOptions.values = values;
    return trackOptions as ITrackOptions;
  }

  private getValues(): number[] {
    const { from, to, range } = this.options;
    const values = range ? [from, to] : [from];

    return values as number[];
  }

  private getSliderLength(): number {
    return this.options.vertical ? this.root.clientHeight : this.root.clientWidth;
  }

  private setSliderLength(): void {
    this.sliderLength = this.getSliderLength();
  }

  private setRatio(): void {
    const { min, max } = this.options;
    this.ratio = this.sliderLength / (max - min);
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
    const trackElement = target.closest(`.${this.className}__track`) as HTMLElement;

    const client = vertical ? event.clientY : event.clientX;
    const trackBound = vertical
      ? trackElement.getBoundingClientRect().y
      : trackElement.getBoundingClientRect().x;

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

  private handleDocumentMouseMoveContent(
    mouseMoveEvent: MouseEvent,
    thumbElement: HTMLElement,
    sliderBound: number,
    shift: number,
  ): void {
    const client = this.options.vertical ? mouseMoveEvent.clientY : mouseMoveEvent.clientX;
    const position = client - sliderBound - shift;
    const value = this.calculateValue(position);
    const data: { [k: string]: number } = {};
    const { key } = thumbElement.dataset;

    key === '0' ? (data.from = value) : (data.to = value);

    this.notify(data);
    this.isGrabbed
      ? this.setActiveThumbIndex(key as string)
      : delete this.activeThumbIndex;
  }

  private handleDocumentMouseUpContent(
    thumbMouseMoveHandler: EventListener,
    thumbMouseUpHandler: EventListener,
  ): void {
    document.removeEventListener('mousemove', thumbMouseMoveHandler);
    document.removeEventListener('mouseup', thumbMouseUpHandler);

    this.deleteActiveThumbMod();
    this.coverElement('off');

    delete this.activeThumbIndex;
    delete this.isGrabbed;
  }

  @boundMethod
  private handleThumbMouseDown(mouseDownEvent: MouseEvent): void {
    // if it isn't left click
    if (!(mouseDownEvent.which === 1)) return;

    const target = mouseDownEvent.target as HTMLElement;
    const thumbElement = target.closest(`.${this.className}__thumb`) as HTMLElement;
    const { offsetX, offsetY } = mouseDownEvent;

    if (!thumbElement) return;

    thumbElement.classList.add(`${this.className}__thumb_type_active`);
    this.coverElement('on');
    this.isGrabbed = true;

    const { vertical } = this.options;
    const targetLength = vertical ? target.clientHeight : target.clientWidth;
    const offset = vertical ? offsetY : offsetX;
    const shift = offset - (targetLength / 2);
    const sliderBound = vertical
      ? this.root.getBoundingClientRect().y
      : this.root.getBoundingClientRect().x;

    const handleDocumentMouseMove = throttle((mouseMoveEvent: MouseEvent): void => {
      this.handleDocumentMouseMoveContent(mouseMoveEvent, thumbElement, sliderBound, shift);
    }, 40);

    const handleDocumentMouseUp = (): void => {
      this.handleDocumentMouseUpContent(handleDocumentMouseMove, handleDocumentMouseUp);
    };

    this.addInnerMouseDownListeners(handleDocumentMouseMove, handleDocumentMouseUp);
    mouseDownEvent.preventDefault();
  }

  private addInnerMouseDownListeners(
    thumbMouseMoveHandler: EventListener,
    thumbMouseUpHandler: EventListener,
  ): void {
    document.addEventListener('mousemove', thumbMouseMoveHandler);
    document.addEventListener('mouseup', thumbMouseUpHandler);
  }

  private handleThumbTouchMoveContent(
    touchMoveEvent: TouchEvent,
    thumbElement: HTMLElement,
    sliderBound: number,
    shift: number,
  ): void {
    if (touchMoveEvent.touches.length > 1) return;

    const client = this.options.vertical
      ? touchMoveEvent.touches[0].clientY
      : touchMoveEvent.touches[0].clientX;

    const position = client - sliderBound - shift;
    const value = this.calculateValue(position);
    const data: { [k: string]: number } = {};
    const { key } = thumbElement.dataset;

    key === '0' ? (data.from = value) : (data.to = value);

    this.notify(data);
    this.isGrabbed
      ? this.setActiveThumbIndex(key as string)
      : delete this.activeThumbIndex;
  }

  private handleThumbTouchEndContent(
    target: HTMLElement,
    thumbTouchMoveHandler: EventListener,
    thumbTouchUpHandler: EventListener,
  ): void {
    target.removeEventListener('touchmove', thumbTouchMoveHandler);
    target.removeEventListener('touchend', thumbTouchUpHandler);

    this.deleteActiveThumbMod();
    delete this.activeThumbIndex;
    delete this.isGrabbed;
  }

  @boundMethod
  private handleThumbTouchStart(touchStartEvent: TouchEvent): void {
    if (touchStartEvent.touches.length > 1) return;

    const target = touchStartEvent.target as HTMLElement;
    const thumbElement = target.closest(`.${this.className}__thumb`) as HTMLElement;

    if (!thumbElement) return;

    thumbElement.classList.add(`${this.className}__thumb_type_active`);
    this.isGrabbed = true;

    const { vertical } = this.options;
    const targetLength = vertical ? target.clientHeight : target.clientWidth;
    const offset = vertical
      ? touchStartEvent.touches[0].clientY
      : touchStartEvent.touches[0].clientX;

    const targetBound = vertical
      ? target.getBoundingClientRect().y
      : target.getBoundingClientRect().x;

    const sliderBound = vertical
      ? this.root.getBoundingClientRect().y
      : this.root.getBoundingClientRect().x;
    const shift = offset - targetBound - (targetLength / 2);

    const handleThumbTouchMove = throttle((touchMoveEvent: TouchEvent): void => {
      this.handleThumbTouchMoveContent(touchMoveEvent, thumbElement, sliderBound, shift);
    }, 40);

    const handleThumbTouchEnd = (): void => {
      this.handleThumbTouchEndContent(target, handleThumbTouchMove, handleThumbTouchEnd);
    };

    this.addInnerTouchStartListeners(target, handleThumbTouchMove, handleThumbTouchEnd);
    touchStartEvent.preventDefault();
  }

  private addInnerTouchStartListeners(
    target: HTMLElement,
    thumbTouchMoveHandler: EventListener,
    thumbTouchUpHandler: EventListener,
  ): void {
    target.addEventListener('touchmove', thumbTouchMoveHandler, { passive: false });
    target.addEventListener('touchend', thumbTouchUpHandler);
  }

  private deleteActiveThumbMod(): void {
    const activeClass = `${this.className}__thumb_type_active`;
    this.root.querySelector(`.${activeClass}`)?.classList.remove(activeClass);
  }

  private setActiveThumbIndex(key: string): void {
    this.activeThumbIndex = 0;
    this.options.range && (this.activeThumbIndex = (key === '0') ? 0 : 1);
  }

  private handleWindowResize(): void {
    // if length was not changed
    if (this.sliderLength === this.getSliderLength()) return;
    this.setSliderLength();
    this.setRatio();
  }

  private createAttributesObserver(): void {
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

    this.attributesObserver = {
      subscribe: (): void => observer.observe(root, config),
      unsubscribe: (): void => observer.disconnect(),
    };
  }

  private coverElement(value: 'on' | 'off'): void {
    const { body } = document;
    const coverClass = `${this.className}__window-cover`;
    const coverElement = body.querySelector(`.${coverClass}`) as HTMLElement;

    if (value === 'on') {
      coverElement
        ? coverElement.removeAttribute('style')
        : body.insertAdjacentHTML('afterbegin', `<div class=${coverClass}></div>`);
    } else coverElement.style.display = 'none';
  }

  private addListeners(): void {
    this.root.addEventListener('click', this.handleTrackClick);
    this.root.addEventListener('mousedown', this.handleThumbMouseDown);
    this.root.addEventListener('touchstart', this.handleThumbTouchStart, { passive: false });

    window.addEventListener('resize', debounce(this.handleWindowResize.bind(this), 150));
  }
}

export default View;
