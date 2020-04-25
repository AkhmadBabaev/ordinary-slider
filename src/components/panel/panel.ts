import { boundMethod } from 'autobind-decorator';

import CheckBox from '../checkbox/Checkbox';
import NumField from '../num-field/NumField';

type Settings = { [k: string]: unknown };

class Panel {
  private panelElement: HTMLElement;

  public fields: { [k: string]: CheckBox | NumField } = {};

  private $slider: JQuery<object>;

  constructor(elem: HTMLElement) {
    this.panelElement = elem;
    this.init();
  }

  @boundMethod
  public settings(options?: Settings): Settings | void {
    if (arguments.length) this.$slider.oSlider('settings', options);
    return { ...this.$slider.oSlider('settings') };
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
    return this.panelElement;
  }

  protected init(): void {
    this.defineFields();
    this.setSlider();
  }

  private foundFields(): HTMLElement[] {
    const foundNulFields = Array.from(this.panelElement.querySelectorAll('.js-panel__field'));
    const foundCheckboxes = Array.from(this.panelElement.querySelectorAll('.js-panel__checkbox'));
    const foundList = [...foundNulFields, ...foundCheckboxes];

    return foundList.map((elem) => elem.firstElementChild as HTMLElement);
  }

  private setField(field: NumField | CheckBox, name: string): void {
    this.fields[name] = field;
    this.fields[name].getInput().addEventListener('change', this.handleInputChange);
  }

  private defineFields(): void {
    this.foundFields().forEach((elem) => {
      const isCheckbox = elem.className.includes('checkbox');
      const isNumField = elem.className.includes('num-field');
      let field;

      isNumField && (field = new NumField(elem));
      isCheckbox && (field = new CheckBox(elem));

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
          this.setField(field as NumField | CheckBox, name);
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
    const slider = this.panelElement.querySelector('.js-panel__slider')?.firstElementChild!;

    this.$slider = $(slider).oSlider() as JQuery<object>;
    this.subscribe(this.handleSliderChanges);
    this.handleSliderChanges(this.settings() as Settings);
  }
}

export default Panel;
