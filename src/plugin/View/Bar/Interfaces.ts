export interface BarOptions {
  parent: HTMLElement;
  isEnabled: boolean;
  vertical: boolean;
  range: boolean;
  length: string;
  shift?: string;
}

export type PBarOptions = Partial<BarOptions>;
