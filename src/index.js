import Model from './Ordinary-slider/Model/Model';
import View from './Ordinary-slider/View/View';
import Presenter from './Ordinary-slider/Presenter/Presenter';

import { isObject } from './Ordinary-slider/helpers';

(function selfInvokingFunction($) {
  // eslint-disable-next-line no-param-reassign
  $.fn.oSlider = function addToJqueryPrototype(options = {}) {
    if (!isObject(options)) {
      throw new TypeError('Ordinary slider configuration should be an object');
    }

    if (!this.length) {
      throw new ReferenceError('Connection to non-existent element');
    }

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
