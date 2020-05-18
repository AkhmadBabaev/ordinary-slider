import { IComponentOptions } from '../Component/Interface';

export interface IBarOptions extends IComponentOptions {
  vertical: boolean;
  length: string;
  shift?: string;
}

export type IPBarOptions = Partial<IBarOptions>;
