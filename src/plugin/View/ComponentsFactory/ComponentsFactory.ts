import Track from '../Track/Track';
import Thumb from '../Thumb/Thumb';
import Bar from '../Bar/Bar';
import { Components } from './IComponents';

class ComponentsFactory {
  private static componentsList = {
    track: Track,
    thumb: Thumb,
    bar: Bar,
  };

  public create<T extends keyof Components>(name: T, options: Components[T]): string {
    const Constructor = ComponentsFactory.componentsList[name];
    const componentData = options as unknown as any;
    const component = new Constructor(componentData);

    return component.getElement();
  }
}

const factory = new ComponentsFactory();
const { create } = factory;

export { factory, create };
