import Checkbox from './Checkbox';

document.body.innerHTML = `
  <div class="checkbox">
    <span class="js-checkbox__title">title</span>
    <button class="js-checkbox__button" type="button"></button>
  </div>
`;

describe('Checkbox', () => {
  const checkbox = new Checkbox(document.body.querySelector('.checkbox') as HTMLElement);
  checkbox.addListeners();

  test('getElement should return an element', () => {
    expect(checkbox.getElement()).toBeInstanceOf(HTMLElement);
  });

  test('method toggle should toggle BEM modifier is_checked', () => {
    checkbox.toggle(false);
    expect(checkbox.getElement().classList.contains('checkbox_is_checked')).toBeFalsy();

    checkbox.toggle(true);
    expect(checkbox.getElement().classList.contains('checkbox_is_checked')).toBeTruthy();

    checkbox.toggle();
    expect(checkbox.getElement().classList.contains('checkbox_is_checked')).toBeFalsy();
  });

  test('should generate event CHANGED if button or title was pressed', () => {
    const checkboxElem = checkbox.getElement();
    const buttonElem = checkboxElem.querySelector('.js-checkbox__button');
    const titleElem = checkboxElem.querySelector('.js-checkbox__title');
    const callback = jest.fn();

    checkboxElem.addEventListener('CHANGED', callback);

    buttonElem?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(callback).toBeCalled();

    callback.mockRestore();

    titleElem?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(callback).toBeCalled();
  });
});
