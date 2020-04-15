import { boundMethod } from 'autobind-decorator';

abstract class Component<T> {
  protected element: string;

  protected options: T;

  constructor(options: T) {
    this.options = options;
    this.render = this.renderDecorator(this.render);
    this.render(options);
  }

  public abstract render(options: T): string;

  @boundMethod
  public getElement(): string {
    return this.element;
  }

  @boundMethod
  public getOptions(): T {
    return this.options;
  }

  private renderDecorator(fn: Function): (options: T) => string {
    return (options: T): string => {
      this.options = options;
      this.element = fn.call(this, options).replace(/>\s+</mg, '><');
      return this.element;
    };
  }
}

export default Component;
