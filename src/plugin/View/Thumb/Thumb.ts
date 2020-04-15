import ThumbComponent from './ThumbComponent';
import { ThumbOptions } from './Interfaces';

export default function Track(options: ThumbOptions): string {
  return new ThumbComponent(options).getElement();
}
