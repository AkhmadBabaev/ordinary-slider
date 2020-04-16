import TrackComponent from './TrackComponent';
import { TrackOptions } from './Interfaces';

export default (options: TrackOptions): string => new TrackComponent(options).getElement();
