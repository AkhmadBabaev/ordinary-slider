export interface ThumbOptions {
  parent: HTMLElement;
  min: number;
  max: number;
  value: number;
  ratio: number;
  tip: boolean;
}

export type PThumbOptions = Partial<ThumbOptions>;
