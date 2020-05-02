import { boundMethod } from 'autobind-decorator';

class NumField {
  private numFieldElement: HTMLElement;

  private titleElement: HTMLElement;

  private input: HTMLInputElement;

  constructor(element: HTMLElement) {
    this.numFieldElement = element;
    this.init();
  }

  @boundMethod
  public getElement(): HTMLElement {
    return this.numFieldElement;
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

  private init(): void {
    this.input = this.numFieldElement.querySelector('.num-field__input') as HTMLInputElement;
    this.titleElement = this.numFieldElement.querySelector('.num-field__title') as HTMLElement;
  }
}

export default NumField;
