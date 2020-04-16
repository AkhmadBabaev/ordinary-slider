import ThumbComponent from './ThumbComponent';
import { ThumbOptions } from './Interfaces';

export default (options: ThumbOptions): string => new ThumbComponent(options).getElement();
