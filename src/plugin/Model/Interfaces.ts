export interface State {
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

export type PState = Partial<State>;

export interface Model {
  setState: (data: PState, notify?: boolean) => void;
  getState: () => State;
  subscribe: (cb: Function) => void;
  unsubscribe: (cb: Function) => void;
}
