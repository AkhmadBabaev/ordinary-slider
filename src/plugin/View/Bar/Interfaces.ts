export interface BarOptions {
  parent: HTMLElement;
  vertical: boolean;
  length: string;
  shift?: string;
}

export type PBarOptions = Partial<BarOptions>;
