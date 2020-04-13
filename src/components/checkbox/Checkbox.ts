class CheckBox {
  protected element: HTMLElement;

  protected input: HTMLInputElement;

  constructor(element: HTMLElement) {
    this.element = element;
    this.setTitle = this.setTitle.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleDocumentKeyUp = this.handleDocumentKeyUp.bind(this);
    this.init();
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public getInput(): HTMLInputElement {
    return this.input;
  }

  public setTitle(title: string): void {
    const titleElement = this.element.querySelector('.checkbox__title') as HTMLElement;
    titleElement.textContent = title;
  }

  protected init(): void {
    this.input = this.element.querySelector('.checkbox__input') as HTMLInputElement;
    this.element.addEventListener('focus', this.handleFocus);
    this.element.addEventListener('blur', this.handleBlur);
  }

  private handleFocus(): void {
    document.addEventListener('keyup', this.handleDocumentKeyUp);
  }

  private handleBlur(): void {
    document.removeEventListener('keyup', this.handleDocumentKeyUp);
  }

  private handleDocumentKeyUp(event: KeyboardEvent): void {
    if (event.code !== 'Enter') return;
    this.input.checked = !this.input.checked;
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

export default CheckBox;
