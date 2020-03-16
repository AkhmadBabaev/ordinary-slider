import Model from './Model/Model';
import View from './View/View';
import Presenter from './Presenter/Presenter';

import { State, PState } from './Model/Interfaces';

import { isObject } from './helpers/helpers';

declare global {
  interface Window {
    $: JQuery;
  }

  interface JQuery {
    oSlider: (options?: PState) => JQuery<object> | JQuery<HTMLElement>;
    reset: () => void;
    getSettings: () => State;
    setSettings: (options: PState) => void;
    subscribe: (callback: Function) => void;
    unsubscribe: (callback: Function) => void;
  }
}

(function selfInvokingFunction($): void {
  // eslint-disable-next-line no-param-reassign
  $.fn.oSlider = function init(options: PState = {}): JQuery<object> | JQuery<HTMLElement> {
    if (!isObject(options)) {
      throw new TypeError('Ordinary slider configuration should be an object');
    }

    if (!this.length) {
      throw new ReferenceError('Connection to non-existent element');
    }

    const $first = $(this).first();

    const element = $first[0];
    const data = $(element).data();
    const model: Model = new Model({ ...options, ...data });
    const view: View = new View(element, model.getState());
    const presenter = new Presenter(model, view);

    $first.reset = presenter.reset;
    $first.getSettings = presenter.getState;
    $first.setSettings = presenter.setState;
    $first.subscribe = presenter.subscribe;
    $first.unsubscribe = presenter.unsubscribe;

    return $first;
  };
}($));
