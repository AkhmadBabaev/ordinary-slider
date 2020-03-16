import Simple from './Simple';

interface Options {
  parent: HTMLElement;
  sun: boolean;
  weather: string;
}

const testeeOptions: Options = {
  parent: document.body,
  sun: true,
  weather: 'windy',
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
  test('createElement should create an element', () => expect(testee.getElement()).toBeInstanceOf(HTMLElement));

  test('getElement should return valid element', () => {
    const element = testee.getElement();

    expect(element.tagName).toBe('DIV');
    expect(element.classList.contains('testee')).toBe(true);
  });

  test('update should put updated values to the options', () => {
    testee.update({ sun: false, weather: 'rain' });

    expect(testee.getOptions().sun).toBe(false);
    expect(testee.getOptions().weather).toBe('rain');
  });
});
