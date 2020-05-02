export interface IState {
  vertical: boolean;
  range: boolean;
  bar: boolean;
  tip: boolean;
  min: number;
  max: number;
  step: number;
  from: number;
  to?: number;
}

export type IPState = Partial<IState>;
