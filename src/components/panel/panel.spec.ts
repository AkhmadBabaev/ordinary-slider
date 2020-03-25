import '../../plugin/o-slider';
import Panel from './panel';

import defaultState from '../../plugin/Model/defaultState';

document.body.innerHTML = `
  <div class="js-panel">
    <div class="js-panel__slider"></div>

    <div class="js-panel__field">
      <input class="input" name="min" type="number">
    </div>

    <div class="js-panel__checkbox">
      <input class="input" name="bar" type="checkbox">
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
  afterEach(() => panel.setSettings({ ...defaultState }));

  test('getElement returns root element of panel', () => {
    const element = panel.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName).toBe('DIV');
    expect(element.classList.contains('js-panel')).toBeTruthy();
  });

  test('Method getSettings returns current state of slider', () => {
    expect(panel.getSettings()).toEqual(defaultState);
  });

  test('Method setSettings sets new options', () => {
    panel.setSettings(options);
    expect(panel.getSettings()).toEqual(options);
  });

  test('subscribe should notify about updates', () => {
    const callback = jest.fn();

    panel.subscribe(callback);
    panel.setSettings(options);

    expect(callback).toHaveBeenCalled();
  });

  test('unsubscribe stops notifications about updates', () => {
    const callback = jest.fn();

    panel.subscribe(callback);
    panel.unsubscribe(callback);
    panel.setSettings(options);

    expect(callback).not.toHaveBeenCalled();
  });
});
