import { boundMethod } from 'autobind-decorator';

class CheckBox {
  private checkboxElement: HTMLElement;

  private titleElement: HTMLElement;

  private input: HTMLInputElement;

  constructor(element: HTMLElement) {
    this.checkboxElement = element;
    this.init();
  }

  @boundMethod
  public getElement(): HTMLElement {
    return this.checkboxElement;
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
  public apply(): void {
    this.addListeners();
  }

  private init(): void {
    this.input = this.checkboxElement.querySelector('.js-checkbox__input') as HTMLInputElement;
    this.titleElement = this.checkboxElement.querySelector('.js-checkbox__title') as HTMLElement;
  }

  @boundMethod
  private handleCheckboxFocus(): void {
    document.addEventListener('keyup', this.handleDocumentKeyUp);
  }

  @boundMethod
  private handleCheckboxBlur(): void {
    document.removeEventListener('keyup', this.handleDocumentKeyUp);
  }

  @boundMethod
  private handleDocumentKeyUp(event: KeyboardEvent): void {
    if (event.code !== 'Enter') return;
    this.input.checked = !this.input.checked;
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  private addListeners(): void {
    this.checkboxElement.addEventListener('focus', this.handleCheckboxFocus);
    this.checkboxElement.addEventListener('blur', this.handleCheckboxBlur);
  }
}

export default CheckBox;
