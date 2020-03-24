export interface TrackOptions {
  parent: HTMLElement;
  min: number;
  max: number;
  values: number[];
  tip: boolean;
  bar: boolean;
  range: boolean;
  vertical: boolean;
  activeThumbIndex?: number;
}
