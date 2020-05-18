import { ITrackOptions } from '../Track/Interfaces';
import { IScaleOptions } from '../Scale/Interfaces';
import { IThumbOptions } from '../Thumb/Interfaces';
import { IBarOptions } from '../Bar/Interfaces';

export interface IComponents {
  track: ITrackOptions;
  scale: IScaleOptions;
  thumb: IThumbOptions;
  bar: IBarOptions;
}
