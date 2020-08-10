export interface IScaleOptions {
  vertical: boolean;
  min: number;
  max: number;
  step: number;
  symbolLength: number;
  scaleLength: number;
}

export type IPScaleOptions = Partial<IScaleOptions>;
