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

  test('getAttr returns specified attribute', () => {
    expect(input.getAttr('class')).toBe('input');
  });

  test('setAttr should set specified attribute', async () => {
    input.setAttr('type', 'number');

    await new Promise((res) => requestAnimationFrame(() => res()));
    expect(input.getAttr('type')).toBe('number');
  });
});
