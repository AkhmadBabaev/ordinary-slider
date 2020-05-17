import { boundMethod } from 'autobind-decorator';

import Observable from '../Observable/Observable';
import { IState, IPState } from '../Model/Interfaces';
import { propertyFilter, isDefined, isBooleanSpy } from '../helpers/helpers';
import EventsHandlers from './EventsHandlers/EventsHandlers';
import { create } from './ComponentsFactory/ComponentsFactory';
import { ITrackOptions, IPTrackOptions } from './Track/Interfaces';
import { IScaleOptions, IPScaleOptions } from './Scale/Interfaces';

class View extends Observable {
  public readonly root: HTMLElement;

  public readonly className: string;

  private options: IState;

  private updates: IPState;

  private ratio: number;

  private sliderLength: number;

  private eventsHandlers: EventsHandlers;

  private attributesObserver: { [k: string]: Function };

  constructor(rootElem: HTMLElement, options: IState) {
    super();

    this.root = rootElem;
    this.options = options;
    this.className = 'o-slider';
    this.eventsHandlers = new EventsHandlers(this);

    this.createAttributesObserver();
    this.setComponentClass();
    this.applyState(options);
    this.eventsHandlers.setListeners();
  }

  @boundMethod
  public applyState(options: IPState): void {
    this.options = { ...this.options, ...options };
    this.updates = options;

    const { min, max, vertical } = this.updates;
    const isDirectionUpdated = isDefined(vertical);
    const isRatioUpdated = isDirectionUpdated || isDefined(min) || isDefined(max);

    isDirectionUpdated && this.handleOptionVertical();
    isDirectionUpdated && this.updateSliderLength();
    isRatioUpdated && this.updateRatio();

    this.setDataAttributes();
    this.createElements();

    delete this.updates;
  }

  @boundMethod
  public getOptions(): IState {
    return this.options;
  }

  @boundMethod
  public calculateValue(position: number): number {
    return this.options.vertical
      ? this.options.max - position / this.ratio
      : position / this.ratio + this.options.min;
  }

  @boundMethod
  public getValues(): number[] {
    const { from, to, range } = this.options;
    const values = range ? [from, to] : [from];

    return values as number[];
  }

  @boundMethod
  public getSliderLength(): number {
    return this.sliderLength;
  }

  @boundMethod
  public updateSliderLength(): void {
    this.sliderLength = this.options.vertical ? this.root.clientHeight : this.root.clientWidth;
  }

  @boundMethod
  public updateRatio(): void {
    const { min, max } = this.options;
    this.ratio = this.getSliderLength() / (max - min);
  }

  @boundMethod
  public createElements(): void {
    this.root.innerHTML = `
      ${create('track', this.generateTrackOptions())}
      ${this.options.scale ? create('scale', this.generateScaleOptions()) : ''}
    `;
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
    const optionsList = ['vertical', 'range', 'bar', 'tip', 'min', 'max', 'className'];
    const options: IPTrackOptions = propertyFilter({ ...this, ...this.options }, optionsList);

    options.values = this.getValues();
    options.activeThumbIndex = this.eventsHandlers.getActiveThumbIndex();
    return options as ITrackOptions;
  }

  private generateScaleOptions(): IScaleOptions {
    const optionsList = ['vertical', 'min', 'max', 'step', 'className'];
    const options: IPScaleOptions = propertyFilter({ ...this, ...this.options }, optionsList);
    const { fontSize, lineHeight } = getComputedStyle(this.root);

    options.scaleLength = this.getSliderLength();
    options.symbolLength = this.options.vertical
      ? parseFloat(lineHeight)
      : parseFloat(fontSize) / 2;

    return options as IScaleOptions;
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
}

export default View;
