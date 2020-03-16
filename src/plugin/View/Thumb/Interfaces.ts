export interface ThumbOptions {
  parent: HTMLElement;
  isEnabled: boolean;
  vertical: boolean;
  min: number;
  max: number;
  value: number;
  ratio: number;
  tip: boolean;
  key?: string;
}

export type PThumbOptions = Partial<ThumbOptions>;
