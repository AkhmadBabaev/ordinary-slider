import '../../plugin/o-slider';
import Panel from './panel';

import defaultState from '../../plugin/Model/defaultState';

document.body.innerHTML = `
  <div class="panel">
    <div class="js-panel__slider"></div>

    <div class="panel__field">
      <input class="input" name="min" type="number">
    </div>

    <div class="panel__checkbox">
      <input class="input" name="bar" type="checkbox">
    </div>
  </div>
`;

const panel = new Panel(document.body.querySelector('.panel') as HTMLElement);

const options = {
  range: false,
  vertical: false,
  tip: true,
  bar: true,
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
    expect(element.classList.contains('panel')).toBeTruthy();
  });

  test('getOptions returns current state of slider', () => {
    expect(panel.getSettings()).toEqual(defaultState);
  });

  test('setOptions sets options new options', () => {
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
