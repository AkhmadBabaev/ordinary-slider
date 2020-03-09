export interface State {
  min: number;
  max: number;
  step: number;
  value: number;
  tip: boolean;
  bar: boolean;
}

export type PState = Partial<State>;

export interface Model {
  reset: () => void;
  setState: (data: PState, notify?: boolean) => void;
  getState: () => State;
  subscribe: (cb: Function) => void;
  unsubscribe: (cb: Function) => void;
}
