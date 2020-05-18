abstract class Component<T> {
  protected options: T;

  constructor(options: T) {
    this.options = options;
    this.render = this.renderDecorator(this.render);
  }

  protected abstract render(options: T): string;

  private toString(): string {
    return this.render(this.options);
  }

  private renderDecorator(fn: Function): (options: T) => string {
    return (options: T): string => {
      const str = fn.call(this, options);
      return str.replace(/([>\w\W])\s+</mg, '$1<').replace(/>\s+([<\w\W])/mg, '>$1');
    };
  }
}

export default Component;
