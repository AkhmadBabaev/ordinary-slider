import Component from '../Component/Component';
import { ThumbOptions } from './Interfaces';

class ThumbComponent extends Component<ThumbOptions> {
  public render(options: ThumbOptions): string {
    const side = options.vertical ? 'bottom' : 'left';
    const componentClass = `${options.className}__thumb`;

    let classes = componentClass;
    options.isActive && (classes += ` ${componentClass}_is_active`);
    options.isPriority && (classes += ` ${componentClass}_is_priority`);

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

export default ThumbComponent;
