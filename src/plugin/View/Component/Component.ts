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
      let str = fn.call(this, options);
      str = str.replace(/([>\w\W])\s+</mg, '$1<');
      str = str.replace(/>\s+([<\w\W])/mg, '>$1');

      return str;
    };
  }
}

export default Component;
