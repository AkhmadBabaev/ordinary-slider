import TrackComponent from './TrackComponent';
import { TrackOptions } from './Interfaces';

export default function Track(options: TrackOptions): string {
  return new TrackComponent(options).getElement();
}
