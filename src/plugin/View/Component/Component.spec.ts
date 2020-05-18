import Component from './Component';

class Testee extends Component<{ sunny: boolean }> {
  render(options: { sunny: boolean }): string {
    return `<div>${options.sunny}</div>`;
  }
}

describe('Simple', () => {
  test('should return string of method render', () => {
    const testee = `${new Testee({ sunny: true })}`;
    expect(typeof testee).toBe('string');
    expect(testee).toBe('<div>true</div>');
  });
});
