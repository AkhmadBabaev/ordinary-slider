import { convertSliderUnitToPercent as convertToPercent } from '../../helpers/helpers';
import Component from '../Component/Component';
import { create } from '../ComponentsFactory/ComponentsFactory';
import { ThumbOptions, PThumbOptions } from '../Thumb/Interfaces';
import { BarOptions, PBarOptions } from '../Bar/Interfaces';
import { TrackOptions } from './Interfaces';

class Track extends Component<TrackOptions> {
  public render(options: TrackOptions): string {
    return `
      <div class=${options.className}__track>
        ${options.bar ? create('bar', this.generateBarOptions()) : ''}
        ${options.values.map((value, key) => create('thumb', this.generateThumbOptions(value, key))).join('')}
      </div>
    `;
  }

  private generateThumbOptions(value: number, key: number): ThumbOptions {
    const { min, max, activeThumbIndex } = this.options;
    const options: PThumbOptions = {
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

    return options as ThumbOptions;
  }

  private generateBarOptions(): BarOptions {
    const { min, max, range } = this.options;
    const [from, to] = this.options.values;
    const options: PBarOptions = {};
    let shift;

    const length = range
      ? convertToPercent({ min, max, value: to - from + min })
      : convertToPercent({ min, max, value: from });

    range && (shift = convertToPercent({ min, max, value: from }));

    options.className = this.options.className;
    options.vertical = this.options.vertical;
    options.length = `${length}%`;
    shift && (options.shift = `${shift}%`);

    return options as BarOptions;
  }
}

export default Track;
