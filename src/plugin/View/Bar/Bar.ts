import BarComponent from './BarComponent';
import { BarOptions } from './Interfaces';

export default function Track(options: BarOptions): string {
  return new BarComponent(options).getElement();
}
