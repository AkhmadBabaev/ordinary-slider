export interface ThumbOptions {
  parent: HTMLElement;
  isEnabled: boolean;
  min: number;
  max: number;
  value: number;
  ratio: number;
  tip: boolean;
}

export type PThumbOptions = Partial<ThumbOptions>;
