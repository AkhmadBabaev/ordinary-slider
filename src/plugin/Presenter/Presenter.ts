import { Model, State, PState } from '../Model/Interfaces';
import { View } from '../View/Interfaces';

class Presenter {
  constructor(
    private model: Model,
    private view: View,
  ) {
    this.getState = this.getState.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.setState = this.setState.bind(this);
    this.reset = this.reset.bind(this);
    this.init();
  }

  public subscribe(callback: Function): void {
    this.model.subscribe(callback);
  }

  public unsubscribe(callback: Function): void {
    this.model.unsubscribe(callback);
  }

  public setState(options: PState): void {
    this.model.setState(options);
  }

  public getState(): State {
    return this.model.getState();
  }

  public reset(): void {
    this.model.reset();
  }

  private init(): void {
    this.model.subscribe(this.view.applyState);
    this.view.subscribe(this.model.setState);
  }
}

export default Presenter;
