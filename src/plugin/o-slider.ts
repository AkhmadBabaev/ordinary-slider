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
    $firstItemFound: JQuery<HTMLElement>,
  ): void {
    if (!this.length) throw new ReferenceError('Connection to non-existent element');
    if (!isObject(options)) throw new TypeError('oSlider configuration should be an object');

    const sliderElement = $firstItemFound[0];
    const dataFromAttributes = $(sliderElement).data();
    const model: Model = new Model({ ...options, ...dataFromAttributes });
    const view: View = new View(sliderElement, model.getState());
    const presenter = new Presenter(model, view);

    $firstItemFound.data('oSlider', presenter);
  }

  // eslint-disable-next-line no-param-reassign
  $.fn.oSlider = function oSlider(
    ...params: [(PState | string)?, (PState | Function)?]
  ): JQuery<object> | JQuery<HTMLElement> | State {
    const $firstItemFound = $(this).first();

    if (!$firstItemFound.data('oSlider')) {
      const settings = params[0] as PState;
      init.call(this, settings, $firstItemFound);
      return $(this).first();
    }

    if (!(typeof params[0] === 'string')) throw new TypeError('oSlider method name should be a string');
    const method = params[0];
    const options = params[1];

    switch (method) {
      case 'settings':
        if (!isDefined(options)) return $firstItemFound.data('oSlider').getState() as State;
        $firstItemFound.data('oSlider').setState(options as PState); break;
      case 'subscribe': $firstItemFound.data('oSlider').subscribe(options as Function); break;
      case 'unsubscribe': $firstItemFound.data('oSlider').unsubscribe(options as Function); break;
      default: break;
    }

    return $(this).first();
  };
}($));
