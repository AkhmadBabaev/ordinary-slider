import { boundMethod } from 'autobind-decorator';

import CheckBox from '../checkbox/Checkbox';
import NumField from '../num-field/NumField';

type Settings = { [k: string]: unknown };

class Panel {
  private element: HTMLElement;

  public fields: { [k: string]: CheckBox | NumField } = {};

  private $slider: JQuery<object>;

  constructor(elem: HTMLElement) {
    this.element = elem;
    this.init();
  }

  @boundMethod
  public settings(options?: Settings): Settings | void {
    if (arguments.length) this.$slider.oSlider('settings', options);
    return this.$slider.oSlider('settings') as unknown as Settings;
  }

  @boundMethod
  public subscribe(callback: Function): void {
    this.$slider.oSlider('subscribe', callback);
  }

  @boundMethod
  public unsubscribe(callback: Function): void {
    this.$slider.oSlider('unsubscribe', callback);
  }

  @boundMethod
  public getElement(): HTMLElement {
    return this.element;
  }

  protected init(): void {
    this.defineFields();
    this.setSlider();
  }

  private defineFields(): void {
    const foundNulFields = Array.from(this.element.querySelectorAll('.js-panel__field'));
    const foundCheckboxes = Array.from(this.element.querySelectorAll('.js-panel__checkbox'));

    [...foundNulFields, ...foundCheckboxes].forEach((elem) => {
      const fieldElement = elem.firstElementChild as HTMLElement;
      const isCheckbox = fieldElement.className.includes('checkbox');
      const isNumField = fieldElement.className.includes('num-field');
      let field;

      isNumField && (field = new NumField(fieldElement as HTMLElement));
      isCheckbox && (field = new CheckBox(fieldElement as HTMLElement));

      const name = field?.getInput().getAttribute('name');

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
          this.fields[name] = field as NumField | CheckBox;
          this.fields[name].getInput().addEventListener('change', this.handleInputChange);
          break;

        default: break;
      }
    });
  }

  @boundMethod
  private handleInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const data = { [target.name]: target.type === 'checkbox' ? target.checked : Number(target.value) };

    this.settings(data);
  }

  @boundMethod
  private handleSliderChanges(options: Settings): void {
    const { range } = this.settings() as Settings;
    const { fields } = this;

    Object.keys(options).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(fields, key)) return;
      const input = fields[key].getInput();
      const value = options[key];

      switch (key) {
        case 'from':
        case 'to':
        case 'min':
        case 'max':
        case 'step':
          (fields[key] as NumField).setAttr('value', value);
          break;

        case 'bar':
        case 'tip':
        case 'range':
        case 'vertical':
          input.checked = value as boolean;
          break;

        default: break;
      }

      switch (key) {
        case 'from':
          range && (fields.to as NumField).setAttr('min', value);
          break;

        case 'to':
          (fields.from as NumField).setAttr('max', value);
          break;

        case 'step':
          (fields.from as NumField).setAttr('step', value);
          (fields.to as NumField).setAttr('step', value);
          break;

        case 'range':
          if (options.range) {
            this.fields.to.getInput().disabled = false;
          } else {
            this.fields.to.getInput().disabled = true;
            fields.from.getInput().removeAttribute('max');
          }
          break;

        default: break;
      }
    });
  }

  private setSlider(): void {
    const slider = this.element.querySelector('.js-panel__slider')?.firstElementChild as HTMLElement;

    this.$slider = $(slider).oSlider() as JQuery<object>;
    this.subscribe(this.handleSliderChanges);
    this.handleSliderChanges(this.settings() as Settings);
  }
}

export default Panel;
