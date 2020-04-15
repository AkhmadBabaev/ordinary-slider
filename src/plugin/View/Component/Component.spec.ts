import Component from './Component';

class Testee extends Component<{ sunny: boolean }> {
  render(options: { sunny: boolean }): string {
    return `<div>${options.sunny}</div>`;
  }
}

const testee = new Testee({ sunny: true });
document.body.innerHTML = testee.getElement();

describe('Simple', () => {
  test('getElement should return valid HTML string', () => {
    const element = document.body.firstElementChild;

    expect(typeof testee.getElement()).toBe('string');
    expect(!!element).toBeTruthy();
  });

  test('getOptions should return current options', () => {
    expect(testee.getOptions()).toEqual({ sunny: true });
  });
});
