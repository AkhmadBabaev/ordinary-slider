import BarComponent from './BarComponent';
import { BarOptions } from './Interfaces';

export default (options: BarOptions): string => new BarComponent(options).getElement();
