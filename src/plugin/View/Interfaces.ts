import { State, PState } from '../Model/Interfaces';

export interface View {
  getOptions: () => State;
  applyState: (data: PState) => void;
  subscribe: (cb: Function) => void;
}
