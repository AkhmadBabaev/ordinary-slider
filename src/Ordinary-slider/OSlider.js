class OSlider {
  constructor(elem, { position } = {}) {
    this.elem = elem;
    this.position = position;

    this.init = this.init.bind(this);
    this.setPosition = this.setPosition.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);

    this.init();
  }

  init() {
    this.slider = document.createElement('div');
    this.slider.classList.add('o-slider');

    this.track = document.createElement('div');
    this.track.classList.add('o-slider__track');

    this.thumb = document.createElement('div');
    this.thumb.classList.add('o-slider__thumb');

    this.thumb.addEventListener('mousedown', this.handleMouseDown);

    this.setPosition(this.position);

    this.track.append(this.thumb);
    this.slider.append(this.track);
    this.elem.append(this.slider);
  }

  setPosition(position) {
    this.thumb.style.left = `${position}px`;
  }

  handleMouseDown(e) {
    const isLeftClick = e.which === 1;
    if (!isLeftClick) return;

    const parentX = this.track.getBoundingClientRect().x;
    document.body.classList.add('Cursor');

    const handleMouseMove = (evt) => {
      let position = evt.clientX - parentX;

      if (position < 0) position = 0;
      if (position > this.track.clientWidth) position = this.track.clientWidth;

      this.setPosition(position);
    };

    const handleMouseUp = () => {
      document.body.classList.remove('Cursor');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    e.preventDefault();
  }
}

export default OSlider;
