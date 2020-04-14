import { boundMethod } from 'autobind-decorator';

class CheckBox {
  protected element: HTMLElement;

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
    const titleElement = this.element.querySelector('.checkbox__title') as HTMLElement;
    titleElement.textContent = title;
  }

  protected init(): void {
    this.input = this.element.querySelector('.checkbox__input') as HTMLInputElement;
    this.element.addEventListener('focus', this.handleFocus);
    this.element.addEventListener('blur', this.handleBlur);
  }

  @boundMethod
  private handleFocus(): void {
    document.addEventListener('keyup', this.handleDocumentKeyUp);
  }

  @boundMethod
  private handleBlur(): void {
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
