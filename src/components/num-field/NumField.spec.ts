import NumField from './NumField';

document.body.innerHTML = `
  <div class="num-field">
    <label class="num-field__label">
      <span class="num-field__title">title</span>
      <input class="num-field__input">
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
    expect(numFieldElem.querySelector('.num-field__title')?.textContent).toBe('hello');
  });
});
