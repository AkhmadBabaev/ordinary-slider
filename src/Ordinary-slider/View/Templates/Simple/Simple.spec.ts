import Simple from './Simple';

type Options = { parent: HTMLElement };

const testeeOptions: Options = {
  parent: document.body,
};

class Testee extends Simple<Options> {
  constructor(options: Options) {
    super(options);
    this.init();
  }

  init(): void {
    this.createElement('div', { class: 'testee' });
  }
}

const testee = new Testee(testeeOptions);

describe('Simple', () => {
  test('createElement should create an element', () => {
    expect(testee.getElement()).toBeInstanceOf(HTMLElement);
  });

  test('getElement should return valid element', () => {
    const element = testee.getElement();

    expect(element.tagName).toBe('DIV');
    expect(element.classList.contains('testee')).toBe(true);
  });
});
