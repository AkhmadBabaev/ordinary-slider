import { ComponentOptions } from '../Component/Interface';

export interface ThumbOptions extends ComponentOptions {
  isActive: boolean;
  vertical: boolean;
  isPriority?: boolean;
  tip: boolean;
  position: string;
  value: number;
  key?: number;
}

export type PThumbOptions = Partial<ThumbOptions>;
