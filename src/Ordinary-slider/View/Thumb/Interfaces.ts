export interface ThumbOptions {
  parent: HTMLElement;
  notify: (data: { [key: string]: unknown }) => void;
  min: number;
  max: number;
  position: number;
  ratio: number;
  tip: boolean;
}
