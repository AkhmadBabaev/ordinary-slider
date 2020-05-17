import { boundMethod } from 'autobind-decorator';

import { throttle, debounce } from '../../helpers/helpers';
import View from '../View';

class EventsHandlers {
  private isGrabbed: boolean;

  private activeThumbIndex: number;

  private view: View;

  constructor(view: View) {
    this.view = view;
  }

  @boundMethod
  public setListeners(): void {
    this.view.root.addEventListener('click', this.handleTrackClick);
    this.view.root.addEventListener('click', this.handleScaleItemClick);
    this.view.root.addEventListener('mousedown', this.handleThumbMouseDown);
    this.view.root.addEventListener('touchstart', this.handleThumbTouchStart, { passive: false });

    window.addEventListener('resize', debounce(this.handleWindowResize.bind(this), 150));
  }

  @boundMethod
  public getActiveThumbIndex(): number {
    return this.activeThumbIndex;
  }

  @boundMethod
  private handleTrackClick(event: MouseEvent): void {
    const { vertical, range } = this.view.getOptions();
    const target = event.target as HTMLElement;
    const trackElement = target.closest(`.js-${this.view.className}__track`) as HTMLElement;
    if (!trackElement) return;

    const client = vertical ? event.clientY : event.clientX;
    const trackBound = this.getClientBound(trackElement);

    const position = client - trackBound;
    const value = this.view.calculateValue(position);
    const nearestThumb = range ? this.detectNearestThumb(value) : 'from';

    this.view.notify({ [nearestThumb]: value });
    event.preventDefault();
  }

