import NumField from './NumField';

document.body.innerHTML = `
  <div class="num-field">
    <label class="num-field__label">
      <span class="js-num-field__title">title</span>
      <input class="js-num-field__input">
    </label>
  </div>
`;

const numField = new NumField(document.body.querySelector('.num-field') as HTMLElement);

describe('Number field', () => {
  test('getElement should return an element', () => {
    expect(numField.getElement()).toBeInstanceOf(HTMLElement);
  });

  test('getInput should return an input element', () => {
    expect(numField.getInput()).toBeInstanceOf(HTMLInputElement);
  });

  test('setTitle should set title', () => {
    numField.setTitle('hello');
    const numFieldElem = numField.getElement();
    expect(numFieldElem.querySelector('.js-num-field__title')?.textContent).toBe('hello');
  });

  test('setAttr should set specified attribute', () => {
    numField.setAttr('type', 'number');
    expect(numField.getInput().getAttribute('type')).toBe('number');
  });
});
