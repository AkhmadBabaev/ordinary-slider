import { boundMethod } from 'autobind-decorator';

import Model from '../Model/Model';
import { IState, IPState } from '../Model/Interfaces';
import View from '../View/View';

class Presenter {
  private view: View;

  private model: Model;

  constructor(rootElement: HTMLElement, options: IPState) {
    this.model = new Model(options);
    this.view = new View(rootElement, this.model.getState());
    this.init();
  }

  @boundMethod
  public subscribe(callback: Function): void {
    this.model.subscribe(callback);
  }

  @boundMethod
  public unsubscribe(callback: Function): void {
    this.model.unsubscribe(callback);
  }

  @boundMethod
  public setState(options: IPState): void {
    this.model.setState(options);
  }

  @boundMethod
  public getState(): IState {
    return this.model.getState();
  }

  private init(): void {
    this.model.subscribe(this.ViewNotifier);
    this.view.subscribe(this.model.setState);
  }

  @boundMethod
  private ViewNotifier(options: IPState): void {
    const viewOptions = this.view.getOptions();
    const stateChanges = { ...options };

    Object.keys(stateChanges).forEach((key) => {
      const value = stateChanges[key as keyof IState];
      (viewOptions[key as keyof IState] === value) && delete stateChanges[key as keyof IState];
    });

    Object.keys(stateChanges).length && this.view.applyState(stateChanges);
  }
}

export default Presenter;
