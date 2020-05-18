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
          <span class="js-num-field__title">from</span>
          <input class="js-num-field__input" name="from" type="number">
        </div>
      </div>
    </div>

    <div class="js-panel__field">
      <div class="num-field">
        <div class "num-field__label">
          <span class="js-num-field__title">to</span>
          <input class="js-num-field__input" name="to" type="number">
        </div>
      </div>
    </div>

    <div class="js-panel__field">
      <div class="num-field">
        <div class "num-field__label">
          <span class="js-num-field__title">step</span>
          <input class="js-num-field__input" name="step" type="number">
        </div>
      </div>
    </div>

    <div class="js-panel__checkbox">
      <div class="checkbox">
        <input class="js-checkbox__input" name="range" type="checkbox">
      </div>
    </div>

    <div class="js-panel__checkbox">
      <div class="checkbox">
        <input class="js-checkbox__input" name="bar" type="checkbox">
      </div>
    </div>

    <div class="js-panel__checkbox">
      <div class="checkbox">
        <input class="js-checkbox__input" name="tip" type="checkbox">
      </div>
    </div>

    <div class="js-panel__checkbox">
      <div class="checkbox">
        <input class="js-checkbox__input" name="fake" type="checkbox">
      </div>
    </div>
  </div>
`;

const panel = new Panel(document.body.querySelector('.js-panel') as HTMLElement);

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

  test('if option range set as true the field "to" shouldn\'t be disabled', () => {
    panel.settings({ range: true });
    expect(panel.getElement().querySelector('[name="to"]')?.hasAttribute('disabled')).toBeFalsy();
  });

  test('if option range set as false the field "to" should be disabled', () => {
    panel.settings({ range: false });
    expect(panel.getElement().querySelector('[name="to"]')?.hasAttribute('disabled')).toBeTruthy();
  });

  test('field "from" should have attribute step that equal to "step" value', () => {
    panel.settings({ step: 2 });
    expect(panel.getElement().querySelector('[name="from"]')?.getAttribute('step')).toBe('2');
  });

  test('field "to" should have attribute step that equal to "step" value', () => {
    panel.settings({ step: 2 });
    expect(panel.getElement().querySelector('[name="to"]')?.getAttribute('step')).toBe('2');
  });

  test('field "from" should have attribute max that equal to "to" value', () => {
    panel.settings({ to: 50 });
    expect(panel.getElement().querySelector('[name="from"]')?.getAttribute('max')).toBe('50');
  });

  test('field "to" should have attribute min that equal to "from" value', () => {
    panel.settings({ from: 20, range: true });
    expect(panel.getElement().querySelector('[name="to"]')?.getAttribute('min')).toBe('20');
  });

  test('should listen "change" event of fields', () => {
    const fieldBar = panel.getElement().querySelector('[name="bar"]') as HTMLInputElement;
    const fieldFrom = panel.getElement().querySelector('[name="from"]') as HTMLInputElement;

    fieldBar.checked = !fieldBar.checked;
    fieldFrom.value = '20';
    fieldBar.dispatchEvent(new Event('change', { bubbles: true }));
    fieldFrom.dispatchEvent(new Event('change', { bubbles: true }));

    expect((panel.settings() as any).bar).toBe(!options.bar);
    expect((panel.settings() as any).from).toBe(20);
  });
});
