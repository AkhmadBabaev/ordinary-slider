export interface ThumbOptions {
  parent: HTMLElement;
  isActive?: boolean;
  vertical: boolean;
  tip: boolean;
  value: number;
  position: string;
  key?: string;
}

export type PThumbOptions = Partial<ThumbOptions>;
