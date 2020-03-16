import { PState } from '../Model/Interfaces';

export interface View {
  applyState: (data: PState) => void;
  subscribe: (cb: Function) => void;
}
