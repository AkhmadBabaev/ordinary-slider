import Model from './Ordinary-slider/Model/Model';
import View from './Ordinary-slider/View/View';
import Presenter from './Ordinary-slider/Presenter/Presenter';

(function selfInvokingFunction($) {
  // eslint-disable-next-line no-param-reassign
  $.fn.oSlider = function addToJqueryPrototype(options = {}) {
    return this.map((i, currentElement) => {
      const model = new Model(options);
      const view = new View(currentElement, model.getState());

      // eslint-disable-next-line no-new
      new Presenter(model, view);
      return this;
    });
  };
}($));

window.addEventListener('load', () => {
  $('.slider-carrier').oSlider();
});
