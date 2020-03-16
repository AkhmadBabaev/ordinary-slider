import Input from './input';

document.body.innerHTML = '<input>';

const input = new Input(document.body.querySelector('input') as HTMLElement);

describe('Input', () => {
  test('getElement returns input element', () => {
    const element = input.getElement();

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName).toBe('INPUT');
    expect(element.classList.contains('input')).toBeTruthy();
  });

  test('getAttribute returns specified attribute', () => {
    expect(input.getAttribute('class')).toBe('input');
  });

  test('setAttribute should set specified attribute', async () => {
    input.setAttribute('type', 'number');

    await new Promise((res) => requestAnimationFrame(() => res()));
    expect(input.getAttribute('type')).toBe('number');
  });
});
