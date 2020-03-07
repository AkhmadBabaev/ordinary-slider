export interface TrackOptions {
  parent: HTMLElement;
  min: number;
  max: number;
  value: number;
  ratio: number;
  trackWidth: number;
  tip: boolean;
  bar: boolean;
}

export type PTrackOptions = Partial<TrackOptions>;
