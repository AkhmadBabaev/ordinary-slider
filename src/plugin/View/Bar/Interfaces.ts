export interface BarOptions {
  parent: HTMLElement;
  isEnabled: boolean;
  range: boolean;
  width: string;
  shift?: string;
}

export type PBarOptions = Partial<BarOptions>;
