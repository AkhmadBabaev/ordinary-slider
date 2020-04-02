class CheckBox {
  protected element: HTMLElement;

  protected input: HTMLInputElement;

  constructor(element: HTMLElement) {
    this.element = element;
    this.setTitle = this.setTitle.bind(this);
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
  }
}

export default CheckBox;
