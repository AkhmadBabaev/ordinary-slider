import { boundMethod } from 'autobind-decorator';

class CheckBox {
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

  protected init(): void {
    this.input = this.element.querySelector('.checkbox__input') as HTMLInputElement;
    this.titleElement = this.element.querySelector('.checkbox__title') as HTMLElement;

    this.element.addEventListener('focus', this.handleCheckboxFocus);
    this.element.addEventListener('blur', this.handleCheckboxBlur);
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
}

export default CheckBox;
