class Input {
  protected element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
    this.getAttribute = this.getAttribute.bind(this);
    this.setAttribute = this.setAttribute.bind(this);
    this.init();
  }

  public getAttribute(name: string): string {
    return this.element.getAttribute(name) as string;
  }

  public setAttribute(name: string, value: string | number | boolean): void {
    // set the same value as attribute and DOM property
    // it isn't a mistake
    requestAnimationFrame(() => {
      this.element.setAttribute(name, value as string);
      (this.element as { [k: string]: any })[name] = value;
    });
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  protected init(): void {
    this.element.classList.add('input');
  }
}

export default Input;
