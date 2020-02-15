import { State } from '../Model/Interfaces';

export interface View {
  applyState: (data: Partial<State>) => void;
  subscribe: (cb: (data: Partial<State>, notify?: boolean) => void) => void;
}
