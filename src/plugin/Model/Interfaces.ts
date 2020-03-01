export interface State {
  min: number;
  max: number;
  step: number;
  value: number;
  tip: boolean;
  bar: boolean;
}

export interface Model {
  reset: () => void;
  setState: (data: Partial<State>, notify?: boolean) => void;
  getState: () => State;
  subscribe: (cb: Function) => void;
  unsubscribe: (cb: Function) => void;
}
