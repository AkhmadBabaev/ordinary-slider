import Component from '../Component/Component';
import { IBarOptions } from './Interfaces';

class Bar extends Component<IBarOptions> {
  protected render(options: IBarOptions): string {
    const dimension = options.vertical ? 'height' : 'width';
    const side = options.vertical ? 'bottom' : 'left';

    return `
      <div
        class=${options.className}__bar
        style='${dimension}: ${options.length}; ${side}: ${options.shift || 0}'>
      </div>
    `;
  }
}

export default Bar;
