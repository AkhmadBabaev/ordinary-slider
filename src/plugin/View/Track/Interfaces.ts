import { ComponentOptions } from '../Component/Interface';

export interface TrackOptions extends ComponentOptions {
  vertical: boolean;
  range: boolean;
  bar: boolean;
  tip: boolean;
  min: number;
  max: number;
  values: number[];
  activeThumbIndex: number;
}

export type PTrackOptions = Partial<TrackOptions>;
