import Input from './input';

document.body.innerHTML = '<input>';

const input = new Input(document.body.querySelector('input') as HTMLElement);

describe('Input', () => {
  test('getElement returns input element', () => {
    // @ts-ignore
    const element = input.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName).toBe('INPUT');
    expect(element.classList.contains('input')).toBeTruthy();
  });

  test('getAttribute returns specified attribute', () => {
    // @ts-ignore
    expect(input.getAttribute('class')).toBe('input');
  });

  test('setAttribute should set specified attribute', () => {
    // @ts-ignore
    input.setAttribute('type', 'number');
    // @ts-ignore
    expect(input.getAttribute('type')).toBe('number');
  });
});
