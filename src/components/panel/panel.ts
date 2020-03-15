import Input from '../input/input';

import { PState } from '../../plugin/Model/Interfaces';

type Options = { [k: string]: unknown };

class Panel {
  private element: HTMLElement;

  public fields: { [k: string]: Input } = {};

  private slider: JQuery<object>;

  constructor(elem: HTMLElement) {
    this.element = elem;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSliderChanges = this.handleSliderChanges.bind(this);
    this.setOptions = this.setOptions.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.subscribe = this.subscribe.bind(this);

    this.init();
  }

  protected init(): void {
    !this.element.classList.contains('panel') && this.element.classList.add('panel');

    this.defineFields();
    this.setSlider();
  }

  public getOptions(): Options {
    return { ...this.slider.getSettings() } as Options;
  }

  public setOptions(options: Options): void {
    this.slider.setSettings(options);
  }

  public subscribe(callback: Function): void {
    this.slider.subscribe(callback);
  }

  private defineFields(): void {
    const foundFields = Array.from(this.element.querySelectorAll('.panel__field'));
    const foundCheckboxes = Array.from(this.element.querySelectorAll('.panel__checkbox'));

    [...foundFields, ...foundCheckboxes].forEach((elem) => {
      const field = new Input(elem.querySelector('.input') as HTMLInputElement);
      const name = field.getAttribute('name');

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

    this.slider.setSettings(data);
  }

  private handleSliderChanges(options: PState): void {
    const { fields } = this;
    const { range } = this.getOptions();

    Object.keys(options).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(fields, key)) return;

      switch (key) {
        case 'from':
          fields[key].setAttribute('value', options[key] as number);
          range && fields.to.setAttribute('min', options[key] as number);
          break;

        case 'to':
          fields[key].setAttribute('value', options[key] as number);
          fields.from.setAttribute('max', options[key] as number);
          break;

        case 'min':
        case 'max':
          fields[key].setAttribute('value', options[key] as number);
          break;

        case 'step':
          fields[key].setAttribute('value', options[key] as number);
          fields.from.setAttribute('step', options[key] as number);
          range && fields.to.setAttribute('step', options[key] as number);
          break;

        case 'bar':
        case 'tip':
        case 'vertical':
          fields[key].setAttribute('checked', options[key] as boolean);
          break;

        case 'range':
          options.range ? this.setFieldTo() : this.removeFieldTo();
          fields[key].setAttribute('checked', options[key] as boolean);
          break;

        default: break;
      }
    });
  }

  private setSlider(): void {
    const slider = this.element.querySelector('.panel__slider') as HTMLElement;

    this.slider = $(slider).oSlider();
    this.handleSliderChanges(this.slider.getSettings());
    this.slider.subscribe(this.handleSliderChanges);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  private setFieldTo(): void {
    // eslint-disable-next-line no-bitwise
    const ID = `${(~~(Math.random() * 1e12)).toString(32)}`;
    const fromContainer = this.fields.from.getElement().closest('.panel__field');
    const toContainer = fromContainer?.cloneNode(true) as HTMLElement;

    (toContainer.querySelector('.num-field__label') as HTMLElement).setAttribute('for', ID);
    (toContainer.querySelector('.num-field__title') as HTMLElement).textContent = 'to';

    this.fields.to = new Input(toContainer.querySelector('.input') as HTMLElement);
    this.fields.to.setAttribute('name', 'to');
    this.fields.to.setAttribute('id', ID);
    this.fields.to.getElement().addEventListener('change', this.handleInputChange);
    fromContainer?.after(toContainer);
  }

  private removeFieldTo(): void {
    const toContainer = this.fields.to?.getElement().closest('.panel__field');
    toContainer?.remove();

    delete this.fields.to;
  }
}

export default Panel;
