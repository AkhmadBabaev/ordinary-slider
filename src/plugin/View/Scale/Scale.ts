import { convertSliderUnitToPercent as convertToPercent } from '../../helpers/helpers';
import Component from '../Component/Component';
import { IScaleOptions } from './Interfaces';

class Scale extends Component<IScaleOptions> {
  protected render(options: IScaleOptions): string {
    const componentClass = 'scale';
    const side = options.vertical ? 'bottom' : 'left';
    const points = this.createPointsList();
    const { min, max } = options;

    let classes = componentClass;
    options.vertical && (classes += ` ${componentClass}_is_vertical`);

    return `
      <div class='${classes}'>
        ${points.map((key) => `
          <span
            class='${componentClass}__item js-${componentClass}__item'
            style='${side}: ${convertToPercent({ value: key, min, max })}%'>
              ${key}
          </span>
        `).join('')}
      </div>
    `;
  }

  private createPointsList(): number[] {
    const {
      symbolLength,
      scaleLength,
      vertical,
      min,
      max,
    } = this.options;
    const gap = max - min;

    let { step } = this.options;
    let stepsNumber = gap / step;
    const maxSymbolsNumber = Number.isInteger(step)
      ? Math.max(String(max).length, String(min).length)
      : Math.max(String(max).length, String(min).length) + 1;

    const maxSymbolsLength = vertical ? symbolLength / 2 : symbolLength * maxSymbolsNumber;

    while (stepsNumber * maxSymbolsLength > scaleLength) {
      stepsNumber /= 2;
      step *= 2;
    }

    const result: number[] = [];
    for (let i = 0; i <= stepsNumber; i += 1) result.push(i * step + min);

    const remainder = gap % step;
    if (remainder !== 0) {
      const spaceBetweenLastItems = (scaleLength / gap) * remainder;

      const itemSpace = vertical
        ? symbolLength - symbolLength / 4
        : maxSymbolsLength + symbolLength;

      spaceBetweenLastItems < itemSpace
        ? result[result.length - 1] = max
        : result.push(max);
    }

    return result.map((value) => Number(value.toFixed(2)));
  }
}

export default Scale;
