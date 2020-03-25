import Simple from './Simple';

interface Options {
  parent: HTMLElement;
  sunny: boolean;
}

const testeeOptions: Options = {
  parent: document.body,
  sunny: true,
};

class Testee extends Simple<Options> {
  render(options: Options): void {
    this.options = options;
    this.createElement('div', { class: 'testee' });
  }
}

const testee = new Testee(testeeOptions);

describe('Simple', () => {
  test('createElement should create an element', () => expect(testee.getElement()).toBeInstanceOf(HTMLElement));

  test('getElement should return valid element', () => {
    const element = testee.getElement();

    expect(element.tagName).toBe('DIV');
    expect(element.classList.contains('testee')).toBe(true);
  });

  test('getOptions should return current options', () => {
    expect(testee.getOptions()).toEqual(testeeOptions);
  });
});
