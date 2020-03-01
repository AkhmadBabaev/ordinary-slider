import Simple from '../Simple/Simple';

abstract class Toggler<T extends { isEnabled: boolean }> extends Simple<T> {
  constructor(options: T) {
    super(options);
    this.options.isEnabled && this.init();
  }

  protected abstract init(): void;

  protected enable(): void {
    this.init();
  }

  protected disable(): void {
    this.element.remove();
  }

  protected toggle(): void {
    this.options.isEnabled ? this.enable() : this.disable();
  }
}

export default Toggler;
