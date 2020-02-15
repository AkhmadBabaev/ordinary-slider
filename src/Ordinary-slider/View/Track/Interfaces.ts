export interface TrackOptions {
  parent: HTMLElement;
  notify: (data: { [key: string]: unknown }) => void;
  min: number;
  max: number;
  position: number;
  ratio: number;
  trackWidth: number;
  tip: boolean;
}
