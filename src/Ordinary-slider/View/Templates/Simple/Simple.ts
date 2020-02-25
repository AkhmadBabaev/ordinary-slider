abstract class Simple<T> {
  protected options: T;

  protected element: HTMLElement;

  constructor(options: T) {
    this.options = options;
    this.update = this.update.bind(this);
  }

  public update(options: Partial<T>): void {
    this.options = { ...this.options, ...options };
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public getOptions(): T {
    return this.options;
  }

  protected createElement(name: string, attributes?: { [k: string]: unknown }): void {
    const tag = document.createElement(name);

    attributes && Object.keys(attributes).forEach((key) => {
      tag.setAttribute(key, attributes[key] as string);
    });

    this.element = tag;
  }
}

export default Simple;
