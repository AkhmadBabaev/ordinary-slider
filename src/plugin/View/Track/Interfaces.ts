import { IComponentOptions } from '../Component/Interface';

export interface ITrackOptions extends IComponentOptions {
  vertical: boolean;
  range: boolean;
  bar: boolean;
  tip: boolean;
  min: number;
  max: number;
  values: number[];
  activeThumbIndex: number;
}

export type IPTrackOptions = Partial<ITrackOptions>;
