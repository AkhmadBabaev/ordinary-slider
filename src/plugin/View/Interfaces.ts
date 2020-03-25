import { State, PState } from '../Model/Interfaces';

export interface View {
  getOptions: () => State;
  render: (data: PState) => void;
  subscribe: (cb: Function) => void;
}
