export interface TipOptions {
  parent: HTMLElement;
  isEnabled: boolean;
  text: string;
}

export type PTipOptions = Partial<TipOptions>;
