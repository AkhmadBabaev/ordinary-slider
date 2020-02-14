import { isDefined } from '../helpers';

class Tip {
  constructor(options) {
    this.options = options;

    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
    this.enable = this.enable.bind(this);
    this.disable = this.disable.bind(this);
    this.toggle = this.toggle.bind(this);

    this.options.isEnabled && this.init();
  }

  init() {
    this.tip = document.createElement('div');
    this.tip.classList.add('o-slider__tip');
    this.setText();

    this.options.parent.append(this.tip);
  }

  update(options) {
    this.options = { ...this.options, ...options };

    const hasIsEnabled = isDefined(options.isEnabled);
    hasIsEnabled && this.toggle();

    const hasText = isDefined(options.text);
    hasText && this.options.isEnabled && this.setText();
  }

  enable() {
    this.init();
  }

  disable() {
    this.tip.remove();
  }

  toggle() {
    this.options.isEnabled ? this.enable() : this.disable();
  }

  setText() {
    this.tip.textContent = this.options.text;
  }
}

export default Tip;
