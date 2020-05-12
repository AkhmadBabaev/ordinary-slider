import { IComponentOptions } from '../Component/Interface';

export interface IScaleOptions extends IComponentOptions {
  vertical: boolean;
  min: number;
  max: number;
  step: number;
  symbolLength: number;
  scaleLength: number;
}

export type IPScaleOptions = Partial<IScaleOptions>;
