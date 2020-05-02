import { convertSliderUnitToPercent as convertToPercent } from '../../helpers/helpers';
import Component from '../Component/Component';
import { create } from '../ComponentsFactory/ComponentsFactory';
import { IThumbOptions, IPThumbOptions } from '../Thumb/Interfaces';
import { IBarOptions, IPBarOptions } from '../Bar/Interfaces';
import { ITrackOptions } from './Interfaces';

class Track extends Component<ITrackOptions> {
  public render(options: ITrackOptions): string {
    return `
      <div class=${options.className}__track>
        ${options.bar ? create('bar', this.generateBarOptions()) : ''}
        ${options.values.map((value, key) => create('thumb', this.generateThumbOptions(value, key))).join('')}
      </div>
    `;
  }

  private generateThumbOptions(value: number, key: number): IThumbOptions {
    const { min, max, activeThumbIndex } = this.options;
    const options: IPThumbOptions = {
      className: this.options.className,
      vertical: this.options.vertical,
      tip: this.options.tip,
      position: `${convertToPercent({ value, min, max })}%`,
      isActive: activeThumbIndex === key,
      value,
      key,
    };

    if (this.options.range && key === 0) {
      const distanceToMax = max - value;
      const distanceToMin = value - min;
      distanceToMax < distanceToMin && (options.isPriority = true);
    }

    return options as IThumbOptions;
  }

  private generateBarOptions(): IBarOptions {
    const { min, max, range } = this.options;
    const [from, to] = this.options.values;
    const options: IPBarOptions = {};
    let shift;

    const length = range
      ? convertToPercent({ min, max, value: to - from + min })
      : convertToPercent({ min, max, value: from });

    range && (shift = convertToPercent({ min, max, value: from }));

    options.className = this.options.className;
    options.vertical = this.options.vertical;
    options.length = `${length}%`;
    shift && (options.shift = `${shift}%`);

    return options as IBarOptions;
  }
}

export default Track;
