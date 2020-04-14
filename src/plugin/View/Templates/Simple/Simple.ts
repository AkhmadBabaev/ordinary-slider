import { boundMethod } from 'autobind-decorator';

abstract class Simple<T> {
  protected element: HTMLElement;

  protected options: T;

  constructor(options: T) {
    this.render(options);
  }

  public abstract render(options: T): void;

  @boundMethod
  public getElement(): HTMLElement {
    return this.element;
  }

  @boundMethod
  public getOptions(): T {
    return this.options;
  }

  protected createElement(name: string, attrs?: { [k: string]: unknown }): void {
    const tag = document.createElement(name);
    attrs && Object.keys(attrs).forEach((key) => tag.setAttribute(key, attrs[key] as string));

    this.element = tag;
  }
}

export default Simple;
