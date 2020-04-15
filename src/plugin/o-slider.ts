import Model from './Model/Model';
import { State, PState } from './Model/Interfaces';
import View from './View/View';
import Presenter from './Presenter/Presenter';
import { isObject, isDefined } from './helpers/helpers';

declare global {
  interface Window {
    $: JQuery;
  }

  interface JQuery {
    oSlider: (
      ...params: [(PState | string)?, (PState | Function)?],
    ) => JQuery<object> | JQuery<HTMLElement> | State;
  }
}

(function selfInvokingFunction($): void {
  function init(
    this: JQuery,
    options: PState = {},
    $firstElement: JQuery<HTMLElement>,
  ): void {
    if (!this.length) {
      throw new ReferenceError('Connection to non-existent element');
    }

    if (!isObject(options)) {
      throw new TypeError('oSlider configuration should be an object');
    }

    const htmlElement = $firstElement[0];
    const data = $(htmlElement).data();
    const model: Model = new Model({ ...options, ...data });
    const view: View = new View(htmlElement, model.getState());
    const presenter = new Presenter(model, view);

    $firstElement.data('oSlider', presenter);
  }

  // eslint-disable-next-line no-param-reassign
  $.fn.oSlider = function oSlider(
    ...params: [(PState | string)?, (PState | Function)?]
  ): JQuery<object> | JQuery<HTMLElement> | State {
    const $firstElement = $(this).first();

    if (!arguments.length) {
      const settings = params[0] as PState;
      init.call(this, settings, $firstElement);
      return $(this).first();
    }

    if (!(typeof params[0] === 'string')) throw new TypeError('oSlider methodd name should be a string');
    const method = params[0];
    const options = params[1];

    switch (method) {
      case 'settings':
        if (!isDefined(options)) return $firstElement.data('oSlider').getState() as State;
        $firstElement.data('oSlider').setState(options as PState); break;
      case 'subscribe': $firstElement.data('oSlider').subscribe(options as Function); break;
      case 'unsubscribe': $firstElement.data('oSlider').unsubscribe(options as Function); break;
      default: break;
    }

    return $(this).first();
  };
}($));
