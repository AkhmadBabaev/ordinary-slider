import Checkbox from './Checkbox';

document.body.innerHTML = `
  <div class="checkbox">
    <label class="checkbox__label">
      <input class="checkbox__input">
      <span class="checkbox__title">title</span>
      <div class="checkbox__toggler"></div>
    </label>
  </div>
`;

const checkbox = new Checkbox(document.body.querySelector('.checkbox') as HTMLElement);

describe('Checkbox', () => {
  test('getElement should return an element', () => {
    expect(checkbox.getElement()).toBeInstanceOf(HTMLElement);
  });

  test('getInput should return an input element', () => {
    expect(checkbox.getInput()).toBeInstanceOf(HTMLInputElement);
  });

  test('setTitle should set title', () => {
    checkbox.setTitle('hello');
    const checkboxElem = checkbox.getElement();
    expect(checkboxElem.querySelector('.checkbox__title')?.textContent).toBe('hello');
  });
});
