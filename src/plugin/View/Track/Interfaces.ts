export interface TrackOptions {
  parent: HTMLElement;
  min: number;
  max: number;
  from: number;
  to?: number;
  ratio: number;
  length: number;
  tip: boolean;
  bar: boolean;
  range: boolean;
  vertical: boolean;
}

export type PTrackOptions = Partial<TrackOptions>;
