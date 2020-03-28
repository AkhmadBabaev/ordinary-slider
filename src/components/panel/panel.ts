import Input from '../input/input';

import { PState } from '../../plugin/Model/Interfaces';

import { isDefined } from '../../plugin/helpers/helpers';

type Settings = { [k: string]: unknown };

class Panel {
  private element: HTMLElement;

  public fields: { [k: string]: Input } = {};

  private $slider: JQuery<object>;

  constructor(elem: HTMLElement) {
    this.element = elem;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSliderChanges = this.handleSliderChanges.bind(this);
    this.settings = this.settings.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.init();
  }

  public settings(options?: Settings): Settings | void {
    if (isDefined(options)) this.$slider.oSlider('settings', options);
    return this.$slider.oSlider('settings') as PState as Settings;
  }

  public subscribe(callback: Function): void {
    this.$slider.oSlider('subscribe', callback);
  }

  public unsubscribe(callback: Function): void {
    this.$slider.oSlider('unsubscribe', callback);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  protected init(): void {
    this.defineFields();
    this.setSlider();
  }

  private defineFields(): void {
    const foundFields = Array.from(this.element.querySelectorAll('.js-panel__field'));
    const foundCheckboxes = Array.from(this.element.querySelectorAll('.js-panel__checkbox'));

    [...foundFields, ...foundCheckboxes].forEach((elem) => {
      const field = new Input(elem.querySelector('.input') as HTMLInputElement);
      const name = field.getAttr('name');

      switch (name) {
        case 'from':
        case 'to':
        case 'min':
        case 'max':
        case 'step':
        case 'bar':
        case 'tip':
        case 'range':
        case 'vertical':
          this.fields[name] = field;
          field.getElement().addEventListener('change', this.handleInputChange);
          break;

        default: break;
      }
    });
  }

  private handleInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const data = { [target.name]: target.type === 'checkbox' ? target.checked : Number(target.value) };

    this.settings(data);
  }

  private handleSliderChanges(options: PState): void {
    const { range } = this.settings() as Settings;
    const { fields } = this;

    Object.keys(options).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(fields, key)) return;
      const value = options[key as keyof PState] as number | boolean;

      switch (key) {
        case 'from':
        case 'to':
        case 'min':
        case 'max':
        case 'step':
          fields[key].setAttr('value', value);
          break;

        case 'bar':
        case 'tip':
        case 'range':
        case 'vertical':
          fields[key].setAttr('checked', value);
          break;

        default: break;
      }

      switch (key) {
        case 'from':
          range && fields.to.setAttr('min', value);
          break;

        case 'to':
          fields.from.setAttr('max', value);
          break;

        case 'step':
          fields.from.setAttr('step', value);
          range && fields.to.setAttr('step', value);
          break;

        case 'range':
          options.range ? this.setFieldTo() : this.removeFieldTo();
          !options.range && fields.from.getElement().removeAttribute('max');
          break;

        default: break;
      }
    });
  }

  private setSlider(): void {
    const slider = this.element.querySelector('.js-panel__slider') as HTMLElement;

    this.$slider = $(slider).oSlider() as JQuery<object>;
    this.subscribe(this.handleSliderChanges);
    this.handleSliderChanges(this.settings() as Settings);
  }

  private setFieldTo(): void {
    // eslint-disable-next-line no-bitwise
    const ID = `${(~~(Math.random() * 1e12)).toString(32)}`;
    const fromContainer = this.fields.from.getElement().closest('.js-panel__field');
    const toContainer = fromContainer?.cloneNode(true) as HTMLElement;

    (toContainer.querySelector('.num-field__label') as HTMLElement).setAttribute('for', ID);
    (toContainer.querySelector('.num-field__title') as HTMLElement).textContent = 'to';

    const { from, to } = this.settings() as PState;

    this.fields.to = new Input(toContainer.querySelector('.input') as HTMLElement);
    this.fields.to.setAttr('name', 'to');
    this.fields.to.setAttr('id', ID);
    this.fields.to.setAttr('value', String(to));
    this.fields.to.setAttr('min', String(from));
    this.fields.to.getElement().removeAttribute('max');
    this.fields.to.getElement().addEventListener('change', this.handleInputChange);
    fromContainer?.after(toContainer);
  }

  private removeFieldTo(): void {
    const toContainer = this.fields.to?.getElement().closest('.js-panel__field');
    toContainer?.remove();

    delete this.fields.to;
  }
}

export default Panel;
