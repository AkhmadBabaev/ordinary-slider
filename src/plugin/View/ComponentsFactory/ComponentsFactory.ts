import { boundMethod } from 'autobind-decorator';

import Track from '../Track/Track';
import Thumb from '../Thumb/Thumb';
import Scale from '../Scale/Scale';
import Bar from '../Bar/Bar';
import { IComponents } from './Interfaces';

class ComponentsFactory {
  private componentsList: {[k in keyof IComponents]?: any} = {};

  constructor() {
    this.defineComponents();
  }

  @boundMethod
  public create<T extends keyof IComponents>(name: T, options: IComponents[T]): string {
    const Constructor = this.componentsList[name];
    const component = new Constructor(options);

    return component.getElement();
  }

  private add<N extends keyof IComponents>(
    name: N,
    value: { new(options: IComponents[N]): unknown },
  ): void {
    this.componentsList[name] = value;
  }

  private defineComponents(): void {
    this.add('track', Track);
    this.add('thumb', Thumb);
    this.add('scale', Scale);
    this.add('bar', Bar);
  }
}

const factory = new ComponentsFactory();
const { create } = factory;

export { factory, create };
