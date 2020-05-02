import { IState, IPState } from './Model/Interfaces';
import Presenter from './Presenter/Presenter';
import { isObject, isDefined } from './helpers/helpers';

declare global {
  interface Window {
    $: JQuery;
  }

  interface JQuery {
    oSlider: (
      ...params: [(IPState | string)?, (IPState | Function)?],
    ) => JQuery<object> | JQuery<HTMLElement> | IState;
  }
}

(function selfInvokingFunction($): void {
  function init(
    this: JQuery,
    options: IPState = {},
    $firstItemFound: JQuery<HTMLElement>,
  ): void {
    if (!this.length) throw new ReferenceError('Connection to non-existent element');
    if (!isObject(options)) throw new TypeError('oSlider configuration should be an object');

    const sliderElement = $firstItemFound[0];
    const dataFromAttributes = $(sliderElement).data();
    const presenter = new Presenter(sliderElement, { ...options, ...dataFromAttributes });

    $firstItemFound.data('oSlider', presenter);
  }

  // eslint-disable-next-line no-param-reassign
  $.fn.oSlider = function oSlider(
    ...params: [(IPState | string)?, (IPState | Function)?]
  ): JQuery<object> | JQuery<HTMLElement> | IState {
    const $firstItemFound = $(this).first();

    if (!$firstItemFound.data('oSlider')) {
      const settings = params[0] as IPState;
      init.call(this, settings, $firstItemFound);
      return $(this).first();
    }

    if (!(typeof params[0] === 'string')) throw new TypeError('oSlider method name should be a string');
    const method = params[0];
    const options = params[1];

    switch (method) {
      case 'settings':
        if (!isDefined(options)) return $firstItemFound.data('oSlider').getState() as IState;
        $firstItemFound.data('oSlider').setState(options as IPState); break;
      case 'subscribe': $firstItemFound.data('oSlider').subscribe(options as Function); break;
      case 'unsubscribe': $firstItemFound.data('oSlider').unsubscribe(options as Function); break;
      default: throw new Error(`${method} isn't found`);
    }

    return $(this).first();
  };
}($));
