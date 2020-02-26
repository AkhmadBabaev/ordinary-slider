export interface State {
  min: number;
  max: number;
  step: number;
  value: number;
  tip: boolean;
  bar: boolean;
}

export interface Model {
  setState: (data: Partial<State>, notify?: boolean) => void;
  getState: () => State;
  subscribe: (cb: (data: Partial<State>) => void) => void;
}
