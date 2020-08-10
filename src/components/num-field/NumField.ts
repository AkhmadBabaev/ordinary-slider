import { boundMethod } from 'autobind-decorator';

class NumField {
  private numField: HTMLElement;

  private input: HTMLInputElement;

  constructor(element: HTMLElement) {
    this.numField = element;
    this.init();
  }

  @boundMethod
  public addListeners(): void {
    this.input.addEventListener('change', this.handleInputChange);
  }

  @boundMethod
  public getElement(): HTMLElement {
    return this.numField;
  }

  @boundMethod
  public disable(): void {
    this.input.disabled = true;
  }

  @boundMethod
  public enable(): void {
    this.input.disabled = false;
  }

  @boundMethod
  public setAttr<
    T extends keyof HTMLInputElement,
    R extends HTMLInputElement[T]
  >(name: T, value: R): void {
    this.input[name] = value;
    this.input.setAttribute(name, String(value));
  }

  @boundMethod
  public removeAttr<T extends keyof HTMLInputElement>(name: T): void {
    this.input.removeAttribute(name);
  }

  private init(): void {
    this.input = this.numField.querySelector('.js-num-field__input') as HTMLInputElement;
  }

  @boundMethod
  private handleInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.numField.dispatchEvent(new CustomEvent('CHANGED', {
      detail: { value: target.value },
      bubbles: true,
    }));
  }
}

export default NumField;
