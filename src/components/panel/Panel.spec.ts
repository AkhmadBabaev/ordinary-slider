import '../../plugin/o-slider';
import Panel from './Panel';

document.body.innerHTML = `
  <div class="js-panel">
    <div class="js-panel__slider">
      <div class="o-slider"></div>
    </div>

    <div class="js-panel__field">
      <div class="js-num-field" data-name="from">
        <label class="num-field__label">
          <span class="js-num-field__title">from</span>
          <input class="js-num-field__input" type="number">
        </label>
      </div>
    </div>

    <div class="js-panel__field">
      <div class="js-num-field" data-name="to">
        <label class="num-field__label">
          <span class="js-num-field__title">to</span>
          <input class="js-num-field__input" type="number">
        </label>
      </div>
    </div>

    <div class="js-panel__field">
      <div class="js-num-field" data-name="step">
        <label class="num-field__label">
          <span class="js-num-field__title">step</span>
          <input class="js-num-field__input" type="number">
        </label>
      </div>
    </div>

    <div class="js-panel__field">
      <div class="js-num-field" data-name="min">
        <label class="num-field__label">
          <span class="js-num-field__title">min</span>
          <input class="js-num-field__input" type="number">
        </label>
      </div>
    </div>

    <div class="js-panel__field">
      <div class="js-num-field" data-name="max">
        <label class="num-field__label">
          <span class="js-num-field__title">max</span>
          <input class="js-num-field__input" type="number">
        </label>
      </div>
    </div>

    <div class="js-panel__checkbox">
      <div class="js-checkbox" data-name="range">
        <button class="js-checkbox__button" type="button"></button>
      </div>
    </div>

    <div class="js-panel__checkbox">
      <div class="js-checkbox" data-name="vertical">
        <button class="js-checkbox__button" type="button"></button>
      </div>
    </div>

    <div class="js-panel__checkbox">
      <div class="js-checkbox" data-name="scale">
        <button class="js-checkbox__button" type="button"></button>
      </div>
    </div>

    <div class="js-panel__checkbox">
      <div class="js-checkbox" data-name="bar">
        <button class="js-checkbox__button" type="button"></button>
      </div>
    </div>

    <div class="js-panel__checkbox">
      <div class="js-checkbox" data-name="tip">
        <button class="js-checkbox__button" type="button"></button>
      </div>
    </div>

    <div class="js-panel__checkbox">
      <div class="js-checkbox" data-name="fake">
        <button class="js-checkbox__button" type="button"></button>
      </div>
    </div>
  </div>
`;

describe('Panel', () => {
  const panel = new Panel(document.body.querySelector('.js-panel') as HTMLElement);
  const panelElem = panel.getElement();

  const options = {
    vertical: true,
    range: false,
    scale: false,
    tip: true,
    bar: true,
    min: 0,
    max: 100,
    step: 1,
    from: 10,
  };

  afterEach(() => panel.settings(options));

  test('getElement returns root element of panel', () => {
    expect(panelElem).toBeInstanceOf(HTMLElement);
    expect(panelElem.tagName).toBe('DIV');
    expect(panelElem.classList.contains('js-panel')).toBeTruthy();
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

  test('if option range set as true the field "to" shouldn\'t have the attribute disabled', () => {
    panel.settings({ range: true });

    const fieldTo = panelElem.querySelector('[data-name="to"]') as HTMLElement;
    const input = fieldTo.querySelector('input') as HTMLInputElement;

    expect(input.hasAttribute('disabled')).toBeFalsy();
  });

  test('if option range set as true the field "to" should have the attribute disabled', () => {
    panel.settings({ range: false });

    const fieldTo = panelElem.querySelector('[data-name="to"]') as HTMLElement;
    const input = fieldTo.querySelector('input') as HTMLInputElement;

    expect(input.hasAttribute('disabled')).toBeTruthy();
  });

  test('field "from" should have attribute step that equal to "step" value', () => {
    panel.settings({ step: 2 });

    const fieldFrom = panelElem.querySelector('[data-name="from"]') as HTMLElement;
    const input = fieldFrom.querySelector('input') as HTMLInputElement;

    expect(input.getAttribute('step')).toBe('2');
  });

  test('field "from" should have attribute max that equal to "to" value', () => {
    panel.settings({ to: 50 });

    const fieldFrom = panelElem.querySelector('[data-name="from"]') as HTMLElement;
    const input = fieldFrom.querySelector('input') as HTMLInputElement;

    expect(input.getAttribute('max')).toBe('50');
  });

  test('field "to" should have attribute min that equal to "from" value', () => {
    panel.settings({ from: 20, range: true });

    const fieldTo = panelElem.querySelector('[data-name="to"]') as HTMLElement;
    const input = fieldTo.querySelector('input') as HTMLInputElement;

    expect(input.getAttribute('min')).toBe('20');
  });
});
