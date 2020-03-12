import Input from '../input/input';

import { PState } from '../../plugin/Model/Interfaces';

type Options = { [k: string]: unknown };

class Panel {
  private element: HTMLElement;

  public fields: { [k: string]: Input } = {};

  private slider: JQuery<object>;

  constructor(elem: HTMLElement) {
    this.element = elem;
    this.setOptions = this.setOptions.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.bindHandlers();
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
    const foundFields = this.element.querySelectorAll('.panel__field');
    const foundCheckboxes = this.element.querySelectorAll('.panel__checkbox');

    foundFields.length && foundFields.forEach((elem) => {
      const field = new Input(elem.querySelector('.input') as HTMLElement);

      switch (field.getAttribute('name')) {
        case 'from':
          this.fields.from = field;
          field.getElement().addEventListener('change', this.handleFromChanges);
          break;

        case 'min':
          this.fields.min = field;
          field.getElement().addEventListener('change', this.handleMinChanges);
          break;

        case 'max':
          this.fields.max = field;
          field.getElement().addEventListener('change', this.handleMaxChanges);
          break;

        case 'step':
          this.fields.step = field;
          field.getElement().addEventListener('change', this.handleStepChanges);
          break;

        default: break;
      }
    });

    foundCheckboxes.length && foundCheckboxes.forEach((elem) => {
      const field = new Input(elem.querySelector('.input') as HTMLElement);

      switch (field.getAttribute('name')) {
        case 'bar':
          this.fields.bar = field;
          field.getElement().addEventListener('change', this.handleBarChanges);
          break;

        case 'tip':
          this.fields.tip = field;
          field.getElement().addEventListener('change', this.handleTipChanges);
          break;

        default: break;
      }
    });
  }

  private handleFromChanges(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.slider.setSettings({ from: Number(target.value) });
  }

  private handleMinChanges(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.slider.setSettings({ min: Number(target.value) });
  }

  private handleMaxChanges(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.slider.setSettings({ max: Number(target.value) });
  }

  private handleStepChanges(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.slider.setSettings({ step: Number(target.value) });
  }

  private handleBarChanges(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.slider.setSettings({ bar: target.checked });
  }

  private handleTipChanges(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.slider.setSettings({ tip: target.checked });
  }

  private handleSliderChanges(options: PState): void {
    const { fields } = this;

    Object.keys(options).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(fields, key)) return;

      switch (key) {
        case 'from':
        case 'min':
        case 'max':
          fields[key].setAttribute('value', options[key] as number);
          break;

        case 'step':
          fields.step.setAttribute('value', options[key] as number);
          fields.from.setAttribute('step', options[key] as number);
          break;

        case 'bar':
        case 'tip':
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

  private bindHandlers(): void {
    this.handleSliderChanges = this.handleSliderChanges.bind(this);
    this.handleFromChanges = this.handleFromChanges.bind(this);
    this.handleMinChanges = this.handleMinChanges.bind(this);
    this.handleMaxChanges = this.handleMaxChanges.bind(this);
    this.handleStepChanges = this.handleStepChanges.bind(this);
    this.handleBarChanges = this.handleBarChanges.bind(this);
    this.handleTipChanges = this.handleTipChanges.bind(this);
  }
}

export default Panel;
