import { State } from '../Model/Interfaces';

export interface View {
  applyState: (data: Partial<State>) => void;
  subscribe: (cb: Function) => void;
}
