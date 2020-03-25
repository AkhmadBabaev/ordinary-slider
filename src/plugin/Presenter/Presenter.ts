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
    this.ViewNotifier = this.ViewNotifier.bind(this);
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

  private init(): void {
    this.model.subscribe(this.ViewNotifier);
    this.view.subscribe(this.model.setState);
  }

  private ViewNotifier(options: PState): void {
    const viewOptions = this.view.getOptions();
    const stateChanges = options;

    Object.keys(stateChanges).forEach((key) => {
      const value = stateChanges[key as keyof State];
      (viewOptions[key as keyof State] === value) && delete stateChanges[key as keyof State];
    });

    Object.keys(stateChanges).length && this.view.render(stateChanges);
  }
}

export default Presenter;
