import { IComponentOptions } from '../Component/Interface';

export interface IThumbOptions extends IComponentOptions {
  isActive: boolean;
  vertical: boolean;
  isPriority?: boolean;
  tip: boolean;
  position: string;
  value: number;
  key?: number;
}

export type IPThumbOptions = Partial<IThumbOptions>;
