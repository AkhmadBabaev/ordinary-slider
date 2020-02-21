import ViewComponent from './ViewComponent';

type Options = { parent: HTMLElement };

const testeeOptions: Options = {
  parent: document.body,
};

class Testee extends ViewComponent<Options> {
  constructor(options: Options) {
    super(options);
    this.init();
  }

  init(): void {
    this.createElement('div', { class: 'testee' });
    this.options.parent.append(this.element);
  }
}

const testee = new Testee(testeeOptions);

describe('ViewComponent', () => {
  test('should be added to parent', () => {
    const isFounded = document.body.contains(testee.getElement());
    expect(isFounded).toBe(true);
  });

  test('createElement should create an element', () => {
    expect(testee.getElement()).toBeInstanceOf(HTMLElement);
  });

  test('getElement should return valid element', () => {
    const element = testee.getElement();

    expect(element.tagName).toBe('DIV');
    expect(element.classList.contains('testee')).toBe(true);
  });
});
