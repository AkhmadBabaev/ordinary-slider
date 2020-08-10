import NumField from './NumField';

document.body.innerHTML = `
  <div class="num-field">
    <label class="num-field__label">
      <span class="js-num-field__title">title</span>
      <input class="js-num-field__input">
    </label>
  </div>
`;

describe('Number field', () => {
  const numField = new NumField(document.body.querySelector('.num-field') as HTMLElement);
  const inputElem = numField.getElement().querySelector('.js-num-field__input') as HTMLInputElement;
  numField.addListeners();

  test('getElement should return an element', () => {
    expect(numField.getElement()).toBeInstanceOf(HTMLElement);
  });

  test('disable should contains the attribute disabled', () => {
    numField.disable();
    expect(inputElem.hasAttribute('disabled')).toBeTruthy();
  });

  test('enable should not contains the attribute disabled', () => {
    numField.enable();
    expect(inputElem.hasAttribute('disabled')).toBeFalsy();
  });

  test('setAttr should set specified attribute', () => {
    numField.setAttr('type', 'number');
    expect(inputElem.getAttribute('type')).toBe('number');
  });

  test('removeAttr should remove specified attribute', () => {
    numField.removeAttr('type');
    expect(inputElem.hasAttribute('type')).not.toBeTruthy();
  });
});
