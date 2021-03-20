import { boundMethod } from 'autobind-decorator';

import CheckBox from '../checkbox/Checkbox';
import NumField from '../num-field/NumField';

type Settings = { [k: string]: unknown };

class Panel {
  public fields: { [k: string]: NumField | CheckBox } = {};
  private panel: HTMLElement;
  private $slider: JQuery<object>;

  constructor(element: HTMLElement) {
    this.panel = element;
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
    return this.panel;
  }

  private init(): void {
    this.defineFields();
    this.setSlider();
  }

  private foundFields(): HTMLElement[] {
    const foundNulFields = Array.from(this.panel.querySelectorAll('.js-panel__field'));
    const foundCheckboxes = Array.from(this.panel.querySelectorAll('.js-panel__checkbox'));
    const foundList = [...foundNulFields, ...foundCheckboxes];

    return foundList.map((elem) => elem.firstElementChild as HTMLElement);
  }

  private setField(name: string, field: NumField | CheckBox): void {
    this.fields[name] = field;
    this.fields[name].getElement().addEventListener('CHANGED', this.handleFieldChange as EventListener);
  }

  private defineFields(): void {
    this.foundFields().forEach((elem) => {
      const isNumField = elem.className.includes('js-num-field');
      const isCheckbox = elem.className.includes('js-checkbox');
      if (!isNumField && !isCheckbox) return;

      const field = isNumField ? new NumField(elem) : new CheckBox(elem);
      const { name } = elem.dataset;

      switch (name) {
        case 'from':
        case 'to':
        case 'min':
        case 'max':
        case 'step':
        case 'bar':
        case 'tip':
        case 'range':
        case 'scale':
        case 'vertical':
          this.setField(name, field);
          break;

        default: break;
      }
    });
  }

  @boundMethod
  private handleFieldChange(event: CustomEvent): void {
    const target = event.target as HTMLElement;
    const name = target.dataset.name as string;
    const isNumField = target.className.includes('js-num-field');
    const data = { [name]: isNumField ? event.detail.value : event.detail.isChecked };

    this.settings(data);
  }

  @boundMethod
  private handleSliderChanges(options: Settings): void {
    const { range } = this.settings() as Settings;
    const { fields } = this;

    Object.keys(options).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(fields, key)) return;
      const value = options[key];

      switch (key) {
        case 'from':
        case 'to':
        case 'min':
        case 'max':
        case 'step':
          (fields[key] as NumField).setAttr('value', String(value));
          break;

        case 'bar':
        case 'tip':
        case 'scale':
        case 'range':
        case 'vertical':
          (fields[key] as CheckBox).toggle(value as boolean);
          break;

        default: break;
      }

      switch (key) {
        case 'from':
          range && (fields.to as NumField).setAttr('min', String(value));
          break;

        case 'to':
          (fields.from as NumField).setAttr('max', String(value));
          break;

        case 'step':
          (fields.from as NumField).setAttr('step', String(value));
          (fields.to as NumField).setAttr('step', String(value));
          break;

        case 'range':
          if (options.range) (fields.to as NumField).enable();
          else {
            (fields.to as NumField).disable();
            (fields.from as NumField).removeAttr('max');
          } break;

        default: break;
      }
    });
  }

  private setSlider(): void {
    const slider = this.panel.querySelector('.js-panel__slider')?.firstElementChild!;

    this.$slider = $(slider).oSlider() as JQuery<object>;
    this.subscribe(this.handleSliderChanges);
    this.handleSliderChanges(this.settings() as Settings);
  }
}

export default Panel;
