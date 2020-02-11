import Tip from './Tip';

import { isDefined, propertyFilter } from '../helpers';

class Thumb {
  constructor(options) {
    this.options = options;

    this.setPosition = this.setPosition.bind(this);

    this.handleMouseDown = this.handleMouseDown.bind(this);

    this.init = this.init.bind(this);
    this.update = this.update.bind(this);
    this.init();
  }

  init() {
    this.thumb = document.createElement('div');
    this.thumb.classList.add('o-slider__thumb');
    this.thumb.addEventListener('mousedown', this.handleMouseDown);

    const tipProps = ['position:text', 'tip:isEnabled'];
    const filteredTipProps = propertyFilter(this.options, tipProps);

    this.tip = new Tip({
      ...filteredTipProps,
      parent: this.thumb,
    });

    this.options.parent.append(this.thumb);
  }

  update(options) {
    this.options = { ...this.options, ...options };

    const hasPosition = isDefined(options.position);
    hasPosition && this.setPosition();

    const hasTip = isDefined(options.tip);
    hasTip && this.tip.update({ isEnabled: options.tip });
  }

  setPosition() {
    const { position, min, max } = this.options;

    this.thumb.style.left = `${(100 / (max - min)) * (position - min)}%`;
    this.tip.update({ text: position });
  }

  handleMouseDown(e) {
    const {
      currentTarget, target, offsetX, which,
    } = e;

    const isLeftClick = which === 1;
    if (!isLeftClick) return;

    currentTarget.classList.add('o-slider__thumb_active');
    document.body.classList.add('o-slider_grabbed');

    const { min, ratio, parent } = this.options;
    const parentX = parent.getBoundingClientRect().x;

    const width = target.clientWidth;
    const shiftX = offsetX - (width / 2);

    const handleMouseMove = (evt) => {
      const pxPosition = evt.clientX - parentX - shiftX;
      const position = pxPosition / ratio + min;

      this.options.notify({ position });
    };

    const handleMouseUp = () => {
      currentTarget.classList.remove('o-slider__thumb_active');
      document.body.classList.remove('o-slider_grabbed');

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    e.preventDefault();
  }
}

export default Thumb;
