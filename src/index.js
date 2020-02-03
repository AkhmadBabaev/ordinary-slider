import OSlider from './Ordinary-slider/OSlider';

(function selfInvokingFunction($) {
  // eslint-disable-next-line no-param-reassign
  $.fn.oSlider = function addToJqueryPrototype(options = {}) {
    return this.map((i, currentElement) => {
      // eslint-disable-next-line no-new
      new OSlider(currentElement, options);
      return this;
    });
  };
}($));

window.addEventListener('load', () => {
  $('.slider-carrier').oSlider();
});
