import Component from '../Component/Component';
import { IThumbOptions } from './Interfaces';

class Thumb extends Component<IThumbOptions> {
  protected render(options: IThumbOptions): string {
    const side = options.vertical ? 'bottom' : 'left';
    const componentClass = `${options.className}__thumb`;

    let classes = componentClass;
    classes += ` js-${componentClass}`;
    options.isActive && (classes += ` ${componentClass}_activated`);
    options.isPriority && (classes += ` ${componentClass}_priority`);

    return `
      <div
        class='${classes}'
        style='${side}: ${options.position}'
        data-key=${options.key}>

        ${options.tip ? `<div class=${options.className}__tip>${options.value}</div>` : ''}
      </div>
    `;
  }
}

export default Thumb;
