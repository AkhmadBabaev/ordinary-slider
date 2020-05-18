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
  public setAttr<
    T extends keyof HTMLInputElement,
    R extends HTMLInputElement[T]
  >(name: T, value: R): void {
    this.input[name] = value;
    this.input.setAttribute(name, String(value));
  }

  private init(): void {
    this.input = this.numFieldElement.querySelector('.js-num-field__input') as HTMLInputElement;
    this.titleElement = this.numFieldElement.querySelector('.js-num-field__title') as HTMLElement;
  }
}

export default NumField;
