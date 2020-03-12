export interface TrackOptions {
  parent: HTMLElement;
  min: number;
  max: number;
  from: number;
  ratio: number;
  trackWidth: number;
  tip: boolean;
  bar: boolean;
}

export type PTrackOptions = Partial<TrackOptions>;
