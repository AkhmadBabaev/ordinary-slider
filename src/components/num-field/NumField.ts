import { boundMethod } from 'autobind-decorator';

class NumField {
  protected element: HTMLElement;

  protected titleElement: HTMLElement;

  protected input: HTMLInputElement;

  constructor(element: HTMLElement) {
    this.element = element;
    this.init();
  }

  @boundMethod
  public getElement(): HTMLElement {
    return this.element;
  }

  @boundMethod
  public getInput(): HTMLInputElement {
    return this.input;
  }

  @boundMethod
  public setTitle(title: string): void {
    this.titleElement.textContent = title;
  }

  @boundMethod
  public setAttr(name: string, value: unknown): void {
    this.input.setAttribute(name, String(value));
    (this.input as { [k: string]: any })[name] = value;
  }

  protected init(): void {
    this.input = this.element.querySelector('.num-field__input') as HTMLInputElement;
    this.titleElement = this.element.querySelector('.num-field__title') as HTMLElement;
  }
}

export default NumField;