  @boundMethod
  private handleScaleItemClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('js-scale__item')) return;

    const value = Number(target.textContent);
    this.view.notify({ [this.detectNearestThumb(value)]: value });
    event.preventDefault();
  }

  @boundMethod
  private handleThumbMouseDown(mouseDownEvent: MouseEvent): void {
    // if it isn't left click
    if (mouseDownEvent.button !== 0) return;

    const target = mouseDownEvent.target as HTMLElement;
    const thumbElement = target.closest(`.js-${this.view.className}__thumb`) as HTMLElement;
    if (!thumbElement) return;

    thumbElement.classList.add(`${this.view.className}__thumb_type_active`);
    this.coverElement('on');
    this.isGrabbed = true;

    const { vertical } = this.view.getOptions();
    const targetLength = vertical ? target.clientHeight : target.clientWidth;
    const offset = vertical ? mouseDownEvent.offsetY : mouseDownEvent.offsetX;
    const shift = offset - (targetLength / 2);
    const sliderBound = this.getClientBound(this.view.root);

    const handleDocumentMouseMoveWrapper = throttle((mouseMoveEvent: MouseEvent): void => {
      this.handleDocumentMouseMove(mouseMoveEvent, thumbElement, sliderBound, shift);
    }, 40);

    const handleDocumentMouseUpWrapper = (): void => {
      this.handleDocumentMouseUp(handleDocumentMouseMoveWrapper, handleDocumentMouseUpWrapper);
    };

    this.addInnerMouseDownListeners(handleDocumentMouseMoveWrapper, handleDocumentMouseUpWrapper);
    mouseDownEvent.preventDefault();
  }

  private handleDocumentMouseMove(
    mouseMoveEvent: MouseEvent,
    thumbElement: HTMLElement,
    sliderBound: number,
    shift: number,
  ): void {
    const client = this.view.getOptions().vertical
      ? mouseMoveEvent.clientY
      : mouseMoveEvent.clientX;

    const position = client - sliderBound - shift;
    const value = this.view.calculateValue(position);
    const data: { [k: string]: number } = {};
    const { key } = thumbElement.dataset;

    key === '0' ? (data.from = value) : (data.to = value);

    this.view.notify(data);
    this.isGrabbed
      ? this.setActiveThumbIndex(key as string)
      : delete this.activeThumbIndex;
  }

  private handleDocumentMouseUp<T extends EventListener>(moveHandler: T, upHandler: T): void {
    document.removeEventListener('mousemove', moveHandler);
    document.removeEventListener('mouseup', upHandler);

    this.deleteActiveThumbMod();
    this.coverElement('off');

    delete this.activeThumbIndex;
    delete this.isGrabbed;
  }

  private addInnerMouseDownListeners<T extends EventListener>(moveHandler: T, upHandler: T): void {
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  }

  @boundMethod
  private handleThumbTouchStart(touchStartEvent: TouchEvent): void {
    if (touchStartEvent.touches.length > 1) return;

    const target = touchStartEvent.target as HTMLElement;
    const thumbElement = target.closest(`.js-${this.view.className}__thumb`) as HTMLElement;
    if (!thumbElement) return;

    thumbElement.classList.add(`${this.view.className}__thumb_type_active`);
    this.isGrabbed = true;

    const { vertical } = this.view.getOptions();
    const targetLength = vertical ? target.clientHeight : target.clientWidth;
    const offset = vertical
      ? touchStartEvent.touches[0].clientY
      : touchStartEvent.touches[0].clientX;

    const targetBound = this.getClientBound(target);
    const sliderBound = this.getClientBound(this.view.root);
    const shift = offset - targetBound - (targetLength / 2);

    const handleThumbTouchMoveWrapper = throttle((touchMoveEvent: TouchEvent): void => {
      this.handleThumbTouchMove(touchMoveEvent, thumbElement, sliderBound, shift);
    }, 40);

    const handleThumbTouchEndWrapper = (): void => {
      this.handleThumbTouchEnd(target, handleThumbTouchMoveWrapper, handleThumbTouchEndWrapper);
    };

    this.addInnerTouchStartListeners(
      target,
      handleThumbTouchMoveWrapper,
      handleThumbTouchEndWrapper,
    );
    touchStartEvent.preventDefault();
  }

  private handleThumbTouchMove(
    touchMoveEvent: TouchEvent,
    thumbElement: HTMLElement,
    sliderBound: number,
    shift: number,
  ): void {
    if (touchMoveEvent.touches.length > 1) return;

    const client = this.view.getOptions().vertical
      ? touchMoveEvent.touches[0].clientY
      : touchMoveEvent.touches[0].clientX;

    const position = client - sliderBound - shift;
    const value = this.view.calculateValue(position);
    const data: { [k: string]: number } = {};
    const { key } = thumbElement.dataset;

    key === '0' ? (data.from = value) : (data.to = value);

    this.view.notify(data);
    this.isGrabbed
      ? this.setActiveThumbIndex(key as string)
      : delete this.activeThumbIndex;
  }

  private handleThumbTouchEnd(
    target: HTMLElement,
    moveHandler: EventListener,
    endHandler: EventListener,
  ): void {
    target.removeEventListener('touchmove', moveHandler);
    target.removeEventListener('touchend', endHandler);

    this.deleteActiveThumbMod();
    delete this.activeThumbIndex;
    delete this.isGrabbed;
  }

  private addInnerTouchStartListeners(
    target: HTMLElement,
    moveHandler: EventListener,
    endHandler: EventListener,
  ): void {
    target.addEventListener('touchmove', moveHandler, { passive: false });
    target.addEventListener('touchend', endHandler);
  }

  private handleWindowResize(): void {
    // if length was not changed
    if (this.view.sliderLength === this.view.getSliderLength()) return;
    this.view.setSliderLength();
    this.view.setRatio();
    this.view.createElements();
  }

  private coverElement(value: 'on' | 'off'): void {
    const { body } = document;
    const className = `${this.view.className}__window-cover`;
    const cover = body.querySelector(`.${className}`) as HTMLElement;

    if (value === 'on') {
      cover
        ? cover.removeAttribute('style')
        : body.insertAdjacentHTML('afterbegin', `<div class=${className}></div>`);
    } else cover.style.display = 'none';
  }

  private detectNearestThumb(value: number): string {
    const [first, second] = this.view.getValues();
    const distanceToFirst = value - first;
    const distanceToSecond = second - value;
    return (distanceToFirst >= distanceToSecond) ? 'to' : 'from';
  }

  private deleteActiveThumbMod(): void {
    const activeClass = `${this.view.className}__thumb_type_active`;
    this.view.root.querySelector(`.${activeClass}`)?.classList.remove(activeClass);
  }

  private setActiveThumbIndex(key: string): void {
    this.activeThumbIndex = 0;
    this.view.getOptions().range && (this.activeThumbIndex = (key === '0') ? 0 : 1);
  }

  private getClientBound(element: Element): number {
    return this.view.getOptions().vertical
    ? element.getBoundingClientRect().y
    : element.getBoundingClientRect().x;
  }
}

export default EventsHandlers;
