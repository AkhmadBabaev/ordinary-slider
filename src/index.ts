import Model from './Ordinary-slider/Model/Model';
import View from './Ordinary-slider/View/View';
import Presenter from './Ordinary-slider/Presenter/Presenter';

import { State } from './Ordinary-slider/Model/Interfaces';

import { isObject } from './Ordinary-slider/helpers';

declare global {
  interface Window {
    $: JQuery;
  }

  interface JQuery {
    oSlider: (options?: Partial<State>) => JQuery<object> | JQuery<HTMLElement>;
  }
}

(function selfInvokingFunction($): void {
  // eslint-disable-next-line no-param-reassign
  $.fn.oSlider = function addToJqueryPrototype(
    options: Partial<State> = {},
  ): JQuery<object> | JQuery<HTMLElement> {
    if (!isObject(options)) {
      throw new TypeError('Ordinary slider configuration should be an object');
    }

    if (!this.length) {
      throw new ReferenceError('Connection to non-existent element');
    }

    return this.map((i: number, currentElement: HTMLElement) => {
      const model: Model = new Model(options);
      const view: View = new View(currentElement, model.getState());

      // eslint-disable-next-line no-new
      new Presenter(model, view);

      return this;
    });
  };
}($));

window.addEventListener('load', () => {
  $('.slider-carrier').oSlider();
});
