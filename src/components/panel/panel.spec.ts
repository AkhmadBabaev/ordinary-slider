import '../../plugin/o-slider';
import Panel from './panel';

import defaultState from '../../plugin/Model/defaultState';

document.body.innerHTML = `
  <div class="panel">
    <div class="panel__slider"></div>

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
  min: 0,
  max: 100,
  step: 1,
  bar: true,
  tip: true,
  from: 10,
};

describe('Panel', () => {
  afterEach(() => { panel.setOptions({ ...defaultState }); });

  test('getElement returns root element of panel', () => {
    const element = panel.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName).toBe('DIV');
    expect(element.classList.contains('panel')).toBeTruthy();
  });

  test('getOptions returns current state of slider', () => {
    expect(panel.getOptions()).toEqual(defaultState);
  });

  test('setOptions sets options new options', () => {
    panel.setOptions(options);
    expect(panel.getOptions()).toEqual(options);
  });

  test('subscribe should notify about updates', () => {
    const callback = jest.fn();

    panel.subscribe(callback);
    panel.setOptions(options);

    expect(callback).toHaveBeenCalled();
  });
});
