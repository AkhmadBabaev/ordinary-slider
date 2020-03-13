export interface TrackOptions {
  parent: HTMLElement;
  min: number;
  max: number;
  from: number;
  to?: number;
  ratio: number;
  trackWidth: number;
  tip: boolean;
  bar: boolean;
  range: boolean;
}

export type PTrackOptions = Partial<TrackOptions>;
