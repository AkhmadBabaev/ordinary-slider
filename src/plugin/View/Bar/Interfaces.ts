import { ComponentOptions } from '../Component/Interface';

export interface BarOptions extends ComponentOptions {
  vertical: boolean;
  length: string;
  shift?: string;
}

export type PBarOptions = Partial<BarOptions>;
