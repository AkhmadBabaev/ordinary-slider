import Checkbox from './Checkbox';

document.body.innerHTML = `
  <div class="checkbox">
    <label class="checkbox__label">
      <input class="js-checkbox__input">
      <span class="js-checkbox__title">title</span>
      <div class="checkbox__toggler"></div>
    </label>
  </div>
`;

describe('Checkbox', () => {
  const checkbox = new Checkbox(document.body.querySelector('.checkbox') as HTMLElement);
  checkbox.apply();

  test('getElement should return an element', () => {
    expect(checkbox.getElement()).toBeInstanceOf(HTMLElement);
  });

  test('getInput should return an input element', () => {
    expect(checkbox.getInput()).toBeInstanceOf(HTMLInputElement);
  });

  test('setTitle should set title', () => {
    checkbox.setTitle('hello');
    const checkboxElem = checkbox.getElement();
    expect(checkboxElem.querySelector('.js-checkbox__title')?.textContent).toBe('hello');
  });

  test('should generate Change Event if press Enter on focused checkbox', () => {
    const checkboxElem = checkbox.getElement();
    const callback = jest.fn();

    const keyboardEventOptions = {
      bubbles: true,
      code: 'KeyE',
    };

    const handleCheckboxFocus = (): void => {
      document.dispatchEvent(new KeyboardEvent('keyup', keyboardEventOptions));
    };

    checkboxElem.addEventListener('change', callback);
    checkboxElem.addEventListener('focus', handleCheckboxFocus);
    checkboxElem.dispatchEvent(new FocusEvent('focus', { bubbles: true }));

    expect(callback).not.toBeCalled();

    keyboardEventOptions.code = 'Enter';

    checkboxElem.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    expect(callback).toBeCalled();
  });
});
