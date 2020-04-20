import { getComponentHTML } from '../../helpers/helpers';
import Component from '../Component/Component';
import { BarOptions } from './Interfaces';

class Bar extends Component<BarOptions> {
  public render(options: BarOptions): string {
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

const barHTML = getComponentHTML<BarOptions>(Bar);

export { Bar, barHTML };
