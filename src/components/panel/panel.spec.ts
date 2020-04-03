import '../../plugin/o-slider';
import Panel from './panel';

document.body.innerHTML = `
  <div class="js-panel">
    <div class="js-panel__slider">
      <div class="o-slider"></div>
    </div>

    <div class="js-panel__field">
      <div class="num-field">
        <div class "num-field__label">
          <span class="num-field__title">from</span>
          <input class="num-field__input" name="from" type="number">
        </div>
      </div>
    </div>

    <div class="js-panel__field">
      <div class="num-field">
        <div class "num-field__label">
          <span class="num-field__title">to</span>
          <input class="num-field__input" name="to" type="number">
        </div>
      </div>
    </div>

    <div class="js-panel__checkbox">
      <div class="checkbox">
        <input class="checkbox__input" name="range" type="checkbox">
      </div>
    </div>
  </div>
`;

const panel = new Panel(document.body.querySelector('.js-panel') as HTMLElement);

const options = {
  vertical: false,
  range: false,
  tip: false,
  bar: false,
  min: 0,
  max: 100,
  step: 1,
  from: 10,
};

describe('Panel', () => {
  afterEach(() => panel.settings(options));

  test('getElement returns root element of panel', () => {
    const element = panel.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName).toBe('DIV');
    expect(element.classList.contains('js-panel')).toBeTruthy();
  });

  describe('Method settings', () => {
    test('returns current state of slider', () => {
      expect(panel.settings()).toEqual(options);
    });

    test('sets new options', () => {
      panel.settings(options);
      expect(panel.settings()).toEqual(options);
    });
  });

  test('subscribe should notify about updates', () => {
    const callback = jest.fn();

    panel.subscribe(callback);
    panel.settings(options);

    expect(callback).toHaveBeenCalled();
  });

  test('unsubscribe stops notifications about updates', () => {
    const callback = jest.fn();

    panel.subscribe(callback);
    panel.unsubscribe(callback);
    panel.settings(options);

    expect(callback).not.toHaveBeenCalled();
  });

  test('if option range set as false the field "to" should be disabled', () => {
    expect(panel.getElement().querySelector('[name="to"]')?.hasAttribute('disabled')).toBeTruthy();
  });
});
