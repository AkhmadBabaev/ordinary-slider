import Simple from '../Simple/Simple';

class Toggler<T extends { isEnabled: boolean }> extends Simple<T> {
  protected init(): void {
    // key 'this' to avoid eslint warnings
    this;
  }

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
